"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS,
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import {
  getContractStatusLabel,
  getMetodoPagoDisplay,
  getPaisDisplay,
  getTipoContratoDisplay,
} from "../data/contract-display";
import type { MockProcesoContratacion } from "../data/mock-contracts";
import { contractToDetailPath } from "../data/mock-contract-detail";
import ContractStatusBadge from "./ContractStatusBadge";

interface ContractsTableProps {
  contracts: MockProcesoContratacion[];
}

export default function ContractsTable({ contracts }: ContractsTableProps) {
  const { addNotification } = useNotificationStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-contract-row-menu]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const allSelected =
    contracts.length > 0 && contracts.every((contract) => selectedIds.has(contract.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contracts.map((contract) => contract.id)));
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

  return (
    <AdminHubTableShell>
      <table className="w-full min-w-[1050px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-[#EFEFEF]">
            <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                aria-label="Seleccionar todos"
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
              Tipo de contrato
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              País
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Metodo de Pago
            </th>
            <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
              Estado
            </th>
            <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => {
            const status = getContractStatusLabel(contract.activo);

            return (
              <tr key={contract.id} className={ADMIN_HUB_TABLE_ROW}>
                <td className="px-6 py-6">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(contract.id)}
                    onChange={() => toggleOne(contract.id)}
                    className="size-4 rounded border-[#EFEFEF] accent-[#0097B2]"
                    aria-label={`Seleccionar ${contract.nombreCompleto}`}
                  />
                </td>
                <td className={cellClass}>{contract.nombreCompleto}</td>
                <td className={cellClass}>{contract.puestoTrabajo}</td>
                <td className={`${cellClass} ${ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS}`}>
                  {contract.empresaNombre}
                </td>
                <td className={cellClass}>
                  {getTipoContratoDisplay(contract.fechaFinalizacion)}
                </td>
                <td className={cellClass}>
                  {getPaisDisplay(contract.paisCodigo, contract.paisFacturacion)}
                </td>
                <td className={cellClass}>{getMetodoPagoDisplay(contract)}</td>
                <td className="px-3 py-6">
                  <ContractStatusBadge status={status} />
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="relative inline-block" data-contract-row-menu>
                    <button
                      type="button"
                      aria-label="Más opciones"
                      aria-expanded={openMenuId === contract.id}
                      aria-haspopup="menu"
                      onClick={() =>
                        setOpenMenuId((prev) => (prev === contract.id ? null : contract.id))
                      }
                      className={`rounded p-1 transition-colors ${
                        openMenuId === contract.id
                          ? "bg-[#DFFAFF] text-[#0097B2]"
                          : "text-[#858585] hover:text-[#0097B2]"
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenuId === contract.id && (
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-1 min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
                      >
                        <Link
                          href={contractToDetailPath(contract)}
                          role="menuitem"
                          onClick={() => setOpenMenuId(null)}
                          className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F8F8F8]"
                        >
                          Ver Contrato
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setOpenMenuId(null);
                            addNotification(
                              "El perfil del contratista estará disponible próximamente.",
                              "info"
                            );
                          }}
                          className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F8F8F8]"
                        >
                          Ver Contratista
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-[#EFEFEF]">
            <td className="rounded-bl-[12px] bg-white px-6 py-6" />
            <td
              colSpan={8}
              className="rounded-br-[12px] bg-white px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]"
            >
              Filas: {contracts.length}
            </td>
          </tr>
        </tfoot>
      </table>
    </AdminHubTableShell>
  );
}
