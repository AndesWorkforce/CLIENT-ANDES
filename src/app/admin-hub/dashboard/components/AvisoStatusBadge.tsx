import type { AvisoEstado } from "../types/avisos.types";

const statusStyles: Record<AvisoEstado, string> = {
  Pendiente: "bg-[#DDE2FF] text-[#4356A6]",
  Revisado: "bg-[#D4F4E2] text-[#2D6A4F]",
  Cerrado: "bg-[#EFEFEF] text-[#858585]",
};

interface AvisoStatusBadgeProps {
  status: AvisoEstado;
}

export default function AvisoStatusBadge({ status }: AvisoStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-[9px] py-[5px] text-[12px] font-semibold leading-[1.3] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
