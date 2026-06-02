"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreVertical } from "lucide-react";
import type { InvoiceLineItem } from "../data/mock-invoice-details";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

const MENU_MIN_WIDTH = 148;

interface InvoiceLineItemsTableProps {
  items: InvoiceLineItem[];
  subtotal: string;
  subtotalIsNegative?: boolean;
  onApprove: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

type MenuPosition = { top: number; left: number };

export default function InvoiceLineItemsTable({
  items,
  subtotal,
  subtotalIsNegative,
  onApprove,
  onReject,
  onDelete,
}: InvoiceLineItemsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
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
        !target.closest("[data-line-item-row-menu]") &&
        !target.closest("[data-line-item-row-menu-dropdown]")
      ) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

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
    closeMenu();
    onApprove(itemId);
  }

  function handleReject(itemId: string) {
    closeMenu();
    onReject(itemId);
  }

  function handleDelete(itemId: string) {
    closeMenu();
    onDelete(itemId);
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
    ? items.find((item) => item.id === openMenuId)
    : null;

  return (
    <>
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
              <tr
                key={item.id}
                className="border-b border-[#EFEFEF] last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleOne(item.id)}
                    className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                    aria-label={`Seleccionar ${item.description}`}
                  />
                </td>
                <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                  {item.date}
                </td>
                <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                  {item.type}
                </td>
                <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                  {item.description}
                </td>
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
                <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                  {item.createdBy}
                </td>
                <td className="overflow-visible px-6 py-6 text-center">
                  <div className="relative inline-block" data-line-item-row-menu>
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

      {openMenuId &&
        openMenuItem &&
        menuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-line-item-row-menu-dropdown
            role="menu"
            className="fixed z-[200] min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleApprove(openMenuItem.id)}
              className={menuItemClass}
            >
              Aprobar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleReject(openMenuItem.id)}
              className={menuItemClass}
            >
              Rechazar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={closeMenu}
              className={`${menuItemClass} text-[#858585]`}
            >
              Editar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleDelete(openMenuItem.id)}
              className={`${menuItemClass} text-[#E33434] hover:bg-[#FFF5F5]`}
            >
              Eliminar
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
