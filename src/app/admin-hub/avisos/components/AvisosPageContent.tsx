"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import { AVISO_GROUPS } from "../data/mock-avisos";
import { getAvisos } from "../actions/avisos.actions";
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
  const [avisos, setAvisos] = useState<AvisoNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvisos() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getAvisos();
        
        if (result.success && result.data) {
          setAvisos(result.data);
        } else {
          setError(result.message || "Error al cargar avisos");
        }
      } catch (err) {
        console.error("[AVISOS] Error al cargar avisos:", err);
        setError("Error al cargar avisos");
      } finally {
        setLoading(false);
      }
    }

    fetchAvisos();
  }, []);

  const counts = useMemo(
    () => ({
      todos: avisos.length,
      "no-leidas": avisos.filter((aviso) => !aviso.leida).length,
      leidas: avisos.filter((aviso) => aviso.leida).length,
    }),
    [avisos]
  );

  const filteredAvisos = useMemo(
    () => filterByTab(avisos, activeTab),
    [avisos, activeTab]
  );

  const groupedAvisos = useMemo(
    () =>
      AVISO_GROUPS.map((group) => ({
        ...group,
        avisos: filteredAvisos.filter((aviso) => aviso.grupo === group.id),
      })).filter((group) => group.avisos.length > 0),
    [filteredAvisos]
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHubBreadcrumbs
          items={[
            { label: "Administrador", href: "/admin-hub/dashboard" },
            { label: "Avisos" },
          ]}
        />

        <h1 className="text-[32px] font-bold leading-[1.3] text-black">Avisos</h1>

        <div className="rounded-[12px] border border-[#EFEFEF] bg-white px-6 py-12 text-center text-[14px] leading-[1.3] text-[#858585]">
          Cargando avisos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHubBreadcrumbs
          items={[
            { label: "Administrador", href: "/admin-hub/dashboard" },
            { label: "Avisos" },
          ]}
        />

        <h1 className="text-[32px] font-bold leading-[1.3] text-black">Avisos</h1>

        <div className="rounded-[12px] border border-[#EFEFEF] bg-white px-6 py-12 text-center text-[14px] leading-[1.3] text-[#858585]">
          {error}
        </div>
      </div>
    );
  }

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
