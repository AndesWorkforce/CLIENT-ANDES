import HeaderDashboard from "@/app/admin/dashboard/components/HeaderDashboard";
import TabsNavigationSuperAdmin from "./components/TabsNavigationSuperAdmin";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <HeaderDashboard />
      <TabsNavigationSuperAdmin />
      {children}
    </div>
  );
}
