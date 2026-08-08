import DashboardShell from "@/components/DashboardShell";

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="coordinator">{children}</DashboardShell>;
}
