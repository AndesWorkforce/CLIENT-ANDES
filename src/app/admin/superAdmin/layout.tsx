import DashboardHeader from "@/app/components/DashboardHeader";
import TabsNavigationSuperAdmin from "./components/TabsNavigationSuperAdmin";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader variant="admin" />
      <TabsNavigationSuperAdmin />
      {children}
    </div>
  );
}
