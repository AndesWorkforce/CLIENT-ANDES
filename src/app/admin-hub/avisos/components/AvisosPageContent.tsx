"use client";

import { useMemo, useState } from "react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import { AVISO_GROUPS, MOCK_AVISO_NOTIFICATIONS } from "../data/mock-avisos";
import type { AvisoNotification, AvisoTab } from "../types/avisos.types";
import AvisoGroupSection from "./AvisoGroupSection";
import AvisosTabs from "./AvisosTabs";

function filterByTab(avisos: AvisoNotification[], tab: AvisoTab): AvisoNotification[] {
  switch (tab) {
    case "no-leidas":
      return avisos.filter((aviso) => !aviso.leida);
    case "leidas":
      return avisos.filter((aviso) => aviso.leida);
    default:
      return avisos;
  }
}

export default function AvisosPageContent() {
  const [activeTab, setActiveTab] = useState<AvisoTab>("todos");

  const counts = useMemo(
    () => ({
      todos: MOCK_AVISO_NOTIFICATIONS.length,
      "no-leidas": MOCK_AVISO_NOTIFICATIONS.filter((aviso) => !aviso.leida).length,
      leidas: MOCK_AVISO_NOTIFICATIONS.filter((aviso) => aviso.leida).length,
    }),
    []
  );

  const filteredAvisos = useMemo(
    () => filterByTab(MOCK_AVISO_NOTIFICATIONS, activeTab),
    [activeTab]
  );

  const groupedAvisos = useMemo(
    () =>
      AVISO_GROUPS.map((group) => ({
        ...group,
        avisos: filteredAvisos.filter((aviso) => aviso.grupo === group.id),
      })).filter((group) => group.avisos.length > 0),
    [filteredAvisos]
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs
        items={[
          { label: "Administrador", href: "/admin-hub/dashboard" },
          { label: "Avisos" },
        ]}
      />

      <h1 className="text-[32px] font-bold leading-[1.3] text-black">Avisos</h1>

      <AvisosTabs activeTab={activeTab} counts={counts} onChange={setActiveTab} />

      <div className="flex flex-col gap-6">
        {groupedAvisos.length > 0 ? (
          groupedAvisos.map((group) => (
            <AvisoGroupSection key={group.id} label={group.label} avisos={group.avisos} />
          ))
        ) : (
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white px-6 py-12 text-center text-[14px] leading-[1.3] text-[#858585]">
            No hay avisos para mostrar en esta pestaña.
          </div>
        )}
      </div>
    </div>
  );
}
