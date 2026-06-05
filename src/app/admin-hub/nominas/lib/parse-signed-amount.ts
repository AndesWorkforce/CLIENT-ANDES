/** "200" → 200, "-200" → -200. Solo el "-" inicial resta; sin signo suma. */
export function parseSignedAmountInput(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return 0;

  const isNegative = trimmed.startsWith("-");
  const digits = trimmed.replace(/[^\d]/g, "");
  const value = parseInt(digits, 10) || 0;

  return isNegative ? -value : value;
}

/** Permite dígitos y un "-" solo al inicio (ej. "-200"). */
export function sanitizeSignedAmountInput(value: string): string {
  const trimmed = value.trimStart();
  if (!trimmed) return "";

  const negative = trimmed.startsWith("-");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return negative ? "-" : "";

  return negative ? `-${digits}` : digits;
}
