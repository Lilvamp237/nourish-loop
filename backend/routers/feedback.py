from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class FeedbackRequest(BaseModel):
    plan_id: str
    actual_consumed: int
    leftover_weight_kg: float
    waste_reason: str
    notes: str = ""


@router.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    waste_pct = round((req.leftover_weight_kg / (req.actual_consumed * 0.45)) * 100, 1)
    return {
        "status": "recorded",
        "consumption_rate_updated": True,
        "new_consumption_rate": round(req.actual_consumed / 395, 3),
        "waste_pct": waste_pct,
        "retrain_pending": False,
        "records_since_last_retrain": 3,
        "records_needed_for_retrain": 5,
        "message": f"Feedback recorded. {5 - 3} more records needed to trigger model update.",
    }


@router.get("/feedback/trends")
def get_waste_trends():
    return {
        "savings_this_month_lkr": 14250,
        "avg_waste_pct_last_30_days": 9.1,
        "retrain_available": False,
        "records_since_last_retrain": 3,
        "waste_trend": [
            {"date": "Jul 01", "waste_pct": 18.2, "consumed": 338, "prepared": 414},
            {"date": "Jul 04", "waste_pct": 16.8, "consumed": 345, "prepared": 415},
            {"date": "Jul 07", "waste_pct": 15.1, "consumed": 352, "prepared": 415},
            {"date": "Jul 10", "waste_pct": 13.4, "consumed": 358, "prepared": 414},
            {"date": "Jul 14", "waste_pct": 12.7, "consumed": 362, "prepared": 415},
            {"date": "Jul 17", "waste_pct": 11.2, "consumed": 367, "prepared": 413},
            {"date": "Jul 21", "waste_pct": 10.4, "consumed": 371, "prepared": 414},
            {"date": "Jul 24", "waste_pct": 9.8, "consumed": 374, "prepared": 415},
            {"date": "Jul 28", "waste_pct": 8.9, "consumed": 378, "prepared": 415},
            {"date": "Aug 01", "waste_pct": 8.3, "consumed": 381, "prepared": 415},
        ],
        "past_plans": [
            {"id": "mock-plan-001", "date": "2026-08-01", "meal": "Rice & Dhal Curry", "prepared": 395},
            {"id": "mock-plan-002", "date": "2026-07-31", "meal": "Vegetable Rice", "prepared": 400},
            {"id": "mock-plan-003", "date": "2026-07-30", "meal": "String Hoppers & Coconut Milk", "prepared": 390},
        ],
    }
