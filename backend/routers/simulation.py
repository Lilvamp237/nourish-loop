from fastapi import APIRouter

from state import STATE

router = APIRouter()

# A hand-authored 9-week journey from "fixed-quantity baseline" to "now".
# Deliberately not a smooth climb — a price spike, a rainy week, an exam
# week — so the story reads as something that actually happened, with the
# system correcting course each time, rather than a straight line up.
TIMELAPSE_FRAMES = [
    {
        "week": "Week 1", "attendance_pct": 84.5, "waste_pct": 19.5, "cost_per_child_lkr": 74.80,
        "adequacy_score": 65, "cumulative_savings_lkr": 0,
        "headline": "Baseline: fixed-quantity planning, no adaptation yet",
    },
    {
        "week": "Week 2", "attendance_pct": 85.8, "waste_pct": 17.2, "cost_per_child_lkr": 76.90,
        "adequacy_score": 68, "cumulative_savings_lkr": 2100,
        "headline": "First feedback cycle — system starts tracking real consumption",
    },
    {
        "week": "Week 3", "attendance_pct": 83.9, "waste_pct": 18.6, "cost_per_child_lkr": 78.90,
        "adequacy_score": 70, "cumulative_savings_lkr": 3400,
        "headline": "Coconut price spike + a rainy week threw off portions",
    },
    {
        "week": "Week 4", "attendance_pct": 86.1, "waste_pct": 14.7, "cost_per_child_lkr": 75.20,
        "adequacy_score": 73, "cumulative_savings_lkr": 6800,
        "headline": "Model retrained on 15 new feedback records — MAE improved 22%",
    },
    {
        "week": "Week 5", "attendance_pct": 85.3, "waste_pct": 13.1, "cost_per_child_lkr": 73.60,
        "adequacy_score": 74, "cumulative_savings_lkr": 9200,
        "headline": "Steady gains, though iron adequacy still lagging",
    },
    {
        "week": "Week 6", "attendance_pct": 86.7, "waste_pct": 15.0, "cost_per_child_lkr": 74.10,
        "adequacy_score": 75, "cumulative_savings_lkr": 10500,
        "headline": "Exam week disrupted normal attendance patterns",
    },
    {
        "week": "Week 7", "attendance_pct": 84.9, "waste_pct": 11.4, "cost_per_child_lkr": 72.30,
        "adequacy_score": 78, "cumulative_savings_lkr": 12100,
        "headline": "Dhal & chickpea rotation increased iron coverage",
    },
    {
        "week": "Week 8", "attendance_pct": 86.4, "waste_pct": 9.6, "cost_per_child_lkr": 71.80,
        "adequacy_score": 80, "cumulative_savings_lkr": 13400,
        "headline": "Second retrain — waste-risk ranking sharpened",
    },
    {
        "week": "Week 9 (Now)", "attendance_pct": 86.0, "waste_pct": 8.3, "cost_per_child_lkr": 72.40,
        "adequacy_score": 81, "cumulative_savings_lkr": 14250,
        "headline": "Current state — the system keeps learning every week",
    },
]


@router.get("/simulation/timelapse")
def get_timelapse():
    return {"frames": TIMELAPSE_FRAMES}


@router.post("/simulation/reset")
def reset_simulation():
    STATE.reset()
    return {"status": "reset"}
