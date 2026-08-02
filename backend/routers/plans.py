from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PlanRequest(BaseModel):
    school_id: int = 1
    date: str = "2026-08-03"
    budget_per_child_lkr: float = 80.0


@router.post("/plans/generate")
def generate_plan(req: PlanRequest):
    return {
        "plan_id": "mock-plan-001",
        "date": req.date,
        "school": "Mahinda Rajapaksa National School",
        "predicted_attendance": 387,
        "recommended_meals": [
            {
                "rank": 1,
                "meal": "Rice & Dhal Curry",
                "servings": 395,
                "cost_per_child_lkr": 58.20,
                "total_cost_lkr": 22989,
                "waste_risk": "Low",
                "consumption_rate": 0.94,
                "nutrition": {
                    "energy_kcal": 642,
                    "protein_g": 18.4,
                    "iron_mg": 4.1,
                    "vitamin_a_ug": 162,
                    "targets": {"energy_kcal": 600, "protein_g": 15, "iron_mg": 3, "vitamin_a_ug": 150},
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
                "rank": 2,
                "meal": "Vegetable Rice (Hodhi)",
                "servings": 395,
                "cost_per_child_lkr": 64.80,
                "total_cost_lkr": 25596,
                "waste_risk": "Medium",
                "consumption_rate": 0.87,
                "nutrition": {
                    "energy_kcal": 611,
                    "protein_g": 14.2,
                    "iron_mg": 3.3,
                    "vitamin_a_ug": 198,
                    "targets": {"energy_kcal": 600, "protein_g": 15, "iron_mg": 3, "vitamin_a_ug": 150},
                },
                "ingredients": [
                    {"name": "White Rice", "quantity_kg": 39.5, "cost_lkr": 9480},
                    {"name": "Mixed Vegetables", "quantity_kg": 19.7, "cost_lkr": 7880},
                    {"name": "Coconut Milk", "quantity_litres": 7.9, "cost_lkr": 3160},
                    {"name": "Tempeh / Tofu", "quantity_kg": 7.9, "cost_lkr": 3952},
                    {"name": "Spices & Oil", "quantity_kg": 1.5, "cost_lkr": 1124},
                ],
                "explanation": (
                    "Vegetable Rice was ranked second due to higher vitamin A from mixed vegetables. "
                    "Cost is LKR 6.60 more per child than dhal curry. "
                    "An 87% consumption rate introduces moderate waste risk (~52 portions)."
                ),
            },
        ],
    }


@router.get("/plans/{plan_id}")
def get_plan(plan_id: str):
    return {"plan_id": plan_id, "status": "approved"}
