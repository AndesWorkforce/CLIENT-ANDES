"use client";

import { useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import type { InvoicePayrollEntry } from "../data/mock-invoice-details";
import { formatClientPrice } from "../../nominas/data/mock-contractors";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceTableTotalRow from "./InvoiceTableTotalRow";

interface InvoicePayrollTableProps {
  entries: InvoicePayrollEntry[];
  subtotal: string;
}

export default function InvoicePayrollTable({ entries, subtotal }: InvoicePayrollTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const allSelected = entries.length > 0 && entries.every((e) => selectedIds.has(e.id));

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(entries.map((e) => e.id)));
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const cellClass = "px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585] whitespace-nowrap";

  return (
    <div className="w-full overflow-x-auto overflow-y-visible">
      <table className="w-full min-w-[900px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-[#EFEFEF]">
            <th className="w-16 px-6 py-5 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                aria-label="Seleccionar todas las nóminas"
              />
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Nombre
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Puesto
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Fecha de inicio de contrato
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Precio del cliente
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <span className="inline-flex items-center gap-1">
                Estado
                <ChevronDown size={18} />
              </span>
            </th>
            <th className="w-[68px] px-3 py-5" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-[#EFEFEF] hover:bg-[#FAFAFA] transition-colors"
            >
              <td className="px-6 py-6">
                <input
                  type="checkbox"
                  checked={selectedIds.has(entry.id)}
                  onChange={() => toggleOne(entry.id)}
                  className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                  aria-label={`Seleccionar ${entry.contractorName}`}
                />
              </td>
              <td className={cellClass}>{entry.contractorName}</td>
              <td className={cellClass}>{entry.position}</td>
              <td className={cellClass}>{entry.contractStartDate}</td>
              <td className={cellClass}>{formatClientPrice(entry.clientPrice)}</td>
              <td className="px-3 py-6">
                <InvoiceStatusBadge status={entry.status} enlarged />
              </td>
              <td className="px-6 py-6 text-center">
                <button
                  type="button"
                  aria-label="Más opciones"
                  onClick={() =>
                    setOpenMenuId((prev) => (prev === entry.id ? null : entry.id))
                  }
                  className={`rounded p-1 transition-colors ${
                    openMenuId === entry.id
                      ? "bg-[#DFFAFF] text-[#0097B2]"
                      : "text-[#858585] hover:text-[#0097B2]"
                  }`}
                >
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
          <InvoiceTableTotalRow
            emptyColumnsBeforeAmount={2}
            emptyColumnsAfterStatus={1}
            subtotal={subtotal}
          />
        </tbody>
      </table>
    </div>
  );
}
