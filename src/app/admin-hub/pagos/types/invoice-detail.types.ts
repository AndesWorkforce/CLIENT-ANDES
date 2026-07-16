import type { Invoice, InvoiceStatus } from "./invoice.types";

export type InvoiceLineItemStatus = "Pendiente" | "Aprobado" | "Rechazado";
export type InvoicePayrollStatus = "Pendiente" | "Aprobada";

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
  contractorName: string;
  position: string;
  contractStartDate: string;
  clientPrice: number;
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

export interface InvoiceDetail extends Invoice {
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
