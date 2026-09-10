"use client";

import { useEffect, useState } from "react";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import { getHistorial } from "../actions/historial.actions";
import type { HistorialItem, HistorialModulo } from "../types/historial.types";
import { HISTORIAL_ACCION_LABEL } from "../types/historial.types";
import { formatHistorialCambios } from "../utils/format-historial-cambios";

interface ObjectHistorialTableProps {
  entidadId: string;
  entidadTipo?: string;
  modulo?: HistorialModulo;
  title?: string;
  limit?: number;
  variant?: "card" | "plain";
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ObjectHistorialTable({
  entidadId,
  entidadTipo,
  modulo,
  title = "Historial de cambios",
  limit = 20,
  variant = "card",
}: ObjectHistorialTableProps) {
  const [rows, setRows] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const response = await getHistorial({
        page: 1,
        limit,
        entidadId,
        entidadTipo,
        modulo,
      });

      if (cancelled) return;

      if (!response.success || !response.data) {
        setRows([]);
        setError(response.message || "No se pudo cargar el historial");
        setLoading(false);
        return;
      }

      setRows(response.data);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [entidadId, entidadTipo, modulo, limit]);

  const cellClass = "px-3 py-4 text-[14px] tracking-[0.28px] text-[#858585]";

  const body = (
    <>
      {variant === "plain" && (
        <h3 className="mb-3 px-6 text-[14px] font-bold text-[#343434]">{title}</h3>
      )}
      {loading ? (
        <p className="px-6 pb-4 text-[14px] text-[#858585]">Cargando historial…</p>
      ) : error ? (
        <p className="px-6 pb-4 text-[14px] text-[#E33434]">{error}</p>
      ) : rows.length === 0 ? (
        <p className="px-6 pb-4 text-[14px] text-[#858585]">
          No hay cambios registrados para este registro.
        </p>
      ) : (
        <AdminHubTableShell variant="nested">
          <table className="w-full min-w-[720px] border-collapse bg-white">
            <thead>
              <tr className="border-b border-[#EFEFEF]">
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  Fecha
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  Usuario
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  Acción
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  Campo
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={ADMIN_HUB_TABLE_ROW}>
                  <td className="whitespace-nowrap px-3 py-4 text-[14px] tracking-[0.28px] text-[#343434]">
                    {formatDateTime(row.createdAt)}
                  </td>
                  <td className={`${cellClass} text-[#343434]`}>
                    {row.usuario?.nombre || "Sistema"}
                  </td>
                  <td className={cellClass}>
                    {HISTORIAL_ACCION_LABEL[row.accion] ?? row.accion}
                  </td>
                  <td className={`${cellClass} whitespace-normal`}>
                    {formatHistorialCambios(row.cambios)}
                  </td>
                  <td className={`${cellClass} max-w-[280px] whitespace-normal`}>
                    {row.descripcion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminHubTableShell>
      )}
    </>
  );

  if (variant === "plain") {
    return <div className="border-t border-[#EFEFEF] pt-4">{body}</div>;
  }

  return (
    <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-[30px] py-[33px]">
      <h2 className="mb-[23px] text-[18px] font-bold leading-[1.3] text-black">
        {title}
      </h2>
      {body}
    </section>
  );
}
