"use client";

import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import { useAdminHubI18n } from "../../i18n";
import type { HistorialItem } from "../types/historial.types";
import { formatHistorialCambios } from "../utils/format-historial-cambios";
import {
  translateHistorialAction,
  translateHistorialModule,
} from "../utils/historial-labels";

interface HistorialTableProps {
  rows: HistorialItem[];
}

export default function HistorialTable({ rows }: HistorialTableProps) {
  const { t, dateLocale } = useAdminHubI18n();
  const cellClass = "px-3 py-5 text-[14px] tracking-[0.28px] text-[#858585]";

  function formatDateTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat(dateLocale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  return (
    <AdminHubTableShell>
      <table className="w-full min-w-[960px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-[#EFEFEF]">
            <th className="rounded-tl-[12px] px-6 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("historial.date")}
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("historial.user")}
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("historial.module")}
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("historial.action")}
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("historial.whatChanged")}
            </th>
            <th className="rounded-tr-[12px] px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("historial.detail")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={ADMIN_HUB_TABLE_ROW}>
              <td className={`px-6 py-5 text-[14px] tracking-[0.28px] text-[#343434] whitespace-nowrap`}>
                {formatDateTime(row.createdAt)}
              </td>
              <td className={`${cellClass} text-[#343434]`}>
                {row.usuario?.nombre || "Sistema"}
              </td>
              <td className={cellClass}>{translateHistorialModule(row.modulo, t)}</td>
              <td className={cellClass}>{translateHistorialAction(row.accion, t)}</td>
              <td className={`${cellClass} whitespace-normal`}>
                {formatHistorialCambios(row.cambios)}
              </td>
              <td className={`${cellClass} max-w-[360px] whitespace-normal`}>
                {row.descripcion}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminHubTableShell>
  );
}
