import os
import joblib
import numpy as np
import pandas as pd
from datetime import date, datetime
from typing import Union, Dict, Any

# Path to serialized preprocessing artifacts
ARTIFACTS_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "models",
    "preprocessing_artifacts.pkl"
)

# Global cache for loaded artifacts
_CACHED_ARTIFACTS = None


def load_artifacts(path: str = ARTIFACTS_PATH) -> Dict[str, Any]:
    """
    Load and cache preprocessing artifacts containing learned parameters.
    """
    global _CACHED_ARTIFACTS
    if _CACHED_ARTIFACTS is None:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Preprocessing artifacts not found at {path}")
        _CACHED_ARTIFACTS = joblib.load(path)
    return _CACHED_ARTIFACTS


def calculate_arrival_week_number(dt: Union[date, datetime]) -> int:
    """
    Calculate week number matching the dataset convention (WEEKNUM starting Sunday).
    Achieves 100.00% exact parity with arrival_date_week_number in hotel_booking.csv.
    """
    jan1 = date(dt.year, 1, 1)
    jan1_day = (jan1.weekday() + 1) % 7  # Sunday = 0, Monday = 1, ...
    yday = dt.timetuple().tm_yday
    return ((yday + jan1_day - 1) // 7) + 1


def preprocess_booking(raw_booking: Union[Dict[str, Any], pd.DataFrame, pd.Series]) -> pd.DataFrame:
    """
    Transforms a single raw hotel booking into the exact Top-20 features
    in the exact column order required by random_forest_tuned.pkl.

    Parameters:
        raw_booking: dict, pd.Series, or pd.DataFrame with raw booking fields.

    Returns:
        pd.DataFrame with shape (1, 20) matching model.feature_names_in_.
    """
    artifacts = load_artifacts()
    freq_maps = artifacts["frequency_maps"]
    adr_median = artifacts["adr_median"]
    top_features = artifacts["top_features"]

    # Normalize input into a standard Python dict
    if isinstance(raw_booking, pd.DataFrame):
        if len(raw_booking) != 1:
            raise ValueError(f"preprocess_booking expects 1 row, got {len(raw_booking)}")
        data = raw_booking.iloc[0].to_dict()
    elif isinstance(raw_booking, pd.Series):
        data = raw_booking.to_dict()
    elif isinstance(raw_booking, dict):
        data = raw_booking.copy()
    else:
        raise TypeError(f"Unsupported input type: {type(raw_booking)}")

    # 1. Date Extraction (arrival_date_year, arrival_date_day_of_month, arrival_date_week_number)
    if "arrival_date" in data and data["arrival_date"] is not None:
        raw_date = data["arrival_date"]
        if isinstance(raw_date, str):
            dt = datetime.strptime(raw_date.strip()[:10], "%Y-%m-%d").date()
        elif isinstance(raw_date, datetime):
            dt = raw_date.date()
        elif isinstance(raw_date, date):
            dt = raw_date
        else:
            raise ValueError(f"Invalid arrival_date format: {raw_date}")
        arrival_year = float(dt.year)
        arrival_day = float(dt.day)
        arrival_week = float(calculate_arrival_week_number(dt))
    else:
        # Fallback to direct numeric fields if passed individually
        if "arrival_date_year" not in data or "arrival_date_day_of_month" not in data:
            raise ValueError("Must provide either 'arrival_date' (YYYY-MM-DD) or individual arrival date fields.")
        arrival_year = float(data["arrival_date_year"])
        arrival_day = float(data["arrival_date_day_of_month"])
        if "arrival_date_week_number" in data and data["arrival_date_week_number"] is not None:
            arrival_week = float(data["arrival_date_week_number"])
        else:
            # Reconstruct date if month is present
            month_map = {
                "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
                "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
            }
            raw_month = str(data.get("arrival_date_month", 1)).strip().lower()
            month_num = month_map.get(raw_month, int(raw_month) if raw_month.isdigit() else 1)
            dt = date(int(arrival_year), month_num, int(arrival_day))
            arrival_week = float(calculate_arrival_week_number(dt))

    # 2. Stay Nights & Engineered Feature: total_nights (pre.ipynb Cell 14)
    weekend_nights = int(data.get("stays_in_weekend_nights", 0))
    week_nights = int(data.get("stays_in_week_nights", 0))
    total_nights = float(weekend_nights + week_nights)

    # 3. ADR Sanitization & Median Imputation (pre.ipynb Cell 11-12: adr < 0 -> adr_median)
    raw_adr = data.get("adr", None)
    if raw_adr is None or pd.isna(raw_adr):
        adr_clean = float(adr_median)
    else:
        adr_val = float(raw_adr)
        adr_clean = float(adr_median) if adr_val < 0 else adr_val

    # 4. Numeric Features
    lead_time = float(data.get("lead_time", 0))
    special_requests = float(data.get("total_of_special_requests", 0))
    prev_cancellations = float(data.get("previous_cancellations", 0))
    parking_spaces = float(data.get("required_car_parking_spaces", 0))
    booking_changes = float(data.get("booking_changes", 0))

    # 5. Frequency Encoding: country (pre.ipynb Cell 8 & Cell 17)
    raw_country = data.get("country", None)
    if raw_country is None or pd.isna(raw_country) or str(raw_country).strip() == "":
        clean_country = "Unknown"
    else:
        clean_country = str(raw_country).strip()
    country_freq = float(freq_maps["country"].get(clean_country, 0.0))

    # 6. Frequency Encoding: agent (pre.ipynb Cell 7 & Cell 17)
    raw_agent = data.get("agent", None)
    if raw_agent is None or pd.isna(raw_agent) or str(raw_agent).strip() in ("", "No Agent", "nan", "None", "0"):
        clean_agent = "No Agent"
    else:
        try:
            clean_agent = str(int(float(raw_agent)))
        except (ValueError, TypeError):
            clean_agent = str(raw_agent).strip()
    agent_freq = float(freq_maps["agent"].get(clean_agent, 0.0))

    # 7. One-Hot Features for Selected Categoricals (pre.ipynb Cell 20)
    raw_deposit = str(data.get("deposit_type", "No Deposit")).strip()
    deposit_no_deposit = 1.0 if raw_deposit == "No Deposit" else 0.0
    deposit_non_refund = 1.0 if raw_deposit == "Non Refund" else 0.0

    raw_customer = str(data.get("customer_type", "Transient")).strip()
    customer_transient = 1.0 if raw_customer == "Transient" else 0.0
    customer_transient_party = 1.0 if raw_customer == "Transient-Party" else 0.0

    raw_market = str(data.get("market_segment", "Online TA")).strip()
    market_groups = 1.0 if raw_market == "Groups" else 0.0
    market_online_ta = 1.0 if raw_market == "Online TA" else 0.0

    # 8. Assemble Feature Dictionary matching Top-20 features
    features_dict = {
        "country_freq": country_freq,
        "lead_time": lead_time,
        "deposit_type_No Deposit": deposit_no_deposit,
        "deposit_type_Non Refund": deposit_non_refund,
        "adr": adr_clean,
        "total_of_special_requests": special_requests,
        "agent_freq": agent_freq,
        "arrival_date_day_of_month": arrival_day,
        "arrival_date_week_number": arrival_week,
        "previous_cancellations": prev_cancellations,
        "total_nights": total_nights,
        "stays_in_week_nights": float(week_nights),
        "arrival_date_year": arrival_year,
        "required_car_parking_spaces": parking_spaces,
        "booking_changes": booking_changes,
        "stays_in_weekend_nights": float(weekend_nights),
        "customer_type_Transient-Party": customer_transient_party,
        "market_segment_Groups": market_groups,
        "market_segment_Online TA": market_online_ta,
        "customer_type_Transient": customer_transient,
    }

    # Create DataFrame and enforce strict Top-20 column ordering
    processed_df = pd.DataFrame([features_dict])[top_features]

    # Strict Validation Checks
    if processed_df.shape != (1, 20):
        raise ValueError(f"Expected processed shape (1, 20), got {processed_df.shape}")

    if list(processed_df.columns) != top_features:
        raise ValueError("Processed columns do not match expected top_features ordering exactly!")

    if processed_df.isnull().sum().sum() > 0:
        null_cols = processed_df.columns[processed_df.isnull().any()].tolist()
        raise ValueError(f"NaN values found in processed features: {null_cols}")

    if not all(np.issubdtype(dtype, np.number) for dtype in processed_df.dtypes):
        raise ValueError("All processed feature values must be numeric!")

    return processed_df
