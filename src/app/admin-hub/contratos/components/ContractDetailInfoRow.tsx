import type { LucideIcon } from "lucide-react";

interface ContractDetailInfoRowProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  isLast?: boolean;
  mutedValue?: boolean;
}

export default function ContractDetailInfoRow({
  icon: Icon,
  label,
  value,
  isLast = false,
  mutedValue = false,
}: ContractDetailInfoRowProps) {
  return (
    <div className="flex w-full flex-col gap-[11px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-[11px]">
          {Icon ? (
            <Icon size={21} className="shrink-0 text-[#707070]" strokeWidth={1.5} />
          ) : null}
          <span className="text-[14px] font-medium leading-[1.2] text-[#707070]">{label}</span>
        </div>
        <span
          className={`shrink-0 text-right text-[14px] font-semibold leading-[1.3] ${
            mutedValue ? "text-[#C8C8C8]" : "text-[#343434]"
          }`}
        >
          {value}
        </span>
      </div>
      {!isLast ? <div className="h-px w-full bg-[#EFEFEF]" /> : null}
    </div>
  );
}
