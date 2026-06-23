"use client";

import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import { NATIONALITY_OPTIONS } from "../data/mock-contract-address";
import type { CreateContractFormData } from "../data/contract-creation-types";
import ContractFormSection from "./ContractFormSection";

interface CreateContractGeneralInfoFormProps {
  formData: CreateContractFormData;
  onChange: (data: CreateContractFormData) => void;
}

export default function CreateContractGeneralInfoForm({
  formData,
  onChange,
}: CreateContractGeneralInfoFormProps) {
  function patch(partial: Partial<CreateContractFormData>) {
    onChange({ ...formData, ...partial });
  }

  return (
    <ContractFormSection title="Información General">
      <AdminHubFormField
        type="input"
        label="Nombre de Contratista"
        value={formData.nombreContratista}
        onChange={(nombreContratista) => patch({ nombreContratista })}
        placeholder="Juan Perez"
      />
      <AdminHubFormField
        type="input"
        label="Email Personal"
        value={formData.emailPersonal}
        onChange={(emailPersonal) => patch({ emailPersonal })}
        placeholder="Jperez@gmail.com"
        inputType="email"
      />
      <AdminHubFormField
        type="input"
        label="Email Laboral"
        value={formData.emailLaboral}
        onChange={(emailLaboral) => patch({ emailLaboral })}
        placeholder="Jperez@teamandes.com"
        inputType="email"
      />
      <AdminHubFormField
        type="input"
        label="Teléfono"
        value={formData.telefono}
        onChange={(telefono) => patch({ telefono })}
        placeholder="+54 011 452 1452"
        inputType="tel"
      />
      <AdminHubFormField
        type="input"
        label="N° Documento"
        value={formData.documento}
        onChange={(documento) => patch({ documento })}
        placeholder="38.335.339"
      />
      <AdminHubDatePicker
        label="Fecha de Nacimiento"
        required
        value={formData.fechaNacimiento}
        onChange={(fechaNacimiento) => patch({ fechaNacimiento })}
        placeholder="03.03.1996"
        maxDate={new Date().toISOString().slice(0, 10)}
      />
      <AdminHubFormField
        type="select"
        label="Nacionalidad"
        value={formData.nacionalidad}
        onChange={(nacionalidad) => patch({ nacionalidad })}
        options={NATIONALITY_OPTIONS}
        placeholder="Argentina"
      />
    </ContractFormSection>
  );
}
