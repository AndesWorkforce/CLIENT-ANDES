"use client";

import { useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import type { InvoiceLineItem } from "../data/mock-invoice-details";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoiceLineItemsTableProps {
  items: InvoiceLineItem[];
  subtotal: string;
  subtotalIsNegative?: boolean;
}

export default function InvoiceLineItemsTable({
  items,
  subtotal,
  subtotalIsNegative,
}: InvoiceLineItemsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((i) => i.id)));
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-[#EFEFEF]">
            <th className="w-16 px-6 py-5 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                aria-label="Seleccionar todos los ítems"
              />
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Fecha
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Tipo
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Descripción
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Monto
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <span className="inline-flex items-center gap-1">
                Estado
                <ChevronDown size={18} />
              </span>
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Creado por
            </th>
            <th className="w-[68px] px-3 py-5" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[#EFEFEF] last:border-b-0">
              <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleOne(item.id)}
                  className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                  aria-label={`Seleccionar ${item.description}`}
                />
              </td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">{item.date}</td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">{item.type}</td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">{item.description}</td>
              <td
                className={`px-3 py-6 text-[14px] tracking-[0.28px] ${
                  item.amountIsNegative ? "text-[#E33434]" : "text-[#858585]"
                }`}
              >
                {item.amount}
              </td>
              <td className="px-3 py-6">
                <InvoiceStatusBadge status={item.status} enlarged />
              </td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">{item.createdBy}</td>
              <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  aria-label="Más opciones"
                  className="text-[#858585] hover:text-[#0097B2] transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
          <tr className="border-t border-[#EFEFEF]">
            <td colSpan={8} className="px-6 py-4">
              <div className="flex w-full items-center justify-end gap-4">
                <span className="text-[18px] font-bold text-[#343434]">Total</span>
                <span
                  className={`min-w-[80px] text-right text-[18px] font-bold ${
                    subtotalIsNegative ? "text-[#E33434]" : "text-[#343434]"
                  }`}
                >
                  {subtotal}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
