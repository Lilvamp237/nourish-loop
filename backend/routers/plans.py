from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PlanRequest(BaseModel):
    school_id: int = 1
    date: str = "2026-08-03"
    budget_per_child_lkr: float = 80.0


SCHOOL = "Mahinda Rajapaksa National School"
TARGETS = {"energy_kcal": 600, "protein_g": 15, "iron_mg": 3, "vitamin_a_ug": 150}
DEFAULT_DATE = "2026-08-03"

# Predicted attendance per date matches /api/forecast's next_5_days so the
# two pages never disagree on how many students are expected that day.
PLANS_BY_DATE = {
    "2026-08-03": {  # Monday
        "predicted_attendance": 387,
        "meals": [
            {
                "meal": "Rice & Dhal Curry",
                "servings": 395,
                "cost_per_child_lkr": 58.20,
                "total_cost_lkr": 22989,
                "waste_risk": "Low",
                "consumption_rate": 0.94,
                "nutrition": {
                    "energy_kcal": 642, "protein_g": 18.4, "iron_mg": 4.1, "vitamin_a_ug": 162,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.5, "cost_lkr": 9480},
                    {"name": "Red Lentils (Dhal)", "quantity_kg": 11.8, "cost_lkr": 7670},
                    {"name": "Coconut Milk", "quantity_litres": 7.9, "cost_lkr": 3160},
                    {"name": "Onions", "quantity_kg": 3.9, "cost_lkr": 780},
                    {"name": "Spices & Oil", "quantity_kg": 1.2, "cost_lkr": 1899},
                ],
                "explanation": (
                    "Rice & Dhal Curry was selected as the primary recommendation because it meets "
                    "all nutritional targets at the lowest cost per child (LKR 58.20). "
                    "Its 94% historical consumption rate keeps predicted waste below 6kg. "
                    "Protein and iron targets are both exceeded — dhal contributes 4.1mg iron per serving."
                ),
            },
            {
                "meal": "Vegetable Rice (Hodhi)",
                "servings": 395,
                "cost_per_child_lkr": 64.80,
                "total_cost_lkr": 25596,
                "waste_risk": "Medium",
                "consumption_rate": 0.87,
                "nutrition": {
                    "energy_kcal": 611, "protein_g": 14.2, "iron_mg": 3.3, "vitamin_a_ug": 198,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.5, "cost_lkr": 9480},
                    {"name": "Mixed Vegetables", "quantity_kg": 19.7, "cost_lkr": 7880},
                    {"name": "Coconut Milk", "quantity_litres": 7.9, "cost_lkr": 3160},
                    {"name": "Soya Meal (TVP)", "quantity_kg": 7.9, "cost_lkr": 3952},
                    {"name": "Spices & Oil", "quantity_kg": 1.5, "cost_lkr": 1124},
                ],
                "explanation": (
                    "Vegetable Rice was ranked second due to higher vitamin A from mixed vegetables. "
                    "Cost is LKR 6.60 more per child than dhal curry. "
                    "An 87% consumption rate introduces moderate waste risk (~52 portions)."
                ),
            },
        ],
    },
    "2026-08-04": {  # Tuesday
        "predicted_attendance": 391,
        "meals": [
            {
                "meal": "Kadala (Chickpea) Curry & Rice",
                "servings": 399,
                "cost_per_child_lkr": 53.55,
                "total_cost_lkr": 21367,
                "waste_risk": "Low",
                "consumption_rate": 0.92,
                "nutrition": {
                    "energy_kcal": 620, "protein_g": 17.0, "iron_mg": 3.8, "vitamin_a_ug": 140,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.9, "cost_lkr": 9576},
                    {"name": "Chickpeas (Kadala)", "quantity_kg": 15.96, "cost_lkr": 6065},
                    {"name": "Coconut Milk", "quantity_litres": 7.98, "cost_lkr": 3192},
                    {"name": "Onions", "quantity_kg": 3.19, "cost_lkr": 638},
                    {"name": "Spices & Oil", "quantity_kg": 1.2, "cost_lkr": 1896},
                ],
                "explanation": (
                    "Kadala Curry meets nutrition targets at the lowest cost per child (LKR 53.55) for Tuesday. "
                    "A 92% historical consumption rate keeps predicted waste low. "
                    "Protein and iron exceed targets, though vitamin A sits slightly under target — "
                    "pairing with a vegetable side is recommended."
                ),
            },
            {
                "meal": "Ambul Thiyal Fish Curry & Rice",
                "servings": 399,
                "cost_per_child_lkr": 65.03,
                "total_cost_lkr": 25947,
                "waste_risk": "Medium",
                "consumption_rate": 0.85,
                "nutrition": {
                    "energy_kcal": 610, "protein_g": 19.5, "iron_mg": 3.0, "vitamin_a_ug": 120,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.9, "cost_lkr": 9576},
                    {"name": "Fish (Ambul Thiyal)", "quantity_kg": 13.97, "cost_lkr": 12573},
                    {"name": "Onions", "quantity_kg": 3.19, "cost_lkr": 638},
                    {"name": "Spices, Tamarind & Oil", "quantity_kg": 2.0, "cost_lkr": 3160},
                ],
                "explanation": (
                    "Fish curry offers the highest protein per child but costs LKR 11.48 more than the "
                    "chickpea option. An 85% historical consumption rate introduces moderate waste risk, "
                    "and vitamin A coverage is lower than the vegetable-based alternative."
                ),
            },
        ],
    },
    "2026-08-05": {  # Wednesday
        "predicted_attendance": 385,
        "meals": [
            {
                "meal": "Soya Meal (TVP) Curry & Rice",
                "servings": 393,
                "cost_per_child_lkr": 55.67,
                "total_cost_lkr": 21877,
                "waste_risk": "Low",
                "consumption_rate": 0.90,
                "nutrition": {
                    "energy_kcal": 595, "protein_g": 20.5, "iron_mg": 4.5, "vitamin_a_ug": 110,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.3, "cost_lkr": 9432},
                    {"name": "Soya Meal (TVP)", "quantity_kg": 13.76, "cost_lkr": 6192},
                    {"name": "Coconut Milk", "quantity_litres": 7.86, "cost_lkr": 3144},
                    {"name": "Onions", "quantity_kg": 3.14, "cost_lkr": 628},
                    {"name": "Spices & Oil", "quantity_kg": 1.57, "cost_lkr": 2481},
                ],
                "explanation": (
                    "Soya meal curry was ranked first for its exceptional protein and iron content at "
                    "LKR 55.67 per child — the lowest-cost option that still meets energy and protein "
                    "targets. Vitamin A falls short of target; consider adding a vegetable side."
                ),
            },
            {
                "meal": "Egg Curry & Rice",
                "servings": 393,
                "cost_per_child_lkr": 81.92,
                "total_cost_lkr": 32193,
                "waste_risk": "Low",
                "consumption_rate": 0.95,
                "nutrition": {
                    "energy_kcal": 615, "protein_g": 19.8, "iron_mg": 3.6, "vitamin_a_ug": 175,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.3, "cost_lkr": 9432},
                    {"name": "Eggs", "quantity_kg": 19.65, "cost_lkr": 15720},
                    {"name": "Coconut Milk", "quantity_litres": 9.83, "cost_lkr": 3932},
                    {"name": "Onions", "quantity_kg": 3.14, "cost_lkr": 628},
                    {"name": "Spices & Oil", "quantity_kg": 1.57, "cost_lkr": 2481},
                ],
                "explanation": (
                    "Egg curry has the highest historical consumption rate (95%) and fully covers all "
                    "four nutrition targets, but costs LKR 26.25 more per child than the soya meal "
                    "option — pushing it just over a LKR 80 budget."
                ),
            },
        ],
    },
    "2026-08-06": {  # Thursday
        "predicted_attendance": 379,
        "meals": [
            {
                "meal": "Green Gram (Mun Ata) Curry & Rice",
                "servings": 387,
                "cost_per_child_lkr": 53.04,
                "total_cost_lkr": 20528,
                "waste_risk": "Low",
                "consumption_rate": 0.91,
                "nutrition": {
                    "energy_kcal": 590, "protein_g": 16.2, "iron_mg": 3.4, "vitamin_a_ug": 130,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 38.7, "cost_lkr": 9288},
                    {"name": "Green Gram (Mun Ata)", "quantity_kg": 13.55, "cost_lkr": 5691},
                    {"name": "Coconut Milk", "quantity_litres": 7.74, "cost_lkr": 3096},
                    {"name": "Onions", "quantity_kg": 3.1, "cost_lkr": 620},
                    {"name": "Spices & Oil", "quantity_kg": 1.16, "cost_lkr": 1833},
                ],
                "explanation": (
                    "Green gram curry meets protein and iron targets at the lowest cost per child "
                    "(LKR 53.04) for Thursday, with a strong 91% historical consumption rate. "
                    "Energy and vitamin A sit slightly under target."
                ),
            },
            {
                "meal": "Dhal & Jackfruit Curry with Rice",
                "servings": 387,
                "cost_per_child_lkr": 59.59,
                "total_cost_lkr": 23063,
                "waste_risk": "Medium",
                "consumption_rate": 0.84,
                "nutrition": {
                    "energy_kcal": 625, "protein_g": 16.8, "iron_mg": 3.9, "vitamin_a_ug": 145,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 38.7, "cost_lkr": 9288},
                    {"name": "Red Lentils (Dhal)", "quantity_kg": 9.68, "cost_lkr": 6292},
                    {"name": "Young Jackfruit (Polos)", "quantity_kg": 11.61, "cost_lkr": 2090},
                    {"name": "Coconut Milk", "quantity_litres": 7.74, "cost_lkr": 3096},
                    {"name": "Onions", "quantity_kg": 2.32, "cost_lkr": 464},
                    {"name": "Spices & Oil", "quantity_kg": 1.16, "cost_lkr": 1833},
                ],
                "explanation": (
                    "Dhal & jackfruit curry adds variety and slightly better overall nutrition coverage, "
                    "but costs LKR 6.55 more per child and has a lower 84% historical consumption rate "
                    "than the green gram option."
                ),
            },
        ],
    },
    "2026-08-07": {  # Friday
        "predicted_attendance": 361,
        "meals": [
            {
                "meal": "Rice & Dhal Curry",
                "servings": 369,
                "cost_per_child_lkr": 58.25,
                "total_cost_lkr": 21496,
                "waste_risk": "Low",
                "consumption_rate": 0.94,
                "nutrition": {
                    "energy_kcal": 642, "protein_g": 18.4, "iron_mg": 4.1, "vitamin_a_ug": 162,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 36.9, "cost_lkr": 8856},
                    {"name": "Red Lentils (Dhal)", "quantity_kg": 11.07, "cost_lkr": 7196},
                    {"name": "Coconut Milk", "quantity_litres": 7.38, "cost_lkr": 2952},
                    {"name": "Onions", "quantity_kg": 3.69, "cost_lkr": 738},
                    {"name": "Spices & Oil", "quantity_kg": 1.11, "cost_lkr": 1754},
                ],
                "explanation": (
                    "Rice & dhal curry remains the most reliable choice — a proven 94% consumption rate "
                    "and full nutrition coverage at LKR 58.25 per child, unchanged from its performance "
                    "on Monday."
                ),
            },
            {
                "meal": "Vegetable Fried Rice with Egg",
                "servings": 369,
                "cost_per_child_lkr": 68.88,
                "total_cost_lkr": 25416,
                "waste_risk": "Medium",
                "consumption_rate": 0.88,
                "nutrition": {
                    "energy_kcal": 630, "protein_g": 16.5, "iron_mg": 3.2, "vitamin_a_ug": 155,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 40.59, "cost_lkr": 9742},
                    {"name": "Mixed Vegetables", "quantity_kg": 11.07, "cost_lkr": 4428},
                    {"name": "Eggs", "quantity_kg": 9.22, "cost_lkr": 8302},
                    {"name": "Oil, Soy Sauce & Spices", "quantity_kg": 1.84, "cost_lkr": 2944},
                ],
                "explanation": (
                    "Vegetable fried rice with egg is a popular Friday treat meal that fully meets "
                    "nutrition targets, but costs LKR 10.63 more per child than rice & dhal and carries "
                    "slightly higher waste risk from smaller portions being left uneaten."
                ),
            },
        ],
    },
}


