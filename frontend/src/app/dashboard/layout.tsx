"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  MessageSquarePlus,
  BarChart3,
  UtensilsCrossed,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/forecast", label: "Demand Forecast", icon: TrendingUp },
  { href: "/dashboard/recommendations", label: "Meal Plan", icon: ClipboardList },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquarePlus },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ backgroundColor: "#0f2137" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-7 border-b border-white/10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">NourishLoop</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-emerald-500 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* School info */}
        <div className="px-5 py-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <School className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">MR National School</p>
              <p className="text-slate-500 text-xs">450 enrolled · Term 2</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
