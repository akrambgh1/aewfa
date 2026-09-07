import Dashboard from "@/components/dashboard/Dashboard";
import AuthGuard from "@/components/dashboard/AuthGuard";

export default function DashboardPage() {
  return (
    <section className="min-h-screen pt-16  bg-[#f5ede0] bg-parchment bg-grid-lines bg-grid">
      <AuthGuard>
        <Dashboard  />
      </AuthGuard>
    </section>
  );
}
