"use client";

import AdminHubBreadcrumbs from "../components/AdminHubBreadcrumbs";
import { useAuthStore } from "@/store/auth.store";
import AvisosCard from "./components/AvisosCard";
import { mockAvisos } from "./data/mock-avisos";

export default function AdminHubDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-[#343434] leading-[1.3]">
        Hola, {user?.nombre ?? "Administrador"}!
      </h1>
      
      <AvisosCard avisos={mockAvisos} />
    </div>
  );
}
