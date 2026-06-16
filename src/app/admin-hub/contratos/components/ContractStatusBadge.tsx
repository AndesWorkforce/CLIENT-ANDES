import type { ContractStatusLabel } from "../data/contract-display";

const statusStyles: Record<ContractStatusLabel, string> = {
  Activo: "bg-[#ECFDF3] text-[#027A48]",
  Inactivo: "bg-[#F2F4F7] text-[#667085]",
};

interface ContractStatusBadgeProps {
  status: ContractStatusLabel;
}

export default function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
