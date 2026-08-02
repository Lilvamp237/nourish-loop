"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, ResponsiveContainer } from "recharts";

interface NutritionBarProps {
  nutrition: {
    energy_kcal: number;
    protein_g: number;
    iron_mg: number;
    vitamin_a_ug: number;
    targets: {
      energy_kcal: number;
      protein_g: number;
      iron_mg: number;
      vitamin_a_ug: number;
    };
  };
}

export default function NutritionBar({ nutrition }: NutritionBarProps) {
  const data = [
    {
      nutrient: "Energy (kcal)",
      pct: Math.round((nutrition.energy_kcal / nutrition.targets.energy_kcal) * 100),
    },
    {
      nutrient: "Protein (g)",
      pct: Math.round((nutrition.protein_g / nutrition.targets.protein_g) * 100),
    },
    {
      nutrient: "Iron (mg)",
      pct: Math.round((nutrition.iron_mg / nutrition.targets.iron_mg) * 100),
    },
    {
      nutrient: "Vitamin A (µg)",
      pct: Math.round((nutrition.vitamin_a_ug / nutrition.targets.vitamin_a_ug) * 100),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="nutrient" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={[0, 140]} unit="%" />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(v: unknown) => [`${v}% of target`, ""]}
        />
        <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "Target", fontSize: 11, fill: "#ef4444" }} />
        <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.pct >= 100 ? "#10b981" : "#f59e0b"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
