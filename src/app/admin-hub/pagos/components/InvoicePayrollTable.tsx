"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreVertical } from "lucide-react";
import AdminHubTableShell, { ADMIN_HUB_TABLE_ROW } from "../../components/AdminHubTableShell";
import type { InvoicePayrollEntry } from "../data/mock-invoice-details";
import { formatClientPrice } from "../../nominas/data/mock-contractors";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceTableTotalRow from "./InvoiceTableTotalRow";

const HOURS_FORMATTER = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * En HOURLY_TIME el precio del cliente es el resultado de tarifa horaria x horas,
 * no un monto mensual. Mostramos los tres valores para que la factura sea auditable.
 */
function PayrollClientPriceCell({ entry }: { entry: InvoicePayrollEntry }) {
  if (!entry.esHourly) {
    return <>{formatClientPrice(entry.clientPrice)}</>;
  }

  if (entry.sinHorasCargadas) {
    return (
      <div className="flex flex-col gap-0.5">
        <span>{formatClientPrice(0)}</span>
        <span className="text-[12px] leading-[1.3] text-[#C87A00]">
          Faltan horas del periodo
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span>{formatClientPrice(entry.clientPrice)}</span>
      <span className="text-[12px] leading-[1.3] text-[#A5A5A5]">
        {formatClientPrice(entry.tarifaHoraria ?? 0)}/h &times;{" "}
        {HOURS_FORMATTER.format(entry.horasTrabajadas ?? 0)} h
      </span>
    </div>
  );
}

const MENU_MIN_WIDTH = 148;

type MenuPosition = { top: number; left: number };

interface InvoicePayrollTableProps {
  entries: InvoicePayrollEntry[];
  subtotal: string;
  onApprove?: (lineaFacturaId: string) => void;
  onReject?: (lineaFacturaId: string) => void;
  onApproveSelected?: (lineaFacturaIds: string[]) => void;
  isBusy?: boolean;
}

export default function InvoicePayrollTable({
  entries,
  subtotal,
  onApprove,
  onReject,
  onApproveSelected,
  isBusy = false,
}: InvoicePayrollTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // El menu va en un portal con posicion fija: dentro de la celda quedaria
  // recortado por el overflow horizontal del contenedor de la tabla.
  const updateMenuPosition = useCallback((entryId: string) => {
    const button = menuButtonRefs.current[entryId];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - MENU_MIN_WIDTH),
    });
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const reposicionar = () => updateMenuPosition(openMenuId);
    window.addEventListener("resize", reposicionar);
    window.addEventListener("scroll", reposicionar, true);
    return () => {
      window.removeEventListener("resize", reposicionar);
      window.removeEventListener("scroll", reposicionar, true);
    };
  }, [openMenuId, updateMenuPosition]);

  useEffect(() => {
    if (!openMenuId) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        !target.closest("[data-payroll-row-menu]") &&
        !target.closest("[data-payroll-row-menu-dropdown]")
      ) {
        cerrarMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  function cerrarMenu() {
    setOpenMenuId(null);
    setMenuPosition(null);
  }

  function toggleRowMenu(entryId: string) {
    if (openMenuId === entryId) {
      cerrarMenu();
      return;
    }
    setOpenMenuId(entryId);
    requestAnimationFrame(() => updateMenuPosition(entryId));
  }

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
  const hasHourly = entries.some((entry) => entry.esHourly);

  const seleccionadasPendientes = entries.filter(
    (e) => selectedIds.has(e.id) && e.lineaFacturaId && e.status !== "Aprobada",
  );

  const entradaDelMenu = entries.find((e) => e.id === openMenuId) ?? null;

  return (
    <>
      <AdminHubTableShell variant="nested">
      {onApproveSelected && seleccionadasPendientes.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-[#EFEFEF] bg-[#F5FAFB] px-6 py-3">
          <span className="text-[13px] text-[#525252]">
            {seleccionadasPendientes.length} nómina(s) seleccionada(s)
          </span>
          <button
            type="button"
            disabled={isBusy}
            onClick={() =>
              onApproveSelected(
                seleccionadasPendientes.map((e) => e.lineaFacturaId as string),
              )
            }
            className="inline-flex h-8 items-center rounded-[8px] bg-[#0097B2] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#008099] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Aprobar seleccionadas
          </button>
        </div>
      )}
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
              {hasHourly ? "Precio del cliente / desglose" : "Precio del cliente"}
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <span className="inline-flex items-center gap-1">
                Estado
                <ChevronDown size={18} />
              </span>
            </th>
            <th className="w-[70px] px-3 py-5" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className={ADMIN_HUB_TABLE_ROW}
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
              <td className={cellClass}>
                <PayrollClientPriceCell entry={entry} />
              </td>
              <td className="px-3 py-6">
                <InvoiceStatusBadge status={entry.status} enlarged />
              </td>
              <td className="px-6 py-6 text-center">
                <button
                  type="button"
                  data-payroll-row-menu
                  ref={(el) => {
                    menuButtonRefs.current[entry.id] = el;
                  }}
                  aria-label="Más opciones"
                  aria-expanded={openMenuId === entry.id}
                  onClick={() => toggleRowMenu(entry.id)}
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
    </AdminHubTableShell>

      {openMenuId &&
        entradaDelMenu &&
        entradaDelMenu.lineaFacturaId &&
        menuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-payroll-row-menu-dropdown
            role="menu"
            className="fixed z-[200] min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            {entradaDelMenu.status !== "Aprobada" && onApprove && (
              <button
                type="button"
                role="menuitem"
                disabled={isBusy}
                onClick={() => {
                  cerrarMenu();
                  onApprove(entradaDelMenu.lineaFacturaId as string);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F8F8F8] disabled:opacity-50"
              >
                Aprobar
              </button>
            )}
            {entradaDelMenu.status !== "Rechazada" && onReject && (
              <button
                type="button"
                role="menuitem"
                disabled={isBusy}
                onClick={() => {
                  cerrarMenu();
                  onReject(entradaDelMenu.lineaFacturaId as string);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#B02A37] transition-colors hover:bg-[#FDF2F3] disabled:opacity-50"
              >
                Rechazar
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
