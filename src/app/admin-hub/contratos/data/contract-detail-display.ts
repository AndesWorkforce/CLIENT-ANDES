import type { DiscretionaryBonusType } from "../types/contrato-detail.types";

export function formatContractSalary(ofertaSalarial: number, monedaSalario: string): string {
  const prefix = monedaSalario === "USD" ? "US $" : `${monedaSalario} `;
  const formatted = ofertaSalarial.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${prefix}${formatted}`;
}

/** Parsea salarios con formato es-ES (`US $2.500` / `2.500,50`) o US (`2,500.50`). */
export function parseContractSalaryInput(value: string): number | null {
  const raw = value.replace(/[^\d.,-]/g, "");
  if (!raw) {
    return null;
  }

  let normalized = raw;
  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  if (lastComma > lastDot) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma) {
    normalized = raw.replace(/,/g, "");
  } else if (lastComma >= 0) {
    normalized = raw.replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(raw)) {
    normalized = raw.replace(/\./g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeOptionalContractField(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "no especificado") {
    return null;
  }
  return trimmed;
}

export function formatIsoDateToDisplay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export function getDiscretionaryBonusLabel(
  discretionaryBonusType: DiscretionaryBonusType | null
): string {
  switch (discretionaryBonusType) {
    case "HALF_MONTH_ONCE_DECEMBER":
      return "Media vez al mes de Diciembre";
    case "FULL_MONTH_ONCE_DECEMBER":
      return "Un mes completo en Diciembre";
    case "FULL_MONTH_TWICE_JUNE_DECEMBER":
      return "Un mes en Junio y Diciembre";
    case "NONE":
    case null:
      return "Ninguno";
    default:
      return discretionaryBonusType;
  }
}

export function formatVariableImpact(amount: number): string {
  const prefix = amount >= 0 ? "+$" : "-$";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${prefix}${formatted}`;
}
