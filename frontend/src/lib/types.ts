export interface KPIs {
  predicted_attendance: number;
  enrolled: number;
  attendance_rate_pct: number;
  cost_per_child_lkr: number;
  nutritional_adequacy_score: number;
  waste_pct_this_week: number;
  estimated_savings_lkr: number;
}

export interface OverviewData {
  school: string;
  date: string;
  kpis: KPIs;
  insight: string;
  model_mae: number;
  attendance_trend: { week: string; predicted: number; actual: number | null }[];
  food_group_coverage: { group: string; pct: number }[];
}

export interface ShapFactor {
  factor: string;
  impact: number;
  direction: "positive" | "negative";
}

export interface ForecastDay {
  date: string;
  day: string;
  predicted: number;
  lower: number;
  upper: number;
  is_exam_week: boolean;
  term: number;
}

export interface ForecastData {
  school: string;
  model_version: string;
  mae: number;
  mape_pct: number;
  drift_alert: boolean;
  next_5_days: ForecastDay[];
  rolling_trend: { week: string; rate: number; predicted: number; actual: number | null }[];
  shap_factors: ShapFactor[];
}

export interface NutritionTarget {
  energy_kcal: number;
  protein_g: number;
  iron_mg: number;
  vitamin_a_ug: number;
}

export interface MealNutrition extends NutritionTarget {
  targets: NutritionTarget;
}

export interface Ingredient {
  name: string;
  quantity_kg?: number;
  quantity_litres?: number;
  cost_lkr: number;
}

export interface RecommendedMeal {
  rank: number;
  meal: string;
  servings: number;
  cost_per_child_lkr: number;
  total_cost_lkr: number;
  waste_risk: "Low" | "Medium" | "High";
  consumption_rate: number;
  nutrition: MealNutrition;
  ingredients: Ingredient[];
  explanation: string;
}

export interface PlanData {
  plan_id: string;
  date: string;
  school: string;
  predicted_attendance: number;
  recommended_meals: RecommendedMeal[];
}

export interface WasteTrend {
  date: string;
  waste_pct: number;
  consumed: number;
  prepared: number;
}

export interface FeedbackTrends {
  savings_this_month_lkr: number;
  avg_waste_pct_last_30_days: number;
  retrain_available: boolean;
  records_since_last_retrain: number;
  waste_trend: WasteTrend[];
  past_plans: { id: string; date: string; meal: string; prepared: number }[];
}

export interface AnalyticsData {
  school: string;
  period: string;
  summary: {
    total_meals_served: number;
    total_waste_kg: number;
    avg_waste_pct: number;
    avg_cost_per_child_lkr: number;
    avg_nutritional_adequacy_score: number;
    total_savings_vs_fixed_lkr: number;
  };
  waste_over_time: { month: string; waste_pct: number; cost_per_child: number; adequacy_score: number }[];
  budget_heatmap: { week: string; Mon: number; Tue: number; Wed: number; Thu: number; Fri: number }[];
  prepared_vs_consumed: { meal: string; prepared: number; consumed: number; date: string }[];
  model_history: { version: string; date: string; mae: number; improvement_pct: number | null }[];
  nutrient_adequacy_trend: { month: string; energy: number; protein: number; iron: number; vitamin_a: number; composite: number }[];
}
