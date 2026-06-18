"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleUser,
  Clock,
  DollarSign,
  Download,
  FileText,
  Hash,
  Scale,
  Trash2,
  User,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import type { PayrollVariableDetail } from "../data/mock-variable-detail";
import PayrollVariableInfoCard from "./PayrollVariableInfoCard";
import PayrollVariableInfoRow from "./PayrollVariableInfoRow";
import PayrollVariableStatusBadge from "./PayrollVariableStatusBadge";

interface PayrollVariableDetailContentProps {
  detail: PayrollVariableDetail;
}

export default function PayrollVariableDetailContent({
  detail: initialDetail,
}: PayrollVariableDetailContentProps) {
  const { addNotification } = useNotificationStore();
  const [detail, setDetail] = useState(initialDetail);
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingBasePago, setIsEditingBasePago] = useState(false);
  const [isEditingDetalles, setIsEditingDetalles] = useState(false);

  // Estado local de edición
  const [contextEdit, setContextEdit] = useState({
    contratista: detail.contratista,
    idContrato: detail.idContrato,
    puesto: detail.puesto,
    cliente: detail.cliente,
    desde: detail.desde,
    hasta: detail.hasta,
  });

  const [statusEdit, setStatusEdit] = useState(detail.estado);

  const [basePagoEdit, setBasePagoEdit] = useState({
    sueldoBase: detail.sueldoBase,
    duracion: detail.duracion,
    cantidad: detail.cantidad,
  });

  const [detallesEdit, setDetallesEdit] = useState(detail.descripcion);

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
    
    // Para deducciones, el cálculo podría ser: -(sueldoBase / duracion) * cantidad
    // Este es un cálculo simplificado
    const montoBase = (base / duracion) * cantidad;
    return -Math.abs(montoBase);
  }, [detail, basePagoEdit, isEditingBasePago]);

  function handleEdit(section: string) {
    switch (section) {
      case "contexto":
        if (isEditingContext) {
          // Guardar cambios
          setDetail({ ...detail, ...contextEdit });
          addNotification("Los cambios en el contexto se guardaron localmente.", "success", "compact");
        }
        setIsEditingContext(!isEditingContext);
        break;
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
    addNotification("La eliminación de la variable estará disponible próximamente.", "info");
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold leading-[1.3] text-black">
          Variable - {detail.id}
        </h1>
        <p className="text-[16px] leading-[1.3] text-[#343434]">
          {detail.contratista} - Deducción
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border border-[#E33434] px-[22px] text-[14px] font-medium leading-[1.2] text-[#E33434] transition-colors hover:bg-[#FFF5F5]"
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

      <div className="flex flex-col gap-[18px]">
        {/* Contexto */}
        <PayrollVariableInfoCard
          title="Contexto"
          onEdit={() => handleEdit("contexto")}
        >
          {isEditingContext ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Contratista*
                </label>
                <input
                  type="text"
                  value={contextEdit.contratista}
                  onChange={(e) => setContextEdit({ ...contextEdit, contratista: e.target.value })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  ID Contrato*
                </label>
                <input
                  type="text"
                  value={contextEdit.idContrato}
                  onChange={(e) => setContextEdit({ ...contextEdit, idContrato: e.target.value })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Puesto*
                </label>
                <input
                  type="text"
                  value={contextEdit.puesto}
                  onChange={(e) => setContextEdit({ ...contextEdit, puesto: e.target.value })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Cliente*
                </label>
                <input
                  type="text"
                  value={contextEdit.cliente}
                  onChange={(e) => setContextEdit({ ...contextEdit, cliente: e.target.value })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[14px] text-[#343434]">
                    Desde*
                  </label>
                  <input
                    type="text"
                    value={contextEdit.desde}
                    onChange={(e) => setContextEdit({ ...contextEdit, desde: e.target.value })}
                    className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                    placeholder="DD.MM.YYYY"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[14px] text-[#343434]">
                    Hasta*
                  </label>
                  <input
                    type="text"
                    value={contextEdit.hasta}
                    onChange={(e) => setContextEdit({ ...contextEdit, hasta: e.target.value })}
                    className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                    placeholder="DD.MM.YYYY"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <PayrollVariableInfoRow
                icon={CircleUser}
                label="Contratista"
                value={detail.contratista}
              />
              <PayrollVariableInfoRow
                icon={Hash}
                label="ID Contrato"
                value={detail.idContrato}
              />
              <PayrollVariableInfoRow
                icon={BriefcaseBusiness}
                label="Puesto"
                value={detail.puesto}
              />
              <PayrollVariableInfoRow
                icon={Building2}
                label="Cliente"
                value={detail.cliente}
              />
              <PayrollVariableInfoRow
                icon={CalendarDays}
                label="Desde"
                value={detail.desde}
              />
              <PayrollVariableInfoRow
                icon={CalendarDays}
                label="Hasta"
                value={detail.hasta}
                isLast
              />
            </>
          )}
        </PayrollVariableInfoCard>

        <div className="grid gap-[18px] lg:grid-cols-2">
          {/* Estado de la nómina */}
          <PayrollVariableInfoCard
            title="Estado de la nómina"
            onEdit={() => handleEdit("estado")}
          >
            {isEditingStatus ? (
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Estado*
                </label>
                <select
                  value={statusEdit}
                  onChange={(e) => setStatusEdit(e.target.value as any)}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-4">
                <Scale size={24} className="shrink-0 text-[#858585]" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="text-[14px] leading-[1.3] text-[#343434]">Estado</div>
                  <div>
                    <PayrollVariableStatusBadge status={detail.estado} />
                  </div>
                </div>
              </div>
            )}
          </PayrollVariableInfoCard>

          {/* Registro de creación */}
          <PayrollVariableInfoCard title="Registro de creación">
            <PayrollVariableInfoRow
              icon={User}
              label="Creado por"
              value={detail.creadoPor}
            />
            <PayrollVariableInfoRow
              icon={CalendarDays}
              label="Fecha de creación"
              value={detail.fechaCreacion}
              isLast
            />
          </PayrollVariableInfoCard>
        </div>

        {/* Base de pago */}
        <PayrollVariableInfoCard
          title="Base de pago"
          onEdit={() => handleEdit("base-pago")}
        >
          {isEditingBasePago ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Sueldo Base*
                </label>
                <input
                  type="number"
                  value={basePagoEdit.sueldoBase}
                  onChange={(e) => setBasePagoEdit({ ...basePagoEdit, sueldoBase: Number(e.target.value) })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Duración (horas)*
                </label>
                <input
                  type="number"
                  value={basePagoEdit.duracion}
                  onChange={(e) => setBasePagoEdit({ ...basePagoEdit, duracion: Number(e.target.value) })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-[14px] text-[#343434]">
                  Cantidad*
                </label>
                <input
                  type="number"
                  value={basePagoEdit.cantidad}
                  onChange={(e) => setBasePagoEdit({ ...basePagoEdit, cantidad: Number(e.target.value) })}
                  className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                  min="0"
                />
              </div>
              <div className="rounded-[8px] bg-[#FFF5F5] p-4">
                <p className="text-[14px] text-[#E33434]">
                  Nota: En Deducciones el impacto es negativo — el monto se muestra como valor a restar.
                </p>
              </div>
            </div>
          ) : (
            <>
              <PayrollVariableInfoRow
                icon={DollarSign}
                label="Sueldo Base"
                value={`$${detail.sueldoBase.toFixed(2)}`}
              />
              <PayrollVariableInfoRow
                icon={Clock}
                label="Duración"
                value={`${detail.duracion} horas`}
              />
              <PayrollVariableInfoRow
                icon={Hash}
                label="Cantidad"
                value={detail.cantidad}
              />
              <div className="rounded-[8px] bg-[#FFF5F5] p-4">
                <p className="text-[14px] text-[#E33434]">
                  Nota: En Deducciones el impacto es negativo — el monto se muestra como valor a restar.
                </p>
              </div>
            </>
          )}
        </PayrollVariableInfoCard>

        {/* Impacto */}
        <PayrollVariableInfoCard title="Impacto">
          <PayrollVariableInfoRow
            icon={DollarSign}
            label="Monto (calculado)"
            value={`-$${Math.abs(montoCalculado).toFixed(2)}`}
            isLast
          />
          <div className="rounded-[8px] bg-[#F8F8F8] p-4">
            <p className="text-[14px] text-[#858585]">
              El monto es calculado localmente como valor negativo (deducción).
            </p>
          </div>
        </PayrollVariableInfoCard>

        {/* Detalles Adicionales */}
        <PayrollVariableInfoCard
          title="Detalles Adicionales"
          onEdit={() => handleEdit("detalles")}
        >
          {isEditingDetalles ? (
            <div>
              <label className="mb-1 block text-[14px] text-[#343434]">
                Descripción*
              </label>
              <textarea
                value={detallesEdit}
                onChange={(e) => setDetallesEdit(e.target.value)}
                className="w-full rounded-[8px] border border-[#EFEFEF] px-4 py-2 text-[14px] focus:border-[#0097B2] focus:outline-none"
                rows={4}
              />
            </div>
          ) : (
            <PayrollVariableInfoRow
              icon={FileText}
              label="Descripción"
              value={detail.descripcion}
              isLast
            />
          )}
        </PayrollVariableInfoCard>
      </div>
    </div>
  );
}
