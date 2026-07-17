import type { PayrollInvoiceStatus } from "../data/payroll-data";

const statusStyles: Record<Exclude<PayrollInvoiceStatus, null>, string> = {
  Generado: "bg-[#ECFDF3] text-[#027A48]",
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
  "Faltan datos": "bg-[#FFF0C2] text-[#E6572B]",
};

interface PayrollInvoiceBadgeProps {
  status: PayrollInvoiceStatus;
}

export default function PayrollInvoiceBadge({ status }: PayrollInvoiceBadgeProps) {
  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
