"use client";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { AnalyticsData } from "@/lib/types";

export function WasteOverTimeChart({ data }: { data: AnalyticsData["waste_over_time"] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="aWaste" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit="%" />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${v}%`, ""]} />
        <Area type="monotone" dataKey="waste_pct" name="Waste %" stroke="#ef4444" strokeWidth={2} fill="url(#aWaste)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function NutrientTrendChart({ data }: { data: AnalyticsData["nutrient_adequacy_trend"] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[50, 100]} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="composite" name="Overall Score" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="protein" name="Protein" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2" />
        <Line type="monotone" dataKey="iron" name="Iron" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
        <Line type="monotone" dataKey="vitamin_a" name="Vitamin A" stroke="#0f2137" strokeWidth={1.5} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CostTrendChart({ data }: { data: AnalyticsData["waste_over_time"] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} unit=" LKR" />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`LKR ${v}`, "Cost/child"]} />
        <Line type="monotone" dataKey="cost_per_child" name="Cost per child (LKR)" stroke="#0f2137" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PreparedVsConsumedChart({ data }: { data: AnalyticsData["prepared_vs_consumed"] }) {
  const MEAL_COLORS: Record<string, string> = {
    "Rice & Dhal": "#10b981",
    "Vegetable Rice": "#6366f1",
    "String Hoppers": "#f59e0b",
    "Pol Roti": "#0f2137",
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="prepared" name="Prepared" type="number" tick={{ fontSize: 12 }} domain={["auto", "auto"]} label={{ value: "Prepared", position: "insideBottom", offset: -2, fontSize: 11 }} />
        <YAxis dataKey="consumed" name="Consumed" type="number" tick={{ fontSize: 12 }} domain={["auto", "auto"]} label={{ value: "Consumed", angle: -90, position: "insideLeft", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(v: unknown, name: unknown) => [v as number, name as string]}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as { meal: string; prepared: number; consumed: number; date: string };
            return (
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow">
                <p className="font-semibold">{d.meal}</p>
                <p className="text-gray-500">{d.date}</p>
                <p>Prepared: {d.prepared}</p>
                <p>Consumed: {d.consumed}</p>
                <p className="text-red-500">Waste: {d.prepared - d.consumed} portions</p>
              </div>
            );
          }}
        />
        <Scatter
          data={data}
          fill="#10b981"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={MEAL_COLORS[d.meal] ?? "#94a3b8"} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function ModelHistoryChart({ data }: { data: AnalyticsData["model_history"] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="version" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 30]} label={{ value: "MAE", angle: -90, position: "insideLeft", fontSize: 11 }} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [v as number, "MAE (students)"]} />
        <Bar dataKey="mae" name="MAE" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 1 ? "#10b981" : "#94a3b8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BudgetHeatmapChart({ data }: { data: AnalyticsData["budget_heatmap"] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
  const allValues = data.flatMap((row) => days.map((d) => row[d]));
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  function color(val: number) {
    const t = (val - min) / (max - min);
    const r = Math.round(16 + t * (239 - 16));
    const g = Math.round(185 - t * (185 - 68));
    const b = Math.round(129 - t * (129 - 68));
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="text-left text-gray-500 font-medium pb-1 pr-2" />
            {days.map((d) => (
              <th key={d} className="text-center text-gray-500 font-medium pb-1 w-14">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.week}>
              <td className="text-gray-500 font-medium pr-2 py-0.5">{row.week}</td>
              {days.map((d) => (
                <td
                  key={d}
                  className="text-center rounded py-1.5 font-medium"
                  style={{ backgroundColor: color(row[d]), color: "#fff" }}
                >
                  {row[d]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">Cost per child (LKR) · darker = higher cost</p>
    </div>
  );
}
