"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { t } from "../../i18n";
import {
  getCityOptions,
  getStateOptions,
  RESIDENCE_COUNTRIES,
} from "../data/mock-contract-address";
import type { CreateContractFormData } from "../data/contract-creation-types";
import ContractFormSection from "./ContractFormSection";

interface CreateContractResidenceFormProps {
  formData: CreateContractFormData;
  onChange: (data: CreateContractFormData) => void;
}

export default function CreateContractResidenceForm({
  formData,
  onChange,
}: CreateContractResidenceFormProps) {
  const stateOptions = getStateOptions(formData.paisResidencia);
  const cityOptions = getCityOptions(formData.estado);

  function patch(partial: Partial<CreateContractFormData>) {
    onChange({ ...formData, ...partial });
  }

  function handleCountryChange(paisResidencia: string) {
    onChange({
      ...formData,
      paisResidencia,
      estado: "",
      ciudad: "",
    });
  }

  function handleStateChange(estado: string) {
    onChange({
      ...formData,
      estado,
      ciudad: "",
    });
  }

  return (
    <ContractFormSection title={t("personas.residence")}>
      <AdminHubFormField
        type="select"
        label={t("personas.countryName")}
        value={formData.paisResidencia}
        onChange={handleCountryChange}
        options={RESIDENCE_COUNTRIES}
        placeholder="Argentina"
      />
      <AdminHubFormField
        type="select"
        label={t("personas.state")}
        value={formData.estado}
        onChange={handleStateChange}
        options={stateOptions}
        placeholder="Buenos Aires"
      />
      <AdminHubFormField
        type="select"
        label={t("personas.city")}
        value={formData.ciudad}
        onChange={(ciudad) => patch({ ciudad })}
        options={cityOptions}
        placeholder="CABA"
      />
      <div className="flex gap-4">
        <div className="min-w-0 flex-[3]">
          <AdminHubFormField
            type="input"
            label={t("personas.street")}
            value={formData.calle}
            onChange={(calle) => patch({ calle })}
            placeholder="Gorriti"
          />
        </div>
        <div className="min-w-0 flex-1">
          <AdminHubFormField
            type="input"
            label={t("personas.streetNumber")}
            value={formData.altura}
            onChange={(altura) => patch({ altura })}
            placeholder="1254"
          />
        </div>
      </div>
      <AdminHubFormField
        type="input"
        label={t("personas.postalCode")}
        value={formData.codigoPostal}
        onChange={(codigoPostal) => patch({ codigoPostal })}
        placeholder="7600"
      />
    </ContractFormSection>
  );
}
