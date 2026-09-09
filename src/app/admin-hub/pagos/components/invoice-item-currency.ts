/** Cargos y créditos de factura al cliente se registran únicamente en USD. */
export const INVOICE_ITEM_CURRENCY = "USD" as const;

export interface CreateItemFormData {
  tipo: string;
  descripcion: string;
  monto: string;
}

export function isCreateItemFormComplete(data: CreateItemFormData): boolean {
  return Boolean(data.tipo && data.descripcion.trim() && data.monto.trim());
}
