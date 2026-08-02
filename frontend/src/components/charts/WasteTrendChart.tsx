"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WastePoint {
  date: string;
  waste_pct: number;
  consumed: number;
  prepared: number;
}

export default function WasteTrendChart({ data }: { data: WastePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 25]} />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(v: unknown) => [`${v}%`, "Waste"]}
        />
        <Area
          type="monotone"
          dataKey="waste_pct"
          name="Waste %"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#wasteGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
