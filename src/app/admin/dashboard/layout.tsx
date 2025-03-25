import HeaderDashboard from "./components/HeaderDashboard";
import TabsNavigation from "./components/TabsNavigation";

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
    </div>
  );
}
