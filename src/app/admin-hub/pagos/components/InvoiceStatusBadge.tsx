import type { InvoiceStatus } from "../types/invoice.types";
import type {
  InvoiceLineItemStatus,
  InvoicePayrollStatus,
} from "../data/mock-invoice-details";

export type InvoiceBadgeStatus =
  | InvoiceStatus
  | InvoiceLineItemStatus
  | InvoicePayrollStatus;

const statusStyles: Record<InvoiceBadgeStatus, string> = {
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
  Pagado: "bg-[#D4F4E2] text-[#2D6A4F]",
  Vencido: "bg-[#FFE5E5] text-[#B42318]",
  Aprobado: "bg-[#D4F4E2] text-[#2D6A4F]",
  Aprobada: "bg-[#ECFDF3] text-[#027A48]",
  Rechazado: "bg-[#FFE5E5] text-[#B42318]",
};

interface InvoiceStatusBadgeProps {
  status: InvoiceBadgeStatus;
  /** +15% size (line-item tables in invoice detail) */
  enlarged?: boolean;
}

export default function InvoiceStatusBadge({
  status,
  enlarged = false,
}: InvoiceStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center font-semibold leading-[1.2] ${statusStyles[status]} ${
        enlarged
          ? "h-[25.3px] rounded-[11.5px] px-[7px] py-[6px] text-[11.5px]"
          : "h-[22px] rounded-[10px] px-[6px] py-[5px] text-[10px]"
      }`}
    >
      {status}
    </span>
  );
}
