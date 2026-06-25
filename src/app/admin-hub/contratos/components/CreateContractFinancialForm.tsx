"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import {
  BANK_OPTIONS,
  BILLING_COUNTRY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "../data/mock-contract-form-options";
import type { CreateContractFormData } from "../data/contract-creation-types";
import ContractFormSection from "./ContractFormSection";

interface CreateContractFinancialFormProps {
  formData: CreateContractFormData;
  onChange: (data: CreateContractFormData) => void;
}

export default function CreateContractFinancialForm({
  formData,
  onChange,
}: CreateContractFinancialFormProps) {
  function patch(partial: Partial<CreateContractFormData>) {
    onChange({ ...formData, ...partial });
  }

  return (
    <ContractFormSection title="Información Financiera">
      <AdminHubFormField
        type="select"
        label="País de Facturación"
        value={formData.paisFacturacion}
        onChange={(paisFacturacion) => patch({ paisFacturacion })}
        options={BILLING_COUNTRY_OPTIONS}
        placeholder="Argentina"
      />
      <AdminHubFormField
        type="select"
        label="Metódo de pago"
        value={formData.metodoPago}
        onChange={(metodoPago) => patch({ metodoPago })}
        options={PAYMENT_METHOD_OPTIONS}
        placeholder="Transferencia bancaria"
      />
      <AdminHubFormField
        type="input"
        label="Dollar Tag"
        required={false}
        value={formData.dollarTag}
        onChange={(dollarTag) => patch({ dollarTag })}
        placeholder="#juanpe"
      />
      <AdminHubFormField
        type="select"
        label="Banco Personal"
        required={false}
        value={formData.bancoPersonal}
        onChange={(bancoPersonal) => patch({ bancoPersonal })}
        options={BANK_OPTIONS}
        placeholder="Galicia"
      />
      <AdminHubFormField
        type="input"
        label="Numero de Cuenta Bancaria personal"
        required={false}
        value={formData.numeroCuentaPersonal}
        onChange={(numeroCuentaPersonal) => patch({ numeroCuentaPersonal })}
        placeholder="AR93 2850 0412 3456 7890 1234"
      />
      <AdminHubFormField
        type="select"
        label="Nombre de Banco de Facturación"
        required={false}
        value={formData.bancoFacturacion}
        onChange={(bancoFacturacion) => patch({ bancoFacturacion })}
        options={BANK_OPTIONS}
        placeholder="Lean"
      />
      <AdminHubFormField
        type="input"
        label="Numero de Banco de Facturación"
        required={false}
        value={formData.numeroBancoFacturacion}
        onChange={(numeroBancoFacturacion) => patch({ numeroBancoFacturacion })}
        placeholder="CA-984512367"
      />
    </ContractFormSection>
  );
}
