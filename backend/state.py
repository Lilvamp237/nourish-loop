"""
In-memory simulation state shared across routers.

This stands in for the database + trained models that will exist after
Phase 2. It lets feedback submissions actually change what the optimiser
recommends next, so the "closed loop" is real and observable in the demo
even though the underlying forecasting/optimisation is still mocked.

Not thread-safe, not persistent — fine for a single-process demo. Replace
with PostgreSQL-backed state once the real models land.
"""

from datetime import datetime, timezone

# Consumption rate each meal started the term with. Feedback submissions
# nudge these via an exponential moving average, same formula the real
# feedback_updater.py will use later (alpha = 0.3).
BASELINE_CONSUMPTION_RATES = {
    "Rice, Dhal Curry, Mallum & Egg": 0.93,
    "Rice, Chicken Curry, Beetroot Curry & Papadam": 0.90,
    "Rice, Kadala Curry, Potato Curry & Fish": 0.91,
    "String Hoppers, Dhal Curry & Pol Sambol": 0.88,
    "Rice, Soya Curry, Mallum & Egg": 0.89,
    "Pittu, Coconut Milk & Dhal Curry": 0.86,
    "Rice, Green Gram Curry, Bean Curry & Chicken": 0.90,
    "Bread, Dhal Curry & Coconut Sambol": 0.83,
    "String Hoppers, Chicken Curry & Pol Sambol": 0.87,
}

EMA_ALPHA = 0.3
BASE_MAE = 12.4
BASE_MODEL_VERSION = "v0.5"


def waste_risk_label(rate: float) -> str:
    if rate >= 0.90:
        return "Low"
    if rate >= 0.80:
        return "Medium"
    return "High"


class SimulationState:
    def __init__(self):
        self.reset()

    def reset(self):
        self.consumption_rates = dict(BASELINE_CONSUMPTION_RATES)
        self.feedback_log: list[dict] = []
        self.plan_status: dict[str, dict] = {}       # plan_id -> {status, meal, approved_at}
        self.rejected_meals: dict[str, set] = {}      # plan_id -> {meal names excluded}
        self.modifications: dict[str, dict] = {}      # plan_id -> {meal, servings}
        self.records_since_retrain = 3
        self.retrain_events: list[dict] = []
        self.current_mae = BASE_MAE
        self.current_version = BASE_MODEL_VERSION

    def get_rate(self, meal: str) -> float:
        return self.consumption_rates.get(meal, 0.85)

    def record_feedback(self, meal: str, consumed: int, prepared: int, leftover_kg: float, reason: str, notes: str):
        old_rate = self.get_rate(meal)
        actual_rate = (consumed / prepared) if prepared else old_rate
        new_rate = round(EMA_ALPHA * actual_rate + (1 - EMA_ALPHA) * old_rate, 3)
        self.consumption_rates[meal] = new_rate

        waste_pct = round(((prepared - consumed) / prepared) * 100, 1) if prepared else 0.0

        record = {
            "meal": meal,
            "consumed": consumed,
            "prepared": prepared,
            "leftover_kg": leftover_kg,
            "reason": reason,
            "notes": notes,
            "old_rate": old_rate,
            "new_rate": new_rate,
            "waste_pct": waste_pct,
            "timestamp": datetime.now(timezone.utc).strftime("%b %d, %H:%M"),
        }
        self.feedback_log.append(record)
        self.records_since_retrain += 1
        return record

    def retrain(self):
        version_num = int(self.current_version.split(".")[1]) + 1
        new_version = f"v0.{version_num}"
        new_mae = max(6.0, round(self.current_mae * 0.88, 1))
        improvement_pct = round((1 - new_mae / self.current_mae) * 100, 1)

        event = {
            "version": new_version,
            "date": "Today",
            "mae": new_mae,
            "improvement_pct": improvement_pct,
        }
        self.retrain_events.append(event)
        self.current_mae = new_mae
        self.current_version = new_version
        self.records_since_retrain = 0
        return event

    def set_plan_status(self, plan_id: str, status: str, meal: str | None = None):
        self.plan_status[plan_id] = {
            "status": status,
            "meal": meal,
            "updated_at": datetime.now(timezone.utc).strftime("%b %d, %H:%M"),
        }

    def get_plan_status(self, plan_id: str) -> str:
        return self.plan_status.get(plan_id, {}).get("status", "pending_review")

    def reject_meal(self, plan_id: str, meal: str):
        self.rejected_meals.setdefault(plan_id, set()).add(meal)

    def is_rejected(self, plan_id: str, meal: str) -> bool:
        return meal in self.rejected_meals.get(plan_id, set())


STATE = SimulationState()
