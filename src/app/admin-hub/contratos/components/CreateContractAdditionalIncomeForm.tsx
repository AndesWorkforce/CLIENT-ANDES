"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { HOW_DID_YOU_HEAR_OPTIONS, YES_NO_OPTIONS } from "../data/mock-contract-form-options";
import type { CreateContractFormData } from "../data/contract-creation-types";
import ContractFormSection from "./ContractFormSection";

interface CreateContractAdditionalIncomeFormProps {
  formData: CreateContractFormData;
  onChange: (data: CreateContractFormData) => void;
}

export default function CreateContractAdditionalIncomeForm({
  formData,
  onChange,
}: CreateContractAdditionalIncomeFormProps) {
  function patch(partial: Partial<CreateContractFormData>) {
    onChange({ ...formData, ...partial });
  }

  function handleReferredChange(fueRecomendado: string) {
    onChange({
      ...formData,
      fueRecomendado,
      porQuien: fueRecomendado === "Si" ? formData.porQuien : "",
    });
  }

  return (
    <ContractFormSection title="Ingresos Adicionales">
      <AdminHubFormField
        type="select"
        label="¿Como nos conoció?"
        value={formData.comoNosConocio}
        onChange={(comoNosConocio) => patch({ comoNosConocio })}
        options={HOW_DID_YOU_HEAR_OPTIONS}
        placeholder="Linkedin"
      />
      <div className="flex gap-2.5">
        <div className="w-[222px] shrink-0">
          <AdminHubFormField
            type="select"
            label="¿Fue recomendado?"
            value={formData.fueRecomendado}
            onChange={handleReferredChange}
            options={YES_NO_OPTIONS}
            placeholder="Si"
          />
        </div>
        <div className="min-w-0 flex-1">
          <AdminHubFormField
            type="input"
            label="¿Por quién?"
            required={false}
            value={formData.porQuien}
            onChange={(porQuien) => patch({ porQuien })}
            placeholder="María Sanchez"
          />
        </div>
      </div>
      <div className="relative w-full pt-2">
        <label
          htmlFor="contract-notes"
          className="absolute left-3 top-0 z-10 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]"
        >
          Notas
        </label>
        <textarea
          id="contract-notes"
          value={formData.notas}
          onChange={(event) => patch({ notas: event.target.value })}
          placeholder="Añadir nota"
          rows={3}
          className="min-h-[50px] w-full resize-y rounded-[8px] border border-[#EFEFEF] bg-white px-4 py-3 text-[14px] leading-[1.3] tracking-[0.28px] text-[#343434] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
        />
      </div>
    </ContractFormSection>
  );
}
