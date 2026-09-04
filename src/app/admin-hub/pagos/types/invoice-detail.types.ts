import type { Invoice, InvoiceStatus } from "./invoice.types";

export type InvoiceLineItemStatus = "Pendiente" | "Aprobado" | "Rechazado";
export type InvoicePayrollStatus = "Pendiente" | "Aprobada" | "Rechazada";

export interface InvoiceLineItem {
  id: string;
  date: string;
  type: string;
  contractor: string;
  description: string;
  amount: string;
  currency?: string;
  amountIsNegative?: boolean;
  status: InvoiceLineItemStatus;
  createdBy: string;
}

export interface InvoicePayrollEntry {
  id: string;
  /** Id de la línea de factura, para aprobarla o rechazarla. */
  lineaFacturaId: string | null;
  contractorName: string;
  position: string;
  contractStartDate: string;
  clientPrice: number;
  /** true cuando el contrato es HOURLY_TIME: el cobro es tarifa horaria × horas. */
  esHourly: boolean;
  /** Tarifa por hora facturada al cliente. Solo HOURLY_TIME. */
  tarifaHoraria: number | null;
  /** Horas facturadas del periodo. Solo HOURLY_TIME. */
  horasTrabajadas: number | null;
  /** HOURLY_TIME sin horas cargadas: el cobro queda en 0 hasta cargarlas. */
  sinHorasCargadas: boolean;
  /** ISO del momento en que se calculó / recalculó el total del contrato. */
  calculadoEn: string | null;
  status: InvoicePayrollStatus;
}

export interface InvoiceAdditionalFee {
  id: string;
  date: string;
  contractor: string;
  position: string;
  description: string;
  amount: string;
  status: InvoiceLineItemStatus;
  createdBy: string;
}

export interface InvoiceSection {
  id: string;
  title: string;
  tabKey: "customer-charges" | "customer-credits";
  items: InvoiceLineItem[];
  subtotal: string;
  subtotalIsNegative?: boolean;
}

/** Estados reales del snapshot en el backend (el `status` de Invoice es la vista UI). */
export type InvoiceBackendEstado =
  | "BORRADOR"
  | "APROBADA"
  | "EMITIDA"
  | "PAGADA"
  | "ANULADA";

export interface InvoiceDetail extends Invoice {
  /** Estado real, necesario para decidir si se puede aprobar, emitir o descargar. */
  estado: InvoiceBackendEstado;
  numeroFactura: string | null;
  pdfUrl: string | null;
  aprobadoEn: string | null;
  emitidaEn: string | null;
  country: string;
  issueDate: string;
  dueDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  grandTotal: string;
  payrollEntries: InvoicePayrollEntry[];
  payrollSubtotal: string;
  additionalFees: InvoiceAdditionalFee[];
  additionalFeesSubtotal: string;
  sections: InvoiceSection[];
}

export type { InvoiceStatus };
