interface PayrollAmountColumnProps {
  title: string;
  lines: { id?: string; label: string; value: string }[];
  totalLabel: string;
  totalAmount: string;
  emptyLabel?: string;
}

export default function PayrollAmountColumn({
  title,
  lines,
  totalLabel,
  totalAmount,
  emptyLabel = "Sin registros",
}: PayrollAmountColumnProps) {
  const fillerCount = Math.max(0, 3 - lines.length);

  return (
    <div className="flex min-w-[286px] flex-1 flex-col">
      <div className="flex h-[50px] items-center rounded-tl-[12px] rounded-tr-[12px] border border-[#EFEFEF] bg-white px-[11px]">
        <span className="text-[14px] font-semibold leading-[1.3] text-black">{title}</span>
      </div>

      {lines.length === 0 ? (
        <div className="flex h-[50px] items-center border border-t-0 border-[#EFEFEF] bg-white px-[11px]">
          <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585]">
            {emptyLabel}
          </span>
        </div>
      ) : (
        lines.map((line, index) => (
          <div
            key={line.id ?? `${line.label}-${index}`}
            className="flex min-h-[50px] items-center border border-t-0 border-[#EFEFEF] bg-white px-[11px] py-2"
          >
            <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black break-words">
              {line.label}: {line.value}
            </span>
          </div>
        ))
      )}

      {lines.length > 0 &&
        Array.from({ length: fillerCount }).map((_, index) => (
          <div
            key={`spacer-${index}`}
            className="h-[50px] border border-t-0 border-[#EFEFEF] bg-white"
          />
        ))}

      <div className="flex">
        <div className="flex h-[50px] flex-1 items-center rounded-bl-[12px] border border-t-0 border-[#EFEFEF] bg-white px-[11px]">
          <span className="text-[14px] font-medium leading-[1.2] text-black">
            {totalLabel}
          </span>
        </div>
        <div className="flex h-[50px] w-[80px] items-center justify-center rounded-br-[12px] border border-l-0 border-t-0 border-[#EFEFEF] bg-white px-[10px]">
          <span className="text-[14px] leading-[1.3] tracking-[0.28px] text-black">
            {totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
