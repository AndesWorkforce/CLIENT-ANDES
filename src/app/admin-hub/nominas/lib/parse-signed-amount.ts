/** "200" → 200, "-200" → -200, "200.50" → 200.5. Solo el "-" inicial resta; sin signo suma. */
export function parseSignedAmountInput(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return 0;

  const isNegative = trimmed.startsWith("-");
  const cleaned = trimmed.replace(/[^\d.]/g, "");
  const value = parseFloat(cleaned) || 0;

  return isNegative ? -value : value;
}

/** Permite dígitos, punto decimal y un "-" solo al inicio (ej. "-200.50"). */
export function sanitizeSignedAmountInput(value: string): string {
  const trimmed = value.trimStart();
  if (!trimmed) return "";

  const negative = trimmed.startsWith("-");
  const cleaned = trimmed.replace(/[^\d.]/g, "");
  
  // Permitir solo un punto decimal
  const parts = cleaned.split(".");
  const sanitized = parts.length > 1 
    ? `${parts[0]}.${parts.slice(1).join("")}` 
    : cleaned;
  
  if (!sanitized) return negative ? "-" : "";

  return negative ? `-${sanitized}` : sanitized;
}
