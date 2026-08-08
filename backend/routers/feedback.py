from fastapi import APIRouter
from pydantic import BaseModel

from state import STATE

router = APIRouter()

# Base 30-day waste history. Overall downward (the system is learning), but
# with two realistic relapses — a rainy-day misprediction and a Friday
# effect — not a perfectly smooth staircase.
WASTE_HISTORY = [
    {"date": "Jul 01", "waste_pct": 18.2, "consumed": 339, "prepared": 414},
    {"date": "Jul 04", "waste_pct": 15.9, "consumed": 345, "prepared": 410},
    {"date": "Jul 07", "waste_pct": 16.8, "consumed": 346, "prepared": 416},
    {"date": "Jul 10", "waste_pct": 13.4, "consumed": 357, "prepared": 412},
    {"date": "Jul 14", "waste_pct": 14.6, "consumed": 354, "prepared": 415},
    {"date": "Jul 17", "waste_pct": 11.2, "consumed": 365, "prepared": 411},
    {"date": "Jul 21", "waste_pct": 12.0, "consumed": 364, "prepared": 414},
    {"date": "Jul 24", "waste_pct": 9.8, "consumed": 373, "prepared": 413},
    {"date": "Jul 28", "waste_pct": 10.6, "consumed": 371, "prepared": 415},
    {"date": "Aug 01", "waste_pct": 8.3, "consumed": 380, "prepared": 414},
]

PAST_PLANS = [
    {"id": "mock-plan-2026-08-01", "date": "2026-08-01", "meal": "Rice, Dhal Curry, Mallum & Egg", "prepared": 395},
    {"id": "mock-plan-2026-07-31", "date": "2026-07-31", "meal": "Rice, Kadala Curry, Potato Curry & Fish", "prepared": 399},
    {"id": "mock-plan-2026-07-30", "date": "2026-07-30", "meal": "String Hoppers, Dhal Curry & Pol Sambol", "prepared": 399},
]


class FeedbackRequest(BaseModel):
    plan_id: str
    meal: str
    prepared: int
    actual_consumed: int
    leftover_weight_kg: float
    waste_reason: str
    notes: str = ""


@router.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    record = STATE.record_feedback(
        meal=req.meal,
        consumed=req.actual_consumed,
        prepared=req.prepared,
        leftover_kg=req.leftover_weight_kg,
        reason=req.waste_reason,
        notes=req.notes,
    )

    retrain_available = STATE.records_since_retrain >= 5

    return {
        "status": "recorded",
        "meal": req.meal,
        "old_consumption_rate": record["old_rate"],
        "new_consumption_rate": record["new_rate"],
        "waste_pct": record["waste_pct"],
        "retrain_pending": retrain_available,
        "records_since_last_retrain": STATE.records_since_retrain,
        "records_needed_for_retrain": max(0, 5 - STATE.records_since_retrain),
        "affects": (
            f"{req.meal}'s consumption rate is now {round(record['new_rate'] * 100)}% "
            f"(was {round(record['old_rate'] * 100)}%). This will change its ranking and "
            "waste-risk badge next time you generate a plan that includes it."
        ),
        "message": (
            "Enough new feedback to retrain the model."
            if retrain_available
            else f"Feedback recorded. {max(0, 5 - STATE.records_since_retrain)} more records needed to trigger model update."
        ),
    }


@router.post("/feedback/retrain")
def retrain_model():
    event = STATE.retrain()
    return {"status": "retrained", **event}


@router.get("/feedback/trends")
def get_waste_trends():
    live_points = [
        {
            "date": r["timestamp"].split(",")[0],
            "waste_pct": r["waste_pct"],
            "consumed": r["consumed"],
            "prepared": r["prepared"],
        }
        for r in STATE.feedback_log
    ]

    return {
        "savings_this_month_lkr": 14250 + len(STATE.feedback_log) * 180,
        "avg_waste_pct_last_30_days": 9.1,
        "retrain_available": STATE.records_since_retrain >= 5,
        "records_since_last_retrain": STATE.records_since_retrain,
        "waste_trend": WASTE_HISTORY + live_points,
        "past_plans": PAST_PLANS,
    }
