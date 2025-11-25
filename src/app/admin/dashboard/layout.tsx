import HeaderDashboard from "./components/HeaderDashboard";
import TabsNavigation from "./components/TabsNavigation";
import NotificationsSidebar from "@/app/components/NotificationsSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <HeaderDashboard />
      <TabsNavigation />
      {children}
      <NotificationsSidebar />
    </div>
  );
}
