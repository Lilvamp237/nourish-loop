import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WasteOverTimeChart,
  NutrientTrendChart,
  CostTrendChart,
  PreparedVsConsumedChart,
  ModelHistoryChart,
  BudgetHeatmapChart,
} from "@/components/charts/AnalyticsCharts";
import { Trash2, Activity, Coins, Utensils, BrainCircuit, PiggyBank } from "lucide-react";

export default async function AnalyticsPage() {
  const data = await api.analytics();
  const { summary, period } = data;

  const summaryCards = [
    { label: "Total meals served", value: summary.total_meals_served.toLocaleString(), icon: Utensils, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg waste rate", value: `${summary.avg_waste_pct}%`, icon: Trash2, color: "text-red-500", bg: "bg-red-50" },
    { label: "Avg cost per child", value: `LKR ${summary.avg_cost_per_child_lkr}`, icon: Coins, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg nutritional score", value: `${summary.avg_nutritional_adequacy_score}/100`, icon: Activity, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total waste (kg)", value: `${summary.total_waste_kg} kg`, icon: Trash2, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Savings vs fixed planning", value: `LKR ${summary.total_savings_vs_fixed_lkr.toLocaleString()}`, icon: PiggyBank, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">{data.school} · {period}</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex w-8 h-8 rounded-lg ${bg} items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Savings hero */}
      <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white border-emerald-100">
        <CardContent className="p-6 flex items-center gap-6">
          <PiggyBank className="w-10 h-10 text-emerald-500 shrink-0" />
          <div>
            <p className="text-3xl font-bold text-emerald-700">
              LKR {summary.total_savings_vs_fixed_lkr.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              estimated savings compared to conventional fixed-quantity planning over the tracked period
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Waste & nutrient trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Waste Rate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <WasteOverTimeChart data={data.waste_over_time} />
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Nutritional Adequacy Trend</CardTitle>
            <p className="text-xs text-gray-400">Composite score + individual nutrients (% of target)</p>
          </CardHeader>
          <CardContent>
            <NutrientTrendChart data={data.nutrient_adequacy_trend} />
          </CardContent>
        </Card>
      </div>

      {/* Cost trend + heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Cost per Child Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CostTrendChart data={data.waste_over_time} />
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Budget Utilisation Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetHeatmapChart data={data.budget_heatmap} />
          </CardContent>
        </Card>
      </div>

      {/* Scatter + model history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Prepared vs Consumed</CardTitle>
            <p className="text-xs text-gray-400">Each dot = one meal service · colour = meal type</p>
          </CardHeader>
          <CardContent>
            <PreparedVsConsumedChart data={data.prepared_vs_consumed} />
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-500" />
              Model Retraining History
            </CardTitle>
            <p className="text-xs text-gray-400">MAE (mean absolute error) per version — lower is better</p>
          </CardHeader>
          <CardContent>
            <ModelHistoryChart data={data.model_history} />
            <div className="mt-4 space-y-1">
              {data.model_history.filter((m) => m.improvement_pct).map((m) => (
                <div key={m.version} className="flex items-center justify-between text-xs text-gray-500">
                  <span>{m.version} ({m.date})</span>
                  <span className="text-emerald-600 font-medium">↓ {m.improvement_pct}% MAE improvement</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
