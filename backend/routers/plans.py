from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from state import STATE, BASELINE_CONSUMPTION_RATES, waste_risk_label

router = APIRouter()


class PlanRequest(BaseModel):
    school_id: int = 1
    date: str = "2026-08-03"
    budget_per_child_lkr: float = 80.0


class RejectRequest(BaseModel):
    rejected_meal: str
    budget_per_child_lkr: float = 80.0


class ModifyRequest(BaseModel):
    meal: str
    servings: int


class ApproveRequest(BaseModel):
    approved_by: str = "Meal Planner"


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
                "explanation_base": (
                    "Rice & Dhal Curry was selected as the primary recommendation because it meets "
                    "all nutritional targets at the lowest cost per child (LKR 58.20). "
                    "Protein and iron targets are both exceeded — dhal contributes 4.1mg iron per serving."
                ),
            },
            {
                "meal": "Vegetable Rice (Hodhi)",
                "servings": 395,
                "cost_per_child_lkr": 64.80,
                "total_cost_lkr": 25596,
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
                "explanation_base": (
                    "Vegetable Rice was ranked second due to higher vitamin A from mixed vegetables. "
                    "Cost is LKR 6.60 more per child than dhal curry."
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
                "explanation_base": (
                    "Kadala Curry meets nutrition targets at the lowest cost per child (LKR 53.55) for Tuesday. "
                    "Protein and iron exceed targets, though vitamin A sits slightly under target — "
                    "pairing with a vegetable side is recommended."
                ),
            },
            {
                "meal": "Ambul Thiyal Fish Curry & Rice",
                "servings": 399,
                "cost_per_child_lkr": 65.03,
                "total_cost_lkr": 25947,
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
                "explanation_base": (
                    "Fish curry offers the highest protein per child but costs LKR 11.48 more than the "
                    "chickpea option, and vitamin A coverage is lower than the vegetable-based alternative."
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
                "explanation_base": (
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
                "explanation_base": (
                    "Egg curry fully covers all four nutrition targets, but costs LKR 26.25 more per "
                    "child than the soya meal option — pushing it just over a LKR 80 budget."
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
                "explanation_base": (
                    "Green gram curry meets protein and iron targets at the lowest cost per child "
                    "(LKR 53.04) for Thursday. Energy and vitamin A sit slightly under target."
                ),
            },
            {
                "meal": "Dhal & Jackfruit Curry with Rice",
                "servings": 387,
                "cost_per_child_lkr": 59.59,
                "total_cost_lkr": 23063,
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
                "explanation_base": (
                    "Dhal & jackfruit curry adds variety and slightly better overall nutrition coverage, "
                    "but costs LKR 6.55 more per child than the green gram option."
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
                "explanation_base": (
                    "Rice & dhal curry remains a reliable choice — full nutrition coverage at "
                    "LKR 58.25 per child, unchanged from its performance on Monday."
                ),
            },
            {
                "meal": "Vegetable Fried Rice with Egg",
                "servings": 369,
                "cost_per_child_lkr": 68.88,
                "total_cost_lkr": 25416,
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
                "explanation_base": (
                    "Vegetable fried rice with egg is a popular Friday treat meal that fully meets "
                    "nutrition targets, but costs LKR 10.63 more per child than rice & dhal."
                ),
            },
        ],
    },
}


def _live_meal(base_meal: dict) -> dict:
    """Overlay a static candidate meal with the current (feedback-adjusted) consumption rate."""
    rate = STATE.get_rate(base_meal["meal"])
    risk = waste_risk_label(rate)

    explanation = base_meal["explanation_base"]
    baseline = BASELINE_CONSUMPTION_RATES.get(base_meal["meal"], rate)
    if abs(rate - baseline) >= 0.02:
        direction = "dropped" if rate < baseline else "risen"
        explanation += (
            f" Note: consumption rate has {direction} to {round(rate * 100)}% "
            f"(from a {round(baseline * 100)}% baseline) based on recent feedback."
        )

    return {
        **{k: v for k, v in base_meal.items() if k != "explanation_base"},
        "consumption_rate": round(rate, 3),
        "waste_risk": risk,
        "explanation": explanation,
    }


_RISK_ORDER = {"Low": 0, "Medium": 1, "High": 2}


def _rank_candidates(date: str, budget: float, exclude: set[str] | None = None):
    day = PLANS_BY_DATE.get(date, PLANS_BY_DATE[DEFAULT_DATE])
    exclude = exclude or set()

    candidates = [_live_meal(m) for m in day["meals"] if m["meal"] not in exclude]
    if not candidates:
        # Everything on this day got rejected — fall back to the full list
        # rather than returning nothing.
        candidates = [_live_meal(m) for m in day["meals"]]

    affordable = [m for m in candidates if m["cost_per_child_lkr"] <= budget]
    pool = affordable if affordable else candidates

    over_budget_note = None
    if not affordable:
        cheapest = min(pool, key=lambda m: m["cost_per_child_lkr"])
        gap = round(cheapest["cost_per_child_lkr"] - budget, 2)
        over_budget_note = (
            f" Note: this is the lowest-cost option available for this day, but it exceeds your "
            f"LKR {budget:.2f} budget by LKR {gap:.2f} per child — consider raising the budget or "
            "reducing portion size."
        )
        pool = [cheapest]

    # Feedback-driven ranking: waste risk beats raw cost. If a top pick's
    # consumption rate has been dragged into "High" risk by recent
    # feedback, a cheaper-but-riskier meal no longer automatically wins —
    # this is the visible effect of the closed loop.
    ranked = sorted(pool, key=lambda m: (_RISK_ORDER[m["waste_risk"]], m["cost_per_child_lkr"]))

    if over_budget_note:
        ranked[0] = {**ranked[0], "explanation": ranked[0]["explanation"] + over_budget_note}

    return day, [{**m, "rank": i + 1} for i, m in enumerate(ranked)]


@router.post("/plans/generate")
def generate_plan(req: PlanRequest):
    day, ranked = _rank_candidates(req.date, req.budget_per_child_lkr)
    plan_id = f"mock-plan-{req.date}"

    return {
        "plan_id": plan_id,
        "date": req.date,
        "school": SCHOOL,
        "predicted_attendance": day["predicted_attendance"],
        "recommended_meals": ranked,
        "status": STATE.get_plan_status(plan_id),
    }


@router.post("/plans/{plan_id}/approve")
def approve_plan(plan_id: str, req: ApproveRequest):
    STATE.set_plan_status(plan_id, "approved")
    return {"plan_id": plan_id, "status": "approved", "approved_by": req.approved_by}


@router.post("/plans/{plan_id}/reject")
def reject_plan(plan_id: str, req: RejectRequest):
    date = plan_id.replace("mock-plan-", "")
    if date not in PLANS_BY_DATE:
        raise HTTPException(status_code=404, detail="Unknown plan date")

    STATE.reject_meal(plan_id, req.rejected_meal)
    STATE.set_plan_status(plan_id, "modified", meal=req.rejected_meal)

    day, ranked = _rank_candidates(date, req.budget_per_child_lkr, exclude=STATE.rejected_meals.get(plan_id, set()))

    return {
        "plan_id": plan_id,
        "date": date,
        "school": SCHOOL,
        "predicted_attendance": day["predicted_attendance"],
        "recommended_meals": ranked,
        "status": "modified",
        "rejected_meal": req.rejected_meal,
    }


@router.post("/plans/{plan_id}/modify")
def modify_plan(plan_id: str, req: ModifyRequest):
    STATE.modifications[plan_id] = {"meal": req.meal, "servings": req.servings}
    STATE.set_plan_status(plan_id, "modified", meal=req.meal)
    return {"plan_id": plan_id, "status": "modified", "meal": req.meal, "servings": req.servings}


@router.get("/plans/{plan_id}")
def get_plan(plan_id: str):
    return {"plan_id": plan_id, "status": STATE.get_plan_status(plan_id)}
