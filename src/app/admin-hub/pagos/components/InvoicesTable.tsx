"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MoreVertical } from "lucide-react";
import type { Invoice } from "../data/mock-invoices";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoicesTableProps {
  invoices: Invoice[];
  searchQuery: string;
}

export default function InvoicesTable({ invoices, searchQuery }: InvoicesTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortByAmount, setSortByAmount] = useState<"asc" | "desc" | null>(null);

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = query
      ? invoices.filter(
          (inv) =>
            inv.clientId.toLowerCase().includes(query) ||
            inv.client.toLowerCase().includes(query) ||
            inv.period.toLowerCase().includes(query)
        )
      : [...invoices];

    if (sortByAmount) {
      result = [...result].sort((a, b) => {
        const amountA = parseInt(a.totalAmount.replace(/[^\d]/g, ""), 10);
        const amountB = parseInt(b.totalAmount.replace(/[^\d]/g, ""), 10);
        return sortByAmount === "asc" ? amountA - amountB : amountB - amountA;
      });
    }

    return result;
  }, [invoices, searchQuery, sortByAmount]);

  const allSelected =
    filteredInvoices.length > 0 &&
    filteredInvoices.every((inv) => selectedIds.has(inv.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInvoices.map((inv) => inv.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAmountSort() {
    setSortByAmount((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
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
                aria-label="Seleccionar todas"
              />
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              ID Cliente
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Cliente
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Periodo
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <button
                type="button"
                onClick={toggleAmountSort}
                className="inline-flex items-center gap-1 hover:text-[#0097B2]"
              >
                Monto total
                <ChevronDown
                  size={18}
                  className={`transition-transform ${sortByAmount === "asc" ? "rotate-180" : ""}`}
                />
              </button>
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Estado
            </th>
            <th className="w-[70px] px-3 py-5" />
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr
              key={invoice.id}
              onClick={() => router.push(`/admin-hub/pagos/facturas/${invoice.id}`)}
              className="cursor-pointer border-b border-[#EFEFEF] last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
            >
              <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(invoice.id)}
                  onChange={() => toggleOne(invoice.id)}
                  className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                  aria-label={`Seleccionar ${invoice.client}`}
                />
              </td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                {invoice.clientId}
              </td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                {invoice.client}
              </td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                {invoice.period}
              </td>
              <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                {invoice.totalAmount}
              </td>
              <td className="px-3 py-6">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
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
        </tbody>
      </table>
    </div>
  );
}
