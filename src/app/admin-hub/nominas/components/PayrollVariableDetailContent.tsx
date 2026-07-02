"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleUser,
  Clock,
  DollarSign,
  Download,
  FileText,
  Hash,
  Pencil,
  Scale,
  Trash2,
  User,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import type { PayrollVariableDetail } from "../data/mock-variable-detail";
import { removePayrollVariable } from "../data/payroll-data";
import type { PayrollVariable } from "../data/mock-payroll-variables";
import PayrollVariableInfoCard from "./PayrollVariableInfoCard";
import PayrollVariableInfoRow from "./PayrollVariableInfoRow";
import PayrollVariableStatusBadge from "./PayrollVariableStatusBadge";
import DeletePayrollVariableModal from "./DeletePayrollVariableModal";

interface PayrollVariableDetailContentProps {
  detail: PayrollVariableDetail;
}

export default function PayrollVariableDetailContent({
  detail: initialDetail,
}: PayrollVariableDetailContentProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [detail, setDetail] = useState(initialDetail);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingBasePago, setIsEditingBasePago] = useState(false);
  const [isEditingDetalles, setIsEditingDetalles] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [statusEdit, setStatusEdit] = useState(detail.estado);

  const [basePagoEdit, setBasePagoEdit] = useState({
    sueldoBase: detail.sueldoBase,
    duracion: detail.duracion,
    cantidad: detail.cantidad,
  });

  const [detallesEdit, setDetallesEdit] = useState(detail.descripcion);

  // Función para convertir fechas al formato USA (MM/DD/YYYY)
  const formatDateToUSA = (dateString: string): string => {
    // Si la fecha está en formato DD.MM.YYYY
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.');
      return `${month}/${day}/${year}`;
    }
    // Si la fecha está en formato DD/MM/YYYY
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        // Si ya está en formato USA (mes es <= 12 y día > 12), retornar tal cual
        if (Number.parseInt(day) > 12 && Number.parseInt(month) <= 12) {
          return dateString;
        }
        return `${month}/${day}/${year}`;
      }
    }
    // Si la fecha está en formato ISO o no se reconoce, intentar parsearla
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      }
    } catch {
      // Si falla, retornar la fecha original
    }
    return dateString;
  };

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: "Variables de nóminas", href: "/admin-hub/nominas/variables" },
      { label: `Variable - ${detail.id}` },
    ],
    [detail.id]
  );

  // Calcular monto basado en base de pago
  const montoCalculado = useMemo(() => {
    const base = isEditingBasePago ? basePagoEdit.sueldoBase : detail.sueldoBase;
    const duracion = isEditingBasePago ? basePagoEdit.duracion : detail.duracion;
    const cantidad = isEditingBasePago ? basePagoEdit.cantidad : detail.cantidad;
    
    // Cálculo según tipo de variable
    const montoBase = (base / duracion) * cantidad;
    
    // Deducciones y Ausencias tienen impacto negativo
    if (detail.type === "Deducción" || detail.type === "Ausencia") {
      return -Math.abs(montoBase);
    }
    
    // Overtime, Income Variable y Holiday tienen impacto positivo
    return Math.abs(montoBase);
  }, [detail, basePagoEdit, isEditingBasePago]);

  function handleEdit(section: string) {
    switch (section) {
      case "estado":
        if (isEditingStatus) {
          // Guardar cambios
          setDetail({ ...detail, estado: statusEdit });
          addNotification("El estado se actualizó localmente.", "success", "compact");
        }
        setIsEditingStatus(!isEditingStatus);
        break;
      case "base-pago":
        if (isEditingBasePago) {
          // Validar que el monto no supere el sueldo base
          if (Math.abs(montoCalculado) > basePagoEdit.sueldoBase) {
            addNotification("El monto de deducción no puede superar el sueldo base.", "error");
            return;
          }
          // Guardar cambios
          setDetail({ ...detail, ...basePagoEdit, monto: montoCalculado });
          addNotification("La base de pago se actualizó localmente.", "success", "compact");
        }
        setIsEditingBasePago(!isEditingBasePago);
        break;
      case "detalles":
        if (isEditingDetalles) {
          // Guardar cambios
          setDetail({ ...detail, descripcion: detallesEdit });
          addNotification("Los detalles adicionales se actualizaron localmente.", "success", "compact");
        }
        setIsEditingDetalles(!isEditingDetalles);
        break;
      default:
        addNotification(`La edición de ${section} estará disponible próximamente.`, "info");
    }
  }

  function handleExport() {
    addNotification("La exportación de la variable estará disponible próximamente.", "info");
  }

  function handleDelete() {
    // No permitir eliminar si el estado es "Emitido"
    if (detail.estado === "Emitido") {
      addNotification(
        "No se puede eliminar una variable con estado 'Emitido'.",
        "error"
      );
      return;
    }

    setDeleteModalOpen(true);
  }

  function confirmDelete() {
    removePayrollVariable(detail.id);
    addNotification("La variable fue eliminada.", "success", "compact");
    // Redirigir a la lista de variables después de eliminar
    router.push("/admin-hub/nominas/variables");
  }

  function cancelDelete() {
    setDeleteModalOpen(false);
  }

  // Convertir PayrollVariableDetail a PayrollVariable para el modal
  const variableForModal: PayrollVariable = {
    id: detail.id,
    date: detail.fechaCreacion,
    contractor: detail.contratista,
    client: detail.cliente,
    type: detail.type,
    category: detail.type === "Overtime" ? "overtimes" : 
              detail.type === "Holiday" ? "holidays" : 
              detail.type === "Deducción" || detail.type === "Ausencia" ? "deducciones" : 
              "incomeVariables",
    description: detail.descripcion,
    amount: detail.monto,
    status: detail.estado,
    createdBy: detail.creadoPor,
    period: `${detail.desde} - ${detail.hasta}`,
    applyDate: detail.hasta,
    incomeCategory: detail.incomeCategory,
    deductionTipo: detail.deductionTipo,
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold leading-[1.3] text-black">
            Variable de nóminas
          </h1>
          <p className="text-[16px] leading-[1.3] text-[#858585]">
            {detail.type}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={detail.estado === "Emitido"}
            className={`inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border px-[22px] text-[14px] font-medium leading-[1.2] transition-colors ${
              detail.estado === "Emitido"
                ? "cursor-not-allowed border-[#C8C8C8] text-[#C8C8C8]"
                : "border-[#E33434] text-[#E33434] hover:bg-[#FFF5F5]"
            }`}
            title={
              detail.estado === "Emitido"
                ? "No se puede eliminar una variable con estado 'Emitido'"
                : undefined
            }
          >
            <Trash2 size={20} />
            Eliminar
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
          >
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_424px]">
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-4">
          {/* Contexto */}
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold leading-[1.3] text-black">Contexto</h2>
            </div>
            <div className="flex flex-col gap-4">
              {/* Contratista */}
              <div className="relative">
                <select
                  value={detail.contratista}
                  disabled
                  className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                >
                  <option value={detail.contratista}>{detail.contratista}</option>
                </select>
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Contratista*
                </label>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
              </div>

              {/* ID Contrato y Puesto en una fila */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    value={detail.idContrato}
                    disabled
                    className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                  >
                    <option value={detail.idContrato}>{detail.idContrato}</option>
                  </select>
                  <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                    ID Contrato*
                  </label>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                </div>

                <div className="relative">
                  <select
                    value={detail.puesto}
                    disabled
                    className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                  >
                    <option value={detail.puesto}>{detail.puesto}</option>
                  </select>
                  <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                    Puesto*
                  </label>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                </div>
              </div>

              {/* Cliente */}
              <div className="relative">
                <select
                  value={detail.cliente}
                  disabled
                  className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                >
                  <option value={detail.cliente}>{detail.cliente}</option>
                </select>
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Cliente*
                </label>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
              </div>

              {/* Variable (Categoría principal) */}
              <div className="relative">
                <select
                  value={detail.type}
                  disabled
                  className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                >
                  <option value={detail.type}>{detail.type}</option>
                </select>
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Variable*
                </label>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
              </div>

              {/* Tipo (Subtipo específico) */}
              {(detail.deductionTipo || detail.incomeCategory) && (
                <div className="relative">
                  <select
                    value={detail.deductionTipo || detail.incomeCategory || ""}
                    disabled
                    className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                  >
                    <option value={detail.deductionTipo || detail.incomeCategory}>
                      {detail.deductionTipo || detail.incomeCategory}
                    </option>
                  </select>
                  <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                    Tipo*
                  </label>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                </div>
              )}

              {/* Fecha */}
              <div className="relative">
                <select
                  value={`${formatDateToUSA(detail.desde)}`}
                  disabled
                  className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                >
                  <option value={`${formatDateToUSA(detail.desde)}`}>{formatDateToUSA(detail.desde)}</option>
                </select>
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Fecha*
                </label>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
              </div>
            </div>
          </div>

          {/* Base de pago */}
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold leading-[1.3] text-black">Base de pago</h2>
              {!isEditingBasePago ? (
                <button
                  type="button"
                  onClick={() => handleEdit("base-pago")}
                  className="flex size-8 items-center justify-center rounded-full border border-[#0097B2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEdit("base-pago")}
                  className="text-[14px] font-medium text-[#0097B2] hover:underline"
                >
                  Guardar
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Sueldo Base */}
              <div className="relative">
                {isEditingBasePago ? (
                  <input
                    type="number"
                    value={basePagoEdit.sueldoBase}
                    onChange={(e) => setBasePagoEdit({ ...basePagoEdit, sueldoBase: Number(e.target.value) })}
                    className="h-[50px] w-full rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none"
                  />
                ) : (
                  <>
                    <select
                      value={detail.sueldoBase}
                      disabled
                      className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                    >
                      <option value={detail.sueldoBase}>${detail.sueldoBase}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                  </>
                )}
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Sueldo Base*
                </label>
              </div>

              {/* Duración */}
              <div className="relative">
                {isEditingBasePago ? (
                  <input
                    type="text"
                    value={basePagoEdit.duracion}
                    onChange={(e) => setBasePagoEdit({ ...basePagoEdit, duracion: Number(e.target.value) })}
                    className="h-[50px] w-full rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none"
                  />
                ) : (
                  <>
                    <select
                      value={detail.duracion}
                      disabled
                      className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                    >
                      <option value={detail.duracion}>Dia</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                  </>
                )}
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Duración*
                </label>
              </div>

              {/* Cantidad */}
              <div className="relative">
                {isEditingBasePago ? (
                  <input
                    type="number"
                    value={basePagoEdit.cantidad}
                    onChange={(e) => setBasePagoEdit({ ...basePagoEdit, cantidad: Number(e.target.value) })}
                    className="h-[50px] w-full rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none"
                  />
                ) : (
                  <>
                    <select
                      value={detail.cantidad}
                      disabled
                      className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                    >
                      <option value={detail.cantidad}>{detail.cantidad}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                  </>
                )}
                <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                  Cantidad*
                </label>
              </div>
            </div>
          </div>

          {/* Ingresos Adicionales / Descripción */}
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold leading-[1.3] text-black">
                {detail.type === "Income Variable" ? "Ingresos Adicionales" : "Descripción"}
              </h2>
              {!isEditingDetalles ? (
                <button
                  type="button"
                  onClick={() => handleEdit("detalles")}
                  className="flex size-8 items-center justify-center rounded-full border border-[#0097B2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEdit("detalles")}
                  className="text-[14px] font-medium text-[#0097B2] hover:underline"
                >
                  Guardar
                </button>
              )}
            </div>
            <div className="relative">
              {isEditingDetalles ? (
                <textarea
                  value={detallesEdit}
                  onChange={(e) => setDetallesEdit(e.target.value)}
                  rows={4}
                  className="w-full rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none"
                />
              ) : (
                <>
                  <select
                    value={detail.descripcion}
                    disabled
                    className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
                  >
                    <option value={detail.descripcion}>{detail.descripcion}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
                </>
              )}
              <label className="absolute left-[13px] top-0 bg-white px-1 text-[12px] text-[#858585]">
                Descripción*
              </label>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-4">
          {/* Estado de la nómina */}
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-bold leading-[1.3] text-black">Estado de la nómina</h2>
              {!isEditingStatus ? (
                <button
                  type="button"
                  onClick={() => handleEdit("estado")}
                  className="flex size-8 items-center justify-center rounded-full border border-[#0097B2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEdit("estado")}
                  className="text-[14px] font-medium text-[#0097B2] hover:underline"
                >
                  Guardar
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={isEditingStatus ? statusEdit : detail.estado}
                onChange={(e) => isEditingStatus && setStatusEdit(e.target.value as any)}
                disabled={!isEditingStatus}
                className="h-[50px] w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-4 pt-4 pb-2 text-[14px] text-[#525252] outline-none disabled:bg-white"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
              <label className="absolute left-[13px] top-0 bg-white px-1 text-[14px] text-[#525252]">
                Estado*
              </label>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#525252]" size={18} />
            </div>
          </div>

          {/* Registro de creación */}
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white p-6">
            <h2 className="mb-6 text-[18px] font-bold leading-[1.3] text-black">Registro de creación</h2>
            <div className="flex flex-col gap-4">
              {/* Creado por */}
              <div className="relative">
                <label className="mb-1 block text-[12px] text-[#858585]">Creado por</label>
                <div className="rounded-[8px] border border-[#C8C8C8] bg-white px-4 py-3">
                  <p className="text-[14px] text-[#525252]">{detail.creadoPor}</p>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="relative">
                <label className="mb-1 block text-[12px] text-[#858585]">Fecha de creación</label>
                <div className="rounded-[8px] border border-[#C8C8C8] bg-white px-4 py-3">
                  <p className="text-[14px] text-[#525252]">{formatDateToUSA(detail.fechaCreacion)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impacto */}
          <div className="rounded-[12px] border border-[#EFEFEF] bg-white p-6">
            <h2 className="mb-6 text-[18px] font-bold leading-[1.3] text-black">Impacto</h2>
            <div className="relative">
              <label className="mb-1 block text-[12px] text-[#858585]">Monto*</label>
              <div className="rounded-[8px] border border-[#C8C8C8] bg-white px-4 py-3">
                <p className="text-[14px] text-[#525252]">
                  {montoCalculado < 0 ? `-$${Math.abs(montoCalculado).toFixed(2)}` : `$${montoCalculado.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeletePayrollVariableModal
        variable={variableForModal}
        open={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
