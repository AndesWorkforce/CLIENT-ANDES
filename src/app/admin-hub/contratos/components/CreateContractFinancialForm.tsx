"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { t } from "../../i18n";
import {
  BANK_OPTIONS,
  BILLING_COUNTRY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "../data/mock-contract-form-options";
import type { CreateContractFormData } from "../data/contract-creation-types";
import ContractFormSection from "./ContractFormSection";

const ARQ_APP_PAYMENT_METHOD = "ARQ App";

interface CreateContractFinancialFormProps {
  formData: CreateContractFormData;
  onChange: (data: CreateContractFormData) => void;
}

export default function CreateContractFinancialForm({
  formData,
  onChange,
}: CreateContractFinancialFormProps) {
  const showArqTag = formData.metodoPago === ARQ_APP_PAYMENT_METHOD;

  function patch(partial: Partial<CreateContractFormData>) {
    onChange({ ...formData, ...partial });
  }

  function handlePaymentMethodChange(metodoPago: string) {
    patch({
      metodoPago,
      arqTag: metodoPago === ARQ_APP_PAYMENT_METHOD ? formData.arqTag : "",
    });
  }

  const paymentOptions = PAYMENT_METHOD_OPTIONS.map((option) => ({
    ...option,
    label:
      option.value === "Transferencia bancaria"
        ? t("paymentMethod.bankTransfer")
        : option.label,
  }));

  return (
    <ContractFormSection title={t("personas.financialInfo")}>
      <AdminHubFormField
        type="select"
        label={t("personas.billingCountry")}
        value={formData.paisFacturacion}
        onChange={(paisFacturacion) => patch({ paisFacturacion })}
        options={BILLING_COUNTRY_OPTIONS}
        placeholder="Argentina"
      />
      <AdminHubFormField
        type="select"
        label={t("personas.paymentMethod")}
        value={formData.metodoPago}
        onChange={handlePaymentMethodChange}
        options={paymentOptions}
        placeholder={t("paymentMethod.bankTransfer")}
      />
      {showArqTag ? (
        <AdminHubFormField
          type="input"
          label={t("personas.dollarTag")}
          required={false}
          value={formData.arqTag}
          onChange={(arqTag) => patch({ arqTag })}
          placeholder="#juanpe"
        />
      ) : null}
      <AdminHubFormField
        type="select"
        label={t("personas.personalBank")}
        required={false}
        value={formData.bancoPersonal}
        onChange={(bancoPersonal) => patch({ bancoPersonal })}
        options={BANK_OPTIONS}
        placeholder="Galicia"
      />
      <AdminHubFormField
        type="input"
        label={t("personas.personalAccountNumber")}
        required={false}
        value={formData.numeroCuentaPersonal}
        onChange={(numeroCuentaPersonal) => patch({ numeroCuentaPersonal })}
        placeholder="AR93 2850 0412 3456 7890 1234"
      />
      <AdminHubFormField
        type="select"
        label={t("personas.billingBankName")}
        required={false}
        value={formData.bancoFacturacion}
        onChange={(bancoFacturacion) => patch({ bancoFacturacion })}
        options={BANK_OPTIONS}
        placeholder="Lean"
      />
      <AdminHubFormField
        type="input"
        label={t("personas.billingBankNumber")}
        required={false}
        value={formData.numeroBancoFacturacion}
        onChange={(numeroBancoFacturacion) => patch({ numeroBancoFacturacion })}
        placeholder="CA-984512367"
      />
    </ContractFormSection>
  );
}
