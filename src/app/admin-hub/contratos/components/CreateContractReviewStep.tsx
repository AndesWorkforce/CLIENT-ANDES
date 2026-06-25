"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { NATIONALITY_OPTIONS } from "../data/mock-contract-address";
import {
  BANK_OPTIONS,
  BILLING_COUNTRY_OPTIONS,
  CLIENT_OPTIONS,
  DISCRETIONARY_BONUS_OPTIONS,
  getOptionLabel,
  HOW_DID_YOU_HEAR_OPTIONS,
  HR_RATE_HOLIDAYS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  POSITION_OPTIONS,
  YES_NO_OPTIONS,
} from "../data/mock-contract-form-options";
import {
  CONTRACT_TYPE_LABELS,
  type ContractCreationType,
  type CreateContractFormData,
} from "../data/contract-creation-types";
import { formatIsoDateToDisplay } from "../data/contract-detail-display";
import ContractFormSection from "./ContractFormSection";

interface CreateContractReviewStepProps {
  formData: CreateContractFormData;
  selectedType: ContractCreationType;
}

function ReviewField({
  label,
  value,
  required = true,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <AdminHubFormField
      type="input"
      label={label}
      required={required}
      value={value}
      onChange={() => undefined}
      readOnly
    />
  );
}

function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  if (isoDate.includes("-")) return formatIsoDateToDisplay(isoDate);
  return isoDate;
}

export default function CreateContractReviewStep({
  formData,
  selectedType,
}: CreateContractReviewStepProps) {
  const discretionaryBonusLabel = getOptionLabel(
    DISCRETIONARY_BONUS_OPTIONS,
    formData.discretionaryBonus
  );

  return (
    <div className="flex w-full max-w-[636px] flex-col gap-6">
      <h3 className="text-[22px] font-bold leading-[1.3] text-[#525252]">
        Revisá la información antes de continuar
      </h3>

      <ContractFormSection title="Información General">
        <ReviewField label="Nombre de Contratista" value={formData.nombreContratista} />
        <ReviewField label="Email Personal" value={formData.emailPersonal} />
        <ReviewField label="Email Laboral" value={formData.emailLaboral} />
        <ReviewField label="Teléfono" value={formData.telefono} />
        <ReviewField label="N° Documento" value={formData.documento} />
        <ReviewField
          label="Fecha de Nacimiento"
          value={formatDateDisplay(formData.fechaNacimiento)}
        />
        <ReviewField
          label="Nacionalidad"
          value={getOptionLabel(NATIONALITY_OPTIONS, formData.nacionalidad)}
        />
      </ContractFormSection>

      <ContractFormSection title="Dirección de Residencia">
        <ReviewField
          label="País de residencia"
          value={getOptionLabel(BILLING_COUNTRY_OPTIONS, formData.paisResidencia)}
        />
        <ReviewField label="Estado" value={formData.estado} />
        <ReviewField label="Ciudad" value={formData.ciudad} />
        <div className="flex gap-4">
          <div className="min-w-0 flex-[3]">
            <ReviewField label="Calle" value={formData.calle} />
          </div>
          <div className="min-w-0 flex-1">
            <ReviewField label="Altura" value={formData.altura} />
          </div>
        </div>
        <ReviewField label="Código Postal" value={formData.codigoPostal} />
      </ContractFormSection>

      <ContractFormSection title="Información Laboral">
        <ReviewField label="Tipo de Contrato" value={CONTRACT_TYPE_LABELS[selectedType]} />
        <ReviewField
          label="Fecha de inicio del contrato"
          value={formatDateDisplay(formData.fechaInicioContrato)}
        />
        <ReviewField
          label="Posición"
          value={getOptionLabel(POSITION_OPTIONS, formData.posicion)}
        />
        <ReviewField label="Cliente" value={getOptionLabel(CLIENT_OPTIONS, formData.cliente)} />
        <ReviewField label="Salario" value={formData.salario} />
        <ReviewField
          label="HR Rate Holidays"
          value={getOptionLabel(HR_RATE_HOLIDAYS_OPTIONS, formData.hrRateHolidays)}
        />
        <ReviewField
          label="Paid Holidays"
          value={getOptionLabel(YES_NO_OPTIONS, formData.paidHolidays)}
        />
        <ReviewField label="Discretionary Bonus" value={discretionaryBonusLabel} />
      </ContractFormSection>

      <ContractFormSection title="Información Financiera">
        <ReviewField
          label="País de Facturación"
          value={getOptionLabel(BILLING_COUNTRY_OPTIONS, formData.paisFacturacion)}
        />
        <ReviewField
          label="Metódo de pago"
          value={getOptionLabel(PAYMENT_METHOD_OPTIONS, formData.metodoPago)}
        />
        <ReviewField
          label="Dollar Tag"
          value={formData.dollarTag || "—"}
          required={false}
        />
        <ReviewField
          label="Banco Personal"
          value={
            formData.bancoPersonal
              ? getOptionLabel(BANK_OPTIONS, formData.bancoPersonal)
              : "—"
          }
          required={false}
        />
        <ReviewField
          label="Numero de Cuenta Bancaria personal"
          value={formData.numeroCuentaPersonal || "—"}
          required={false}
        />
        <ReviewField
          label="Nombre de Banco de Facturación"
          value={
            formData.bancoFacturacion
              ? getOptionLabel(BANK_OPTIONS, formData.bancoFacturacion)
              : "—"
          }
          required={false}
        />
        <ReviewField
          label="Numero de Banco de Facturación"
          value={formData.numeroBancoFacturacion || "—"}
          required={false}
        />
      </ContractFormSection>

      <ContractFormSection title="Ingresos Adicionales">
        <ReviewField
          label="¿Como nos conoció?"
          value={getOptionLabel(HOW_DID_YOU_HEAR_OPTIONS, formData.comoNosConocio)}
        />
        <div className="flex gap-2.5">
          <div className="w-[222px] shrink-0">
            <ReviewField
              label="¿Fue recomendado?"
              value={getOptionLabel(YES_NO_OPTIONS, formData.fueRecomendado)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <ReviewField
              label="¿Por quién?"
              value={formData.porQuien || "—"}
              required={false}
            />
          </div>
        </div>
        <ReviewField label="Notas" value={formData.notas || "—"} required={false} />
      </ContractFormSection>
    </div>
  );
}
