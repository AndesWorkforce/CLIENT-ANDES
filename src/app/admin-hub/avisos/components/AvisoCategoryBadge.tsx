import type { AvisoCategory } from "../types/avisos.types";

const categoryStyles: Record<AvisoCategory, string> = {
  Facturación: "bg-[#F5FFB3] text-[#E3A634]",
  Nóminas: "bg-[#EFFEDD] text-[#43A652]",
};

interface AvisoCategoryBadgeProps {
  category: AvisoCategory;
}

export default function AvisoCategoryBadge({ category }: AvisoCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${categoryStyles[category]}`}
    >
      {category}
    </span>
  );
}
