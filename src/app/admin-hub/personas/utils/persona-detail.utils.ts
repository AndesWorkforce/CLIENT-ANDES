import type { UpdatePersonaInput } from "../actions/personas.actions";
import type { PersonaStatus } from "../types/persona-detail.types";

export function personaToDetailPath(persona: { id: string }): string {
  return `/admin-hub/personas/${persona.id}`;
}

export function contractStartToIso(contractStartDate: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(contractStartDate)) {
    return contractStartDate;
  }

  const parts = contractStartDate.split(".");
  if (parts.length !== 3) {
    return contractStartDate;
  }

  const [month, day, year] = parts;
  return `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function parseSalaryInput(value: string): number | null {
  const normalized = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validatePersonaForm(form: {
  personalEmail: string;
  workEmail: string;
  birthDate: string;
  contractStartDate: string;
  baseSalary: string;
}): string[] {
  const errors: string[] = [];

  if (!form.personalEmail.trim()) {
    errors.push("El email personal es obligatorio.");
  } else if (!EMAIL_REGEX.test(form.personalEmail.trim())) {
    errors.push("El email personal no tiene un formato válido.");
  }

  if (form.workEmail.trim() && !EMAIL_REGEX.test(form.workEmail.trim())) {
    errors.push("El email laboral no tiene un formato válido.");
  }

  if (form.birthDate && !ISO_DATE_REGEX.test(form.birthDate)) {
    errors.push("La fecha de nacimiento debe tener formato YYYY-MM-DD.");
  }

  if (form.contractStartDate && !ISO_DATE_REGEX.test(form.contractStartDate)) {
    errors.push("La fecha de inicio del contrato debe tener formato YYYY-MM-DD.");
  }

  if (form.baseSalary.trim()) {
    const salary = parseSalaryInput(form.baseSalary);
    if (salary === null || salary < 0) {
      errors.push("El salario debe ser un número válido mayor o igual a 0.");
    }
  }

  return errors;
}

export function buildUpdatePayloadFromForm(form: {
  name: string;
  personalEmail: string;
  workEmail: string;
  phone: string;
  documentNumber: string;
  birthDate: string;
  nationality: string;
  country: string;
  state: string;
  city: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  contractType: string;
  contractStartDate: string;
  position: string;
  baseSalary: string;
  currency: string;
  billingCountry: string;
  paymentMethod: string;
  dollarTag: string;
  personalBank: string;
  personalAccountNumber: string;
  billingBankName: string;
  billingAccountNumber: string;
  status: PersonaStatus;
  howDidYouHear: string;
  wasReferred: string;
  referredBy: string;
  notes: string;
  ipbBalance: string;
}): UpdatePersonaInput {
  const baseSalary = parseSalaryInput(form.baseSalary);

  return {
    name: form.name.trim(),
    personalEmail: form.personalEmail.trim(),
    workEmail: form.workEmail.trim(),
    phone: form.phone.trim(),
    documentNumber: form.documentNumber.trim(),
    birthDate: form.birthDate,
    nationality: form.nationality.trim(),
    country: form.country.trim(),
    state: form.state.trim(),
    city: form.city.trim(),
    street: form.street.trim(),
    streetNumber: form.streetNumber.trim(),
    postalCode: form.postalCode.trim(),
    contractType: form.contractType.trim(),
    contractStartDate: form.contractStartDate,
    position: form.position.trim(),
    ...(baseSalary !== null ? { baseSalary } : {}),
    currency: form.currency.trim(),
    billingCountry: form.billingCountry.trim(),
    paymentMethod: form.paymentMethod.trim(),
    dollarTag: form.dollarTag.trim(),
    personalBank: form.personalBank.trim(),
    personalAccountNumber: form.personalAccountNumber.trim(),
    billingBankName: form.billingBankName.trim(),
    billingAccountNumber: form.billingAccountNumber.trim(),
    status: form.status,
    howDidYouHear: form.howDidYouHear.trim(),
    wasReferred: form.wasReferred === "Si" ? "Si" : "No",
    referredBy: form.referredBy.trim(),
    notes: form.notes.trim(),
    ipbBalance: form.ipbBalance.trim(),
  };
}
