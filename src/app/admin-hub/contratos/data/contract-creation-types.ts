export type ContractCreationType =
  | "permanente"
  | "por-periodo"
  | "por-proyecto"
  | "contractor-freelance";

export type ContractCreationStep = "select-type" | "general-info" | "residence";

export const CONTRACT_CREATION_TOTAL_STEPS = 7;

export const CONTRACT_TYPE_OPTIONS: {
  id: ContractCreationType;
  label: string;
}[] = [
  { id: "permanente", label: "Permanente" },
  { id: "por-periodo", label: "Por periodo" },
  { id: "por-proyecto", label: "Por proyecto" },
  { id: "contractor-freelance", label: "Contractor / Freelance" },
];

export const CONTRACT_TYPE_LABELS: Record<ContractCreationType, string> = {
  permanente: "Permanente",
  "por-periodo": "Por periodo",
  "por-proyecto": "Por proyecto",
  "contractor-freelance": "Contractor / Freelance",
};

export const CONTRACT_STEP_META: Record<
  ContractCreationStep,
  { stepNumber: number; label: string }
> = {
  "select-type": { stepNumber: 1, label: "Tipo de contrato" },
  "general-info": { stepNumber: 2, label: "Información General" },
  residence: { stepNumber: 3, label: "Dirección de Residencia" },
};

export interface CreateContractFormData {
  nombreContratista: string;
  emailPersonal: string;
  emailLaboral: string;
  telefono: string;
  documento: string;
  fechaNacimiento: string;
  nacionalidad: string;
  paisResidencia: string;
  estado: string;
  ciudad: string;
  calle: string;
  altura: string;
  codigoPostal: string;
}

export function emptyCreateContractForm(): CreateContractFormData {
  return {
    nombreContratista: "",
    emailPersonal: "",
    emailLaboral: "",
    telefono: "",
    documento: "",
    fechaNacimiento: "",
    nacionalidad: "",
    paisResidencia: "",
    estado: "",
    ciudad: "",
    calle: "",
    altura: "",
    codigoPostal: "",
  };
}

export function isGeneralInfoComplete(data: CreateContractFormData): boolean {
  return Boolean(
    data.nombreContratista.trim() &&
      data.emailPersonal.trim() &&
      data.emailLaboral.trim() &&
      data.telefono.trim() &&
      data.documento.trim() &&
      data.fechaNacimiento &&
      data.nacionalidad
  );
}

export function isResidenceComplete(data: CreateContractFormData): boolean {
  return Boolean(
    data.paisResidencia &&
      data.estado &&
      data.ciudad &&
      data.calle.trim() &&
      data.altura.trim() &&
      data.codigoPostal.trim()
  );
}
