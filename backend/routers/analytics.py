from fastapi import APIRouter

router = APIRouter()


@router.get("/analytics")
def get_analytics():
    return {
        "school": "Mahinda Rajapaksa National School",
        "period": "2026-05-01 to 2026-08-02",
        "summary": {
            "total_meals_served": 9240,
            "total_waste_kg": 312.4,
            "avg_waste_pct": 9.8,
            "avg_cost_per_child_lkr": 71.60,
            "avg_nutritional_adequacy_score": 78.4,
            "total_savings_vs_fixed_lkr": 38640,
        },
        "waste_over_time": [
            {"month": "May", "waste_pct": 18.4, "cost_per_child": 78.20, "adequacy_score": 68},
            {"month": "Jun", "waste_pct": 14.2, "cost_per_child": 74.80, "adequacy_score": 72},
            {"month": "Jul", "waste_pct": 10.6, "cost_per_child": 72.10, "adequacy_score": 78},
            {"month": "Aug", "waste_pct": 8.3, "cost_per_child": 70.40, "adequacy_score": 81},
        ],
        "budget_heatmap": [
            {"week": "W1", "Mon": 78.2, "Tue": 72.1, "Wed": 68.4, "Thu": 75.3, "Fri": 70.8},
            {"week": "W2", "Mon": 76.4, "Tue": 71.8, "Wed": 74.2, "Thu": 69.7, "Fri": 68.1},
            {"week": "W3", "Mon": 74.1, "Tue": 70.3, "Wed": 72.8, "Thu": 71.2, "Fri": 67.4},
            {"week": "W4", "Mon": 72.8, "Tue": 69.4, "Wed": 70.1, "Thu": 68.8, "Fri": 66.9},
            {"week": "W5", "Mon": 70.4, "Tue": 68.2, "Wed": 69.8, "Thu": 67.1, "Fri": 65.8},
        ],
        "prepared_vs_consumed": [
            {"meal": "Rice & Dhal", "prepared": 415, "consumed": 390, "date": "Jul 01"},
            {"meal": "Vegetable Rice", "prepared": 410, "consumed": 371, "date": "Jul 04"},
            {"meal": "String Hoppers", "prepared": 405, "consumed": 364, "date": "Jul 07"},
            {"meal": "Rice & Dhal", "prepared": 412, "consumed": 388, "date": "Jul 10"},
            {"meal": "Pol Roti", "prepared": 408, "consumed": 368, "date": "Jul 14"},
            {"meal": "Rice & Dhal", "prepared": 410, "consumed": 385, "date": "Jul 17"},
            {"meal": "Vegetable Rice", "prepared": 413, "consumed": 374, "date": "Jul 21"},
            {"meal": "String Hoppers", "prepared": 408, "consumed": 371, "date": "Jul 24"},
            {"meal": "Rice & Dhal", "prepared": 415, "consumed": 392, "date": "Jul 28"},
            {"meal": "Pol Roti", "prepared": 410, "consumed": 376, "date": "Aug 01"},
        ],
        "model_history": [
            {"version": "v0.1", "date": "May 12", "mae": 24.8, "improvement_pct": None},
            {"version": "v0.2", "date": "Jun 01", "mae": 19.3, "improvement_pct": 22.2},
            {"version": "v0.3", "date": "Jun 18", "mae": 16.1, "improvement_pct": 16.6},
            {"version": "v0.4", "date": "Jul 07", "mae": 14.2, "improvement_pct": 11.8},
            {"version": "v0.5", "date": "Jul 25", "mae": 12.4, "improvement_pct": 12.7},
        ],
        "nutrient_adequacy_trend": [
            {"month": "May", "energy": 91, "protein": 72, "iron": 58, "vitamin_a": 64, "composite": 68},
            {"month": "Jun", "energy": 93, "protein": 76, "iron": 63, "vitamin_a": 69, "composite": 72},
            {"month": "Jul", "energy": 95, "protein": 81, "iron": 72, "vitamin_a": 74, "composite": 78},
            {"month": "Aug", "energy": 96, "protein": 84, "iron": 78, "vitamin_a": 79, "composite": 81},
        ],
    }
