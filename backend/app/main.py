from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import BookingRequest, PredictionResponse, HealthResponse, RootResponse
from .predictor import predict_booking, load_model
from .preprocessor import load_artifacts


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Eagerly load model and preprocessing artifacts at application startup.
    Fails fast if artifacts are missing or corrupted.
    """
    try:
        load_artifacts()
        load_model()
        print("ReserveIQ API: Model and preprocessing artifacts loaded successfully.")
    except Exception as e:
        print(f"CRITICAL STARTUP ERROR: Failed to load ML artifacts: {e}")
        raise e
    yield


app = FastAPI(
    title="ReserveIQ API",
    description="Production-ready machine learning API for predicting hotel booking cancellations using Random Forest.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration for React Frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Custom Exception Handler for Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Formats Pydantic validation errors into clear, human-readable JSON messages
    without exposing internal parser details.
    """
    errors = []
    for err in exc.errors():
        field_path = " -> ".join(str(loc) for loc in err.get("loc", []) if loc != "body")
        msg = err.get("msg", "Invalid value")
        errors.append(f"{field_path}: {msg}" if field_path else msg)
    
    clean_detail = "; ".join(errors) if errors else "Invalid request payload"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": clean_detail}
    )


# Custom Exception Handler for Business & Runtime Errors
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)}
    )


@app.exception_handler(FileNotFoundError)
async def file_not_found_handler(request: Request, exc: FileNotFoundError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": f"Service unavailable: Required model artifact is missing. {str(exc)}"}
    )


@app.get(
    "/",
    response_model=RootResponse,
    summary="Root Status",
    tags=["General"]
)
def root():
    """
    Returns API status confirmation.
    """
    return {"message": "ReserveIQ API is running"}


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health & Model Status",
    tags=["Monitoring"]
)
def health():
    """
    Health check verifying the server is healthy and model artifacts are loaded.
    """
    try:
        model = load_model()
        artifacts = load_artifacts()
        model_ok = model is not None
        preprocessing_ok = artifacts is not None
    except Exception:
        model_ok = False
        preprocessing_ok = False

    if not model_ok or not preprocessing_ok:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model or preprocessing artifacts are not available."
        )

    return {
        "status": "ok",
        "model_loaded": model_ok,
        "preprocessing_loaded": preprocessing_ok
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict Booking Cancellation",
    tags=["Prediction"]
)
def predict(request: BookingRequest):
    """
    Predicts the likelihood of a hotel booking cancellation from raw booking fields.
    
    - Applies the exact preprocessing pipeline learned from the training data.
    - Generates class prediction (0: Likely to Continue, 1: Likely to Cancel).
    - Returns calibrated cancellation probability and application-level risk category.
    """
    try:
        raw_data = request.model_dump()
        result = predict_booking(raw_data)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        # Prevent stack trace leakage in production
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction could not be generated due to an internal server error."
        )
