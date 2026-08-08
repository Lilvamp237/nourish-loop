from fastapi import APIRouter

from state import STATE

router = APIRouter()

SCHOOL = "Mahinda Rajapaksa National School"
ENROLLED = 450

# Attendance holds in a narrow band (school attendance doesn't swing much
# week to week) — small noise around ~85%, not a climbing trend.
WEEKLY_ATTENDANCE = [
    {"week": "Week 1", "predicted": 382, "actual": 379},
    {"week": "Week 2", "predicted": 385, "actual": 391},
    {"week": "Week 3", "predicted": 388, "actual": 381},
    {"week": "Week 4", "predicted": 384, "actual": 388},
]


@router.get("/overview")
def get_overview():
    this_week_predicted = 387
    attendance_trend = WEEKLY_ATTENDANCE + [
        {"week": "This Week", "predicted": this_week_predicted, "actual": None}
    ]

    savings_this_month = 14250 + len(STATE.feedback_log) * 180

    return {
        "school": SCHOOL,
        "date": "2026-08-03",
        "kpis": {
            "predicted_attendance": this_week_predicted,
            "enrolled": ENROLLED,
            "attendance_rate_pct": round(this_week_predicted / ENROLLED * 100, 1),
            "cost_per_child_lkr": 72.40,
            "nutritional_adequacy_score": 81,
            "waste_pct_this_week": 8.3,
            "estimated_savings_lkr": savings_this_month,
        },
        "hero_stat": {
            "value": "428 kg",
            "label": "Food waste avoided this term",
            "sub": "vs. conventional fixed-quantity planning — enough for roughly 950 additional meals",
        },
        "insight": (
            "Attendance has held steady around 85-87% all term — normal week-to-week variation, "
            "not a trend. Iron adequacy rose from 52% to 79% after rotating in dhal and chickpea "
            "curries more often. A coconut milk price spike in June briefly pushed cost per child "
            "up 8%, but the optimiser rebalanced portions and brought it back down within three weeks."
        ),
        "model_mae": STATE.current_mae,
        "model_version": STATE.current_version,
        "attendance_trend": attendance_trend,
        "food_group_coverage": [
            {"group": "Grains", "pct": 38},
            {"group": "Protein", "pct": 22},
            {"group": "Vegetables", "pct": 25},
            {"group": "Dairy", "pct": 10},
            {"group": "Other", "pct": 5},
        ],
    }
