import asyncio
import json
import os
import math
from contextlib import asynccontextmanager
from io import StringIO
from datetime import datetime, timezone
from typing import List, Dict
from itertools import groupby
from operator import itemgetter
from zoneinfo import ZoneInfo

import pandas as pd
import numpy as np
import pytz
import jwt
from passlib.context import CryptContext
from werkzeug.security import check_password_hash
from fastapi import FastAPI, HTTPException, Request, status, Form
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

from database.telemetry_service import get_sensors_data_for_device_async
from database import db_utils, connection
from database.db_utils import get_imei
from utils.gcs_models import (
    is_model_implemented, has_model_implemented, simple_model_evaluate, get_col_remap
)

load_dotenv()
now_utc = datetime.now(timezone.utc)
utc = pytz.timezone("UTC")
ist = utc

with open("configs/Configurations.json") as json_config:
    configJson = json.load(json_config)

telemetry_host = (
    configJson.get("telemetry_host")
    or configJson.get("database_host")
    or "localhost"
)
raw_telemetry_port = configJson.get("telemetry_port") or configJson.get("database_port")
try:
    telemetry_port = int(raw_telemetry_port)
except (ValueError, TypeError):
    telemetry_port = None

logger = logging.getLogger("dashboard_api")
if not logger.handlers:
    logger.setLevel(logging.INFO)
    handler = RotatingFileHandler('dashboard_api.log', maxBytes=100000, backupCount=5)
    formatter = logging.Formatter('[%(levelname)s][%(asctime)s] %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

session = None
keys_cache = {}
imei_cache = []

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO = os.getenv("JWT_ALGO")
pwd_context = CryptContext(
    schemes=["bcrypt", "pbkdf2_sha256"],
    deprecated="auto"
)


def safe_round(v, ndigits=1):
    if v is None:
        return None
    if isinstance(v, (int, float)):
        if not math.isfinite(v):
            return None
        return round(float(v), ndigits)
    return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages database connections for the application's entire lifecycle."""
    global session, keys_cache, imei_cache
    logger.info("Application startup: Connecting to database...")
    try:
        session = connection.init_db(configJson)
        keys_cache = connection.load_keys_cache(session)
        imei_cache = connection.load_imei_cache(session)
        logger.info(f"Successfully connected to database and cached {len(keys_cache)} API keys.")
    except Exception as e:
        logger.error(f"FATAL: Could not connect to database at startup: {e}", exc_info=True)

    yield

    logger.info("Application shutdown: Closing database connections.")
    connection.close_db()


app = FastAPI(title="AQ Dashboard API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def final_processing_sync(result_df: pd.DataFrame, target_params: list, user_config: dict, query_params: dict) -> pd.DataFrame:
    """(CPU-Bound) Handles all final data merging, cleaning, and formatting."""
    if result_df.empty:
        return pd.DataFrame()
    result_df = result_df[result_df.columns.intersection(['dt_time', *target_params, 'deviceid', 'bus_no'])]
    rounding_cols = list(set(result_df.columns) - {'lat', 'lon', 'dt_time', 'deviceid', 'bus_no'})
    result_df[rounding_cols] = result_df[rounding_cols].astype(float).round(2)

    gaps = int(query_params.get('gaps', 0))
    gap_string = query_params.get('gap_value')
    if gaps and gap_string:
        result_df = result_df.fillna(gap_string)
    else:
        result_df = result_df.replace({np.nan: None})

    if user_config.get('output_timezone'):
        result_df['dt_time'] = result_df['dt_time'].dt.tz_localize('UTC', ambiguous='infer').dt.tz_convert(user_config['output_timezone']).dt.strftime('%Y-%m-%d %H:%M:%S')

    if query_params.get('labels') and user_config.get('all_metrics'):
        result_df = result_df.rename(columns=get_col_remap(user_config['all_metrics']))

    if user_config.get('output_remap'):
        result_df = result_df.rename(columns=user_config['output_remap'])

    if user_config.get('append_constants'):
        for key, value in user_config['append_constants'].items():
            result_df[key] = value

    return result_df


async def fetch_and_process_single_device(device_id: str, params_list: List[str], dates: Dict, avg_info: Dict, query_params: Dict, auth_info: Dict) -> pd.DataFrame:
    """(I/O then CPU) Fetches data for one device and runs its model processing."""
    try:
        user_configs = auth_info['user_configs']
        username = auth_info['username']
        force_calc = int(query_params.get("force_calc", 0))
        requested_params = params_list.copy()
        fetch_params = params_list.copy()

        if user_configs.get(username) and (not user_configs.get(username).get('get_precalculated') or force_calc):
            for model_name in ['comodel', 'no2model', 'o3model', 'so2model']:
                if model_name in requested_params:
                    exists, model_class = is_model_implemented(username, device_id, model_name)
                    if exists and hasattr(model_class, 'get_feature_list'):
                        model_features = model_class.get_feature_list()
                        fetch_params.extend([f for f in model_features if f not in fetch_params])

        device_df, _ = await get_sensors_data_for_device_async(
            deviceid=device_id, imei_param=fetch_params, from_date=dates['from_date'],
            to_date=dates['to_date'], avg_period=avg_info['period'], sample_unit=avg_info['unit'],
            host=telemetry_host, port=telemetry_port,
            align=query_params.get("align"), gaps=int(query_params.get("gaps", 0))
        )

        if device_df.empty:
            return pd.DataFrame()

        device_df["deviceid"] = device_id
        device_df['dt_time'] = pd.to_datetime(device_df['dt_time'])

        processed_df = await asyncio.to_thread(
            process_models_sync, device_df, device_id, username, requested_params, user_configs, force_calc
        )
        return processed_df
    except Exception:
        logger.error(f"ERROR processing device {device_id}", exc_info=True)
        return pd.DataFrame()


@app.post("/login")
async def login(
    username: str = Form(...),
    password: str = Form(...)
):
    if not username or not password:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "status_code": 401,
                "message": "Could not verify, Login required !!"
            }
        )

    user = await db_utils.check_user(session, username)

    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "status_code": 401,
                "message": "Could not verify, User does not exist !!"
            }
        )

    if not check_password_hash(user.password, password):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "status_code": 403,
                "message": "Could not verify, Wrong Password !!"
            }
        )
    locations = await db_utils.get_devices(session, user.username)
    imei_locality_map = {
        loc["imei"]: loc["locality"].strip().strip('"') if loc["locality"] else None
        for loc in locations
    }
    token = jwt.encode(
        {
            "username": user.username
        },
        JWT_SECRET,
        algorithm=JWT_ALGO
    )

    check_calibration = 1 if user.role == "calibration" else 0
    check_aqi = 1 if user.country == "india" else 0
    return {
        "status_code": 201,
        "token": token,
        "username": user.username,
        "email": user.email,
        "imeis": user.imeis,
        "key": user.key,
        "name": user.contact_person,
        "logo": user.logo,
        "country": user.country,
        "check_calibration": check_calibration,
        "check_aqi": check_aqi,
        "imei_location": imei_locality_map
    }


