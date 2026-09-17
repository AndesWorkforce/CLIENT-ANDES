const MAX_RATE_DECIMALS = 2;

/** Máximo 2 decimales; omite ceros a la derecha (1.50 → "1.5", 1.00 → "1"). */
export function formatCountryRate(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(MAX_RATE_DECIMALS)).toString();
}

export function roundCountryRate(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(MAX_RATE_DECIMALS));
}

/** Permite teclear "1." y corta a 2 decimales. */
export function sanitizeCountryRateInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot < 0) return cleaned;
  const integerPart = cleaned.slice(0, firstDot);
  const decimalPart = cleaned.slice(firstDot + 1).replace(/\./g, "").slice(0, MAX_RATE_DECIMALS);
  return `${integerPart}.${decimalPart}`;
}
