import type { DiscretionaryBonusType } from "./mock-contract-detail";
import { getDiscretionaryBonusLabel } from "./contract-detail-display";
import { RESIDENCE_COUNTRIES } from "./mock-contract-address";

export const POSITION_OPTIONS = [
  { value: "Diseñador UX UI", label: "Diseñador UX UI" },
  { value: "Desarrollador Frontend", label: "Desarrollador Frontend" },
  { value: "Desarrollador Backend", label: "Desarrollador Backend" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Welcome Call", label: "Welcome Call" },
];

export const CLIENT_OPTIONS = [
  { value: "ADDS", label: "ADDS" },
  { value: "BK", label: "BK" },
  { value: "Team Andes", label: "Team Andes" },
  { value: "Lean", label: "Lean" },
];

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "ARS", label: "ARS" },
  { value: "COP", label: "COP" },
  { value: "MXN", label: "MXN" },
];

export const HR_RATE_HOLIDAYS_OPTIONS = [
  { value: "1.00", label: "1.00" },
  { value: "1.50", label: "1.50" },
  { value: "2.00", label: "2.00" },
  { value: "2.50", label: "2.50" },
];

export const BONUS_OPTIONS = [
  { value: "Bono Cumpleaños", label: "Bono Cumpleaños" },
  { value: "Bono Anual", label: "Bono Anual" },
  { value: "Sin bono", label: "Sin bono" },
];

const IPB_VALUES: DiscretionaryBonusType[] = [
  "HALF_MONTH_ONCE_DECEMBER",
  "FULL_MONTH_ONCE_DECEMBER",
  "FULL_MONTH_TWICE_JUNE_DECEMBER",
  "NONE",
];

export const DISCRETIONARY_BONUS_OPTIONS = IPB_VALUES.map((value) => ({
  value,
  label: getDiscretionaryBonusLabel(value),
}));

export const BILLING_COUNTRY_OPTIONS = RESIDENCE_COUNTRIES;

export const PAYMENT_METHOD_OPTIONS = [
  { value: "Transferencia bancaria", label: "Transferencia bancaria" },
  { value: "ARQ App", label: "ARQ App" },
  { value: "Payoneer", label: "Payoneer" },
  { value: "Wise", label: "Wise" },
];

export const BANK_OPTIONS = [
  { value: "Galicia", label: "Galicia" },
  { value: "Santander", label: "Santander" },
  { value: "BBVA", label: "BBVA" },
  { value: "Lean", label: "Lean" },
];

export const HOW_DID_YOU_HEAR_OPTIONS = [
  { value: "Linkedin", label: "Linkedin" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Referido", label: "Referido" },
  { value: "Sitio web", label: "Sitio web" },
  { value: "Otro", label: "Otro" },
];

export const YES_NO_OPTIONS = [
  { value: "Si", label: "Si" },
  { value: "No", label: "No" },
];

export function getOptionLabel(
  options: { value: string; label: string }[],
  value: string
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
