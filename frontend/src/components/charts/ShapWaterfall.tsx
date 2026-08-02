"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface Factor {
  factor: string;
  impact: number;
  direction: "positive" | "negative";
}

export default function ShapWaterfall({ data }: { data: Factor[] }) {
  const sorted = [...data].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const chartData = sorted.map((d) => ({
    name: d.factor,
    value: d.direction === "positive" ? d.impact : -d.impact,
    abs: d.impact,
    dir: d.direction,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`} />
        <YAxis
          type="category"
          dataKey="name"
          width={180}
          tick={{ fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(v: unknown) => { const n = v as number; return [`${n > 0 ? "+" : ""}${n} attendance`, "SHAP impact"]; }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {chartData.map((d, i) => (
            <Cell key={i} fill={d.dir === "positive" ? "#10b981" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
