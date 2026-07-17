import type { PayrollProofStatus } from "../data/payroll-data";

const badgeStyles: Record<"Cargado" | "Pendiente", string> = {
  Cargado: "bg-[#ECFDF3] text-[#027A48]",
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
};

interface PayrollProofBadgeProps {
  status: PayrollProofStatus;
}

export default function PayrollProofBadge({ status }: PayrollProofBadgeProps) {
  if (!status) return null;

  if (status === "Not req.") {
    return <span className="text-[14px] tracking-[0.28px] text-[#858585]">Not req.</span>;
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${badgeStyles[status]}`}
    >
      {status}
    </span>
  );
}
