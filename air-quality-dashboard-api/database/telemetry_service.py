import asyncio
import json
import logging
import os
from datetime import datetime
import httpx
import pandas as pd
from pytz import timezone

logger = logging.getLogger("dashboard_api")

datapoint_query_path = os.getenv("TELEMETRY_QUERY_PATH", "your_datapoint_query_path")
date_time_format = "%Y-%m-%d %H:%M:%S"


async def fetch_telemetry_datapoints(
    client: httpx.AsyncClient, query: str, host: str, port: int
):
    port_str = f":{port}" if port else ""
    url = f"http://{host}{port_str}{datapoint_query_path}"
    try:
        response = await client.post(url, data=query, timeout=30.0)
        response.raise_for_status()
        r_json = response.json()

        query_response = r_json.get("queries", [{}])[0]
        sample_size = query_response.get("sample_size", 0)
        results = query_response.get("results", [])
        return sample_size, results

    except httpx.RequestError as e:
        logger.error(f"Telemetry database request failed: {e}")
        return 0, []
    except (KeyError, ValueError, IndexError) as e:
        logger.error(f"Unexpected database response structure: {e}")
        return 0, []




async def get_imei_sensor_data_async(
    client: httpx.AsyncClient,
    imei: str,
    host: str,
    port: int,
    sensor: str,
    start_date_str: str,
    end_date_str: str,
    avg_period: str,
    sample_unit: str,
    align=None,
    gaps=None,
    limit=None,
    order=None,
):
    """Asynchronously fetches and processes sensor data for a single device IMEI into a DataFrame."""
    start_datetime = datetime.strptime(start_date_str, date_time_format)
    end_datetime = datetime.strptime(end_date_str, date_time_format)

    localtz = timezone("UTC")
    tz_start_datetime = localtz.localize(start_datetime)
    tz_end_datetime = localtz.localize(end_datetime)

    start_date_millis = int(tz_start_datetime.timestamp() * 1000)
    end_date_millis = int(tz_end_datetime.timestamp() * 1000)

    query = get_imei_signal_query(
        [imei],
        sensor,
        start_date_millis,
        end_date_millis,
        avg_period,
        sample_unit,
        align,
        gaps,
        limit,
        order,
    )
    query_json = json.dumps(query)

    sample_size_dash, result_dash = await fetch_telemetry_datapoints(
        client, query_json, host, port
    )

    if not result_dash or not result_dash[0].get("values"):
        return pd.DataFrame(columns=["dt_time", sensor]), 0

    imei_dt_data = pd.DataFrame(
        result_dash[0]["values"], columns=["timestamp", sensor]
    )
    imei_dt_data.index = pd.to_datetime(imei_dt_data["timestamp"], utc=True, unit="ms")
    imei_dt_data.index = imei_dt_data.index.tz_convert("UTC")
    imei_dt_data["dt_time"] = imei_dt_data.index.strftime("%Y-%m-%d %H:%M:%S")

    return imei_dt_data[["dt_time", sensor]], sample_size_dash


async def get_sensors_data_for_device_async(
    deviceid: str,
    imei_param: list,
    from_date: str,
    to_date: str,
    avg_period: str,
    sample_unit: str,
    host: str,
    port: int,
    align=None,
    gaps=None,
    limit=None,
    order=None,
    **kwargs,
):
    """
    Asynchronously fetches data for multiple sensors for a single device concurrently.
    """
    actual_host = host or kwargs.get("db_host")
    actual_port = port or kwargs.get("db_port")

    sensor_data_map = {}
    sample_size_dash = {}

    async with httpx.AsyncClient() as client:
        tasks = [
            get_imei_sensor_data_async(
                client,
                deviceid,
                actual_host,
                actual_port,
                sensor,
                from_date,
                to_date,
                avg_period,
                sample_unit,
                align,
                gaps,
                limit,
                order,
            )
            for sensor in imei_param
        ]

        results = await asyncio.gather(*tasks)

    for sensor, (data_df, sample_size) in zip(imei_param, results):
        sensor_data_map[sensor] = data_df
        sample_size_dash[sensor] = sample_size

    if "pm2.5_ref" in imei_param:
        sensor_data_map = process_pm_data(sensor_data_map, "pm2.5_ref", "pm2.5cnc")
    if "pm25conc" in imei_param:
        sensor_data_map = process_pm_data(sensor_data_map, "pm2.5cnc", "pm25conc")
    if "pm10conc" in imei_param:
        sensor_data_map = process_pm_data(sensor_data_map, "pm10cnc", "pm10conc")
    if "pm10_ref" in imei_param:
        sensor_data_map = process_pm_data(sensor_data_map, "pm10_ref", "pm10cnc")

    updated_sensor_list = list(sensor_data_map.keys())
    if not updated_sensor_list:
        return pd.DataFrame(), {}

    merged_df = pd.DataFrame()
    start_index = 0
    for i, sensor in enumerate(updated_sensor_list):
        if not sensor_data_map[sensor].empty:
            merged_df = sensor_data_map[sensor]
            start_index = i + 1
            break

    if merged_df.empty:
        return pd.DataFrame(), sample_size_dash

    for sensor in updated_sensor_list[start_index:]:
        if not sensor_data_map[sensor].empty:
            merged_df = pd.merge(
                merged_df, sensor_data_map[sensor], how="outer", on="dt_time"
            )

    return merged_df, sample_size_dash


def get_imei_signal_query(
    imeis: list[str],
    signal: str,
    start_date_millis: int,
    end_date_millis: int,
    avg_period: str,
    sample_unit: str,
    align=None,
    gaps=None,
    limit=None,
    order=None,
):
    alignment_dict = (
        {"key": f"align_{align}", "value": True}
        if align
        else {"key": "align_start_time", "value": True}
    )
    aggregator_name = "sum" if signal.lower() in ("rainfall", "power") else "avg"
    query = {
        "metrics": [
            {
                "tags": {"imei": imeis},
                "name": signal,
                "aggregators": [
                    {
                        "name": aggregator_name,
                        "sampling": {"value": avg_period, "unit": sample_unit},
                        "align_sampling": True,
                        alignment_dict["key"]: alignment_dict["value"],
                    }
                ],
            }
        ],
        "cache_time": 0,
        "start_absolute": start_date_millis,
        "end_absolute": end_date_millis,
    }
    if order:
        query["metrics"][0]["order"] = order
    if limit:
        query["metrics"][0]["limit"] = limit
    if gaps:
        gaps_aggregator = {
            "name": "gaps",
            "sampling": {"value": avg_period, "unit": sample_unit},
            "align_sampling": True,
            alignment_dict["key"]: alignment_dict["value"],
        }
        query["metrics"][0]["aggregators"].append(gaps_aggregator)
    return query


def process_pm_data(sensor_data_map, primary_col, secondary_column):
    primary_df = sensor_data_map.get(primary_col)
    secondary_df = sensor_data_map.get(secondary_column)

    if primary_df is None or secondary_df is None:
        return sensor_data_map

    if primary_df.empty and not secondary_df.empty:
        sensor_data_map[primary_col] = secondary_df.rename(
            columns={secondary_column: primary_col}
        )

    if secondary_column in sensor_data_map:
        del sensor_data_map[secondary_column]

    return sensor_data_map
