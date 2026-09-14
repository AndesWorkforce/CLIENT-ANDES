"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { useAdminHubI18n, type AdminHubTranslate } from "../../i18n";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import AdminHubSelect from "../../components/AdminHubSelect";
import { formatBaseSalary } from "../../nominas/data/mock-contractors";
import { updatePersona } from "../actions/personas.actions";
import type { PersonaDetail, PersonaStatus } from "../types/persona-detail.types";
import {
  buildUpdatePayloadFromForm,
  contractStartToIso,
  validatePersonaForm,
} from "../utils/persona-detail.utils";
import PersonaFormSection from "./PersonaFormSection";
import PersonaStatusBadge from "./PersonaStatusBadge";
import ObjectHistorialTable from "../../historial/components/ObjectHistorialTable";

interface PersonaDetailContentProps {
  detail: PersonaDetail;
}

interface PersonaFormState {
  name: string;
  personalEmail: string;
  workEmail: string;
  phone: string;
  documentNumber: string;
  birthDate: string;
  nationality: string;
  country: string;
  state: string;
  city: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  contractCode: string;
  contractType: string;
  contractStartDate: string;
  position: string;
  client: string;
  baseSalary: string;
  currency: string;
  hrRateHolidays: string;
  bonusLabel: string;
  ipbBalance: string;
  billingCountry: string;
  paymentMethod: string;
  dollarTag: string;
  personalBank: string;
  personalAccountNumber: string;
  billingBankName: string;
  billingAccountNumber: string;
  status: PersonaStatus;
  howDidYouHear: string;
  wasReferred: string;
  referredBy: string;
  notes: string;
}

const PERSONA_VALIDATION_I18N_KEYS: Record<string, string> = {
  "El email personal no tiene un formato válido.": "personas.invalidPersonalEmail",
  "El email laboral no tiene un formato válido.": "personas.invalidWorkEmail",
  "El salario debe ser un número válido mayor o igual a 0.": "personas.invalidSalary",
};

const UNSPECIFIED_SENTINEL = "No especificado";

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

function contractTypeLabel(value: string, t: AdminHubTranslate): string {
  if (value === "Plazo fijo") return t("contractType.fixedTerm");
  if (value === "Indeterminado" || value === "Permanente") {
    return t("contractType.indefinite");
  }
  if (value === "Full Time") return t("contractType.fullTime");
  if (value === "Part Time") return t("contractType.partTime");
  return value;
}

function bonusLabel(value: string, t: AdminHubTranslate): string {
  if (value === "Media vez al mes de Diciembre") {
    return t("bonus.HALF_MONTH_ONCE_DECEMBER");
  }
  if (value === "Un mes completo en Diciembre") {
    return t("bonus.FULL_MONTH_ONCE_DECEMBER");
  }
  if (value === "Un mes en Junio y Diciembre") {
    return t("bonus.FULL_MONTH_TWICE_JUNE_DECEMBER");
  }
  if (value === "Ninguno") return t("bonus.NONE");
  return value;
}

