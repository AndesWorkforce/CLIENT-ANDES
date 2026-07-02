"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import AdminHubSelect from "../../components/AdminHubSelect";
import { formatBaseSalary } from "../../nominas/data/mock-contractors";
import type { PersonaDetail } from "../data/mock-persona-detail";
import { contractStartToIso } from "../data/mock-persona-detail";
import type { PersonaStatus } from "../data/mock-persona-detail";
import PersonaFormSection from "./PersonaFormSection";
import PersonaStatusBadge from "./PersonaStatusBadge";

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

const YES_NO_OPTIONS = [
  { value: "Si", label: "Si" },
  { value: "No", label: "No" },
];

const STATUS_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

function displayOptional(value: string | null): string {
  return value ?? "No especificado";
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
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [form, setForm] = useState<PersonaFormState>(() => buildFormState(detail));
  const [isEditing, setIsEditing] = useState(false);

  const viewOnly = !isEditing;

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Personas", href: "/admin-hub/personas" },
      { label: "Contratista" },
    ],
    []
  );

  function updateField<K extends keyof PersonaFormState>(key: K, value: PersonaFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleDownload() {
    addNotification("La descarga del perfil estará disponible próximamente.", "info");
  }

  function handleEditClick() {
    if (isEditing) {
      addNotification("Cambios guardados correctamente.", "success");
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
  }

  function handleCancel() {
    router.push("/admin-hub/personas");
  }

  function handleCreateContract() {
    addNotification("La creación de contrato estará disponible próximamente.", "info");
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
              {detail.countryName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleEditClick}
          className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB]"
        >
          {isEditing ? "Guardar" : "Editar"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
        >
          <Download size={20} />
          Descargar
        </button>
      </div>

      <div className="rounded-[8px] bg-white p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <PersonaFormSection title="Información General">
              <AdminHubFormField
                type="input"
                label="Nombre de Contratista"
                value={form.name}
                onChange={(value) => updateField("name", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Email Personal"
                value={form.personalEmail}
                onChange={(value) => updateField("personalEmail", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Email Laboral"
                value={form.workEmail}
                onChange={(value) => updateField("workEmail", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Teléfono"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="N° Documento"
                value={form.documentNumber}
                onChange={(value) => updateField("documentNumber", value)}
                viewOnly={viewOnly}
              />
              <AdminHubDatePicker
                label="Fecha de Nacimiento"
                value={form.birthDate}
                onChange={(value) => updateField("birthDate", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Nacionalidad"
                value={form.nationality}
                onChange={(value) => updateField("nationality", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>

            <PersonaFormSection title="Dirección de Residencia">
              <AdminHubFormField
                type="input"
                label="País"
                value={form.country}
                onChange={(value) => updateField("country", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Estado"
                value={form.state}
                onChange={(value) => updateField("state", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Ciudad"
                value={form.city}
                onChange={(value) => updateField("city", value)}
                viewOnly={viewOnly}
              />
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <AdminHubFormField
                    type="input"
                    label="Calle"
                    value={form.street}
                    onChange={(value) => updateField("street", value)}
                    viewOnly={viewOnly}
                  />
                </div>
                <div className="w-full sm:w-[140px]">
                  <AdminHubFormField
                    type="input"
                    label="Altura"
                    value={form.streetNumber}
                    onChange={(value) => updateField("streetNumber", value)}
                    viewOnly={viewOnly}
                  />
                </div>
              </div>
              <AdminHubFormField
                type="input"
                label="Código Postal"
                value={form.postalCode}
                onChange={(value) => updateField("postalCode", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>

            <PersonaFormSection title="Información Laboral">
              <AdminHubFormField
                type="input"
                label="ID Contrato"
                value={form.contractCode}
                onChange={(value) => updateField("contractCode", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Tipo de Contrato"
                value={form.contractType}
                onChange={(value) => updateField("contractType", value)}
                viewOnly={viewOnly}
              />
              <AdminHubDatePicker
                label="Fecha de inicio del contrato"
                value={form.contractStartDate}
                onChange={(value) => updateField("contractStartDate", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Posición"
                value={form.position}
                onChange={(value) => updateField("position", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Cliente"
                value={form.client}
                onChange={(value) => updateField("client", value)}
                viewOnly={viewOnly}
              />
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <AdminHubFormField
                    type="input"
                    label="Salario"
                    value={form.baseSalary}
                    onChange={(value) => updateField("baseSalary", value)}
                    viewOnly={viewOnly}
                  />
                </div>
                <div className="w-full sm:w-[180px]">
                  <AdminHubFormField
                    type="input"
                    label="Moneda"
                    value={form.currency}
                    onChange={(value) => updateField("currency", value)}
                    viewOnly={viewOnly}
                  />
                </div>
              </div>
              <AdminHubFormField
                type="input"
                label="HR Rate Holidays"
                value={form.hrRateHolidays}
                onChange={(value) => updateField("hrRateHolidays", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Bonos"
                value={form.bonusLabel}
                onChange={(value) => updateField("bonusLabel", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="IPB Balance"
                value={form.ipbBalance}
                onChange={(value) => updateField("ipbBalance", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>

            <PersonaFormSection title="Información Financiera">
              <AdminHubFormField
                type="input"
                label="País de Facturación"
                value={form.billingCountry}
                onChange={(value) => updateField("billingCountry", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Método de pago"
                value={form.paymentMethod}
                onChange={(value) => updateField("paymentMethod", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Dollar Tag"
                value={form.dollarTag}
                onChange={(value) => updateField("dollarTag", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Banco Personal"
                value={form.personalBank}
                onChange={(value) => updateField("personalBank", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Numero de cuenta bancaria personal"
                value={form.personalAccountNumber}
                onChange={(value) => updateField("personalAccountNumber", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Nombre del Banco de Facturación"
                value={form.billingBankName}
                onChange={(value) => updateField("billingBankName", value)}
                viewOnly={viewOnly}
              />
              <AdminHubFormField
                type="input"
                label="Numero de Banco de Facturación"
                value={form.billingAccountNumber}
                onChange={(value) => updateField("billingAccountNumber", value)}
                viewOnly={viewOnly}
              />
            </PersonaFormSection>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[424px]">
            <PersonaFormSection title="Estado del contratista">
              <AdminHubSelect
                label="Estado"
                required
                value={form.status}
                onChange={(value) => updateField("status", value as PersonaStatus)}
                options={STATUS_OPTIONS}
                variant="form"
                viewOnly={viewOnly}
                labelBackground="#FFFFFF"
              />
            </PersonaFormSection>

            <PersonaFormSection title="Ingresos Adicionales">
              <AdminHubFormField
                type="input"
                label="¿Como nos conoció?"
                value={form.howDidYouHear}
                onChange={(value) => updateField("howDidYouHear", value)}
                viewOnly={viewOnly}
              />
              <AdminHubSelect
                label="¿Fue recomendado?"
                required
                value={form.wasReferred}
                onChange={(value) => updateField("wasReferred", value)}
                options={YES_NO_OPTIONS}
                variant="form"
                viewOnly={viewOnly}
                labelBackground="#FFFFFF"
              />
              {form.referredBy || isEditing ? (
                <AdminHubFormField
                  type="input"
                  label="¿Por quién?"
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
                  Notas
                </label>
                <textarea
                  id="persona-notes"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  readOnly={viewOnly}
                  placeholder="Añadir nota"
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
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateContract}
                  className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
                >
                  Crear contrato
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
