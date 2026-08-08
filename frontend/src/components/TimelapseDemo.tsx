"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import type { TimelapseFrame } from "@/lib/types";

const TICK_MS = 750;

export default function TimelapseDemo({ frames }: { frames: TimelapseFrame[] }) {
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function play() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIndex(0);
    setPlaying(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      if (i >= frames.length) {
        setIndex(frames.length - 1);
        setPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setIndex(i);
    }, TICK_MS);
  }

  const current = index >= 0 ? frames[index] : null;
  const revealed = index >= 0 ? frames.slice(0, index + 1) : [];

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Watch the Loop Learn
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">9 weeks compressed — from fixed planning to adaptive</p>
          </div>
          <button
            onClick={play}
            disabled={playing}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shrink-0"
          >
            {index >= 0 && !playing ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? "Playing…" : index >= 0 ? "Replay" : "Play Simulation"}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {current ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <MiniStat label="Attendance" value={`${current.attendance_pct}%`} />
              <MiniStat label="Waste" value={`${current.waste_pct}%`} accent={current.waste_pct < 12 ? "good" : "warn"} />
              <MiniStat label="Cost / child" value={`LKR ${current.cost_per_child_lkr.toFixed(2)}`} />
              <MiniStat label="Adequacy" value={`${current.adequacy_score}/100`} />
              <MiniStat
                label="Savings so far"
                value={`LKR ${current.cumulative_savings_lkr.toLocaleString()}`}
                accent="good"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5 mb-4">
              <p className="text-xs font-semibold text-emerald-700">{current.week}</p>
              <p className="text-sm text-emerald-800">{current.headline}</p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={revealed} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="waste_pct" name="Waste %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="adequacy_score" name="Nutrition Score" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
            <Sparkles className="w-8 h-8 mb-3 opacity-30" />
            <p className="text-sm">Press play to see 9 weeks of feedback-driven learning in ~7 seconds.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: "good" | "warn" }) {
  const color = accent === "good" ? "text-emerald-600" : accent === "warn" ? "text-amber-600" : "text-gray-900";
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className={`text-base font-bold ${color} leading-tight`}>{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
