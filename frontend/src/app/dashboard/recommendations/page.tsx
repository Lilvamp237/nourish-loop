"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { PlanData, RecommendedMeal } from "@/lib/types";
import NutritionBar from "@/components/charts/NutritionBar";
import {
  ClipboardList,
  Loader2,
  Lightbulb,
  Package,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const WASTE_COLORS: Record<string, string> = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

function MealCard({ meal, expanded, onToggle }: { meal: RecommendedMeal; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
              {meal.rank}
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{meal.meal}</h3>
              <p className="text-xs text-gray-400">{meal.servings} servings recommended</p>
            </div>
          </div>
          <Badge className={`text-xs ${WASTE_COLORS[meal.waste_risk]} hover:${WASTE_COLORS[meal.waste_risk]}`}>
            {meal.waste_risk} waste risk
          </Badge>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">LKR {meal.cost_per_child_lkr}</p>
            <p className="text-xs text-gray-400">per child</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">LKR {meal.total_cost_lkr.toLocaleString()}</p>
            <p className="text-xs text-gray-400">total cost</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{Math.round(meal.consumption_rate * 100)}%</p>
            <p className="text-xs text-gray-400">historical consumption</p>
          </div>
        </div>

        {/* Nutrition chart */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nutritional Coverage vs Targets</p>
          <NutritionBar nutrition={meal.nutrition} />
        </div>

        {/* Explanation */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4 flex gap-3">
          <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">{meal.explanation}</p>
        </div>

        {/* Ingredients toggle */}
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Package className="w-3.5 h-3.5" />
          Procurement list ({meal.ingredients.length} items)
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 font-medium">Ingredient</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">Quantity</th>
                  <th className="text-right px-4 py-2 text-gray-500 font-medium">Cost (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {meal.ingredients.map((ing, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                    <td className="px-4 py-2 text-gray-700">{ing.name}</td>
                    <td className="px-4 py-2 text-right text-gray-500">
                      {ing.quantity_kg != null && `${ing.quantity_kg} kg`}
                      {ing.quantity_litres != null && `${ing.quantity_litres} L`}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-800">{ing.cost_lkr.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RecommendationsPage() {
  const [date, setDate] = useState("2026-08-03");
  const [budget, setBudget] = useState(80);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generatePlan(date, budget);
      setPlan(result);
      setExpandedIdx(null);
    } catch {
      setError("Could not reach the backend. Make sure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!plan) return;
    const rows = plan.recommended_meals.flatMap((m) =>
      m.ingredients.map((ing) => [
        m.rank,
        m.meal,
        ing.name,
        ing.quantity_kg != null ? `${ing.quantity_kg} kg` : `${ing.quantity_litres} L`,
        ing.cost_lkr,
      ])
    );
    const header = "Rank,Meal,Ingredient,Quantity,Cost (LKR)";
    const csv = [header, ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meal-plan-${plan.date}.csv`;
    a.click();
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meal Recommendations</h1>
        <p className="text-gray-500 text-sm mt-1">AI-optimised meal plan for your selected date</p>
      </div>

      {/* Controls */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Budget per child (LKR)
              </label>
              <input
                type="number"
                value={budget}
                min={50}
                max={150}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 w-28 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <button
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
              {loading ? "Generating…" : "Generate Plan"}
            </button>

            {plan && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>

      {/* Results */}
      {plan && (
        <>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              {plan.school} · {plan.date} ·{" "}
              <span className="font-semibold text-gray-700">
                {plan.predicted_attendance} students predicted
              </span>
            </p>
          </div>

          <div className="space-y-6">
            {plan.recommended_meals.map((meal, i) => (
              <MealCard
                key={meal.rank}
                meal={meal}
                expanded={expandedIdx === i}
                onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
              />
            ))}
          </div>
        </>
      )}

      {!plan && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <ClipboardList className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-base font-medium">No plan generated yet</p>
          <p className="text-sm">Select a date and click &quot;Generate Plan&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}
