import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  required?: boolean;
}

interface InvoiceFormSelectProps extends BaseProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface InvoiceFormInputProps extends BaseProps {
  type: "input";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

type InvoiceFormFieldProps = InvoiceFormSelectProps | InvoiceFormInputProps;

export default function InvoiceFormField(props: InvoiceFormFieldProps) {
  const { label, required = true } = props;

  return (
    <div className="relative w-full pt-2">
      <label className="absolute left-3 top-0 z-10 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]">
        {label}
        {required && "*"}
      </label>

      {props.type === "select" ? (
        <div className="relative">
          <select
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className={`h-[50px] w-full appearance-none rounded-[8px] border border-[#EFEFEF] bg-white px-4 text-[14px] leading-[1.3] tracking-[0.28px] focus:outline-none focus:ring-1 focus:ring-[#0097B2] [&>option]:bg-white [&>option]:text-black ${
              props.value ? "text-black" : "text-[#C8C8C8]"
            }`}
          >
            {props.placeholder && (
              <option value="" disabled className="text-[#C8C8C8]">
                {props.placeholder}
              </option>
            )}
            {props.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-black">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#707070]"
          />
        </div>
      ) : (
        <input
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          inputMode={props.inputMode}
          className="h-[50px] w-full rounded-[8px] border border-[#EFEFEF] bg-white px-4 text-[14px] leading-[1.3] tracking-[0.28px] text-[#343434] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
        />
      )}
    </div>
  );
}
