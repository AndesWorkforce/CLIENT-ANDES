import type { DiscretionaryBonusType } from "./mock-contract-detail";

export type ContractCreationType = "full-time" | "part-time";

export type ContractCreationStep =
  | "select-type"
  | "general-info"
  | "residence"
  | "labor-info"
  | "financial-info"
  | "additional-income"
  | "review";

export const CONTRACT_CREATION_STEP_ORDER: ContractCreationStep[] = [
  "select-type",
  "general-info",
  "residence",
  "labor-info",
  "financial-info",
  "additional-income",
  "review",
];

export const CONTRACT_CREATION_TOTAL_STEPS = 7;

export const CONTRACT_TYPE_OPTIONS: {
  id: ContractCreationType;
  label: string;
}[] = [
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
];

export const CONTRACT_TYPE_LABELS: Record<ContractCreationType, string> = {
  "full-time": "Full Time",
  "part-time": "Part Time",
};

export const PART_TIME_LOCKED_LABOR_VALUES = {
  paidHolidays: "No",
  discretionaryBonus: "NONE" as const,
  ipbBonus: "No",
};

export const CONTRACT_STEP_META: Record<
  ContractCreationStep,
  { stepNumber: number; label: string }
> = {
  "select-type": { stepNumber: 1, label: "Tipo de contrato" },
  "general-info": { stepNumber: 2, label: "Información General" },
  residence: { stepNumber: 3, label: "Dirección de Residencia" },
  "labor-info": { stepNumber: 4, label: "Información Laboral" },
  "financial-info": { stepNumber: 5, label: "Información Financiera" },
  "additional-income": { stepNumber: 6, label: "Ingresos adicionales" },
  review: { stepNumber: 7, label: "Confirmación" },
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
  fechaInicioContrato: string;
  posicion: string;
  cliente: string;
  salario: string;
  hrRateHolidays: string;
  paidHolidays: string;
  discretionaryBonus: DiscretionaryBonusType | "";
  ipbBonus: string;
  paisFacturacion: string;
  metodoPago: string;
  arqTag: string;
  bancoPersonal: string;
  numeroCuentaPersonal: string;
  bancoFacturacion: string;
  numeroBancoFacturacion: string;
  comoNosConocio: string;
  fueRecomendado: string;
  porQuien: string;
  notas: string;
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
    fechaInicioContrato: "",
    posicion: "",
    cliente: "",
    salario: "",
    hrRateHolidays: "",
    paidHolidays: "",
    discretionaryBonus: "",
    ipbBonus: "",
    paisFacturacion: "",
    metodoPago: "",
    arqTag: "",
    bancoPersonal: "",
    numeroCuentaPersonal: "",
    bancoFacturacion: "",
    numeroBancoFacturacion: "",
    comoNosConocio: "",
    fueRecomendado: "",
    porQuien: "",
    notas: "",
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

export function isLaborInfoComplete(data: CreateContractFormData): boolean {
  return Boolean(
    data.fechaInicioContrato &&
      data.posicion &&
      data.cliente &&
      data.salario.trim() &&
      data.hrRateHolidays &&
      data.paidHolidays &&
      data.discretionaryBonus &&
      data.ipbBonus
  );
}

export function isFinancialInfoComplete(data: CreateContractFormData): boolean {
  return Boolean(data.paisFacturacion && data.metodoPago);
}

export function isAdditionalIncomeComplete(data: CreateContractFormData): boolean {
  const baseComplete = Boolean(data.comoNosConocio && data.fueRecomendado);
  if (!baseComplete) return false;
  if (data.fueRecomendado === "Si") {
    return Boolean(data.porQuien.trim());
  }
  return true;
}

export function isStepComplete(
  step: ContractCreationStep,
  data: CreateContractFormData,
  selectedType: ContractCreationType | null
): boolean {
  switch (step) {
    case "select-type":
      return selectedType !== null;
    case "general-info":
      return isGeneralInfoComplete(data);
    case "residence":
      return isResidenceComplete(data);
    case "labor-info":
      return isLaborInfoComplete(data);
    case "financial-info":
      return isFinancialInfoComplete(data);
    case "additional-income":
      return isAdditionalIncomeComplete(data);
    case "review":
      return true;
    default:
      return false;
  }
}

export function getPreviousStep(step: ContractCreationStep): ContractCreationStep | null {
  const index = CONTRACT_CREATION_STEP_ORDER.indexOf(step);
  if (index <= 0) return null;
  return CONTRACT_CREATION_STEP_ORDER[index - 1];
}

export function getNextStep(step: ContractCreationStep): ContractCreationStep | null {
  const index = CONTRACT_CREATION_STEP_ORDER.indexOf(step);
  if (index < 0 || index >= CONTRACT_CREATION_STEP_ORDER.length - 1) return null;
  return CONTRACT_CREATION_STEP_ORDER[index + 1];
}
