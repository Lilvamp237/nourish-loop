import type {
  AnalyticsData,
  FeedbackTrends,
  ForecastData,
  OverviewData,
  PlanActionResponse,
  PlanData,
  TimelapseFrame,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  overview: () => get<OverviewData>("/api/overview"),
  forecast: () => get<ForecastData>("/api/forecast"),
  generatePlan: (date: string, budget: number) =>
    post<PlanData>("/api/plans/generate", { date, budget_per_child_lkr: budget }),
  feedbackTrends: () => get<FeedbackTrends>("/api/feedback/trends"),
  submitFeedback: (body: {
    plan_id: string;
    meal: string;
    prepared: number;
    actual_consumed: number;
    leftover_weight_kg: number;
    waste_reason: string;
    notes: string;
  }) => post("/api/feedback", body),
  retrainModel: () => post<{ status: string; version: string; mae: number; improvement_pct: number }>(
    "/api/feedback/retrain",
    {}
  ),
  analytics: () => get<AnalyticsData>("/api/analytics"),
  timelapse: () => get<{ frames: TimelapseFrame[] }>("/api/simulation/timelapse"),
  approvePlan: (planId: string, approvedBy = "Meal Planner") =>
    post<PlanActionResponse>(`/api/plans/${planId}/approve`, { approved_by: approvedBy }),
  rejectPlan: (planId: string, rejectedMeal: string, budget: number) =>
    post<PlanActionResponse>(`/api/plans/${planId}/reject`, {
      rejected_meal: rejectedMeal,
      budget_per_child_lkr: budget,
    }),
  modifyPlan: (planId: string, meal: string, servings: number) =>
    post<PlanActionResponse>(`/api/plans/${planId}/modify`, { meal, servings }),
  getPlanStatus: (planId: string) => get<{ plan_id: string; status: string }>(`/api/plans/${planId}`),
};
