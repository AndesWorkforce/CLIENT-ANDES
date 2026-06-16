import type { LucideIcon } from "lucide-react";

interface PayrollDetailInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function PayrollDetailInfoRow({
  icon: Icon,
  label,
  value,
}: PayrollDetailInfoRowProps) {
  return (
    <div className="flex w-full flex-col gap-[11px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-[7px]">
          <Icon size={21} className="shrink-0 text-[#707070]" strokeWidth={1.5} />
          <span className="text-[14px] font-medium leading-[1.2] text-[#707070]">
            {label}
          </span>
        </div>
        <span className="shrink-0 text-right text-[14px] font-medium leading-[1.2] text-black">
          {value}
        </span>
      </div>
      <div className="h-px w-full bg-[#EFEFEF]" />
    </div>
  );
}
