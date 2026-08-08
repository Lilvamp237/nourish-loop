import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Lightbulb,
  ClipboardList,
  MessageSquarePlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

const STATUS_META: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  modified: { label: "Modified", className: "bg-blue-100 text-blue-700", icon: SlidersHorizontal },
  pending_review: { label: "Awaiting Review", className: "bg-amber-100 text-amber-700", icon: Clock },
};

export default async function TodayPage() {
  const data = await api.overview();
  const { kpis, insight, school, date } = data;

  const planId = `mock-plan-${date}`;
  const planStatus = await api.getPlanStatus(planId).catch(() => ({ plan_id: planId, status: "pending_review" }));
  const status = STATUS_META[planStatus.status] ?? STATUS_META.pending_review;
  const StatusIcon = status.icon;

  const [y, m, d] = date.split("-").map(Number);
  const displayDate = new Date(y, m - 1, d).toLocaleDateString("en-LK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Today</h1>
        <p className="text-gray-500 text-sm mt-1">{school} · {displayDate}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 mb-3">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-tight">
              {kpis.predicted_attendance} / {kpis.enrolled}
            </p>
            <p className="text-xs text-gray-500 mt-1">Predicted attendance today</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpis.attendance_rate_pct}% attendance rate</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${status.className}`}>
              <StatusIcon className="w-4 h-4" />
            </div>
            <Badge className={`text-sm font-semibold px-2.5 py-1 ${status.className} hover:${status.className}`}>
              {status.label}
            </Badge>
            <p className="text-xs text-gray-500 mt-2">Today&apos;s meal plan status</p>
          </CardContent>
        </Card>
      </div>

      {/* Insight */}
      <Card className="border-l-4 border-l-emerald-500 bg-emerald-50 border-emerald-100">
        <CardContent className="p-5 flex gap-4 items-start">
          <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 mb-1">Before you plan today</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{insight}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/planner/recommendations">
          <Card className="border border-gray-100 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Generate &amp; Review Today&apos;s Plan</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                Get the AI&apos;s recommended menu, procurement list, and approve, modify or reject it.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mt-4">
                Go to Meal Plan <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/planner/feedback">
          <Card className="border border-gray-100 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <MessageSquarePlus className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Log Yesterday&apos;s Feedback</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                Record actual consumption and leftovers so tomorrow&apos;s plan adjusts automatically.
              </p>
              <div className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold mt-4">
                Go to Feedback <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
