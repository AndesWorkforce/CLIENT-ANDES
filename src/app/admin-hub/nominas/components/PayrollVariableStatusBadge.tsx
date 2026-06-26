import type { PayrollVariableStatus } from "../data/mock-payroll-variables";

const statusStyles: Record<PayrollVariableStatus, string> = {
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
  Aprobado: "bg-[#D4F4E2] text-[#2D6A4F]",
  Rechazado: "bg-[#FFE5E5] text-[#B42318]",
  Emitido: "bg-[#E0E0E0] text-[#525252]",
};

interface PayrollVariableStatusBadgeProps {
  status: PayrollVariableStatus;
}

export default function PayrollVariableStatusBadge({
  status,
}: PayrollVariableStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
