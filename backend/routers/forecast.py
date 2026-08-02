from fastapi import APIRouter

router = APIRouter()


@router.get("/forecast")
def get_forecast():
    return {
        "school": "Mahinda Rajapaksa National School",
        "model_version": "v0.1-mock",
        "mae": 12.4,
        "mape_pct": 3.2,
        "drift_alert": False,
        "next_5_days": [
            {
                "date": "2026-08-03",
                "day": "Monday",
                "predicted": 387,
                "lower": 373,
                "upper": 401,
                "is_exam_week": False,
                "term": 2,
            },
            {
                "date": "2026-08-04",
                "day": "Tuesday",
                "predicted": 391,
                "lower": 377,
                "upper": 405,
                "is_exam_week": False,
                "term": 2,
            },
            {
                "date": "2026-08-05",
                "day": "Wednesday",
                "predicted": 385,
                "lower": 371,
                "upper": 399,
                "is_exam_week": False,
                "term": 2,
            },
            {
                "date": "2026-08-06",
                "day": "Thursday",
                "predicted": 379,
                "lower": 365,
                "upper": 393,
                "is_exam_week": False,
                "term": 2,
            },
            {
                "date": "2026-08-07",
                "day": "Friday",
                "predicted": 361,
                "lower": 347,
                "upper": 375,
                "is_exam_week": False,
                "term": 2,
            },
        ],
        "rolling_trend": [
            {"week": "Week 1", "rate": 80.2},
            {"week": "Week 2", "rate": 82.7},
            {"week": "Week 3", "rate": 84.1},
            {"week": "Week 4", "rate": 85.8},
            {"week": "This Week", "rate": 86.0},
        ],
        "shap_factors": [
            {"factor": "Term 2 (historically high)", "impact": 6.4, "direction": "positive"},
            {"factor": "Rolling 4-week rate (85.8%)", "impact": 4.1, "direction": "positive"},
            {"factor": "Monday effect", "impact": 3.2, "direction": "positive"},
            {"factor": "Days since last holiday (3)", "impact": -2.1, "direction": "negative"},
            {"factor": "Rainy season (Aug)", "impact": -1.8, "direction": "negative"},
        ],
    }
