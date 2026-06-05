import AdminHubSelect from "../../components/AdminHubSelect";

interface InvoiceFilterSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export default function InvoiceFilterSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  className = "",
}: InvoiceFilterSelectProps) {
  return (
    <AdminHubSelect
      label={label}
      required={false}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      variant="filter"
      labelBackground="#F8F8F8"
      className={`max-w-[259px] min-w-[200px] flex-1 ${className}`}
    />
  );
}
