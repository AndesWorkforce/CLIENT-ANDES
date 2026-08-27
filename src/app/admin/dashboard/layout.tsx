import DashboardHeader from "@/app/components/DashboardHeader";
import TabsNavigation from "./components/TabsNavigation";
import NotificationsSidebar from "@/app/components/NotificationsSidebar";
import MfaGraceBanner from "./components/MfaGraceBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader variant="admin" />
      <TabsNavigation />
      <MfaGraceBanner />
      {children}
      <NotificationsSidebar />
    </div>
  );
}
