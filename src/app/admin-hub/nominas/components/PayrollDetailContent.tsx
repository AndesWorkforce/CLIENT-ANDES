"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Calendar,
  CircleUser,
  Download,
  Globe,
  Mail,
  Pen,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubSelect from "../../components/AdminHubSelect";
import { formatMoney } from "../data/payroll-data";
import type { PayrollDetail } from "../data/mock-payroll-detail";
import type { PayrollVariableStatus } from "../data/mock-payroll-variables";
import PayrollAmountColumn from "./PayrollAmountColumn";
import PayrollDetailInfoRow from "./PayrollDetailInfoRow";
import PayrollEmitModal, { type PayrollEmitModalVariant } from "./PayrollEmitModal";

const STATUS_OPTIONS: { value: PayrollVariableStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

interface PayrollDetailContentProps {
  detail: PayrollDetail;
}

export default function PayrollDetailContent({ detail }: PayrollDetailContentProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [status, setStatus] = useState<PayrollVariableStatus>(detail.status);
  const [notes, setNotes] = useState(detail.notes);
  const [emitModal, setEmitModal] = useState<PayrollEmitModalVariant | null>(null);

  const allVariablesApproved = useMemo(
    () =>
      detail.variables.length === 0 ||
      detail.variables.every((variable) => variable.status === "Aprobado"),
    [detail.variables]
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: detail.contractorName },
    ],
    [detail.contractorName]
  );

  function handleDownload() {
    addNotification("La descarga del recibo estará disponible próximamente.", "info");
  }

  function handleSaveDraft() {
    addNotification("Borrador guardado correctamente.", "success");
  }

  function handleEmitPayrollClick() {
    if (allVariablesApproved) {
      setEmitModal("confirm-emit");
    } else {
      setEmitModal("cannot-emit");
    }
  }

  function handleConfirmEmitPayroll() {
    setEmitModal(null);
    addNotification("Nómina emitida correctamente.", "success");
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-bold leading-[1.3] text-black">
          Detalle de Nómina
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin-hub/nominas/variables"
            className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB]"
          >
            Ir a Variables
          </Link>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
          >
            <Download size={18} />
            Descargar
          </button>
        </div>
      </div>

      <div className="rounded-[8px] bg-white px-5 py-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <section className="rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
              <h2 className="mb-2.5 text-[18px] font-bold leading-[1.3] text-black">
                Información del contrato
              </h2>
              <div className="rounded-[12px] border border-[#EFEFEF] bg-white px-[30px] py-[30px]">
                <h3 className="mb-[33px] text-[18px] font-bold leading-[1.3] text-black">
                  Informacion Personal
                </h3>
                <div className="flex flex-col gap-[11px]">
                  <PayrollDetailInfoRow
                    icon={CircleUser}
                    label="Nombre"
                    value={detail.contractorName}
                  />
                  <PayrollDetailInfoRow
                    icon={CircleUser}
                    label="Cliente"
                    value={detail.client}
                  />
                  <PayrollDetailInfoRow
                    icon={BriefcaseBusiness}
                    label="Puesto"
                    value={detail.position}
                  />
                  <PayrollDetailInfoRow
                    icon={Globe}
                    label="País"
                    value={detail.country}
                  />
                  <PayrollDetailInfoRow
                    icon={Calendar}
                    label="Contratado desde"
                    value={detail.contractStartDate}
                  />
                  <PayrollDetailInfoRow
                    icon={Calendar}
                    label="Contratado hasta"
                    value={detail.contractEndDate}
                  />
                  <PayrollDetailInfoRow
                    icon={Mail}
                    label="Email de contacto"
                    value={detail.contactEmail}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
              <div className="mb-2.5 flex items-start justify-between gap-3">
                <h2 className="text-[18px] font-bold leading-[1.3] text-black">
                  Base de pago
                </h2>
                <button
                  type="button"
                  aria-label="Editar base de pago"
                  onClick={() =>
                    addNotification("La edición de la base de pago estará disponible próximamente.", "info")
                  }
                  className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#0097B2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB]"
                >
                  <Pen size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-[27px]">
                <div className="flex flex-col gap-[15px] lg:flex-row lg:flex-wrap">
                  <PayrollAmountColumn
                    title="Ganancias"
                    lines={detail.earnings}
                    totalLabel="Total Ganancias"
                    totalAmount={formatMoney(detail.totalEarnings)}
                  />
                  <PayrollAmountColumn
                    title="Deducciones"
                    lines={detail.deductions}
                    totalLabel="Total Deducciones"
                    totalAmount={formatMoney(detail.totalDeductions)}
                    emptyLabel="Sin deducciones"
                  />
                </div>

                <div className="w-full min-w-[286px]">
                  <div className="flex h-[50px] items-center rounded-tl-[12px] rounded-tr-[12px] border border-[#EFEFEF] bg-white px-[11px]">
                    <span className="text-[14px] font-semibold leading-[1.3] text-black">
                      Resumen total
                    </span>
                  </div>
                  <div className="flex">
                    <div className="flex h-[50px] flex-1 items-center border border-t-0 border-[#EFEFEF] bg-white px-[11px]">
                      <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black">
                        Ganancias
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[100px] items-center justify-center border border-l-0 border-t-0 border-[#EFEFEF] bg-white px-[10px]">
                      <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black">
                        + {formatMoney(detail.totalEarnings)}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex h-[50px] flex-1 items-center border border-t-0 border-[#EFEFEF] bg-white px-[11px]">
                      <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black">
                        Deducciones
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[100px] items-center justify-center border border-l-0 border-t-0 border-[#EFEFEF] bg-white px-[10px]">
                      <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black">
                        - {formatMoney(detail.totalDeductions)}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex h-[50px] flex-1 items-center rounded-bl-[12px] border border-t-0 border-[#EFEFEF] bg-white px-[11px]">
                      <span className="text-[14px] font-medium leading-[1.2] text-black">
                        Monto total
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[100px] items-center justify-center rounded-br-[12px] border border-l-0 border-t-0 border-[#EFEFEF] bg-white px-[10px]">
                      <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black">
                        {formatMoney(detail.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex w-full flex-col gap-4 xl:w-[424px] xl:shrink-0">
            <section className="rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
              <h2 className="mb-2.5 text-[18px] font-bold leading-[1.3] text-black">
                Estado de la nómina
              </h2>
              <AdminHubSelect
                label="Estado"
                required
                value={status}
                onChange={(value) => setStatus(value as PayrollVariableStatus)}
                options={STATUS_OPTIONS}
                variant="form"
                labelBackground="#FFFFFF"
              />
            </section>

            <section className="rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
              <h2 className="mb-2.5 text-[18px] font-bold leading-[1.3] text-black">
                Notas
              </h2>
              <div className="relative w-full pt-2">
                <label
                  htmlFor="payroll-notes"
                  className="absolute left-3 top-0 z-10 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]"
                >
                  Notas
                </label>
                <textarea
                  id="payroll-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Agregar comentario o aclaración"
                  rows={8}
                  className="min-h-[209px] w-full resize-y rounded-[8px] border border-[#EFEFEF] bg-white px-4 py-3 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                />
              </div>
            </section>

            <section className="flex min-h-[200px] flex-1 flex-col justify-end rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-6 xl:min-h-[507px]">
              <div className="ml-auto flex w-max max-w-full items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/admin-hub/nominas")}
                  className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap px-3 text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:text-[#008099]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border border-[#0097B2] px-3 text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB]"
                >
                  Guardar borrador
                </button>
                <button
                  type="button"
                  onClick={handleEmitPayrollClick}
                  className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#0097B2] px-3 text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
                >
                  Emitir Nómina
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {emitModal && (
        <PayrollEmitModal
          open
          variant={emitModal}
          onClose={() => setEmitModal(null)}
          onPrimaryAction={() => {
            if (emitModal === "confirm-emit") {
              handleConfirmEmitPayroll();
            } else {
              setEmitModal(null);
            }
          }}
        />
      )}
    </div>
  );
}
