import { ReactNode } from "react";
import { CompaniesProvider } from "./context/CompaniesContext";
import HeaderDashboard from "./components/HeaderDashboard";
import TabsNavigation from "./components/TabsNavigation";

interface CompaniesLayoutProps {
  children: ReactNode;
}

export default function CompaniesLayout({ children }: CompaniesLayoutProps) {
  return (
    <CompaniesProvider>
      <HeaderDashboard />
      <TabsNavigation />
      <div className="min-h-screen bg-gray-100">{children}</div>
    </CompaniesProvider>
  );
}
