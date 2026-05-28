import DashboardHeader from "@/app/components/DashboardHeader";
import TabsNavigation from "./components/TabsNavigation";
import NotificationsSidebar from "@/app/components/NotificationsSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader variant="admin" />
      <TabsNavigation />
      {children}
      <NotificationsSidebar />
    </div>
  );
}
