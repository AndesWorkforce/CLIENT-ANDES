import type { LucideIcon } from "lucide-react";

interface PayrollVariableInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  isLast?: boolean;
  mutedValue?: boolean;
}

export default function PayrollVariableInfoRow({
  icon: Icon,
  label,
  value,
  isLast = false,
  mutedValue = false,
}: PayrollVariableInfoRowProps) {
  return (
    <div
      className={`flex gap-4 ${isLast ? "" : "border-b border-[#C8C8C8] pb-[18px]"}`}
    >
      <Icon size={24} className="shrink-0 text-[#858585]" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-[14px] leading-[1.3] text-[#343434]">{label}</div>
        <div
          className={`text-[16px] font-semibold leading-[1.3] ${mutedValue ? "text-[#858585]" : "text-black"}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
