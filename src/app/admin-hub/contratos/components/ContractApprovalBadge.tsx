type ContractApprovalStatus = "Pendiente" | "Aprobada";

const statusStyles: Record<ContractApprovalStatus, string> = {
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
  Aprobada: "bg-[#ECFDF3] text-[#027A48]",
};

interface ContractApprovalBadgeProps {
  status: ContractApprovalStatus;
}

export default function ContractApprovalBadge({ status }: ContractApprovalBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