@app.get("/getMapData/username/{user_name}")
async def getMapData(
    user_name: str
):
    df_imei = await db_utils.get_devices(session, user_name)
    if not isinstance(df_imei, pd.DataFrame):
        df_imei = pd.DataFrame(df_imei)
    df_imei = df_imei.where(pd.notnull(df_imei), None)
    df_imei = df_imei[df_imei["last_updated"].notnull()]
    df_imei = df_imei[df_imei["last_updated"] != ""]
    df_imei["last_updated"] = df_imei["last_updated"].astype("int64")

    current_time = int(datetime.now(timezone.utc).timestamp() * 1000)

    df_imei.loc[df_imei["last_updated"] <= current_time - 5 * 60 * 1000, "status"] = 0
    df_imei.loc[df_imei["last_updated"] > current_time - 5 * 60 * 1000, "status"] = 1

    data = await db_utils.get_user_config(session, user_name)
    out_tz = data.get('output_timezone', ist) if data else ist

    df_imei["last_updated"] = pd.to_datetime(df_imei["last_updated"], unit='ms')
    df_imei["last_updated"] = df_imei["last_updated"].dt.tz_localize('UTC').dt.tz_convert(out_tz)
    df_imei["last_updated"] = df_imei["last_updated"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    output = []
    df_imei = df_imei.replace([np.nan, np.inf, -np.inf], None)

    for _, row in df_imei.iterrows():
        output.append({
            "imei": str(row.get("imei")),
            "locality": row.get("locality"),
            "city": row.get("city"),
            "state": row.get("state"),
            "pm25": safe_round(row.get("pm25")),
            "pm10": safe_round(row.get("pm10")),
            "temp": safe_round(row.get("temp")),
            "humidity": safe_round(row.get("humidity")),
            "sound_db": safe_round(row.get("sound_db")),
            "latLong": (
                f"{row.get('latitude')}, {row.get('longitude')}"
                if row.get("latitude") is not None and row.get("longitude") is not None
                else None
            ),
            "last_updated": row.get("last_updated"),
            "status": "ONLINE" if row.get("status") == 1 else "OFFLINE"
        })
    return JSONResponse(content=output)


def process_models_sync(device_df: pd.DataFrame, device_id: str, username: str, requested_params: list, user_configs: dict, force_calc: bool) -> pd.DataFrame:
    """(CPU-Bound) Applies models to a DataFrame for a single device."""
    if user_configs.get(username):
        config = user_configs[username]
        if not config.get('get_precalculated') or force_calc:
            for model in ['comodel', 'no2model', 'o3model', 'so2model']:
                if model in requested_params and not device_df.empty:
                    exists, model_class = is_model_implemented(username, device_id, model)
                    if exists:
                        label = getattr(model_class, 'target_label', model)
                        device_df[label] = device_df.apply(lambda x: model_class.evaluate(x), axis=1)
            for simple in ['temp', 'humidity']:
                if simple in requested_params and has_model_implemented(username, device_id, simple) and not device_df.empty:
                    device_df = simple_model_evaluate(device_df, username, device_id, simple, [simple])
    return device_df


@app.get('/check_user_imei/user/{user}')
async def check_user_imei(user: str):
    """
    Asynchronously retrieves and structures IMEI data for a user.
    """
    try:
        imei_records = await get_imei(session, user)
        if not imei_records:
            return {
                "status_code": 200,
                "imei_details": []
            }
        imei_records.sort(key=itemgetter('imei'))

        result_list = []
        for imei, group in groupby(imei_records, key=itemgetter('imei')):
            values_list = []
            for record in group:
                value_data = record.copy()
                del value_data['imei']
                values_list.append(value_data)

            result_list.append({
                "imei": imei,
                "values": values_list
            })

        return {
            "status_code": 200,
            "imei_details": result_list
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal server error occurred.{e}")


@app.get("/user_config/{username}")
async def user_config(username: str):
    data = await db_utils.get_user_config(session, username)
    if not data:
        try:
            with open("data/user_configs.json", "r", encoding="utf-8") as f:
                config_json = json.load(f)
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="user_configs.json not found")

        if username in config_json:
            return JSONResponse(content=config_json[username])

        try:
            with open("configs/default_user_config.json", "r", encoding="utf-8") as f:
                default_config = json.load(f)
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="default_user_config.json not found")

        return JSONResponse(content=default_config)
    return JSONResponse(data)


