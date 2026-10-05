import os
import joblib
import pandas as pd
from typing import Dict, Any, Union

from .preprocessor import preprocess_booking, load_artifacts

# Path to the serialized final tuned Random Forest model
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "models",
    "random_forest_tuned.pkl"
)

# Global cache for the loaded model instance (loaded once at startup)
_CACHED_MODEL = None


def load_model(path: str = MODEL_PATH):
    """
    Loads and caches the final trained Random Forest model.
    Ensures the model is loaded exactly once during application lifecycle.
    """
    global _CACHED_MODEL
    if _CACHED_MODEL is None:
        if not os.path.exists(path):
            raise FileNotFoundError(
                f"Tuned Random Forest model file not found at {path}. "
                "Ensure backend/models/random_forest_tuned.pkl exists."
            )
        _CACHED_MODEL = joblib.load(path)
    return _CACHED_MODEL


def determine_risk_level(cancellation_probability: float) -> str:
    """
    Assigns an application-level risk category based on cancellation probability.
    
    Thresholds:
      - 0.00 - 0.39: Low Risk
      - 0.40 - 0.69: Medium Risk
      - 0.70 - 1.00: High Risk
      
    NOTE: These risk tiers are application/UI heuristics, not model classes.
    The binary class prediction is determined strictly by model.predict().
    """
    if cancellation_probability < 0.40:
        return "Low Risk"
    elif cancellation_probability < 0.70:
        return "Medium Risk"
    else:
        return "High Risk"


def predict_booking(raw_booking: Union[Dict[str, Any], pd.DataFrame, pd.Series]) -> Dict[str, Any]:
    """
    Executes end-to-end inference for a single booking:
      1. Preprocesses raw booking using exact training parameters.
      2. Validates feature order against model.feature_names_in_.
      3. Generates prediction class via model.predict().
      4. Generates class probability via model.predict_proba().
      5. Derives human-readable label and UI risk tier.
    """
    model = load_model()

    # Step 1: Preprocess raw booking into exact 20-feature DataFrame
    processed_df = preprocess_booking(raw_booking)

    # Step 2: Validate feature names and ordering match the model's expected inputs
    if hasattr(model, "feature_names_in_"):
        expected_features = list(model.feature_names_in_)
        actual_features = list(processed_df.columns)
        if actual_features != expected_features:
            raise ValueError(
                f"Feature ordering mismatch!\n"
                f"Expected: {expected_features}\n"
                f"Received: {actual_features}"
            )

    # Step 3: Run model prediction
    raw_pred = model.predict(processed_df)[0]
    prediction_class = int(raw_pred)

    # Step 4: Run probability estimation (Class 1 = Cancellation)
    probabilities = model.predict_proba(processed_df)[0]
    cancellation_prob = float(probabilities[1])

    # Step 5: Derive business label and UI risk tier
    # 0 -> "Likely to Continue", 1 -> "Likely to Cancel"
    label = "Likely to Cancel" if prediction_class == 1 else "Likely to Continue"
    risk_level = determine_risk_level(cancellation_prob)
    cancellation_percentage = round(cancellation_prob * 100, 2)

    return {
        "prediction": prediction_class,
        "label": label,
        "cancellation_probability": round(cancellation_prob, 4),
        "cancellation_percentage": cancellation_percentage,
        "risk_level": risk_level
    }
