"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS,
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import {
  formatPayrollAmount,
  type PayrollVariable,
} from "../data/mock-payroll-variables";
import { applyDateToSortable } from "../lib/payroll-apply-date";
import PayrollVariableStatusBadge from "./PayrollVariableStatusBadge";
import DeletePayrollVariableModal from "./DeletePayrollVariableModal";

const MENU_MIN_WIDTH = 148;

interface PayrollVariablesTableProps {
  variables: PayrollVariable[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (selectedIds: Set<string>) => void;
  onApprove: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

type MenuPosition = { top: number; left: number };

export default function PayrollVariablesTable({
  variables,
  selectedIds,
  onSelectedIdsChange,
  onApprove,
  onReject,
  onDelete,
}: PayrollVariablesTableProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [sortByDate, setSortByDate] = useState<"asc" | "desc" | null>(null);
  const [sortByAmount, setSortByAmount] = useState<"asc" | "desc" | null>(null);
  const [sortByApplyDate, setSortByApplyDate] = useState<"asc" | "desc" | null>(null);
  const [sortByStatus, setSortByStatus] = useState<"asc" | "desc" | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<PayrollVariable | null>(null);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updateMenuPosition = useCallback((itemId: string) => {
    const button = menuButtonRefs.current[itemId];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - MENU_MIN_WIDTH),
    });
  }, []);

  useEffect(() => {
    if (!openMenuId) return;

    const handleReposition = () => updateMenuPosition(openMenuId);

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
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
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const displayedVariables = useMemo(() => {
    let result = [...variables];

    if (sortByDate) {
      result.sort((a, b) => {
        const cmp = a.date.localeCompare(b.date);
        return sortByDate === "asc" ? cmp : -cmp;
      });
    } else if (sortByApplyDate) {
      result.sort((a, b) => {
        const cmp = applyDateToSortable(a.applyDate).localeCompare(
          applyDateToSortable(b.applyDate)
        );
        return sortByApplyDate === "asc" ? cmp : -cmp;
      });
    } else if (sortByAmount) {
      result.sort((a, b) =>
        sortByAmount === "asc" ? a.amount - b.amount : b.amount - a.amount
      );
    } else if (sortByStatus) {
      result.sort((a, b) => {
        const cmp = a.status.localeCompare(b.status);
        return sortByStatus === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [variables, sortByDate, sortByApplyDate, sortByAmount, sortByStatus]);

  const allSelected =
    displayedVariables.length > 0 &&
    displayedVariables.every((item) => selectedIds.has(item.id));

  function toggleAll() {
    if (allSelected) {
      onSelectedIdsChange(new Set());
    } else {
      onSelectedIdsChange(new Set(displayedVariables.map((item) => item.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange(next);
  }

  function toggleDateSort() {
    setSortByAmount(null);
    setSortByApplyDate(null);
    setSortByStatus(null);
    setSortByDate((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
  }

  function toggleApplyDateSort() {
    setSortByDate(null);
    setSortByAmount(null);
    setSortByStatus(null);
    setSortByApplyDate((prev) =>
      prev === null ? "desc" : prev === "desc" ? "asc" : null
    );
  }

  function toggleAmountSort() {
    setSortByDate(null);
    setSortByApplyDate(null);
    setSortByStatus(null);
    setSortByAmount((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
  }

  function toggleStatusSort() {
    setSortByDate(null);
    setSortByApplyDate(null);
    setSortByAmount(null);
    setSortByStatus((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
  }

  function closeMenu() {
    setOpenMenuId(null);
    setMenuPosition(null);
  }

  function toggleRowMenu(itemId: string) {
    if (openMenuId === itemId) {
      closeMenu();
      return;
    }

    setOpenMenuId(itemId);
    requestAnimationFrame(() => updateMenuPosition(itemId));
  }

  function handleApprove(itemId: string) {
    const variable = displayedVariables.find((v) => v.id === itemId);
    if (!variable || variable.status !== "Pendiente") {
      closeMenu();
      return;
    }
    closeMenu();
    onApprove(itemId);
  }

  function handleReject(itemId: string) {
    const variable = displayedVariables.find((v) => v.id === itemId);
    if (
      !variable ||
      variable.status === "Rechazado" ||
      variable.status === "Emitido"
    ) {
      closeMenu();
      return;
    }
    closeMenu();
    onReject(itemId);
  }

  function handleDelete(itemId: string) {
    const variable = displayedVariables.find((v) => v.id === itemId);
    if (!variable) return;

    // No permitir eliminar si el estado es "Emitido"
    if (variable.status === "Emitido") {
      closeMenu();
      addNotification(
        "No se puede eliminar una variable con estado 'Emitido'.",
        "error"
      );
      return;
    }

    closeMenu();
    setVariableToDelete(variable);
    setDeleteModalOpen(true);
  }

  function confirmDelete() {
    if (!variableToDelete) return;
    onDelete(variableToDelete.id);
    setDeleteModalOpen(false);
    setVariableToDelete(null);
  }

  function cancelDelete() {
    setDeleteModalOpen(false);
    setVariableToDelete(null);
  }

  function handleEdit(itemId: string) {
    closeMenu();
    router.push(`/admin-hub/nominas/variables/${encodeURIComponent(itemId)}`);
  }

  function handleViewDetail(itemId: string) {
    closeMenu();
    router.push(`/admin-hub/nominas/variables/${encodeURIComponent(itemId)}`);
  }

  const menuButtonClass = (itemId: string) =>
    `rounded p-1 transition-colors ${
      openMenuId === itemId
        ? "bg-[#DFFAFF] text-[#0097B2]"
        : "text-[#858585] hover:text-[#0097B2]"
    }`;

  const menuItemClass =
    "flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] hover:bg-[#F8F8F8] transition-colors cursor-pointer";

  const openMenuItem = openMenuId
    ? displayedVariables.find((item) => item.id === openMenuId)
    : null;

  const cellClass =
    "px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]";
  const compactCellClass = `${cellClass} whitespace-nowrap`;

  return (
    <>
      <AdminHubTableShell>
        <table className="w-full table-auto border-collapse bg-white">
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
                <button
                  type="button"
                  onClick={toggleDateSort}
                  className="inline-flex items-center gap-1 hover:text-[#0097B2]"
                >
                  Fecha creación
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${sortByDate === "asc" ? "rotate-180" : ""}`}
                  />
                </button>
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Contratista
              </th>
              <th
                className={`px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252] ${ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS}`}
              >
                Cliente
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Tipo
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                <button
                  type="button"
                  onClick={toggleAmountSort}
                  className="inline-flex items-center gap-1 hover:text-[#0097B2]"
                >
                  Monto
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${sortByAmount === "asc" ? "rotate-180" : ""}`}
                  />
                </button>
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                <button
                  type="button"
                  onClick={toggleStatusSort}
                  className="inline-flex items-center gap-1 hover:text-[#0097B2]"
                >
                  Estado
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${sortByStatus === "asc" ? "rotate-180" : ""}`}
                  />
                </button>
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Creado por
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                <button
                  type="button"
                  onClick={toggleApplyDateSort}
                  className="inline-flex items-center gap-1 hover:text-[#0097B2]"
                >
                  Fecha a aplicar
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${sortByApplyDate === "asc" ? "rotate-180" : ""}`}
                  />
                </button>
              </th>
              <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
            </tr>
          </thead>
          <tbody>
            {displayedVariables.map((item, index) => (
              <tr key={item.id} className={ADMIN_HUB_TABLE_ROW}>
                <td className="px-6 py-6">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleOne(item.id)}
                    className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                    aria-label={`Seleccionar ${item.contractor}`}
                  />
                </td>
                <td className={`${compactCellClass} ${index === 0 ? "text-[#707070]" : ""}`}>
                  {item.date}
                </td>
                <td className={compactCellClass}>{item.contractor}</td>
                <td className={`${compactCellClass} ${ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS}`}>
                  {item.client}
                </td>
                <td className={compactCellClass}>{item.type}</td>
                <td className={compactCellClass}>{formatPayrollAmount(item.amount)}</td>
                <td className="px-3 py-6">
                  <PayrollVariableStatusBadge status={item.status} />
                </td>
                <td className={compactCellClass}>{item.createdBy}</td>
                <td className={compactCellClass}>{item.applyDate}</td>
                <td className="overflow-visible px-6 py-6 text-center">
                  <div className="relative inline-block" data-payroll-row-menu>
                    <button
                      ref={(el) => {
                        menuButtonRefs.current[item.id] = el;
                      }}
                      type="button"
                      aria-label="Más opciones"
                      aria-expanded={openMenuId === item.id}
                      aria-haspopup="menu"
                      onClick={() => toggleRowMenu(item.id)}
                      className={menuButtonClass(item.id)}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminHubTableShell>

      {openMenuId &&
        openMenuItem &&
        menuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-payroll-row-menu-dropdown
            role="menu"
            className="fixed z-[200] min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleViewDetail(openMenuItem.id)}
              className={menuItemClass}
            >
              Ver detalle
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleApprove(openMenuItem.id)}
              disabled={openMenuItem.status !== "Pendiente"}
              className={`${menuItemClass} ${
                openMenuItem.status !== "Pendiente"
                  ? "cursor-not-allowed text-[#C8C8C8] hover:bg-transparent"
                  : ""
              }`}
              title={
                openMenuItem.status !== "Pendiente"
                  ? `Solo se pueden aprobar variables en estado Pendiente (actual: ${openMenuItem.status})`
                  : undefined
              }
            >
              Aprobar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleReject(openMenuItem.id)}
              disabled={
                openMenuItem.status === "Rechazado" ||
                openMenuItem.status === "Emitido"
              }
              className={`${menuItemClass} ${
                openMenuItem.status === "Rechazado" ||
                openMenuItem.status === "Emitido"
                  ? "cursor-not-allowed text-[#C8C8C8] hover:bg-transparent"
                  : ""
              }`}
              title={
                openMenuItem.status === "Emitido"
                  ? "No se puede rechazar una variable con estado Emitido"
                  : openMenuItem.status === "Rechazado"
                    ? "La variable ya está rechazada"
                    : undefined
              }
            >
              Rechazar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleEdit(openMenuItem.id)}
              className={menuItemClass}
            >
              Editar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleDelete(openMenuItem.id)}
              disabled={openMenuItem.status === "Emitido"}
              className={`${menuItemClass} ${
                openMenuItem.status === "Emitido"
                  ? "cursor-not-allowed text-[#C8C8C8] hover:bg-transparent"
                  : "text-[#E33434] hover:bg-[#FFF5F5]"
              }`}
              title={
                openMenuItem.status === "Emitido"
                  ? "No se puede eliminar una variable con estado 'Emitido'"
                  : undefined
              }
            >
              Eliminar
            </button>
          </div>,
          document.body
        )}

      <DeletePayrollVariableModal
        variable={variableToDelete}
        open={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
