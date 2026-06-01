import type { InvoiceStatus } from "../data/mock-invoices";

const statusStyles: Record<InvoiceStatus, string> = {
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
  Pagado: "bg-[#D4F4E2] text-[#2D6A4F]",
  Vencido: "bg-[#FFE5E5] text-[#B42318]",
};

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex h-[22px] items-center justify-center rounded-[10px] px-[6px] py-[5px] text-[10px] font-semibold leading-[1.2] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
