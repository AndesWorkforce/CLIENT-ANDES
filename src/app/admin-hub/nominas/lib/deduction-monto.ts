/** Monto fijo de deducción Other: solo dígitos; siempre negativo. */
export function sanitizeDeductionMontoInput(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function parseDeductionMonto(raw: string): number {
  const value = parseInt(sanitizeDeductionMontoInput(raw), 10) || 0;
  return -Math.abs(value);
}
