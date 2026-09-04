"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Calendar,
  CircleUser,
  Clock3,
  Download,
  Globe,
  Mail,
} from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubSelect from "../../components/AdminHubSelect";
import {
  downloadPayslip,
  emitPayroll,
  saveHorasTrabajadas,
} from "../actions/nominas.actions";
import { formatMoney } from "../data/payroll-data";
import type { PayrollDetail } from "../types/nomina-detail.types";
import type { PayrollVariableStatus } from "../data/mock-payroll-variables";
import PayrollAmountColumn from "./PayrollAmountColumn";
import PayrollDetailInfoRow from "./PayrollDetailInfoRow";
import PayrollEmitModal, { type PayrollEmitModalVariant } from "./PayrollEmitModal";
import PayrollPayslipPreviewModal from "./PayrollPayslipPreviewModal";
import PayrollPayslipPreviewThumbnail from "./PayrollPayslipPreviewThumbnail";

const STATUS_OPTIONS: { value: PayrollVariableStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

interface PayrollDetailContentProps {
  detail: PayrollDetail;
}

export default function PayrollDetailContent({ detail: initialDetail }: PayrollDetailContentProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<PayrollDetail>(initialDetail);
  const [status, setStatus] = useState<PayrollVariableStatus>(initialDetail.status);
  const [notes, setNotes] = useState(initialDetail.notes);
  const [hoursInput, setHoursInput] = useState(
    initialDetail.horasTrabajadas != null ? String(initialDetail.horasTrabajadas) : "",
  );
  const [emitModal, setEmitModal] = useState<PayrollEmitModalVariant | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [isEmitting, setIsEmitting] = useState(false);

  // Una nómina emitida es un documento oficial: no se re-emite ni se edita.
  const isEmitted = detail.desprendible != null;
  const canEmit = detail.status === "Aprobado" && !isEmitted;

  const allVariablesApproved = useMemo(
    () =>
      detail.variables.length === 0 ||
      detail.variables.every((variable) => variable.status === "Aprobado"),
    [detail.variables],
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: detail.contractorName },
    ],
    [detail.contractorName],
  );

  const hoursPreview = useMemo(() => {
    if (!detail.esHourly) return null;
    const horas = Number(hoursInput.replace(",", "."));
    const tarifa = detail.tarifaHoraria ?? detail.baseSalary;
    if (!Number.isFinite(horas) || horas < 0 || !(tarifa > 0)) {
      return { horas: 0, monto: 0, tarifa };
    }
    return {
      horas,
      tarifa,
      monto: Math.round(horas * tarifa * 100) / 100,
    };
  }, [detail.esHourly, detail.tarifaHoraria, detail.baseSalary, hoursInput]);

  const canEditHours =
    detail.esHourly && detail.status !== "Emitido";

  /**
   * Descarga el desprendible emitido. El PDF llega en base64 desde la server
   * action y se materializa como blob para disparar la descarga en el browser.
   */
  function handleDownload() {
    if (!isEmitted) {
      addNotification(
        "El desprendible se genera al emitir la nómina.",
        "info",
      );
      return;
    }

    startTransition(async () => {
      const result = await downloadPayslip(
        detail.contractId,
        detail.periodoAnioMes,
      );

      if (!result.success || !result.data) {
        addNotification(
          result.message || "No se pudo descargar el desprendible.",
          "error",
        );
        return;
      }

      const bytes = Uint8Array.from(atob(result.data.base64), (c) =>
        c.charCodeAt(0),
      );
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.filename;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  function handleSaveDraft() {
    if (detail.esHourly) {
      handleSaveHours();
      return;
    }
    addNotification("Borrador guardado correctamente.", "success");
  }

  function handleSaveHours() {
    if (!detail.esHourly) return;
    const horas = Number(hoursInput.replace(",", "."));
    if (!Number.isFinite(horas) || horas < 0) {
      addNotification("Ingresá una cantidad de horas válida (≥ 0).", "error");
      return;
    }

    startTransition(async () => {
      const result = await saveHorasTrabajadas(
        detail.contractId,
        detail.periodoAnioMes,
        horas,
      );
      if (!result.success || !result.data) {
        addNotification(result.message || "No se pudieron guardar las horas.", "error");
        return;
      }
      setDetail(result.data);
      setHoursInput(
        result.data.horasTrabajadas != null
          ? String(result.data.horasTrabajadas)
          : "",
      );
      setStatus(result.data.status);
      addNotification("Horas trabajadas guardadas.", "success");
      router.refresh();
    });
  }

  function handleEmitPayrollClick() {
    if (isEmitted) {
      addNotification(
        `La nómina ya fue emitida (${detail.desprendible?.numeroDocumento}).`,
        "info",
      );
      return;
    }

    if (detail.status !== "Aprobado") {
      addNotification(
        "Solo se puede emitir una nómina aprobada.",
        "error",
      );
      return;
    }

    if (detail.esHourly) {
      const horas = Number(hoursInput.replace(",", "."));
      if (!Number.isFinite(horas) || !(horas > 0)) {
        addNotification(
          "Cargá y guardá las horas trabajadas antes de emitir la nómina.",
          "error",
        );
        return;
      }
    }
    if (allVariablesApproved) {
      setEmitModal("confirm-emit");
    } else {
      setEmitModal("cannot-emit");
    }
  }

  async function handleConfirmEmitPayroll() {
    setIsEmitting(true);

    try {
      const result = await emitPayroll(
        detail.contractId,
        detail.periodoAnioMes,
      );

      if (!result.success || !result.data) {
        addNotification(result.message || "No se pudo emitir la nómina.", "error");
        return;
      }

      setEmitModal(null);
      setDetail((prev) => ({ ...prev, status: "Emitido", desprendible: result.data! }));
      setStatus("Emitido");
      addNotification(
        `Nómina emitida. Desprendible ${result.data.numeroDocumento} generado.`,
        "success",
      );
      router.refresh();
    } catch (error) {
      console.error("[NOMINAS] Error al emitir nómina:", error);
      addNotification("Error al emitir la nómina.", "error");
    } finally {
      setIsEmitting(false);
    }
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
            disabled={!isEmitted || isPending}
            title={
              isEmitted
                ? `Descargar ${detail.desprendible?.numeroDocumento}`
                : "El desprendible se genera al emitir la nómina"
            }
            className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={18} />
            Descargar
          </button>
        </div>
      </div>

      <div className="rounded-[8px] bg-white px-5 py-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
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
                  {detail.esHourly && (
                    <PayrollDetailInfoRow
                      icon={Clock3}
                      label="Tipo de jornada"
                      value="Hourly Time"
                    />
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
              <h2 className="mb-2.5 text-[18px] font-bold leading-[1.3] text-black">
                Base de pago
              </h2>

              {detail.esHourly && (
                <div className="mb-6 rounded-[12px] border border-[#EFEFEF] bg-[#FAFAFA] px-5 py-4">
                  <div className="mb-3 flex flex-wrap items-end gap-4">
                    <div className="relative min-w-[180px] flex-1 pt-2">
                      <label
                        htmlFor="payroll-hours"
                        className="absolute left-3 top-0 z-10 bg-[#FAFAFA] px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]"
                      >
                        Horas trabajadas
                      </label>
                      <input
                        id="payroll-hours"
                        type="number"
                        min={0}
                        step={0.25}
                        inputMode="decimal"
                        disabled={!canEditHours || isPending}
                        value={hoursInput}
                        onChange={(event) => setHoursInput(event.target.value)}
                        onBlur={() => {
                          if (canEditHours && hoursInput.trim() !== "") {
                            handleSaveHours();
                          }
                        }}
                        placeholder="0"
                        className="h-11 w-full rounded-[8px] border border-[#EFEFEF] bg-white px-4 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2] disabled:cursor-not-allowed disabled:bg-[#F5F5F5]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!canEditHours || isPending}
                      onClick={handleSaveHours}
                      className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#0097B2] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#008099] disabled:cursor-not-allowed disabled:bg-[#C8C8C8]"
                    >
                      {isPending ? "Guardando…" : "Guardar horas"}
                    </button>
                  </div>
                  {hoursPreview && (
                    <p className="text-[14px] leading-[1.3] text-[#525252]">
                      Tarifa {formatMoney(hoursPreview.tarifa)}/h × {hoursPreview.horas} h ={" "}
                      <span className="font-semibold text-black">
                        {formatMoney(hoursPreview.monto)}
                      </span>
                    </p>
                  )}
                </div>
              )}

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

          <div className="flex w-full flex-col gap-4 xl:w-[424px] xl:shrink-0 xl:self-start">
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

            <section className="flex flex-col gap-4 rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-5">
              <div className="flex flex-col gap-2">
                <h2 className="text-[14px] font-semibold leading-[1.3] text-[#525252]">
                  Previsualización
                </h2>
                <PayrollPayslipPreviewThumbnail
                  detail={detail}
                  onClick={() => setPreviewModalOpen(true)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
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
                  disabled={isPending || isEmitted}
                  className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border border-[#0097B2] px-3 text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB] disabled:opacity-60"
                >
                  Guardar borrador
                </button>
                <button
                  type="button"
                  onClick={handleEmitPayrollClick}
                  disabled={!canEmit || isEmitting}
                  title={
                    isEmitted
                      ? `Emitida como ${detail.desprendible?.numeroDocumento}`
                      : detail.status !== "Aprobado"
                        ? "Solo se puede emitir una nómina aprobada"
                        : undefined
                  }
                  className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#0097B2] px-3 text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEmitting
                    ? "Emitiendo..."
                    : isEmitted
                      ? "Nómina emitida"
                      : "Emitir Nómina"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <PayrollPayslipPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        detail={detail}
      />

      {emitModal && (
        <PayrollEmitModal
          open
          variant={emitModal}
          isLoading={isEmitting}
          onClose={() => !isEmitting && setEmitModal(null)}
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
