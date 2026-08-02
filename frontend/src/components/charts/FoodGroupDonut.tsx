"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#0f2137", "#6366f1", "#f59e0b", "#94a3b8"];

interface Slice {
  group: string;
  pct: number;
}

export default function FoodGroupDonut({ data }: { data: Slice[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="pct"
          nameKey="group"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: unknown) => [`${v}%`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => v} />
      </PieChart>
    </ResponsiveContainer>
  );
}
