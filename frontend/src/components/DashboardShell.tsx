"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  School,
  Menu,
  X,
  ArrowLeftRight,
  CalendarCheck,
  ClipboardList,
  MessageSquarePlus,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

type Role = "planner" | "coordinator";

const ROLE_CONFIG: Record<
  Role,
  { navItems: NavItem[]; roleLabel: string; switchHref: string; switchLabel: string }
> = {
  planner: {
    roleLabel: "Meal Planner",
    switchHref: "/dashboard/coordinator/overview",
    switchLabel: "Switch to Coordinator view",
    navItems: [
      { href: "/dashboard/planner/today", label: "Today", icon: CalendarCheck },
      { href: "/dashboard/planner/recommendations", label: "Meal Plan", icon: ClipboardList },
      { href: "/dashboard/planner/feedback", label: "Feedback", icon: MessageSquarePlus },
    ],
  },
  coordinator: {
    roleLabel: "Coordinator",
    switchHref: "/dashboard/planner/today",
    switchLabel: "Switch to Meal Planner view",
    navItems: [
      { href: "/dashboard/coordinator/overview", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/coordinator/forecast", label: "Demand Forecast", icon: TrendingUp },
      { href: "/dashboard/coordinator/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
};

export default function DashboardShell({ children, role }: { children: React.ReactNode; role: Role }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { navItems, roleLabel, switchHref, switchLabel } = ROLE_CONFIG[role];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "#0f2137" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-base font-bold tracking-tight">NourishLoop</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-white p-1.5 rounded-lg hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#0f2137" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-lg font-bold tracking-tight">NourishLoop</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 pt-4">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
            {roleLabel}
          </span>
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

        {/* Switch role */}
        <div className="px-3">
          <Link
            href={switchHref}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
            {switchLabel}
          </Link>
        </div>

        {/* School info */}
        <div className="px-5 py-5 border-t border-white/10 mt-3">
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
      <main className="flex-1 overflow-auto pt-14 md:pt-0 flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="px-8 py-4 border-t border-gray-100 text-[11px] text-gray-400 leading-relaxed">
          Nutritional data: Sri Lankan Food Composition Table, Medical Research Institute (2011) ·
          Retail prices: Department of Census &amp; Statistics weekly bulletin ·
          Meal templates aligned with Ministry of Education school meal guidelines.
        </footer>
      </main>
    </div>
  );
}
