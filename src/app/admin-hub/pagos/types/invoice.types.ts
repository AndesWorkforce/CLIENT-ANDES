export type InvoiceStatus = "Pendiente" | "Pagado" | "Vencido";

export interface Invoice {
  id: string;
  clientId: string;
  client: string;
  period: string;
  totalAmount: string;
  status: InvoiceStatus;
}
