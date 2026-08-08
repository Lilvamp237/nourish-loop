"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { FeedbackTrends } from "@/lib/types";
import WasteTrendChart from "@/components/charts/WasteTrendChart";
import {
  MessageSquarePlus,
  Loader2,
  CheckCircle2,
  RefreshCw,
  PiggyBank,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const WASTE_REASONS = [
  "Over-preparation",
  "Low attendance",
  "Meal unpopular",
  "Spoilage",
  "Other",
];

export default function FeedbackPage() {
  const [trends, setTrends] = useState<FeedbackTrends | null>(null);
  const [planId, setPlanId] = useState("");
  const [consumed, setConsumed] = useState("");
  const [leftover, setLeftover] = useState("");
  const [reason, setReason] = useState(WASTE_REASONS[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [affectsMessage, setAffectsMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState<string | null>(null);

  useEffect(() => {
    api.feedbackTrends().then(setTrends).catch(() => null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const selectedPlan = trends?.past_plans.find((p) => p.id === planId);
    if (!selectedPlan || !consumed || !leftover) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setAffectsMessage(null);
    try {
      const resp = await api.submitFeedback({
        plan_id: planId,
        meal: selectedPlan.meal,
        prepared: selectedPlan.prepared,
        actual_consumed: parseInt(consumed),
        leftover_weight_kg: parseFloat(leftover),
        waste_reason: reason,
        notes,
      });
      setAffectsMessage((resp as { affects?: string }).affects ?? "Feedback recorded.");
      setConsumed("");
      setLeftover("");
      setNotes("");
      const updated = await api.feedbackTrends();
      setTrends(updated);
    } catch {
      setError("Could not reach the backend. Make sure FastAPI is running on port 8000.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRetrain() {
    setRetraining(true);
    setRetrainResult(null);
    try {
      const resp = await api.retrainModel();
      setRetrainResult(`Model retrained to ${resp.version} — MAE improved ${resp.improvement_pct}% (now ±${resp.mae}).`);
      const updated = await api.feedbackTrends();
      setTrends(updated);
    } catch {
      setError("Could not reach the backend.");
    } finally {
      setRetraining(false);
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meal Feedback</h1>
        <p className="text-gray-500 text-sm mt-1">
          Log actual consumption and leftovers to improve future predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-emerald-500" />
              Record Meal Outcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            {affectsMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 mb-4 text-sm flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="leading-relaxed">{affectsMessage}</p>
                  <Link
                    href="/dashboard/planner/recommendations"
                    className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs mt-1.5 hover:underline"
                  >
                    See it reflected in Meal Recommendations <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Meal Plan <span className="text-red-400">*</span>
                </label>
                {trends ? (
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Select a past meal plan…</option>
                    {trends.past_plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.date} · {p.meal} ({p.prepared} prepared)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Portions consumed <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={consumed}
                    onChange={(e) => setConsumed(e.target.value)}
                    placeholder="e.g. 260"
                    min={0}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Leftover weight (kg) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftover}
                    onChange={(e) => setLeftover(e.target.value)}
                    placeholder="e.g. 25"
                    min={0}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Waste reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {WASTE_REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any additional observations…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {submitting ? "Saving…" : "Submit Feedback"}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Stats sidebar */}
        <div className="space-y-4">
          {trends ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border border-gray-100 shadow-sm">
                  <CardContent className="p-5">
                    <PiggyBank className="w-5 h-5 text-emerald-500 mb-3" />
                    <p className="text-2xl font-bold text-gray-900">
                      LKR {trends.savings_this_month_lkr.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">savings this month</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-100 shadow-sm">
                  <CardContent className="p-5">
                    <TrendingDown className="w-5 h-5 text-emerald-500 mb-3" />
                    <p className="text-2xl font-bold text-gray-900">{trends.avg_waste_pct_last_30_days}%</p>
                    <p className="text-xs text-gray-400 mt-1">avg waste (30 days)</p>
                  </CardContent>
                </Card>
              </div>

              {/* Retrain status */}
              <Card className={`border shadow-sm ${trends.retrain_available ? "border-emerald-200 bg-emerald-50" : "border-gray-100"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className={`w-5 h-5 shrink-0 ${trends.retrain_available ? "text-emerald-600" : "text-gray-400"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {trends.retrain_available ? "Model update ready" : "Model up to date"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trends.records_since_last_retrain} new records ·{" "}
                        {trends.retrain_available ? "Retrain available" : `${5 - trends.records_since_last_retrain} more needed`}
                      </p>
                    </div>
                    {trends.retrain_available && (
                      <button
                        onClick={handleRetrain}
                        disabled={retraining}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
                      >
                        {retraining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Retrain
                      </button>
                    )}
                  </div>
                  {retrainResult && (
                    <p className="text-xs text-emerald-700 mt-2 pt-2 border-t border-emerald-100">{retrainResult}</p>
                  )}
                </CardContent>
              </Card>

              {/* Waste trend */}
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Waste Trend (30 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <WasteTrendChart data={trends.waste_trend} />
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
