export const NOMINA_MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

/**
 * Convierte el periodo del API (ej. "2026-01") al formato de display (ej. "Enero 2026")
 */
export function apiPeriodoToDisplay(periodo: string): string {
  const [year, monthStr] = periodo.split("-");
  const monthIndex = parseInt(monthStr, 10) - 1;

  if (monthIndex < 0 || monthIndex >= NOMINA_MONTH_NAMES.length) {
    return periodo;
  }

  return `${NOMINA_MONTH_NAMES[monthIndex]} ${year}`;
}

/**
 * Convierte el periodo de display (ej. "Enero 2026") al formato del backend (ej. "2026-01")
 */
export function displayPeriodToApiPeriod(displayPeriod: string): string {
  const [monthName, yearStr] = displayPeriod.split(" ");
  const monthIndex = NOMINA_MONTH_NAMES.indexOf(monthName as (typeof NOMINA_MONTH_NAMES)[number]);
  
  if (monthIndex < 0 || !yearStr) {
    throw new Error(`Periodo inválido: ${displayPeriod}`);
  }
  
  const mes = (monthIndex + 1).toString().padStart(2, "0");
  return `${yearStr}-${mes}`;
}