@router.post("/plans/generate")
def generate_plan(req: PlanRequest):
    day = PLANS_BY_DATE.get(req.date, PLANS_BY_DATE[DEFAULT_DATE])
    candidates = day["meals"]

    affordable = [m for m in candidates if m["cost_per_child_lkr"] <= req.budget_per_child_lkr]

    if affordable:
        selected = affordable
    else:
        # Nothing fits the budget — fall back to the cheapest option and say so,
        # rather than silently returning an empty plan.
        cheapest = min(candidates, key=lambda m: m["cost_per_child_lkr"])
        gap = round(cheapest["cost_per_child_lkr"] - req.budget_per_child_lkr, 2)
        cheapest = {
            **cheapest,
            "explanation": (
                f"{cheapest['explanation']} Note: this is the lowest-cost option available for this day, "
                f"but it exceeds your LKR {req.budget_per_child_lkr:.2f} budget by LKR {gap:.2f} per child — "
                "consider raising the budget or reducing portion size."
            ),
        }
        selected = [cheapest]

    ranked = [{**m, "rank": i + 1} for i, m in enumerate(selected)]

    return {
        "plan_id": f"mock-plan-{req.date}",
        "date": req.date,
        "school": SCHOOL,
        "predicted_attendance": day["predicted_attendance"],
        "recommended_meals": ranked,
    }


@router.get("/plans/{plan_id}")
def get_plan(plan_id: str):
    return {"plan_id": plan_id, "status": "approved"}
