"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS,
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import {
  formatMoney,
  formatVariableColumn,
  type PayrollRow,
} from "../data/payroll-data";
import PayrollVariableStatusBadge from "./PayrollVariableStatusBadge";

interface NominasTableProps {
  rows: PayrollRow[];
}

type SortKey = "clientPrice" | "variableAmount" | "totalAmount" | null;

export default function NominasTable({ rows }: NominasTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-nomina-row-menu]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const displayedRows = useMemo(() => {
    if (!sortKey) return rows;

    return [...rows].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
  }, [rows, sortKey, sortDir]);

  const allSelected =
    displayedRows.length > 0 && displayedRows.every((row) => selectedIds.has(row.id));

  function toggleSort(key: Exclude<SortKey, null>) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedRows.map((row) => row.id)));
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

  const cellClass = "px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585] whitespace-nowrap";

  function SortableHeader({
    label,
    sortField,
  }: {
    label: string;
    sortField: Exclude<SortKey, null>;
  }) {
    const isActive = sortKey === sortField;
    return (
      <button
        type="button"
        onClick={() => toggleSort(sortField)}
        className="inline-flex items-center gap-1 hover:text-[#0097B2]"
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform ${isActive && sortDir === "asc" ? "rotate-180" : ""}`}
        />
      </button>
    );
  }

  return (
    <AdminHubTableShell>
      <table className="w-full min-w-[1100px] border-collapse bg-white">
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
              Contratista
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Puesto
            </th>
            <th
              className={`px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252] ${ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS}`}
            >
              Cliente
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Período
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <SortableHeader label="Precio del cliente" sortField="clientPrice" />
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <SortableHeader label="Variable" sortField="variableAmount" />
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              <SortableHeader label="Monto total" sortField="totalAmount" />
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Estado
            </th>
            <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
          </tr>
        </thead>
        <tbody>
          {displayedRows.map((row) => (
            <tr
              key={row.id}
              className={ADMIN_HUB_TABLE_ROW}
            >
              <td className="px-6 py-6">
                <input
                  type="checkbox"
                  checked={selectedIds.has(row.id)}
                  onChange={() => toggleOne(row.id)}
                  className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                  aria-label={`Seleccionar ${row.contractorName}`}
                />
              </td>
              <td className={cellClass}>{row.contractorName}</td>
              <td className={cellClass}>{row.position}</td>
              <td className={`${cellClass} ${ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS}`}>
                {row.client}
              </td>
              <td className={cellClass}>{row.period}</td>
              <td className={cellClass}>{formatMoney(row.clientPrice)}</td>
              <td className={cellClass}>{formatVariableColumn(row.variableAmount)}</td>
              <td className={cellClass}>{formatMoney(row.totalAmount)}</td>
              <td className="px-3 py-6">
                <PayrollVariableStatusBadge status={row.status} />
              </td>
              <td className="px-6 py-6 text-center">
                <div className="relative inline-block" data-nomina-row-menu>
                  <button
                    type="button"
                    aria-label="Más opciones"
                    aria-expanded={openMenuId === row.id}
                    aria-haspopup="menu"
                    onClick={() => setOpenMenuId((prev) => (prev === row.id ? null : row.id))}
                    className={`rounded p-1 transition-colors ${
                      openMenuId === row.id
                        ? "text-[#0097B2] bg-[#DFFAFF]"
                        : "text-[#858585] hover:text-[#0097B2]"
                    }`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === row.id && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-50 mt-1 min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setOpenMenuId(null)}
                        className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setOpenMenuId(null)}
                        className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminHubTableShell>
  );
}
