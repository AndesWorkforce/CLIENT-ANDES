import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import type { HistorialItem } from "../types/historial.types";
import {
  HISTORIAL_ACCION_LABEL,
  HISTORIAL_MODULO_LABEL,
} from "../types/historial.types";

interface HistorialTableProps {
  rows: HistorialItem[];
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCambios(cambios: unknown): string {
  if (!cambios || typeof cambios !== "object") return "—";
  const record = cambios as {
    estado?: { de?: string | null; a?: string | null };
  };
  if (record.estado && (record.estado.de || record.estado.a)) {
    const from = record.estado.de ?? "—";
    const to = record.estado.a ?? "—";
    return `${from} → ${to}`;
  }
  return "—";
}

export default function HistorialTable({ rows }: HistorialTableProps) {
  const cellClass = "px-3 py-5 text-[14px] tracking-[0.28px] text-[#858585]";

  return (
    <AdminHubTableShell>
      <table className="w-full min-w-[960px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-[#EFEFEF]">
            <th className="rounded-tl-[12px] px-6 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Fecha
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Usuario
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Módulo
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Acción
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Qué cambió
            </th>
            <th className="rounded-tr-[12px] px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Detalle
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
              <td className={cellClass}>{HISTORIAL_MODULO_LABEL[row.modulo]}</td>
              <td className={cellClass}>{HISTORIAL_ACCION_LABEL[row.accion]}</td>
              <td className={`${cellClass} whitespace-nowrap`}>
                {formatCambios(row.cambios)}
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
