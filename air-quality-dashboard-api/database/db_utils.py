import asyncio
import json
import numpy as np
import pandas as pd
from fastapi.concurrency import run_in_threadpool


async def check_user(session, user_name: str) -> dict | None:
    """
    Asynchronously and securely checks if a user exists by username or email.
    """
    query_user = "SELECT * FROM keys WHERE username = %s ALLOW FILTERING"
    user_rows = await asyncio.to_thread(session.execute, query_user, (user_name,))
    user = user_rows.one()
    if user:
        return user

    query_email = "SELECT * FROM keys WHERE email = %s ALLOW FILTERING"
    email_rows = await asyncio.to_thread(session.execute, query_email, (user_name,))
    return email_rows.one()


async def get_imei(session, user_name: str):
    """
    Asynchronously fetch device location details for a given username.
    Cleans NaN/inf values for JSON-safe serialization.
    """
    query = f"SELECT * FROM KEYS WHERE USERNAME='{user_name}' ALLOW FILTERING"
    keys_rows = await asyncio.to_thread(session.execute, query)

    imeis = []
    for row in keys_rows:
        imeis.extend(row.imeis.replace(" ", "").split(","))

    if not imeis:
        return []

    imei_list = "', '".join(imeis)
    query = f"SELECT * FROM locationdatatable WHERE IMEI IN ('{imei_list}') ALLOW FILTERING"
    rows = await asyncio.to_thread(session.execute, query)
    df = pd.DataFrame(list(rows))

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df = df.where(pd.notnull(df), None)

    json_str = df.to_json(orient="records", default_handler=str)
    result = json.loads(json_str)
    return result


async def get_devices(session, user_name: str):
    """
    Asynchronously fetch device details and status for a given username.
    Cleans NaN/inf values for JSON-safe serialization.
    """
    query = f"SELECT * FROM KEYS WHERE USERNAME='{user_name}' ALLOW FILTERING"
    keys_rows = await asyncio.to_thread(session.execute, query)

    imeis = []
    for row in keys_rows:
        imeis.extend(row.imeis.replace(" ", "").split(","))

    if not imeis:
        return []

    imei_list = "', '".join(imeis)
    query = f"SELECT * FROM locationdatatable WHERE IMEI IN ('{imei_list}') ALLOW FILTERING"
    rows = await asyncio.to_thread(session.execute, query)
    df = pd.DataFrame(list(rows))

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df = df.where(pd.notnull(df), None)

    json_str = df.to_json(orient="records", default_handler=str)
    result = json.loads(json_str)
    return result


async def get_user_config(session, user_name: str):
    """
    Fetch user configuration, dashboard settings, and hydrate metric labels from parameters_table.
    """
    allowed_keys = {
        "all_metrics", "append_constants", "data_interval",
        "get_precalculated", "map_center", "map_zoom_level",
        "output_remap", "output_timezone", "priority_metrics",
        "project_title", "rename_headers", "target_input_remap"
    }

    query_user = 'SELECT * FROM "keys" WHERE "username" = ? ALLOW FILTERING'
    prepared_user = await run_in_threadpool(session.prepare, query_user)
    result_user = await run_in_threadpool(session.execute, prepared_user, [user_name])

    row = result_user.one()

    if not row:
        return None

    full_dict = row._asdict()
    query_master = "SELECT metric, label, unit FROM parameters_table"
    master_results = await run_in_threadpool(session.execute, query_master)

    master_map = {
        r.metric: {"label": r.label, "unit": r.unit}
        for r in master_results
    }

    def hydrate_metrics(metric_list):
        if not metric_list:
            return []
        return [
            {
                "metric": m,
                "label": master_map.get(m, {}).get("label", m),
                "unit": master_map.get(m, {}).get("unit"),
            }
            for m in metric_list
        ]

    config_dict = {}
    for key in allowed_keys:
        val = full_dict.get(key)

        if val is not None:
            if key == "map_center" and isinstance(val, list):
                config_dict[key] = [f"{float(x):.6f}" for x in val]
            elif key in ("priority_metrics", "all_metrics"):
                config_dict[key] = hydrate_metrics(val)
            else:
                config_dict[key] = val

    return config_dict
