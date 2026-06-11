import type {
  InvoiceAdditionalFee,
  InvoiceLineItem,
  InvoiceLineItemStatus,
  InvoicePayrollEntry,
} from "../data/mock-invoice-details";

type ApprovableStatus = InvoiceLineItemStatus | InvoicePayrollEntry["status"];

function isApprovedStatus(status: ApprovableStatus): boolean {
  return status === "Aprobado" || status === "Aprobada";
}

/** Pendiente si hay al menos un ítem pendiente o rechazado; Aprobado solo si todos están aprobados */
export function resolveAggregateApprovalStatus(
  statuses: ApprovableStatus[]
): "Pendiente" | "Aprobado" {
  if (statuses.length === 0) return "Pendiente";
  return statuses.every(isApprovedStatus) ? "Aprobado" : "Pendiente";
}

export function resolveLineItemsApprovalStatus(
  items: Pick<InvoiceLineItem, "status">[]
): "Pendiente" | "Aprobado" {
  return resolveAggregateApprovalStatus(items.map((item) => item.status));
}

export function resolvePayrollApprovalStatus(
  entries: Pick<InvoicePayrollEntry, "status">[]
): "Pendiente" | "Aprobado" {
  return resolveAggregateApprovalStatus(entries.map((entry) => entry.status));
}

export function resolveAdditionalFeesApprovalStatus(
  fees: Pick<InvoiceAdditionalFee, "status">[]
): "Pendiente" | "Aprobado" {
  return resolveAggregateApprovalStatus(fees.map((fee) => fee.status));
}
