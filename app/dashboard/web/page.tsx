import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";

// Server component
export default async function WebDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner with Section Title */}

      {/* Content Area */}
      <div className="max-w-6xl px-4 mx-auto my-6">
        <DashboardTabs />
      </div>
    </main>
  );
}
