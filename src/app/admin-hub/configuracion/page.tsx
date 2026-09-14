"use client";

import AdminHubBreadcrumbs from "../components/AdminHubBreadcrumbs";
import { useAdminHubI18n } from "../i18n";

export default function AdminHubConfiguracinPage() {
  const { t } = useAdminHubI18n();
  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-[#343434] leading-[1.3]">
        {t("configuracion.title")}
      </h1>
      <p className="mt-4 text-[#707070]">{t("configuracion.inProgress")}</p>
    </div>
  );
}
