"use client";

import { useEffect, useState } from "react";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import { t, ADMIN_HUB_DATE_LOCALE } from "../../i18n";
import { getHistorial } from "../actions/historial.actions";
import type { HistorialItem, HistorialModulo } from "../types/historial.types";
import { formatHistorialCambios } from "../utils/format-historial-cambios";
import { translateHistorialAction } from "../utils/historial-labels";

interface ObjectHistorialTableProps {
  entidadId: string;
  entidadTipo?: string;
  modulo?: HistorialModulo;
  title?: string;
  limit?: number;
  variant?: "card" | "plain";
}

export default function ObjectHistorialTable({
  entidadId,
  entidadTipo,
  modulo,
  title,
  limit = 20,
  variant = "card",
}: ObjectHistorialTableProps) {
  const dateLocale = ADMIN_HUB_DATE_LOCALE;
  const [rows, setRows] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heading = title ?? t("historial.title");

  function formatDateTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat(dateLocale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

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
        setError(t("historial.loadError"));
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
  }, [entidadId, entidadTipo, modulo, limit, t]);

  const cellClass = "px-3 py-4 text-[14px] tracking-[0.28px] text-[#858585]";

  const body = (
    <>
      {variant === "plain" && (
        <h3 className="mb-3 px-6 text-[14px] font-bold text-[#343434]">{heading}</h3>
      )}
      {loading ? (
        <p className="px-6 pb-4 text-[14px] text-[#858585]">{t("historial.loading")}</p>
      ) : error ? (
        <p className="px-6 pb-4 text-[14px] text-[#E33434]">{error}</p>
      ) : rows.length === 0 ? (
        <p className="px-6 pb-4 text-[14px] text-[#858585]">
          {t("historial.empty")}
        </p>
      ) : (
        <AdminHubTableShell variant="nested">
          <table className="w-full min-w-[720px] border-collapse bg-white">
            <thead>
              <tr className="border-b border-[#EFEFEF]">
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  {t("historial.date")}
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  {t("historial.user")}
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  {t("historial.action")}
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  {t("historial.field")}
                </th>
                <th className="px-3 py-4 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                  {t("historial.detail")}
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
                    {translateHistorialAction(row.accion, t)}
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
        {heading}
      </h2>
      {body}
    </section>
  );
}
