import DashboardShell from "@/components/DashboardShell";

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="planner">{children}</DashboardShell>;
}
