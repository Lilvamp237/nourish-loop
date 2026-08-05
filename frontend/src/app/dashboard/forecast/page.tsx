import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AttendanceChart from "@/components/charts/AttendanceChart";
import ShapWaterfall from "@/components/charts/ShapWaterfall";
import { AlertTriangle, CheckCircle2, BrainCircuit, CalendarDays } from "lucide-react";

export default async function ForecastPage() {
  const data = await api.forecast();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demand Forecast</h1>
          <p className="text-gray-500 text-sm mt-1">{data.school} · {data.model_version}</p>
        </div>
        <div className="flex items-center gap-3">
          {data.drift_alert ? (
            <Badge variant="destructive" className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Model drift detected
            </Badge>
          ) : (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Model healthy
            </Badge>
          )}
          <div className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />
            MAE ±{data.mae} · MAPE {data.mape_pct}%
          </div>
        </div>
      </div>

      {/* 5-day forecast table */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
            Next 5 School Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Day</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Predicted</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Lower</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Upper</th>
                  <th className="text-center py-2 text-gray-500 font-medium">Term</th>
                  <th className="text-center py-2 text-gray-500 font-medium">Exam Week</th>
                </tr>
              </thead>
              <tbody>
                {data.next_5_days.map((day, i) => (
                  <tr key={day.date} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                    <td className="py-3 font-semibold text-gray-800">{day.day}</td>
                    <td className="py-3 text-gray-500">{day.date}</td>
                    <td className="py-3 text-right font-bold text-emerald-600">{day.predicted}</td>
                    <td className="py-3 text-right text-gray-400">{day.lower}</td>
                    <td className="py-3 text-right text-gray-400">{day.upper}</td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className="text-xs">{day.term}</Badge>
                    </td>
                    <td className="py-3 text-center">
                      {day.is_exam_week ? (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">Yes</Badge>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Rolling Attendance Rate (4 weeks)</CardTitle>
            <p className="text-xs text-gray-400">Same attendance history feeding this week&apos;s forecast</p>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={data.rolling_trend} />
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">Why This Prediction?</CardTitle>
            <p className="text-xs text-gray-400">SHAP — top factors driving Monday&apos;s forecast</p>
          </CardHeader>
          <CardContent>
            <ShapWaterfall data={data.shap_factors} />
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Green bars increase the predicted attendance; red bars decrease it.
              Each bar shows how much that factor shifts the forecast from the baseline.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
