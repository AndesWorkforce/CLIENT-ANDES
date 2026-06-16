import type { DiscretionaryBonusType } from "./mock-contract-detail";

export function formatContractSalary(ofertaSalarial: number, monedaSalario: string): string {
  const prefix = monedaSalario === "USD" ? "US $" : `${monedaSalario} `;
  return `${prefix}${ofertaSalarial.toLocaleString("es-ES")}`;
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
  return `${prefix}${Math.abs(amount).toLocaleString("es-ES")}`;
}
