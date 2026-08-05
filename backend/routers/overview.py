from fastapi import APIRouter

router = APIRouter()


@router.get("/overview")
def get_overview():
    return {
        "school": "Mahinda Rajapaksa National School",
        "date": "2026-08-03",
        "kpis": {
            "predicted_attendance": 387,
            "enrolled": 450,
            "attendance_rate_pct": 86.0,
            "cost_per_child_lkr": 72.40,
            "nutritional_adequacy_score": 81,
            "waste_pct_this_week": 8.3,
            "estimated_savings_lkr": 14250,
        },
        "insight": (
            "Attendance is trending 8% above the term average — "
            "consider increasing servings by 10 for the next 3 days. "
            "Iron adequacy improved from 68% to 81% after introducing dhal curry."
        ),
        "model_mae": 12.4,
        "attendance_trend": [
            {"week": "Week 1", "predicted": 368, "actual": 361},
            {"week": "Week 2", "predicted": 374, "actual": 379},
            {"week": "Week 3", "predicted": 382, "actual": 388},
            {"week": "Week 4", "predicted": 385, "actual": 391},
            {"week": "This Week", "predicted": 387, "actual": None},
        ],
        "food_group_coverage": [
            {"group": "Grains", "pct": 38},
            {"group": "Protein", "pct": 22},
            {"group": "Vegetables", "pct": 25},
            {"group": "Dairy", "pct": 10},
            {"group": "Other", "pct": 5},
        ],
    }
