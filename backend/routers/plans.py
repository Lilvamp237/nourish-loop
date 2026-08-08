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
                "meal": "Rice, Dhal Curry, Mallum & Egg",
                "servings": 395,
                "cost_per_child_lkr": 73.00,
                "total_cost_lkr": 28835,
                "nutrition": {
                    "energy_kcal": 660, "protein_g": 20.5, "iron_mg": 4.8, "vitamin_a_ug": 240,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.5, "cost_lkr": 9480},
                    {"name": "Red Lentils (Dhal Curry)", "quantity_kg": 9.1, "cost_lkr": 5925},
                    {"name": "Gotukola (Mallum Greens)", "quantity_kg": 11.9, "cost_lkr": 2370},
                    {"name": "Scraped Coconut (for Mallum)", "quantity_kg": 3.95, "cost_lkr": 1185},
                    {"name": "Eggs (Egg Curry)", "quantity_kg": 9.9, "cost_lkr": 7900},
                    {"name": "Onions & Spices", "quantity_kg": 2.4, "cost_lkr": 1975},
                ],
                "explanation_base": (
                    "A full traditional plate — rice, dhal curry, mallum (shredded greens with coconut) "
                    "and egg curry — meets every nutritional target at LKR 73.00 per child. The mallum "
                    "greens push vitamin A well above target, and it's historically the most reliably "
                    "eaten combination on the menu."
                ),
            },
            {
                "meal": "Rice, Chicken Curry, Beetroot Curry & Papadam",
                "servings": 395,
                "cost_per_child_lkr": 89.97,
                "total_cost_lkr": 35540,
                "nutrition": {
                    "energy_kcal": 680, "protein_g": 24.5, "iron_mg": 3.2, "vitamin_a_ug": 130,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.5, "cost_lkr": 9480},
                    {"name": "Chicken (Curry Cut)", "quantity_kg": 15.8, "cost_lkr": 17775},
                    {"name": "Beetroot Curry", "quantity_kg": 7.9, "cost_lkr": 2765},
                    {"name": "Papadam", "quantity_kg": 3.0, "cost_lkr": 1185},
                    {"name": "Coconut Milk", "quantity_litres": 5.9, "cost_lkr": 2360},
                    {"name": "Onions & Spices", "quantity_kg": 2.4, "cost_lkr": 1975},
                ],
                "explanation_base": (
                    "Chicken curry with beetroot and papadam is the highest-protein option today, and a "
                    "popular treat plate. At LKR 89.97 per child it exceeds a LKR 80 default budget — "
                    "raise the budget or reserve it for a special day."
                ),
            },
        ],
    },
    "2026-08-04": {  # Tuesday
        "predicted_attendance": 391,
        "meals": [
            {
                "meal": "Rice, Kadala Curry, Potato Curry & Fish",
                "servings": 399,
                "cost_per_child_lkr": 78.00,
                "total_cost_lkr": 31122,
                "nutrition": {
                    "energy_kcal": 645, "protein_g": 22.0, "iron_mg": 4.0, "vitamin_a_ug": 155,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.9, "cost_lkr": 9576},
                    {"name": "Chickpeas (Kadala Curry)", "quantity_kg": 9.98, "cost_lkr": 5985},
                    {"name": "Potato Curry", "quantity_kg": 15.96, "cost_lkr": 3192},
                    {"name": "Fish Curry", "quantity_kg": 9.98, "cost_lkr": 7980},
                    {"name": "Coconut Milk", "quantity_litres": 5.99, "cost_lkr": 2394},
                    {"name": "Onions & Spices", "quantity_kg": 2.4, "cost_lkr": 1995},
                ],
                "explanation_base": (
                    "Rice with chickpea curry, potato curry and fish is a well-rounded three-curry plate "
                    "that clears every nutritional target at LKR 78.00 per child, with a strong 91% "
                    "historical consumption rate."
                ),
            },
            {
                "meal": "String Hoppers, Dhal Curry & Pol Sambol",
                "servings": 399,
                "cost_per_child_lkr": 54.00,
                "total_cost_lkr": 21546,
                "nutrition": {
                    "energy_kcal": 560, "protein_g": 14.5, "iron_mg": 3.6, "vitamin_a_ug": 120,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "String Hoppers (Rice Flour)", "quantity_kg": 35.9, "cost_lkr": 8778},
                    {"name": "Red Lentils (Dhal Curry)", "quantity_kg": 11.97, "cost_lkr": 7581},
                    {"name": "Pol Sambol (Coconut, Chili, Onion, Lime)", "quantity_kg": 7.98, "cost_lkr": 3990},
                    {"name": "Spices & Oil", "quantity_kg": 1.6, "cost_lkr": 1197},
                ],
                "explanation_base": (
                    "String hoppers with dhal curry and pol sambol is the cheapest option this week at "
                    "LKR 54.00 per child. Energy sits slightly under target — pairing with a banana or "
                    "extra dhal portion is recommended."
                ),
            },
        ],
    },
    "2026-08-05": {  # Wednesday
        "predicted_attendance": 385,
        "meals": [
            {
                "meal": "Rice, Soya Curry, Mallum & Egg",
                "servings": 393,
                "cost_per_child_lkr": 72.00,
                "total_cost_lkr": 28296,
                "nutrition": {
                    "energy_kcal": 650, "protein_g": 23.5, "iron_mg": 5.0, "vitamin_a_ug": 220,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.3, "cost_lkr": 9432},
                    {"name": "Soya Meal (TVP Curry)", "quantity_kg": 6.29, "cost_lkr": 6288},
                    {"name": "Gotukola (Mallum Greens)", "quantity_kg": 11.79, "cost_lkr": 2358},
                    {"name": "Scraped Coconut (for Mallum)", "quantity_kg": 3.93, "cost_lkr": 1179},
                    {"name": "Eggs (Egg Curry)", "quantity_kg": 7.86, "cost_lkr": 7074},
                    {"name": "Onions & Spices", "quantity_kg": 2.36, "cost_lkr": 1965},
                ],
                "explanation_base": (
                    "Soya curry, mallum and egg together give the strongest protein and iron coverage "
                    "of the week at LKR 72.00 per child. Soya's texture is sometimes less popular with "
                    "younger children — worth monitoring consumption closely."
                ),
            },
            {
                "meal": "Pittu, Coconut Milk & Dhal Curry",
                "servings": 393,
                "cost_per_child_lkr": 54.00,
                "total_cost_lkr": 21222,
                "nutrition": {
                    "energy_kcal": 590, "protein_g": 13.8, "iron_mg": 3.4, "vitamin_a_ug": 95,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "Pittu (Rice Flour & Coconut)", "quantity_kg": 35.4, "cost_lkr": 8646},
                    {"name": "Coconut Milk (Side)", "quantity_litres": 9.83, "cost_lkr": 3930},
                    {"name": "Red Lentils (Dhal Curry)", "quantity_kg": 11.79, "cost_lkr": 7467},
                    {"name": "Spices & Oil", "quantity_kg": 1.57, "cost_lkr": 1179},
                ],
                "explanation_base": (
                    "Pittu with coconut milk and dhal curry is a traditional low-cost favourite at "
                    "LKR 54.00 per child, but has no vegetable component — vitamin A coverage is the "
                    "lowest of the week. Consider adding a vegetable side on this day."
                ),
            },
        ],
    },
    "2026-08-06": {  # Thursday
        "predicted_attendance": 379,
        "meals": [
            {
                "meal": "Rice, Green Gram Curry, Bean Curry & Chicken",
                "servings": 387,
                "cost_per_child_lkr": 99.00,
                "total_cost_lkr": 38313,
                "nutrition": {
                    "energy_kcal": 700, "protein_g": 26.0, "iron_mg": 4.2, "vitamin_a_ug": 145,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 38.7, "cost_lkr": 9288},
                    {"name": "Green Gram (Mun Ata) Curry", "quantity_kg": 5.42, "cost_lkr": 5418},
                    {"name": "Long Bean Curry", "quantity_kg": 3.87, "cost_lkr": 3870},
                    {"name": "Chicken (Curry Cut)", "quantity_kg": 15.48, "cost_lkr": 15480},
                    {"name": "Coconut Milk", "quantity_litres": 5.81, "cost_lkr": 2322},
                    {"name": "Onions & Spices", "quantity_kg": 2.32, "cost_lkr": 1935},
                ],
                "explanation_base": (
                    "A three-curry plate with green gram, beans and chicken gives the strongest overall "
                    "protein coverage this week, but at LKR 99.00 per child it exceeds a LKR 80 default "
                    "budget — this is the meal most likely to need a budget increase to serve."
                ),
            },
            {
                "meal": "Bread, Dhal Curry & Coconut Sambol",
                "servings": 387,
                "cost_per_child_lkr": 45.00,
                "total_cost_lkr": 17415,
                "nutrition": {
                    "energy_kcal": 540, "protein_g": 13.0, "iron_mg": 3.1, "vitamin_a_ug": 85,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "Bread (Sliced Loaves)", "quantity_kg": 23.2, "cost_lkr": 5805},
                    {"name": "Red Lentils (Dhal Curry)", "quantity_kg": 11.61, "cost_lkr": 7353},
                    {"name": "Coconut Sambol", "quantity_kg": 3.1, "cost_lkr": 3096},
                    {"name": "Spices & Oil", "quantity_kg": 1.16, "cost_lkr": 1161},
                ],
                "explanation_base": (
                    "Bread with dhal curry and coconut sambol is the cheapest option this week at "
                    "LKR 45.00 per child and quick to prepare, but energy and vitamin A both fall under "
                    "target — best paired with a piece of fruit."
                ),
            },
        ],
    },
    "2026-08-07": {  # Friday
        "predicted_attendance": 361,
        "meals": [
            {
                "meal": "Rice, Dhal Curry, Mallum & Egg",
                "servings": 369,
                "cost_per_child_lkr": 73.00,
                "total_cost_lkr": 26937,
                "nutrition": {
                    "energy_kcal": 660, "protein_g": 20.5, "iron_mg": 4.8, "vitamin_a_ug": 240,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 36.9, "cost_lkr": 8856},
                    {"name": "Red Lentils (Dhal Curry)", "quantity_kg": 8.49, "cost_lkr": 5535},
                    {"name": "Gotukola (Mallum Greens)", "quantity_kg": 11.07, "cost_lkr": 2214},
                    {"name": "Scraped Coconut (for Mallum)", "quantity_kg": 3.69, "cost_lkr": 1107},
                    {"name": "Eggs (Egg Curry)", "quantity_kg": 9.23, "cost_lkr": 7380},
                    {"name": "Onions & Spices", "quantity_kg": 2.21, "cost_lkr": 1845},
                ],
                "explanation_base": (
                    "The same reliable rice, dhal, mallum and egg combination that performed well on "
                    "Monday — full nutritional coverage at LKR 73.00 per child."
                ),
            },
            {
                "meal": "String Hoppers, Chicken Curry & Pol Sambol",
                "servings": 369,
                "cost_per_child_lkr": 78.00,
                "total_cost_lkr": 28782,
                "nutrition": {
                    "energy_kcal": 620, "protein_g": 21.0, "iron_mg": 3.0, "vitamin_a_ug": 110,
                    "targets": TARGETS,
                },
                "ingredients": [
                    {"name": "String Hoppers (Rice Flour)", "quantity_kg": 33.2, "cost_lkr": 8118},
                    {"name": "Chicken Curry", "quantity_kg": 14.76, "cost_lkr": 15498},
                    {"name": "Pol Sambol (Coconut, Chili, Onion, Lime)", "quantity_kg": 3.69, "cost_lkr": 3690},
                    {"name": "Spices & Oil", "quantity_kg": 1.48, "cost_lkr": 1476},
                ],
                "explanation_base": (
                    "String hoppers with chicken curry and pol sambol is a popular Friday treat plate "
                    "that fully meets nutrition targets, at a LKR 5.00 premium per child over the rice "
                    "and dhal option."
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
