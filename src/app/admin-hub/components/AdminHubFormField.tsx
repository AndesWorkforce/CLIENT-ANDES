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
  searchable?: boolean;
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
  /** Solo lectura sin cursor bloqueado (vista de detalle). */
  viewOnly?: boolean;
};

export default function AdminHubFormField(props: AdminHubFormFieldProps) {
  const { label, required = true, readOnly = false, viewOnly = false } = props;
  const isLocked = readOnly && !viewOnly;
  const readOnlyClass =
    "cursor-not-allowed bg-[#F8F8F8] text-[#525252] focus:ring-0";
  const viewOnlyClass = "cursor-default bg-white text-[#525252] focus:ring-0";

  if (props.type === "select") {
    return (
      <AdminHubSelect
        label={label}
        required={required}
        value={props.value}
        onChange={props.onChange}
        options={props.options}
        placeholder={props.placeholder}
        disabled={isLocked}
        viewOnly={viewOnly}
        variant="form"
        labelBackground="#FFFFFF"
        searchable={props.searchable}
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
        readOnly={isLocked || viewOnly}
        disabled={isLocked}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        className={`h-[50px] w-full rounded-[8px] border border-[#EFEFEF] px-4 text-[14px] leading-[1.3] tracking-[0.28px] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2] ${
          viewOnly
            ? viewOnlyClass
            : isLocked
              ? readOnlyClass
              : "bg-white text-[#343434]"
        }`}
      />
    </div>
  );
}
