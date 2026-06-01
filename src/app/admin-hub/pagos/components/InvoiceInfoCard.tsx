import type { LucideIcon } from "lucide-react";

interface InvoiceInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function InvoiceInfoCard({ icon: Icon, label, value }: InvoiceInfoCardProps) {
  return (
    <div className="flex min-h-[62px] w-full min-w-0 flex-col justify-center rounded-[12px] border border-[#EFEFEF] bg-white px-4 py-[11px]">
      <div className="flex min-w-0 flex-col gap-[5px]">
        <div className="flex min-w-0 items-center gap-1">
          <Icon size={16} className="shrink-0 text-[#707070]" />
          <span className="truncate text-[14px] font-medium leading-[1.2] text-[#707070]">
            {label}
          </span>
        </div>
        <p className="truncate text-[14px] font-semibold leading-[1.3] text-[#343434]" title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}
