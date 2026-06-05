interface TypeOption<T extends string> {
  id: T;
  label: string;
}

interface AdminHubTypeSelectStepProps<T extends string> {
  title: string;
  options: TypeOption<T>[];
  selectedId: T | null;
  onSelect: (id: T) => void;
}

export default function AdminHubTypeSelectStep<T extends string>({
  title,
  options,
  selectedId,
  onSelect,
}: AdminHubTypeSelectStepProps<T>) {
  return (
    <div className="flex w-full max-w-[624px] flex-col gap-[37px]">
      <h3 className="text-[22px] font-bold leading-[1.3] text-[#525252]">{title}</h3>
      <div className="flex flex-col gap-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`flex h-[76px] w-full items-center rounded-[8px] border bg-white px-6 text-left shadow-[0px_2px_2px_rgba(202,202,202,0.25)] transition-colors ${
                isSelected
                  ? "border-[#0097B2] ring-1 ring-[#0097B2]"
                  : "border-[#EFEFEF] hover:border-[#C8C8C8]"
              }`}
            >
              <span
                className={`text-[18px] font-bold leading-[1.3] transition-colors ${
                  isSelected ? "text-[#0097B2]" : "text-[#343434]"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
