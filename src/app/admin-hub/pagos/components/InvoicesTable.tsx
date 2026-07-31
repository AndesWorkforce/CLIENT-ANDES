"use client";

import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import { ensureInvoiceSnapshot } from "../actions/pagos.actions";
import type { Invoice } from "../types/invoice.types";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoicesTableProps {
  invoices: Invoice[];
  displayPeriod: string;
  emptyMessage?: string;
}

export default function InvoicesTable({
  invoices,
  displayPeriod,
  emptyMessage = "No hay facturas para el periodo seleccionado.",
}: InvoicesTableProps) {
  const router = useRouter();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortByAmount, setSortByAmount] = useState<"asc" | "desc" | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openingInvoiceId, setOpeningInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-invoice-row-menu]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  function toggleRowMenu(invoiceId: string) {
    setOpenMenuId((prev) => (prev === invoiceId ? null : invoiceId));
  }

  async function handleViewInvoice(invoice: Invoice) {
    setOpenMenuId(null);
    setOpeningInvoiceId(invoice.id);

    const result = await ensureInvoiceSnapshot(invoice.empresaId, displayPeriod);
    setOpeningInvoiceId(null);

    if (!result.success || !result.data?.id) {
      addNotification(
        result.message ?? "No se pudo abrir la factura del cliente",
        "error",
      );
      return;
    }

    router.push(`/admin-hub/pagos/facturas/${result.data.id}`);
  }

  function handleRowClick(
    invoice: Invoice,
    event: ReactMouseEvent<HTMLTableRowElement>,
  ) {
    const target = event.target as HTMLElement;
    if (
      target.closest("input[type='checkbox']") ||
      target.closest("[data-invoice-row-menu]")
    ) {
      return;
    }
    void handleViewInvoice(invoice);
  }

  const displayedInvoices = useMemo(() => {
    if (!sortByAmount) return invoices;

    return [...invoices].sort((a, b) => {
      const amountA = parseInt(a.totalAmount.replace(/[^\d]/g, ""), 10);
      const amountB = parseInt(b.totalAmount.replace(/[^\d]/g, ""), 10);
      return sortByAmount === "asc" ? amountA - amountB : amountB - amountA;
    });
  }, [invoices, sortByAmount]);

  const allSelected =
    displayedInvoices.length > 0 &&
    displayedInvoices.every((inv) => selectedIds.has(inv.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedInvoices.map((inv) => inv.id)));
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
    setSortByAmount((prev) =>
      prev === null ? "desc" : prev === "desc" ? "asc" : null,
    );
  }

  return (
    <AdminHubTableShell>
      {displayedInvoices.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center bg-white px-6 py-12">
          <p className="text-[14px] text-[#858585]">{emptyMessage}</p>
        </div>
      ) : (
        <table className="w-full min-w-[900px] border-collapse bg-white">
          <thead>
            <tr className="border-b border-[#EFEFEF]">
              <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
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
              <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
            </tr>
          </thead>
          <tbody>
            {displayedInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className={`${ADMIN_HUB_TABLE_ROW} cursor-pointer`}
                onClick={(event) => handleRowClick(invoice, event)}
              >
                <td className="px-6 py-6">
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
                  {displayPeriod}
                </td>
                <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                  {invoice.totalAmount}
                </td>
                <td className="px-3 py-6">
                  <InvoiceStatusBadge status={invoice.status} enlarged />
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="relative inline-block" data-invoice-row-menu>
                    <button
                      type="button"
                      aria-label="Más opciones"
                      aria-expanded={openMenuId === invoice.id}
                      aria-haspopup="menu"
                      disabled={openingInvoiceId === invoice.id}
                      onClick={() => toggleRowMenu(invoice.id)}
                      className={`rounded p-1 transition-colors ${
                        openMenuId === invoice.id
                          ? "text-[#0097B2] bg-[#DFFAFF]"
                          : "text-[#858585] hover:text-[#0097B2]"
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenuId === invoice.id && (
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-1 min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          disabled={openingInvoiceId === invoice.id}
                          onClick={() => void handleViewInvoice(invoice)}
                          className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] hover:bg-[#F8F8F8] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {openingInvoiceId === invoice.id
                            ? "Abriendo..."
                            : "Ver Factura"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminHubTableShell>
  );
}
