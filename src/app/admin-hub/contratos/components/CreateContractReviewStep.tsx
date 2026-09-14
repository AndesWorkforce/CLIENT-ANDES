"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { useAdminHubI18n, type AdminHubTranslate } from "../../i18n";
import { NATIONALITY_OPTIONS } from "../data/mock-contract-address";
import {
  BANK_OPTIONS,
  BILLING_COUNTRY_OPTIONS,
  CLIENT_OPTIONS,
  getOptionLabel,
  HOW_DID_YOU_HEAR_OPTIONS,
  HR_RATE_HOLIDAYS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  POSITION_OPTIONS,
  YES_NO_OPTIONS,
} from "../data/mock-contract-form-options";
import {
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

function yesNoLabel(value: string, t: AdminHubTranslate): string {
  if (value === "Si") return t("common.yes");
  if (value === "No") return t("common.no");
  return getOptionLabel(YES_NO_OPTIONS, value);
}

function paymentLabel(value: string, t: AdminHubTranslate): string {
  if (value === "Transferencia bancaria" || value === "Transferencia Bancaria") {
    return t("paymentMethod.bankTransfer");
  }
  if (value === "Dollar App") return t("paymentMethod.dollarApp");
  return getOptionLabel(PAYMENT_METHOD_OPTIONS, value);
}

function contractTypeLabel(type: ContractCreationType, t: AdminHubTranslate): string {
  return t(type === "full-time" ? "contractType.fullTime" : "contractType.partTime");
}

export default function CreateContractReviewStep({
  formData,
  selectedType,
}: CreateContractReviewStepProps) {
  const { t } = useAdminHubI18n();
  const discretionaryBonusLabel = formData.discretionaryBonus
    ? t(`bonus.${formData.discretionaryBonus}`)
    : t("common.dash");
  const dash = t("common.dash");

  return (
    <div className="flex w-full max-w-[636px] flex-col gap-6">
      <h3 className="text-[22px] font-bold leading-[1.3] text-[#525252]">
        {t("contratos.reviewHint")}
      </h3>

      <ContractFormSection title={t("personas.generalInfo")}>
        <ReviewField
          label={t("contratos.contractorName")}
          value={formData.nombreContratista}
        />
        <ReviewField label={t("personas.personalEmail")} value={formData.emailPersonal} />
        <ReviewField label={t("personas.workEmail")} value={formData.emailLaboral} />
        <ReviewField label={t("personas.phone")} value={formData.telefono} />
        <ReviewField label={t("personas.documentNumber")} value={formData.documento} />
        <ReviewField
          label={t("personas.birthDate")}
          value={formatDateDisplay(formData.fechaNacimiento)}
        />
        <ReviewField
          label={t("personas.nationality")}
          value={getOptionLabel(NATIONALITY_OPTIONS, formData.nacionalidad)}
        />
      </ContractFormSection>

      <ContractFormSection title={t("personas.residence")}>
        <ReviewField
          label={t("personas.countryName")}
          value={getOptionLabel(BILLING_COUNTRY_OPTIONS, formData.paisResidencia)}
        />
        <ReviewField label={t("personas.state")} value={formData.estado} />
        <ReviewField label={t("personas.city")} value={formData.ciudad} />
        <div className="flex gap-4">
          <div className="min-w-0 flex-[3]">
            <ReviewField label={t("personas.street")} value={formData.calle} />
          </div>
          <div className="min-w-0 flex-1">
            <ReviewField label={t("personas.streetNumber")} value={formData.altura} />
          </div>
        </div>
        <ReviewField label={t("personas.postalCode")} value={formData.codigoPostal} />
      </ContractFormSection>

      <ContractFormSection title={t("personas.laborInfo")}>
        <ReviewField
          label={t("personas.contractType")}
          value={contractTypeLabel(selectedType, t)}
        />
        <ReviewField
          label={t("personas.startDate")}
          value={formatDateDisplay(formData.fechaInicioContrato)}
        />
        <ReviewField
          label={t("personas.position")}
          value={getOptionLabel(POSITION_OPTIONS, formData.posicion)}
        />
        <ReviewField
          label={t("personas.client")}
          value={getOptionLabel(CLIENT_OPTIONS, formData.cliente)}
        />
        <ReviewField label={t("personas.salary")} value={formData.salario} />
        <ReviewField
          label={t("personas.hrRateHolidays")}
          value={getOptionLabel(HR_RATE_HOLIDAYS_OPTIONS, formData.hrRateHolidays)}
        />
        <ReviewField
          label={t("personas.paidHolidays")}
          value={yesNoLabel(formData.paidHolidays, t)}
        />
        <ReviewField label={t("personas.ipbBalance")} value={discretionaryBonusLabel} />
        <ReviewField
          label={t("personas.ipbBalance")}
          value={yesNoLabel(formData.ipbBonus, t)}
        />
      </ContractFormSection>

      <ContractFormSection title={t("personas.financialInfo")}>
        <ReviewField
          label={t("personas.billingCountry")}
          value={getOptionLabel(BILLING_COUNTRY_OPTIONS, formData.paisFacturacion)}
        />
        <ReviewField
          label={t("personas.paymentMethod")}
          value={paymentLabel(formData.metodoPago, t)}
        />
        {formData.metodoPago === "ARQ App" ? (
          <ReviewField
            label={t("personas.dollarTag")}
            value={formData.arqTag || dash}
            required={false}
          />
        ) : null}
        <ReviewField
          label={t("personas.personalBank")}
          value={
            formData.bancoPersonal
              ? getOptionLabel(BANK_OPTIONS, formData.bancoPersonal)
              : dash
          }
          required={false}
        />
        <ReviewField
          label={t("personas.personalAccountNumber")}
          value={formData.numeroCuentaPersonal || dash}
          required={false}
        />
        <ReviewField
          label={t("personas.billingBankName")}
          value={
            formData.bancoFacturacion
              ? getOptionLabel(BANK_OPTIONS, formData.bancoFacturacion)
              : dash
          }
          required={false}
        />
        <ReviewField
          label={t("personas.billingBankNumber")}
          value={formData.numeroBancoFacturacion || dash}
          required={false}
        />
      </ContractFormSection>

      <ContractFormSection title={t("personas.additionalIncome")}>
        <ReviewField
          label={t("personas.howDidYouMeetUs")}
          value={getOptionLabel(HOW_DID_YOU_HEAR_OPTIONS, formData.comoNosConocio)}
        />
        <div className="flex gap-2.5">
          <div className="w-[222px] shrink-0">
            <ReviewField
              label={t("personas.wasReferred")}
              value={yesNoLabel(formData.fueRecomendado, t)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <ReviewField
              label={t("personas.referredBy")}
              value={formData.porQuien || dash}
              required={false}
            />
          </div>
        </div>
        <ReviewField
          label={t("personas.notes")}
          value={formData.notas || dash}
          required={false}
        />
      </ContractFormSection>
    </div>
  );
}
