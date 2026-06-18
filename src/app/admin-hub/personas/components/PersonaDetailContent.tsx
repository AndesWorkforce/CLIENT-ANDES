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
import PersonaFormSection from "./PersonaFormSection";
import PersonaStatusBadge from "./PersonaStatusBadge";

interface PersonaDetailContentProps {
  detail: PersonaDetail;
}

const YES_NO_OPTIONS = [
  { value: "Si", label: "Si" },
  { value: "No", label: "No" },
];

const STATUS_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

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
  const [notes, setNotes] = useState(detail.profile.notes);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Personas", href: "/admin-hub/personas" },
      { label: "Contratista" },
    ],
    []
  );

  const { profile, primaryContract } = detail;

  function handleDownload() {
    addNotification("La descarga del perfil estará disponible próximamente.", "info");
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
          {getInitials(detail.name)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.3] text-black">{detail.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <PersonaStatusBadge status={profile.status} />
            <span className="text-[16px] font-semibold leading-[1.3] text-black">
              {detail.countryName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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
                value={detail.name}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Email Personal"
                value={profile.personalEmail}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Email Laboral"
                value={profile.workEmail}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Teléfono"
                value={profile.phone}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="N° Documento"
                value={profile.documentNumber}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubDatePicker
                label="Fecha de Nacimiento"
                value={profile.birthDate}
                onChange={() => undefined}
                disabled
              />
              <AdminHubFormField
                type="input"
                label="Nacionalidad"
                value={profile.nationality}
                onChange={() => undefined}
                readOnly
              />
            </PersonaFormSection>

            <PersonaFormSection title="Dirección de Residencia">
              <AdminHubFormField
                type="input"
                label="País"
                value={profile.nationality}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Estado"
                value={profile.state}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Ciudad"
                value={profile.city}
                onChange={() => undefined}
                readOnly
              />
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <AdminHubFormField
                    type="input"
                    label="Calle"
                    value={profile.street}
                    onChange={() => undefined}
                    readOnly
                  />
                </div>
                <div className="w-full sm:w-[140px]">
                  <AdminHubFormField
                    type="input"
                    label="Altura"
                    value={profile.streetNumber}
                    onChange={() => undefined}
                    readOnly
                  />
                </div>
              </div>
              <AdminHubFormField
                type="input"
                label="Código Postal"
                value={profile.postalCode}
                onChange={() => undefined}
                readOnly
              />
            </PersonaFormSection>

            <PersonaFormSection title="Información Laboral">
              <AdminHubFormField
                type="input"
                label="ID Contrato"
                value={detail.contractCode}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Tipo de Contrato"
                value={profile.contractType}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubDatePicker
                label="Fecha de inicio del contrato"
                value={contractStartToIso(primaryContract.contractStartDate)}
                onChange={() => undefined}
                disabled
              />
              <AdminHubFormField
                type="input"
                label="Posición"
                value={primaryContract.position}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Cliente"
                value={primaryContract.client}
                onChange={() => undefined}
                readOnly
              />
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <AdminHubFormField
                    type="input"
                    label="Salario"
                    value={formatBaseSalary(primaryContract.baseSalary)}
                    onChange={() => undefined}
                    readOnly
                  />
                </div>
                <div className="w-full sm:w-[180px]">
                  <AdminHubFormField
                    type="input"
                    label="Moneda"
                    value={profile.currency}
                    onChange={() => undefined}
                    readOnly
                  />
                </div>
              </div>
              <AdminHubFormField
                type="input"
                label="HR Rate Holidays"
                value={profile.hrRateHolidays.toFixed(2)}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Bonos"
                value={profile.bonusLabel}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="IPB Balance"
                value={profile.ipbBalance}
                onChange={() => undefined}
                readOnly
              />
            </PersonaFormSection>

            <PersonaFormSection title="Información Financiera">
              <AdminHubFormField
                type="input"
                label="País de Facturación"
                value={profile.billingCountry}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Método de pago"
                value={profile.paymentMethod}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Dollar Tag"
                value={profile.dollarTag ?? "No especificado"}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Banco Personal"
                value={profile.personalBank ?? "No especificado"}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Numero de cuenta bancaria personal"
                value={profile.personalAccountNumber ?? "No especificado"}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Nombre del Banco de Facturación"
                value={profile.billingBankName ?? "No especificado"}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubFormField
                type="input"
                label="Numero de Banco de Facturación"
                value={profile.billingAccountNumber ?? "No especificado"}
                onChange={() => undefined}
                readOnly
              />
            </PersonaFormSection>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[424px]">
            <PersonaFormSection title="Estado del contratista">
              <AdminHubSelect
                label="Estado"
                required
                value={profile.status}
                onChange={() => undefined}
                options={STATUS_OPTIONS}
                variant="form"
                disabled
                labelBackground="#FFFFFF"
              />
            </PersonaFormSection>

            <PersonaFormSection title="Ingresos Adicionales">
              <AdminHubFormField
                type="input"
                label="¿Como nos conoció?"
                value={profile.howDidYouHear}
                onChange={() => undefined}
                readOnly
              />
              <AdminHubSelect
                label="¿Fue recomendado?"
                required
                value={profile.wasReferred}
                onChange={() => undefined}
                options={YES_NO_OPTIONS}
                variant="form"
                disabled
                labelBackground="#FFFFFF"
              />
              {profile.referredBy ? (
                <AdminHubFormField
                  type="input"
                  label="¿Por quién?"
                  value={profile.referredBy}
                  onChange={() => undefined}
                  readOnly
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
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Añadir nota"
                  rows={4}
                  className="min-h-[100px] w-full resize-y rounded-[8px] border border-[#EFEFEF] bg-white px-4 py-3 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
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
