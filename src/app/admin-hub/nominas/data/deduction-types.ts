export const DEDUCTION_TYPE_OPTIONS = [
  { value: "Ausencia", label: "Absence" },
  { value: "Other", label: "Other" },
] as const;

export type DeductionTipo = (typeof DEDUCTION_TYPE_OPTIONS)[number]["value"];
