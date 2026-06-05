import type { InputHTMLAttributes } from "react";
import AdminHubSelect from "./AdminHubSelect";

interface BaseProps {
  label: string;
  required?: boolean;
}

interface AdminHubFormSelectProps extends BaseProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface AdminHubFormInputProps extends BaseProps {
  type: "input";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  inputType?: InputHTMLAttributes<HTMLInputElement>["type"];
  readOnly?: boolean;
}

type AdminHubFormFieldProps = (AdminHubFormSelectProps | AdminHubFormInputProps) & {
  readOnly?: boolean;
};

export default function AdminHubFormField(props: AdminHubFormFieldProps) {
  const { label, required = true, readOnly = false } = props;
  const readOnlyClass =
    "cursor-not-allowed bg-[#F8F8F8] text-[#525252] focus:ring-0";

  if (props.type === "select") {
    return (
      <AdminHubSelect
        label={label}
        required={required}
        value={props.value}
        onChange={props.onChange}
        options={props.options}
        placeholder={props.placeholder}
        disabled={readOnly}
        variant="form"
        labelBackground="#FFFFFF"
      />
    );
  }

  return (
    <div className="relative w-full pt-2">
      <label className="absolute left-3 top-0 z-10 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]">
        {label}
        {required && "*"}
      </label>
      <input
        type={props.inputType ?? "text"}
        value={props.value}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        className={`h-[50px] w-full rounded-[8px] border border-[#EFEFEF] px-4 text-[14px] leading-[1.3] tracking-[0.28px] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2] ${
          readOnly ? readOnlyClass : "bg-white text-[#343434]"
        }`}
      />
    </div>
  );
}