@app.get("/getDeviceStatus/username/{user_name}")
async def getDeviceStatus(
    user_name: str
):
    df_imei = await db_utils.get_devices(session, user_name)
    if not isinstance(df_imei, pd.DataFrame):
        df_imei = pd.DataFrame(df_imei)
    df_imei = df_imei.where(pd.notnull(df_imei), None)
    df_imei = df_imei[df_imei["last_updated"].notnull()]
    df_imei = df_imei[df_imei["last_updated"] != ""]
    df_imei["last_updated"] = df_imei["last_updated"].astype("int64")

    current_time = int(datetime.now(timezone.utc).timestamp() * 1000)

    df_imei.loc[df_imei["last_updated"] <= current_time - 5 * 60 * 1000, "status"] = 0
    df_imei.loc[df_imei["last_updated"] > current_time - 5 * 60 * 1000, "status"] = 1

    data = await db_utils.get_user_config(session, user_name)
    out_tz = data.get('output_timezone', ist) if data else ist
    df_imei["last_updated"] = pd.to_datetime(df_imei["last_updated"], unit='ms')
    df_imei["last_updated"] = df_imei["last_updated"].dt.tz_localize('UTC').dt.tz_convert(out_tz)
    df_imei["last_updated"] = df_imei["last_updated"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    output = []

    for _, row in df_imei.iterrows():
        output.append({
            "imei": str(row.get("imei")),
            "locality": row.get("locality"),
            "city": row.get("city"),
            "state": row.get("state"),
            "latLong": (
                f"{row.get('latitude')}, {row.get('longitude')}"
                if row.get("latitude") is not None and row.get("longitude") is not None
                else None
            ),
            "last_updated": row.get("last_updated"),
            "status": "ONLINE" if row.get("status") == 1 else "OFFLINE",
            "powerSource": (
                "Mains"
                if row.get("power_avl") is not None
                and not pd.isna(row.get("power_avl"))
                and row.get("power_avl") == 1
                else "Solar"
                if row.get("solar_avl") is not None
                and not pd.isna(row.get("solar_avl"))
                and row.get("solar_avl") == 1
                else "Battery"
            ),
            "battery": (
                int(row["battery"])
                if row.get("battery") is not None and not pd.isna(row.get("battery"))
                else None
            )
        })
    return JSONResponse(content=output)


async def fetch_and_process_single_device(device_id: str, params_list: List[str], dates: Dict, avg_info: Dict, query_params: Dict, auth_info: Dict) -> pd.DataFrame:
    """(I/O then CPU) Fetches data for one device and runs its model processing."""
    try:
        user_configs = auth_info['user_configs']
        username = auth_info['username']
        force_calc = int(query_params.get("force_calc", 0))
        requested_params = params_list.copy()
        fetch_params = params_list.copy()

        if user_configs.get(username) and (not user_configs.get(username).get('get_precalculated') or force_calc):
            for model_name in ['comodel', 'no2model', 'o3model', 'so2model']:
                if model_name in requested_params:
                    exists, model_class = is_model_implemented(username, device_id, model_name)
                    if exists and hasattr(model_class, 'get_feature_list'):
                        model_features = model_class.get_feature_list()
                        fetch_params.extend([f for f in model_features if f not in fetch_params])

        device_df, _ = await get_sensors_data_for_device_async(
            deviceid=device_id, imei_param=fetch_params, from_date=dates['from_date'],
            to_date=dates['to_date'], avg_period=avg_info['period'], sample_unit=avg_info['unit'],
            host=telemetry_host, port=telemetry_port,
            align=query_params.get("align"), gaps=int(query_params.get("gaps", 0))
        )

        if device_df.empty:
            return pd.DataFrame()

        device_df["deviceid"] = device_id
        device_df['dt_time'] = pd.to_datetime(device_df['dt_time'])

        processed_df = await asyncio.to_thread(
            process_models_sync, device_df, device_id, username, requested_params, user_configs, force_calc
        )
        return processed_df
    except Exception:
        logger.error(f"ERROR processing device {device_id}", exc_info=True)
        return pd.DataFrame()


@app.get("/getDeviceDataParamPage/imei/{imei}/params/{params}/startdate/{startdate}/enddate/{enddate}/ts/{avg_ref}/avg/{avg_period}/api/{api_key}")
async def get_device_data_params_page(request: Request, imei: str, params: str, startdate: str, enddate: str, avg_ref: str, avg_period: str, api_key: str):
    try:
        query_params = dict(request.query_params)

        try:
            from_date_str = f"{startdate[0:10]} {startdate[11:16]}:00"
            to_date_str = datetime.strptime(enddate, '%Y-%m-%dT%H:%M').strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Please use the format YYYY-MM-DDTHH:MM."
            )

        try:
            page = int(query_params.get('page', 1))
            per_page = 10
            if page < 1:
                raise ValueError("Page number cannot be less than 1.")
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=400,
                detail="Invalid 'page' parameter. It must be a positive integer."
            )
        username = None
        if api_key == "master_key":
            pass
        elif api_key in keys_cache:
            username = keys_cache[api_key].username
        else:
            raise HTTPException(
                status_code=401,
                detail="Invalid API Key provided."
            )

        imei_list = imei.split(",")
        params_list = params.split(",")

        total_devices = len(imei_list)
        total_pages = (total_devices + per_page - 1) // per_page
        start_index = (page - 1) * per_page
        end_index = page * per_page
        paginated_device_list = imei_list[start_index:end_index]

        user_config_data = await db_utils.get_user_config(session, username)
        user_configs = {username: user_config_data} if user_config_data else {}
        user_config = user_configs.copy()

        sample_unit = {'hh': 'hours', 'mm': 'minutes', 'dd': 'days'}.get(avg_ref, 'hours')

        tasks = [
            fetch_and_process_single_device(
                device_id=device, params_list=params_list, dates={'from_date': from_date_str, 'to_date': to_date_str},
                avg_info={'period': avg_period, 'unit': sample_unit}, query_params=query_params,
                auth_info={'username': username, 'user_configs': user_configs}
            ) for device in paginated_device_list
        ]
        result_df_list = await asyncio.gather(*tasks)

        non_empty_dfs = [df for df in result_df_list if not df.empty]
        if not non_empty_dfs:
            final_df = pd.DataFrame()
        else:
            concatenated_df = pd.concat(non_empty_dfs, ignore_index=True)
            target_params = params_list.copy()
            for model_name in ['comodel', 'no2model', 'o3model', 'so2model']:
                if model_name not in target_params:
                    target_params.append(model_name)

            final_df = await asyncio.to_thread(final_processing_sync, concatenated_df, target_params, user_config, query_params)

        if 'json' in query_params:
            return {"data": final_df.to_dict(orient='records'), "pagination": {"page": page, "per_page": per_page, "total_devices": total_devices, "total_pages": total_pages}}

        stream = StringIO()
        final_df.to_csv(stream, index=False)
        return StreamingResponse(iter([stream.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=device_data.csv"})

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Unhandled error in paginated endpoint", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")


@app.get("/getDeviceDataParam/imei/{imei}/params/{params}/startdate/{startdate}/enddate/{enddate}/ts/{avg_ref}/avg/{avg_period}/api/{api_key}")
async def get_device_data_params(request: Request, imei: str, params: str, startdate: str, enddate: str, avg_ref: str, avg_period: str, api_key: str):
    try:
        from_date_str = f"{startdate[0:10]} {startdate[11:16]}:00"
        to_date_str = datetime.strptime(enddate, '%Y-%m-%dT%H:%M').strftime('%Y-%m-%d %H:%M:%S')
        device_list = imei.split(",")
        params_list = params.split(",")
        query_params = dict(request.query_params)

        username = None
        if api_key == "master_key":
            pass
        elif api_key in keys_cache:
            row = keys_cache[api_key]
            user_imeis = row.imeis.split(", ") if row.imeis else []
            if any(dev not in user_imeis for dev in device_list):
                raise HTTPException(status_code=403, detail="One or more IMEIs do not belong to this API key.")
            username = row.username
        else:
            raise HTTPException(status_code=401, detail="Invalid API Key.")

        user_config_data = await db_utils.get_user_config(session, username)
        user_configs = {username: user_config_data} if user_config_data else {}
        user_config = user_configs.copy()

        sample_unit = {'hh': 'hours', 'mm': 'minutes', 'dd': 'days'}.get(avg_ref, 'hours')

        tasks = [
            fetch_and_process_single_device(
                device_id=device, params_list=params_list, dates={'from_date': from_date_str, 'to_date': to_date_str},
                avg_info={'period': avg_period, 'unit': sample_unit}, query_params=query_params,
                auth_info={'username': username, 'user_configs': user_configs}
            ) for device in device_list
        ]
        result_df_list = await asyncio.gather(*tasks)

        non_empty_dfs = [df for df in result_df_list if not df.empty]
        if not non_empty_dfs:
            final_df = pd.DataFrame()
        else:
            concatenated_df = pd.concat(non_empty_dfs, ignore_index=True)
            target_params = params_list.copy()
            for model_name in ['comodel', 'no2model', 'o3model', 'so2model']:
                if model_name not in target_params:
                    target_params.append(model_name)
            final_df = await asyncio.to_thread(final_processing_sync, concatenated_df, target_params, user_config, query_params)

        if 'json' in query_params:
            return JSONResponse(content=final_df.to_dict(orient='records'))

        stream = StringIO()
        final_df.to_csv(stream, index=False)
        return StreamingResponse(iter([stream.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=device_data.csv"})

    except Exception as e:
        logger.error("Unhandled error in non-paginated endpoint", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")