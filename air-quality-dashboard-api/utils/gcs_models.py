import os
import sys
import importlib.util
import inspect
import traceback
import joblib
import numpy as np
import pandas as pd
from typing import Optional, Tuple, List
from google.cloud import storage
from dotenv import load_dotenv 
import json
load_dotenv() 
env_cred = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

try:
    storage_client = storage.Client()
    BUCKET_NAME = "your_bucket_name"  # Replace with your actual bucket name
    bucket = storage_client.bucket(BUCKET_NAME)
    print(f"[DEBUG-STARTUP] GCS Client connected to: {BUCKET_NAME}")
except Exception as e:
    print(f"[FATAL-STARTUP] GCS Client failed: {e}")
    storage_client = None

MODULE_CACHE = {}

LOCAL_MODEL_ROOT = os.path.join(os.getcwd(), "persistent_models")

def get_zscore(x, mean, std):
    return (x - mean) / std

def get_col_remap(metrics: List[dict]) -> dict:
    """Return dictionary mapping metric names to display labels."""
    return {m["metric"]: f"{m['label']} ({m['unit']})" for m in metrics}

def predict(series, model_path, ref_mean, ref_std):
    """Predict using sklearn model and apply reverse normalization."""
    model = joblib.load(model_path)
    predict_z = model.predict([series])[0]
    result = predict_z * ref_std + ref_mean
    return result


def get_model_value(series, model_path, target_metric, coefficients):
    """Compute model value based on coefficients JSON."""
    if None in series or np.isnan(series).any():
        return None

    z_score_series = []
    i = 0
    for key, value in coefficients.items():
        if key == f"ref_{target_metric}":
            break
        z_score_series.append(get_zscore(series[i], coefficients[key]['mean'], coefficients[key]['std']))
        i += 1

    result = predict(z_score_series, model_path,
                     coefficients[f"ref_{target_metric}"]['mean'],
                     coefficients[f"ref_{target_metric}"]['std'])
    return result

def is_model_implemented(username: str, deviceid: str, target_metric: str) -> Tuple[bool, Optional[object]]:
    deviceid = deviceid.strip()
    target_metric = target_metric.strip()
    cache_key = (username, deviceid)
    
    try:
        if cache_key in MODULE_CACHE:
            module = MODULE_CACHE[cache_key]
        else:
            device_local_dir = os.path.join(LOCAL_MODEL_ROOT, username, deviceid)
            model_path = os.path.join(device_local_dir, "model.py")
            
            if not os.path.exists(model_path):

                print(f"[DEBUG-PERSIST] Not found on disk. Downloading from GCS...")

                if not storage_client:
                    return False, None

                os.makedirs(device_local_dir, exist_ok=True)
                device_folder_prefix = f"{username}/{deviceid}/"
                user_folder_prefix = f"{username}/"

                print(f"[DEBUG] Searching device prefix: {device_folder_prefix}")

                device_blobs = list(bucket.list_blobs(prefix=device_folder_prefix))

                print(f"[DEBUG] Found blobs:")
                for b in device_blobs:
                    print(f"   {b.name}")

                device_has_model = any(
                    b.name == f"{device_folder_prefix}model.py"
                    for b in device_blobs
                )

                if device_has_model:
                    active_prefix = device_folder_prefix
                    blobs = device_blobs

                else:
                    print(f"[DEBUG] Trying user-level model")

                    user_blobs = list(bucket.list_blobs(prefix=user_folder_prefix))

                    user_has_model = any(
                        b.name == f"{user_folder_prefix}model.py"
                        for b in user_blobs
                    )

                    if user_has_model:
                        active_prefix = user_folder_prefix
                        blobs = user_blobs
                    else:
                        print(f"[DEBUG-EXIT] No model.py found in GCS for {username}/{deviceid}")
                        return False, None

                for blob in blobs:

                    if blob.name.endswith("/"):
                        continue

                    relative_path = os.path.relpath(blob.name, active_prefix)

                    local_file_path = os.path.join(device_local_dir, relative_path)

                    os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

                    blob.download_to_filename(local_file_path)

                    print(f"[DEBUG-DOWNLOAD] Persisted: {relative_path}")

            else:
                print(f"[DEBUG-PERSIST] Found {deviceid} models on disk. Skipping download.")

            module_name = f"mod_{username}_{deviceid}".replace("-", "_")
            spec = importlib.util.spec_from_file_location(module_name, model_path)
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            
            try:
                spec.loader.exec_module(module)
                MODULE_CACHE[cache_key] = module 
                print(f"[DEBUG-SUCCESS] Module {module_name} is ready.")
            except Exception as e:
                print(f"[ERROR-EXEC] Execution failed: {e}")
                return False, None

        model_class = next((m[1] for m in inspect.getmembers(module) if m[0] == target_metric), None)

        if model_class:
            return True, model_class
        return False, None

    except Exception as e:
        print(f"[FATAL] Error: {e}")
        traceback.print_exc()
        return False, None
    
def has_model_implemented(username: str, deviceid: str, target_metric: str) -> bool:
    """Check if a user/device model exists in GCS or persistent cache."""
    exists, _ = is_model_implemented(username, deviceid, target_metric)
    return exists

def simple_model_evaluate(device_data_df: pd.DataFrame, username: str, deviceid: str,
                          target_metric: str, features: List[str]) -> pd.DataFrame:
    """Evaluate user-defined models (.py) using GCS/Persistent Cache."""
    if len(device_data_df) == 0:
        return device_data_df

    exists, model_class = is_model_implemented(username, deviceid, target_metric)

    if not exists:
        print(f"[DEBUG-EVAL] Model not implemented for {target_metric}")
        device_data_df[target_metric] = None
        return device_data_df

    device_data_df[target_metric] = device_data_df.apply(
        lambda row: model_class.evaluate(row), axis=1)
    
    return device_data_df



def update_df_with_model(device_data_df: pd.DataFrame, username: str, deviceid: str,
                         target_metric: str, features: List[str]) -> pd.DataFrame:
    """Apply predictions using coefficients.json from persistent cache."""
    if len(device_data_df) == 0:
        return device_data_df

    exists, model_class = is_model_implemented(username, deviceid, target_metric)
    if not exists:
        device_data_df[target_metric] = None
        return device_data_df

    device_local_dir = os.path.join(LOCAL_MODEL_ROOT, username, deviceid)
    coeff_path = os.path.join(device_local_dir, "coefficients.json")

    if not os.path.exists(coeff_path):
        coeff_path = os.path.join(LOCAL_MODEL_ROOT, username, "coefficients.json")

    if not os.path.exists(coeff_path):
        print(f"[WARNING] No coefficients.json found for {username}")
        device_data_df[target_metric] = None
        return device_data_df

    with open(coeff_path) as f:
        coefficients = json.load(f)

    device_data_df[target_metric] = device_data_df.apply(
        lambda row: get_model_value(
            [row[f] for f in features], 
            None, 
            target_metric,
            coefficients.get(target_metric)
        ), axis=1)
    
    return device_data_df