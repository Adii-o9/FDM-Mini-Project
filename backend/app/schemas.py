from datetime import date
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DepositType(str, Enum):
    NO_DEPOSIT = "No Deposit"
    NON_REFUND = "Non Refund"
    REFUNDABLE = "Refundable"


class CustomerType(str, Enum):
    TRANSIENT = "Transient"
    TRANSIENT_PARTY = "Transient-Party"
    CONTRACT = "Contract"
    GROUP = "Group"


class MarketSegment(str, Enum):
    ONLINE_TA = "Online TA"
    OFFLINE_TA = "Offline TA/TO"
    GROUPS = "Groups"
    DIRECT = "Direct"
    CORPORATE = "Corporate"
    COMPLEMENTARY = "Complementary"
    AVIATION = "Aviation"


class BookingRequest(BaseModel):
    # Required business-level raw booking fields
    lead_time: int = Field(
        ...,
        ge=0,
        description="Number of days between booking date and arrival date",
        examples=[65]
    )
    arrival_date: date = Field(
        ...,
        description="Arrival date in YYYY-MM-DD format",
        examples=["2026-08-15"]
    )
    stays_in_weekend_nights: int = Field(
        ...,
        ge=0,
        description="Number of weekend nights (Saturday or Sunday) stayed or booked",
        examples=[2]
    )
    stays_in_week_nights: int = Field(
        ...,
        ge=0,
        description="Number of weekday nights (Monday through Friday) stayed or booked",
        examples=[3]
    )
    adr: float = Field(
        ...,
        ge=0.0,
        description="Average Daily Rate (room price per day in EUR/USD)",
        examples=[125.50]
    )
    deposit_type: DepositType = Field(
        ...,
        description="Type of deposit made for the reservation",
        examples=[DepositType.NO_DEPOSIT]
    )
    customer_type: CustomerType = Field(
        ...,
        description="Customer booking category",
        examples=[CustomerType.TRANSIENT]
    )
    market_segment: MarketSegment = Field(
        ...,
        description="Market segment designation",
        examples=[MarketSegment.ONLINE_TA]
    )

    # Optional / defaulted raw booking fields
    country: Optional[str] = Field(
        default="Unknown",
        description="Country of origin ISO 3166-1 alpha-3 code (e.g. PRT, GBR, FRA, or Unknown)",
        examples=["PRT"]
    )
    agent: Optional[str] = Field(
        default="No Agent",
        description="ID of the travel agency that made the booking, or 'No Agent'",
        examples=["9"]
    )
    previous_cancellations: int = Field(
        default=0,
        ge=0,
        description="Number of previous bookings cancelled by the customer prior to this booking",
        examples=[0]
    )
    booking_changes: int = Field(
        default=0,
        ge=0,
        description="Number of amendments made to the booking prior to check-in",
        examples=[1]
    )
    required_car_parking_spaces: int = Field(
        default=0,
        ge=0,
        description="Number of car parking spaces requested by the guest",
        examples=[0]
    )
    total_of_special_requests: int = Field(
        default=0,
        ge=0,
        description="Number of special requests made by the guest (e.g. high floor, twin bed)",
        examples=[2]
    )

    model_config = ConfigDict(
        use_enum_values=True,
        json_schema_extra={
            "example": {
                "lead_time": 65,
                "arrival_date": "2026-08-15",
                "stays_in_weekend_nights": 2,
                "stays_in_week_nights": 3,
                "adr": 125.50,
                "deposit_type": "No Deposit",
                "customer_type": "Transient",
                "market_segment": "Online TA",
                "country": "PRT",
                "agent": "9",
                "previous_cancellations": 0,
                "booking_changes": 1,
                "required_car_parking_spaces": 0,
                "total_of_special_requests": 2
            }
        }
    )


class PredictionResponse(BaseModel):
    prediction: int = Field(
        ...,
        description="Model class prediction: 0 (Likely to Continue) or 1 (Likely to Cancel)",
        examples=[0]
    )
    label: str = Field(
        ...,
        description="Human-readable prediction label",
        examples=["Likely to Continue"]
    )
    cancellation_probability: float = Field(
        ...,
        description="Model estimated probability for Class 1 (cancellation), between 0.0 and 1.0",
        examples=[0.1791]
    )
    cancellation_percentage: float = Field(
        ...,
        description="Cancellation probability expressed as a percentage (0.0% to 100.0%)",
        examples=[17.91]
    )
    risk_level: str = Field(
        ...,
        description="Application-level risk classification: Low Risk (0.00-0.39), Medium Risk (0.40-0.69), or High Risk (0.70-1.00)",
        examples=["Low Risk"]
    )


class HealthResponse(BaseModel):
    status: str = Field(default="ok", examples=["ok"])
    model_loaded: bool = Field(default=True, examples=[True])
    preprocessing_loaded: bool = Field(default=True, examples=[True])


class RootResponse(BaseModel):
    message: str = Field(default="ReserveIQ API is running", examples=["ReserveIQ API is running"])
