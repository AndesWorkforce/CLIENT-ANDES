import { ReactNode } from "react";
import { CompaniesProvider } from "./context/CompaniesContext";
import DashboardHeader from "@/app/components/DashboardHeader";
import TabsNavigation from "./components/TabsNavigation";

interface CompaniesLayoutProps {
  children: ReactNode;
}

export default function CompaniesLayout({ children }: CompaniesLayoutProps) {
  return (
    <CompaniesProvider>
      <DashboardHeader variant="companies" />
      <TabsNavigation />
      <div className="min-h-screen bg-gray-100">{children}</div>
    </CompaniesProvider>
  );
}
