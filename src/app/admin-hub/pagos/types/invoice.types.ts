/**
 * Estado de la factura del cliente tal como lo maneja el backend. Antes
 * BORRADOR, APROBADA y EMITIDA se mostraban todas como "Pendiente", así que una
 * factura emitida se veía igual que un borrador.
 */
export type InvoiceStatus =
  | "Borrador"
  | "Aprobada"
  | "Emitida"
  | "Pagado"
  | "Anulada"
  | "Pendiente";

export interface Invoice {
  id: string;
  clientId: string;
  empresaId: string;
  client: string;
  period: string;
  totalAmount: string;
  status: InvoiceStatus;
}
