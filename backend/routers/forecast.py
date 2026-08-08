from fastapi import APIRouter

from state import STATE

router = APIRouter()

SCHOOL = "Mahinda Rajapaksa National School"
ENROLLED = 450

# Same weekly attendance story as overview.py, expressed as a rate.
# Held in a stable band with natural noise, not a smooth climb.
WEEKLY_ROLLING = [
    {"week": "Week 1", "predicted": 382, "actual": 379},
    {"week": "Week 2", "predicted": 385, "actual": 391},
    {"week": "Week 3", "predicted": 388, "actual": 381},
    {"week": "Week 4", "predicted": 384, "actual": 388},
]


@router.get("/forecast")
def get_forecast():
    this_week_predicted = 387
    rolling_trend = [
        {**w, "rate": round(w["actual"] / ENROLLED * 100, 1)} for w in WEEKLY_ROLLING
    ] + [
        {
            "week": "This Week",
            "predicted": this_week_predicted,
            "actual": None,
            "rate": round(this_week_predicted / ENROLLED * 100, 1),
        }
    ]

    return {
        "school": SCHOOL,
        "model_version": STATE.current_version,
        "mae": STATE.current_mae,
        "mape_pct": 3.2,
        "drift_alert": False,
        "next_5_days": [
            {
                "date": "2026-08-03", "day": "Monday", "predicted": 387,
                "lower": 373, "upper": 401, "is_exam_week": False, "term": 2,
            },
            {
                "date": "2026-08-04", "day": "Tuesday", "predicted": 391,
                "lower": 377, "upper": 405, "is_exam_week": False, "term": 2,
            },
            {
                "date": "2026-08-05", "day": "Wednesday", "predicted": 385,
                "lower": 371, "upper": 399, "is_exam_week": False, "term": 2,
            },
            {
                "date": "2026-08-06", "day": "Thursday", "predicted": 379,
                "lower": 365, "upper": 393, "is_exam_week": False, "term": 2,
            },
            {
                "date": "2026-08-07", "day": "Friday", "predicted": 361,
                "lower": 347, "upper": 375, "is_exam_week": False, "term": 2,
            },
        ],
        "rolling_trend": rolling_trend,
        "shap_factors": [
            {"factor": "Term 2 (historically high)", "impact": 6.4, "direction": "positive"},
            {"factor": "Rolling 4-week rate (85.8%)", "impact": 4.1, "direction": "positive"},
            {"factor": "Monday effect", "impact": 3.2, "direction": "positive"},
            {"factor": "Days since last holiday (3)", "impact": -2.1, "direction": "negative"},
            {"factor": "Rainy season (Aug)", "impact": -1.8, "direction": "negative"},
        ],
    }
