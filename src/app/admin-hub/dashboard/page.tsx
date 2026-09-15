"use client";

import AdminHubBreadcrumbs from "../components/AdminHubBreadcrumbs";
import { useAuthStore } from "@/store/auth.store";
import { t } from "../i18n";

export default function AdminHubDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-[#343434] leading-[1.3]">
        {t("dashboard.hello", { name: user?.nombre ?? t("roles.fallback") })}
      </h1>
    </div>
  );
}