function buildFormState(detail: PersonaDetail): PersonaFormState {
  const { profile, primaryContract } = detail;

  return {
    name: detail.name,
    personalEmail: profile.personalEmail,
    workEmail: profile.workEmail,
    phone: profile.phone,
    documentNumber: profile.documentNumber,
    birthDate: profile.birthDate,
    nationality: profile.nationality,
    country: profile.nationality,
    state: profile.state,
    city: profile.city,
    street: profile.street,
    streetNumber: profile.streetNumber,
    postalCode: profile.postalCode,
    contractCode: detail.contractCode,
    contractType: profile.contractType,
    contractStartDate: contractStartToIso(primaryContract.contractStartDate),
    position: primaryContract.position,
    client: primaryContract.client,
    baseSalary: formatBaseSalary(primaryContract.baseSalary),
    currency: profile.currency,
    hrRateHolidays: profile.hrRateHolidays.toFixed(2),
    bonusLabel: profile.bonusLabel,
    ipbBalance: profile.ipbBalance,
    billingCountry: profile.billingCountry,
    paymentMethod: profile.paymentMethod,
    dollarTag: displayOptional(profile.dollarTag),
    personalBank: displayOptional(profile.personalBank),
    personalAccountNumber: displayOptional(profile.personalAccountNumber),
    billingBankName: displayOptional(profile.billingBankName),
    billingAccountNumber: displayOptional(profile.billingAccountNumber),
    status: profile.status,
    howDidYouHear: profile.howDidYouHear,
    wasReferred: profile.wasReferred,
    referredBy: profile.referredBy ?? "",
    notes: profile.notes,
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PersonaDetailContent({ detail }: PersonaDetailContentProps) {
  const { t } = useAdminHubI18n();
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [detailState, setDetailState] = useState(detail);
  const [form, setForm] = useState<PersonaFormState>(() => buildFormState(detail));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const viewOnly = !isEditing;

  const breadcrumbItems = useMemo(
    () => [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.personas"), href: "/admin-hub/personas" },
      { label: t("breadcrumbs.contratista") },
    ],
    [t],
  );

  const yesNoOptions = useMemo(
    () => [
      { value: "Si", label: t("common.yes") },
      { value: "No", label: t("common.no") },
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: "Activo", label: t("status.persona.Activo") },
      { value: "Inactivo", label: t("status.persona.Inactivo") },
    ],
    [t],
  );

  function updateField<K extends keyof PersonaFormState>(key: K, value: PersonaFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleDownload() {
    addNotification(t("personas.downloadSoon"), "info");
  }

  async function handleEditClick() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const validationErrors = validatePersonaForm(form);
    if (validationErrors.length > 0) {
      addNotification(
        validationErrors
          .map((error) =>
            PERSONA_VALIDATION_I18N_KEYS[error]
              ? t(PERSONA_VALIDATION_I18N_KEYS[error])
              : error,
          )
          .join(" "),
        "error",
      );
      return;
    }

    setIsSaving(true);
    try {
      const result = await updatePersona(
        detailState.id,
        buildUpdatePayloadFromForm(form),
      );

      if (!result.success || !result.data) {
        addNotification(result.message || t("personas.saveError"), "error");
        return;
      }

      setDetailState(result.data);
      setForm(buildFormState(result.data));
      setIsEditing(false);
      addNotification(t("personas.saveSuccess"), "success");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    router.push("/admin-hub/personas");
  }

  function handleCreateContract() {
    addNotification(t("personas.createContractSoon"), "info");
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-wrap items-center gap-6">
        <div
          className="flex size-[79px] shrink-0 items-center justify-center rounded-full bg-[#DFFAFF] text-[24px] font-semibold text-[#0097B2]"
          aria-hidden
        >
          {getInitials(form.name)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.3] text-black">{form.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <PersonaStatusBadge status={form.status} />
            <span className="text-[16px] font-semibold leading-[1.3] text-black">
              {detailState.countryName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleEditClick}
          disabled={isSaving}
          className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? t("common.saving") : isEditing ? t("common.save") : t("common.edit")}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
        >
          <Download size={20} />
          {t("common.download")}
        </button>
      </div>

      <div className="rounded-[8px] bg-white p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <PersonaFormSection title={t("personas.generalInfo")}>
              <AdminHubFormField
                type="input"
                label={t("contratos.contractorName")}
                value={form.name}
                onChange={(value) => updateField("name", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.personalEmail")}
                value={form.personalEmail}
                onChange={(value) => updateField("personalEmail", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.workEmail")}
                value={form.workEmail}
                onChange={(value) => updateField("workEmail", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.phone")}
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.documentNumber")}
                value={form.documentNumber}
                onChange={(value) => updateField("documentNumber", value)}
                viewOnly={viewOnly}
              />
              <AdminHubDatePicker
                label={t("personas.birthDate")}
                value={form.birthDate}
                onChange={(value) => updateField("birthDate", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.nationality")}
                value={form.nationality}
                onChange={(value) => updateField("nationality", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>

            <PersonaFormSection title={t("personas.residence")}>
              <AdminHubFormField
                type="input"
                label={t("personas.countryName")}
                value={form.country}
                onChange={(value) => updateField("country", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.state")}
                value={form.state}
                onChange={(value) => updateField("state", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.city")}
                value={form.city}
                onChange={(value) => updateField("city", value)}
                viewOnly={viewOnly}
              />
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <AdminHubFormField
                    type="input"
                    label={t("personas.street")}
                    value={form.street}
                    onChange={(value) => updateField("street", value)}
                    viewOnly={viewOnly}
                  />
                </div>
                <div className="w-full sm:w-[140px]">
                  <AdminHubFormField
                    type="input"
                    label={t("personas.streetNumber")}
                    value={form.streetNumber}
                    onChange={(value) => updateField("streetNumber", value)}
                    viewOnly={viewOnly}
                  />
                </div>
              </div>
              <AdminHubFormField
                type="input"
                label={t("personas.postalCode")}
                value={form.postalCode}
                onChange={(value) => updateField("postalCode", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>

            <PersonaFormSection title={t("personas.laborInfo")}>
              <AdminHubFormField
                type="input"
                label={t("personas.contractId")}
                value={form.contractCode}
                onChange={(value) => updateField("contractCode", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.contractType")}
                value={
                  viewOnly ? contractTypeLabel(form.contractType, t) : form.contractType
                }
                onChange={(value) => updateField("contractType", value)}
                viewOnly={viewOnly}
              />
              <AdminHubDatePicker
                label={t("personas.startDate")}
                value={form.contractStartDate}
                onChange={(value) => updateField("contractStartDate", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.position")}
                value={form.position}
                onChange={(value) => updateField("position", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.client")}
                value={form.client}
                onChange={(value) => updateField("client", value)}
                viewOnly={viewOnly}
              />
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <AdminHubFormField
                    type="input"
                    label={t("personas.salary")}
                    value={form.baseSalary}
                    onChange={(value) => updateField("baseSalary", value)}
                    viewOnly={viewOnly}
                  />
                </div>
                <div className="w-full sm:w-[180px]">
                  <AdminHubFormField
                    type="input"
                    label={t("personas.currency")}
                    value={form.currency}
                    onChange={(value) => updateField("currency", value)}
                    viewOnly={viewOnly}
                  />
                </div>
              </div>
              <AdminHubFormField
                type="input"
                label={t("personas.hrRateHolidays")}
                value={form.hrRateHolidays}
                onChange={(value) => updateField("hrRateHolidays", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.paidHolidays")}
                value={viewOnly ? bonusLabel(form.bonusLabel, t) : form.bonusLabel}
                onChange={(value) => updateField("bonusLabel", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.ipbBalance")}
                value={viewOnly ? bonusLabel(form.ipbBalance, t) : form.ipbBalance}
                onChange={(value) => updateField("ipbBalance", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>

            <PersonaFormSection title={t("personas.financialInfo")}>
              <AdminHubFormField
                type="input"
                label={t("personas.billingCountry")}
                value={form.billingCountry}
                onChange={(value) => updateField("billingCountry", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.paymentMethod")}
                value={
                  viewOnly
                    ? paymentMethodLabel(form.paymentMethod, t)
                    : form.paymentMethod
                }
                onChange={(value) => updateField("paymentMethod", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.dollarTag")}
                value={optionalFieldValue(form.dollarTag, t)}
                onChange={(value) => updateField("dollarTag", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.personalBank")}
                value={optionalFieldValue(form.personalBank, t)}
                onChange={(value) => updateField("personalBank", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.personalAccountNumber")}
                value={optionalFieldValue(form.personalAccountNumber, t)}
                onChange={(value) => updateField("personalAccountNumber", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.billingBankName")}
                value={optionalFieldValue(form.billingBankName, t)}
                onChange={(value) => updateField("billingBankName", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label={t("personas.billingBankNumber")}
                value={optionalFieldValue(form.billingAccountNumber, t)}
                onChange={(value) => updateField("billingAccountNumber", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[424px]">
            <PersonaFormSection title={t("personas.contractorStatus")}>
              <AdminHubSelect
                label={t("personas.status")}
                required
                value={form.status}
                onChange={(value) => updateField("status", value as PersonaStatus)}
                options={statusOptions}
                variant="form"
                viewOnly={viewOnly}
                labelBackground="#FFFFFF"
              />
            </PersonaFormSection>

            <PersonaFormSection title={t("personas.additionalIncome")}>
              <AdminHubFormField
                type="input"
                label={t("personas.howDidYouMeetUs")}
                value={form.howDidYouHear}
                onChange={(value) => updateField("howDidYouHear", value)}
                viewOnly={viewOnly}
              />
              <AdminHubSelect
                label={t("personas.wasReferred")}
                required
                value={form.wasReferred}
                onChange={(value) => updateField("wasReferred", value)}
                options={yesNoOptions}
                variant="form"
                viewOnly={viewOnly}
                labelBackground="#FFFFFF"
              />
              {form.referredBy || isEditing ? (
                <AdminHubFormField
                  type="input"
                  label={t("personas.referredBy")}
                  value={form.referredBy}
                  onChange={(value) => updateField("referredBy", value)}
                  viewOnly={viewOnly}
                  required={false}
                />
              ) : null}
              <div className="relative w-full pt-2">
                <label
                  htmlFor="persona-notes"
                  className="absolute left-3 top-0 z-10 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]"
                >
                  {t("personas.notes")}
                </label>
                <textarea
                  id="persona-notes"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  readOnly={viewOnly}
                  placeholder={t("personas.addNote")}
                  rows={4}
                  className={`min-h-[100px] w-full resize-y rounded-[8px] border border-[#EFEFEF] bg-white px-4 py-3 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2] ${
                    viewOnly ? "cursor-default" : ""
                  }`}
                />
              </div>
            </PersonaFormSection>

            <section className="flex items-center justify-end rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleCreateContract}
                  className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
                >
                  {t("personas.createContract")}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ObjectHistorialTable
        entidadId={detailState.id}
        entidadTipo="Usuario"
        title={t("personas.changeHistory")}
      />
    </div>
  );
}
