"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { t, type AdminHubTranslate } from "../../i18n";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import { PAYROLL_VARIABLE_TABS } from "../../nominas/data/mock-payroll-variables";
import { formatMoney } from "../../nominas/data/payroll-data";
import {
  updateContrato,
  type UpdateContratoInput,
} from "../actions/contratos.actions";
import {
  formatContractSalary,
  formatVariableImpact,
  getDiscretionaryBonusLabel,
  normalizeOptionalContractField,
  parseContractSalaryInput,
} from "../data/contract-detail-display";
import type { ContratoDetail } from "../types/contrato-detail.types";
import { personaToDetailPath } from "../../personas/utils/persona-detail.utils";
import ObjectHistorialTable from "../../historial/components/ObjectHistorialTable";
import ContractApprovalBadge from "./ContractApprovalBadge";
import ContractInfoCard from "./ContractInfoCard";

interface ContractDetailContentProps {
  detail: ContratoDetail;
}

type ContractVariableTab = (typeof PAYROLL_VARIABLE_TABS)[number]["key"];
type EditableSection = "general" | "residence" | "labor" | "financial";

interface ContractFormState {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  pais: string;
  estadoResidencia: string;
  ciudadResidencia: string;
  direccionResidencia: string;
  idContrato: string;
  fechaInicioContrato: string;
  fechaUltimaModificacionContrato: string;
  puestoTrabajo: string;
  empresaNombre: string;
  salario: string;
  tarifaHrNacional: string;
  bonusLabel: string;
  ipbBalance: string;
  paisFacturacion: string;
  metodoPago: string;
  dollarTag: string;
  bancoNombre: string;
  numeroCuentaBancaria: string;
  bancoFacturacionNombre: string;
  numeroCuentaFacturacion: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const UNSPECIFIED_SENTINEL = "No especificado";

const VARIABLE_TAB_I18N: Record<ContractVariableTab, string> = {
  todos: "nominas.tabs.all",
  overtimes: "nominas.tabs.overtimes",
  holidays: "nominas.tabs.holidays",
  deducciones: "nominas.tabs.deductions",
  incomeVariables: "nominas.tabs.incomeVariables",
};

function displayOptional(value: string | null): string {
  return value ?? UNSPECIFIED_SENTINEL;
}

function optionalFieldValue(value: string, t: AdminHubTranslate): string {
  if (!value || value === UNSPECIFIED_SENTINEL) {
    return t("common.notSpecified");
  }
  return value;
}

function paymentMethodLabel(value: string, t: AdminHubTranslate): string {
  if (value === "Dollar App") return t("paymentMethod.dollarApp");
  if (value === "Transferencia Bancaria" || value === "Transferencia bancaria") {
    return t("paymentMethod.bankTransfer");
  }
  if (value === "No Especifica") return t("paymentMethod.unspecified");
  return value;
}

function buildContractFormState(detail: ContratoDetail): ContractFormState {
  return {
    nombreCompleto: detail.nombreCompleto,
    correo: detail.correo,
    telefono: detail.telefono,
    documentoIdentidad: detail.documentoIdentidad,
    fechaNacimiento: detail.fechaNacimiento,
    pais: detail.paisNombre,
    estadoResidencia: detail.estadoResidencia,
    ciudadResidencia: detail.ciudadResidencia,
    direccionResidencia: detail.direccionResidencia,
    idContrato: detail.id,
    fechaInicioContrato: detail.fechaInicioContrato,
    fechaUltimaModificacionContrato: detail.fechaUltimaModificacionContrato,
    puestoTrabajo: detail.puestoTrabajo,
    empresaNombre: detail.empresaNombre,
    salario: formatContractSalary(detail.ofertaSalarial, detail.monedaSalario),
    tarifaHrNacional: detail.tarifaHrNacional.toFixed(1),
    bonusLabel: detail.bonusLabel,
    ipbBalance: getDiscretionaryBonusLabel(detail.discretionaryBonusType),
    paisFacturacion: detail.paisFacturacionNombre,
    metodoPago: detail.metodoPago,
    dollarTag: displayOptional(detail.dollarTag),
    bancoNombre: displayOptional(detail.bancoNombre),
    numeroCuentaBancaria: displayOptional(detail.numeroCuentaBancaria),
    bancoFacturacionNombre: displayOptional(detail.bancoFacturacionNombre),
    numeroCuentaFacturacion: displayOptional(detail.numeroCuentaFacturacion),
  };
}

function buildSectionPayload(
  section: EditableSection,
  form: ContractFormState,
  detail: ContratoDetail,
): { payload?: UpdateContratoInput; error?: string } {
  if (section === "general") {
    if (!form.nombreCompleto.trim()) {
      return { error: "El nombre completo es obligatorio." };
    }
    if (!form.correo.trim()) {
      return { error: "El email es obligatorio." };
    }
    if (!EMAIL_REGEX.test(form.correo.trim())) {
      return { error: "El email no tiene un formato válido." };
    }
    if (form.fechaNacimiento && !ISO_DATE_REGEX.test(form.fechaNacimiento)) {
      return { error: "La fecha de nacimiento debe tener formato YYYY-MM-DD." };
    }

    return {
      payload: {
        nombreCompleto: form.nombreCompleto.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        documentoIdentidad: form.documentoIdentidad.trim(),
        fechaNacimiento: form.fechaNacimiento || undefined,
        paisNombre: form.pais.trim(),
      },
    };
  }

  if (section === "residence") {
    return {
      payload: {
        paisNombre: form.pais.trim(),
        estadoResidencia: form.estadoResidencia.trim(),
        ciudadResidencia: form.ciudadResidencia.trim(),
        direccionResidencia: form.direccionResidencia.trim(),
      },
    };
  }

  if (section === "labor") {
    const ofertaSalarial = parseContractSalaryInput(form.salario);
    if (ofertaSalarial === null || ofertaSalarial < 0) {
      return { error: "El salario debe ser un número válido mayor o igual a 0." };
    }

    return {
      payload: {
        ofertaSalarial,
        monedaSalario: detail.monedaSalario,
      },
    };
  }

  return {
    payload: {
      paisFacturacion: form.paisFacturacion.trim(),
      metodoPago: form.metodoPago.trim(),
      dollarTag: normalizeOptionalContractField(form.dollarTag),
      bancoNombre: normalizeOptionalContractField(form.bancoNombre),
      numeroCuentaBancaria: normalizeOptionalContractField(form.numeroCuentaBancaria),
      numeroCuentaFacturacion: normalizeOptionalContractField(form.numeroCuentaFacturacion),
    },
  };
}

export default function ContractDetailContent({ detail }: ContractDetailContentProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [detailState, setDetailState] = useState(detail);
  const [form, setForm] = useState<ContractFormState>(() => buildContractFormState(detail));
  const [editingSections, setEditingSections] = useState<Record<EditableSection, boolean>>({
    general: false,
    residence: false,
    labor: false,
    financial: false,
  });
  const [savingSection, setSavingSection] = useState<EditableSection | null>(null);
  const [activeVariableTab, setActiveVariableTab] = useState<ContractVariableTab>("todos");
  const [selectedPayrollHistoryIds, setSelectedPayrollHistoryIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedVariableIds, setSelectedVariableIds] = useState<Set<string>>(new Set());

  const checkboxClass = "size-4 rounded border-[#EFEFEF] accent-[#0097B2]";

  const breadcrumbItems = useMemo(
    () => [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.contratos"), href: "/admin-hub/contratos" },
      { label: `${t("breadcrumbs.contractDetail")} - ${detailState.codigoContrato}` },
    ],
    [detailState.codigoContrato, t],
  );

  const filteredVariables = useMemo(() => {
    if (activeVariableTab === "todos") return detailState.variablesNomina;
    return detailState.variablesNomina.filter(
      (variable) => variable.categoria === activeVariableTab
    );
  }, [activeVariableTab, detailState.variablesNomina]);

  const payrollTotal = useMemo(
    () => detailState.historialNomina.reduce((sum, row) => sum + row.totalPagado, 0),
    [detailState.historialNomina]
  );

  const allPayrollHistorySelected =
    detailState.historialNomina.length > 0 &&
    detailState.historialNomina.every((row) => selectedPayrollHistoryIds.has(row.id));

  const allVariablesSelected =
    filteredVariables.length > 0 &&
    filteredVariables.every((variable) => selectedVariableIds.has(variable.id));

  function togglePayrollHistoryAll() {
    if (allPayrollHistorySelected) {
      setSelectedPayrollHistoryIds(new Set());
    } else {
      setSelectedPayrollHistoryIds(new Set(detailState.historialNomina.map((row) => row.id)));
    }
  }

  function togglePayrollHistoryOne(id: string) {
    setSelectedPayrollHistoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleVariablesAll() {
    if (allVariablesSelected) {
      setSelectedVariableIds((prev) => {
        const next = new Set(prev);
        filteredVariables.forEach((variable) => next.delete(variable.id));
        return next;
      });
    } else {
      setSelectedVariableIds((prev) => {
        const next = new Set(prev);
        filteredVariables.forEach((variable) => next.add(variable.id));
        return next;
      });
    }
  }

  function toggleVariableOne(id: string) {
    setSelectedVariableIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateField<K extends keyof ContractFormState>(key: K, value: ContractFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function toggleSectionEdit(section: EditableSection) {
    if (savingSection) {
      return;
    }

    if (!editingSections[section]) {
      if (section === "labor") {
        setForm((prev) => ({
          ...prev,
          salario: String(detailState.ofertaSalarial),
        }));
      }
      setEditingSections((prev) => ({ ...prev, [section]: true }));
      return;
    }

    const { payload, error } = buildSectionPayload(section, form, detailState);
    if (error || !payload) {
      const validationKeys: Record<string, string> = {
        "El nombre completo es obligatorio.": "contratos.fullNameRequired",
        "El email es obligatorio.": "contratos.emailRequired",
        "El email no tiene un formato válido.": "contratos.invalidEmail",
        "La fecha de nacimiento debe tener formato YYYY-MM-DD.": "contratos.invalidBirthDate",
        "El salario debe ser un número válido mayor o igual a 0.": "personas.invalidSalary",
      };
      const translatedError = error
        ? t(validationKeys[error] ?? error)
        : undefined;
      addNotification(translatedError ?? t("personas.saveError"), "error");
      return;
    }

    setSavingSection(section);
    try {
      const result = await updateContrato(detailState.id, payload);
      if (!result.success || !result.data) {
        addNotification(result.message || t("personas.saveError"), "error");
        return;
      }

      setDetailState(result.data);
      setForm(buildContractFormState(result.data));
      setEditingSections((prev) => ({ ...prev, [section]: false }));
      addNotification(t("personas.saveSuccess"), "success");
      router.refresh();
    } finally {
      setSavingSection(null);
    }
  }

  function handleExport() {
    addNotification(t("contratos.exportSoon"), "info");
  }

  function handleGoToPayrollVariables() {
    const params = new URLSearchParams({ contractor: detailState.nombreCompleto });
    router.push(`/admin-hub/nominas/variables?${params.toString()}`);
  }

  function handleGoToProfile() {
    router.push(personaToDetailPath({ id: detailState.usuarioId }));
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold leading-[1.3] text-black">
          {t("breadcrumbs.contractDetail")} - {detailState.codigoContrato}
        </h1>
        <p className="text-[16px] leading-[1.3] text-[#343434]">
          {detailState.nombreCompleto} - {detailState.puestoTrabajo}
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
        >
          <Download size={20} />
          {t("common.export")}
        </button>
        <button
          type="button"
          onClick={handleGoToProfile}
          className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
        >
          {t("contratos.goToProfile")}
        </button>
      </div>

      <div className="flex flex-col gap-[18px]">
        <div className="grid gap-[18px] lg:grid-cols-2">
          <ContractInfoCard
            title={t("personas.generalInfo")}
            isEditing={editingSections.general}
            isSaving={savingSection === "general"}
            onEditClick={() => void toggleSectionEdit("general")}
          >
            <AdminHubFormField
              type="input"
              label={t("contratos.contractorName")}
              value={form.nombreCompleto}
              onChange={(value) => updateField("nombreCompleto", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.personalEmail")}
              value={form.correo}
              onChange={(value) => updateField("correo", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.phone")}
              value={form.telefono}
              onChange={(value) => updateField("telefono", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.documentNumber")}
              value={form.documentoIdentidad}
              onChange={(value) => updateField("documentoIdentidad", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubDatePicker
              label={t("personas.birthDate")}
              value={form.fechaNacimiento}
              onChange={(value) => updateField("fechaNacimiento", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.countryName")}
              value={form.pais}
              onChange={(value) => updateField("pais", value)}
              viewOnly={!editingSections.general}
            />
          </ContractInfoCard>

          <ContractInfoCard
            title={t("personas.residence")}
            isEditing={editingSections.residence}
            isSaving={savingSection === "residence"}
            onEditClick={() => void toggleSectionEdit("residence")}
          >
            <AdminHubFormField
              type="input"
              label={t("personas.countryName")}
              value={form.pais}
              onChange={(value) => updateField("pais", value)}
              viewOnly={!editingSections.residence}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.state")}
              value={form.estadoResidencia}
              onChange={(value) => updateField("estadoResidencia", value)}
              viewOnly={!editingSections.residence}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.city")}
              value={form.ciudadResidencia}
              onChange={(value) => updateField("ciudadResidencia", value)}
              viewOnly={!editingSections.residence}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.street")}
              value={form.direccionResidencia}
              onChange={(value) => updateField("direccionResidencia", value)}
              viewOnly={!editingSections.residence}
            />
          </ContractInfoCard>
        </div>

        <div className="grid gap-[18px] lg:grid-cols-2">
          <ContractInfoCard
            title={t("personas.laborInfo")}
            isEditing={editingSections.labor}
            isSaving={savingSection === "labor"}
            onEditClick={() => void toggleSectionEdit("labor")}
          >
            <AdminHubFormField
              type="input"
              label={t("personas.contractId")}
              value={form.idContrato}
              onChange={(value) => updateField("idContrato", value)}
              viewOnly
            />
            <AdminHubDatePicker
              label={t("personas.startDate")}
              value={form.fechaInicioContrato}
              onChange={(value) => updateField("fechaInicioContrato", value)}
              viewOnly
            />
            <AdminHubDatePicker
              label={t("personas.startDate")}
              value={form.fechaUltimaModificacionContrato}
              onChange={(value) => updateField("fechaUltimaModificacionContrato", value)}
              viewOnly
            />
            <AdminHubFormField
              type="input"
              label={t("personas.position")}
              value={form.puestoTrabajo}
              onChange={(value) => updateField("puestoTrabajo", value)}
              viewOnly
            />
            <AdminHubFormField
              type="input"
              label={t("personas.client")}
              value={form.empresaNombre}
              onChange={(value) => updateField("empresaNombre", value)}
              viewOnly
            />
            <AdminHubFormField
              type="input"
              label={t("personas.salary")}
              value={form.salario}
              onChange={(value) => updateField("salario", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.hrRateHolidays")}
              value={form.tarifaHrNacional}
              onChange={(value) => updateField("tarifaHrNacional", value)}
              viewOnly
            />
            <AdminHubFormField
              type="input"
              label={t("personas.paidHolidays")}
              value={form.bonusLabel}
              onChange={(value) => updateField("bonusLabel", value)}
              viewOnly
            />
            <AdminHubFormField
              type="input"
              label={t("personas.ipbBalance")}
              value={
                detailState.discretionaryBonusType
                  ? t(`bonus.${detailState.discretionaryBonusType}`)
                  : t("bonus.NONE")
              }
              onChange={(value) => updateField("ipbBalance", value)}
              viewOnly
            />
          </ContractInfoCard>

          <ContractInfoCard
            title={t("personas.financialInfo")}
            isEditing={editingSections.financial}
            isSaving={savingSection === "financial"}
            onEditClick={() => void toggleSectionEdit("financial")}
          >
            <AdminHubFormField
              type="input"
              label={t("personas.billingCountry")}
              value={form.paisFacturacion}
              onChange={(value) => updateField("paisFacturacion", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.paymentMethod")}
              value={
                editingSections.financial
                  ? form.metodoPago
                  : paymentMethodLabel(form.metodoPago, t)
              }
              onChange={(value) => updateField("metodoPago", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.dollarTag")}
              required={false}
              value={optionalFieldValue(form.dollarTag, t)}
              onChange={(value) => updateField("dollarTag", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.personalBank")}
              required={false}
              value={optionalFieldValue(form.bancoNombre, t)}
              onChange={(value) => updateField("bancoNombre", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.personalAccountNumber")}
              required={false}
              value={optionalFieldValue(form.numeroCuentaBancaria, t)}
              onChange={(value) => updateField("numeroCuentaBancaria", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label={t("personas.billingBankName")}
              required={false}
              value={optionalFieldValue(form.bancoFacturacionNombre, t)}
              onChange={(value) => updateField("bancoFacturacionNombre", value)}
              viewOnly
            />
            <AdminHubFormField
              type="input"
              label={t("personas.billingBankNumber")}
              required={false}
              value={optionalFieldValue(form.numeroCuentaFacturacion, t)}
              onChange={(value) => updateField("numeroCuentaFacturacion", value)}
              viewOnly={!editingSections.financial}
            />
          </ContractInfoCard>
        </div>

        <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-5 py-6">
          <h2 className="mb-[15px] text-[18px] font-bold leading-[1.3] text-black">
            {t("contratos.payrollHistory")}
          </h2>

          <AdminHubTableShell variant="nested">
            <table className="w-full min-w-[700px] border-collapse bg-white">
              <thead>
                <tr className="border-b border-[#EFEFEF]">
                  <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
                    <input
                      type="checkbox"
                      checked={allPayrollHistorySelected}
                      onChange={togglePayrollHistoryAll}
                      className={checkboxClass}
                      aria-label={t("common.selectAll")}
                    />
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("nominas.period")}
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("contratos.totalPaid")}
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("contratos.status")}
                  </th>
                  <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
                </tr>
              </thead>
              <tbody>
                {detailState.historialNomina.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-[14px] text-[#858585]"
                    >
                      {t("contratos.emptyPayrolls")}
                    </td>
                  </tr>
                ) : (
                  detailState.historialNomina.map((row) => (
                  <tr key={row.id} className={ADMIN_HUB_TABLE_ROW}>
                    <td className="px-6 py-6">
                      <input
                        type="checkbox"
                        checked={selectedPayrollHistoryIds.has(row.id)}
                        onChange={() => togglePayrollHistoryOne(row.id)}
                        className={checkboxClass}
                        aria-label={`${t("common.select")} ${row.periodo}`}
                      />
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {row.periodo}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {formatMoney(row.totalPagado)}
                    </td>
                    <td className="px-3 py-6">
                      <ContractApprovalBadge status={row.estado} />
                    </td>
                    <td className="px-6 py-6" />
                  </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#EFEFEF]">
                  <td className="rounded-bl-[12px] bg-white px-6 py-6" />
                  <td className="bg-white px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    Total
                  </td>
                  <td className="bg-white px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    {formatMoney(payrollTotal)}
                  </td>
                  <td colSpan={2} className="rounded-br-[12px] bg-white px-3 py-6" />
                </tr>
              </tfoot>
            </table>
          </AdminHubTableShell>
        </section>

        <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-5 py-6">
          <div className="mb-[15px] flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold leading-[1.3] text-black">
              {t("contratos.payrollVariable")}
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGoToPayrollVariables}
                className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
              >
                {t("common.go")}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
              >
                <Download size={20} />
                {t("common.export")}
              </button>
            </div>
          </div>

          <div className="mb-6 border-b border-[#EFEFEF]">
            <div className="flex flex-wrap gap-[38px]">
              {PAYROLL_VARIABLE_TABS.map((tab) => {
                const isActive = activeVariableTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveVariableTab(tab.key)}
                    className={`flex flex-col items-center gap-3.5 pb-0 text-[14px] font-medium leading-[1.2] transition-colors ${
                      isActive ? "text-[#0097B2]" : "text-[#858585] hover:text-[#0097B2]"
                    }`}
                  >
                    {t(VARIABLE_TAB_I18N[tab.key])}
                    {isActive ? (
                      <span className="h-0.5 w-full rounded-full bg-[#0097B2]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <AdminHubTableShell variant="nested">
            <table className="w-full min-w-[900px] border-collapse bg-white">
              <thead>
                <tr className="border-b border-[#EFEFEF]">
                  <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
                    <input
                      type="checkbox"
                      checked={allVariablesSelected}
                      onChange={toggleVariablesAll}
                      className={checkboxClass}
                      aria-label={t("common.selectAll")}
                    />
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("nominas.period")}
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("contratos.type")}
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("contratos.impact")}
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("pagos.description")}
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    {t("contratos.status")}
                  </th>
                  <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
                </tr>
              </thead>
              <tbody>
                {filteredVariables.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-[14px] text-[#858585]"
                    >
                      {t("contratos.emptyVariables")}
                    </td>
                  </tr>
                ) : (
                  filteredVariables.map((variable) => (
                  <tr key={variable.id} className={ADMIN_HUB_TABLE_ROW}>
                    <td className="px-6 py-6">
                      <input
                        type="checkbox"
                        checked={selectedVariableIds.has(variable.id)}
                        onChange={() => toggleVariableOne(variable.id)}
                        className={checkboxClass}
                        aria-label={`${t("common.select")} ${variable.tipo} — ${variable.periodo}`}
                      />
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {variable.periodo}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {t(`nominas.types.${variable.tipo}`)}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {formatVariableImpact(variable.impacto)}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {variable.descripcion}
                    </td>
                    <td className="px-3 py-6">
                      <ContractApprovalBadge status={variable.estado} />
                    </td>
                    <td className="px-6 py-6" />
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </AdminHubTableShell>
        </section>

        <ObjectHistorialTable
          entidadId={detailState.id}
          title={t("contratos.changeHistory")}
        />
      </div>
    </div>
  );
}
