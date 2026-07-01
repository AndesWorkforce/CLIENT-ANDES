"use client";

import AdminHubBreadcrumbs from "../components/AdminHubBreadcrumbs";
import { useAuthStore } from "@/store/auth.store";
import AlertsList from "./components/AlertsList";
import { useAlertsPendientes } from "./hooks/useAlerts";

export default function AdminHubDashboardPage() {
  const { user } = useAuthStore();
  const { data, loading, error, isEmpty, refetch } = useAlertsPendientes();

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-[#343434] leading-[1.3]">
          Hola, {user?.nombre ?? "Administrador"}!
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Alertas Pendientes
          </h2>
          {!loading && !error && data.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {data.length} {data.length === 1 ? "alerta" : "alertas"}
            </span>
          )}
        </div>

        <AlertsList
          alerts={data}
          loading={loading}
          error={error}
          isEmpty={isEmpty}
          onRetry={refetch}
        />
      </div>
    </div>
  );
}
