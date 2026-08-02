import type { AnalyticsData, FeedbackTrends, ForecastData, OverviewData, PlanData } from "./types";

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
    actual_consumed: number;
    leftover_weight_kg: number;
    waste_reason: string;
    notes: string;
  }) => post("/api/feedback", body),
  analytics: () => get<AnalyticsData>("/api/analytics"),
};
