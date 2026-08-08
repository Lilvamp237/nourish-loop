import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AttendanceChart from "@/components/charts/AttendanceChart";
import FoodGroupDonut from "@/components/charts/FoodGroupDonut";
import TimelapseDemo from "@/components/TimelapseDemo";
import { Users, Coins, Activity, Trash2, PiggyBank, Lightbulb, BrainCircuit, Leaf } from "lucide-react";

export default async function OverviewPage() {
  const [data, timelapse] = await Promise.all([api.overview(), api.timelapse()]);
  const { kpis, hero_stat, insight, model_mae, model_version, attendance_trend, food_group_coverage, school, date } = data;

  const [y, m, d] = date.split("-").map(Number);
  const displayDate = new Date(y, m - 1, d).toLocaleDateString("en-LK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const kpiCards = [
    {
      label: "Predicted Attendance",
      value: `${kpis.predicted_attendance} / ${kpis.enrolled}`,
      sub: `${kpis.attendance_rate_pct}% attendance rate`,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Cost per Child",
      value: `LKR ${kpis.cost_per_child_lkr.toFixed(2)}`,
      sub: "today's estimated spend",
      icon: Coins,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Nutritional Adequacy",
      value: `${kpis.nutritional_adequacy_score} / 100`,
      sub: "composite score",
      icon: Activity,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Waste This Week",
      value: `${kpis.waste_pct_this_week}%`,
      sub: "of prepared meals",
      icon: Trash2,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Savings vs Fixed Planning",
      value: `LKR ${kpis.estimated_savings_lkr.toLocaleString()}`,
      sub: "this month",
      icon: PiggyBank,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">{school} · Today, {displayDate}</p>
      </div>

      {/* Hero impact stat — the one number worth remembering */}
      <Card className="border-0 shadow-sm overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0f2137 0%, #12563f 100%)" }}>
        <CardContent className="p-7 flex items-center gap-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Leaf className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-4xl font-bold text-white leading-none">{hero_stat.value}</p>
            <p className="text-emerald-300 font-medium text-sm mt-2">{hero_stat.label}</p>
            <p className="text-slate-400 text-xs mt-1">{hero_stat.sub}</p>
          </div>
        </CardContent>
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label} className="border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${bg} mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insight card */}
      <Card className="border-l-4 border-l-emerald-500 bg-emerald-50 border-emerald-100">
        <CardContent className="p-5 flex gap-4 items-start">
          <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 mb-1">This Week&apos;s Insight</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{insight}</p>
          </div>
        </CardContent>
      </Card>

      {/* Live simulation — proves the closed loop, not just claims it */}
      <TimelapseDemo frames={timelapse.frames} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Predicted vs Actual Attendance</CardTitle>
            <p className="text-xs text-gray-400">Last 4 weeks + this week&apos;s forecast</p>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={attendance_trend} />
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Food Group Coverage</CardTitle>
            <p className="text-xs text-gray-400">This week&apos;s recommended plan</p>
          </CardHeader>
          <CardContent>
            <FoodGroupDonut data={food_group_coverage} />
          </CardContent>
        </Card>
      </div>

      {/* Model badge */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <BrainCircuit className="w-4 h-4" />
        <span>Demand model · MAE = ±{model_mae} students · {model_version}</span>
        <Badge variant="secondary" className="text-xs">Prototype</Badge>
      </div>
    </div>
  );
}
