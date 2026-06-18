import type { PersonaStatus } from "../data/mock-persona-detail";

interface PersonaStatusBadgeProps {
  status: PersonaStatus;
}

export default function PersonaStatusBadge({ status }: PersonaStatusBadgeProps) {
  const isActive = status === "Activo";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-2 py-[5px] text-[14px] font-semibold leading-[1.3] ${
        isActive ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#FEF3F2] text-[#B42318]"
      }`}
    >
      {status}
    </span>
  );
}
