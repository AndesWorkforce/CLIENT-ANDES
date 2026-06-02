import { ChevronDown } from "lucide-react";

interface InvoiceFilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
}

export default function InvoiceFilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: InvoiceFilterSelectProps) {
  return (
    <div className={`relative w-full max-w-[259px] min-w-[200px] flex-1 pt-2 ${className}`}>
      <label className="absolute left-3 top-0 z-10 bg-[#F8F8F8] px-1 text-[12px] leading-[1.3] tracking-[0.24px] text-[#525252]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-10 w-full appearance-none rounded-[8px] border border-[#C8C8C8] bg-white px-[15px] pr-10 text-[14px] leading-[1.3] tracking-[0.28px] focus:outline-none focus:ring-1 focus:ring-[#0097B2] [&>option]:bg-white [&>option]:text-black ${
            value ? "text-black" : "text-[#C8C8C8]"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-[#525252]"
        />
      </div>
    </div>
  );
}
