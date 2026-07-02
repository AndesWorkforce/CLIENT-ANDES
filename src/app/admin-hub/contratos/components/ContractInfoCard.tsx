import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

interface ContractInfoCardProps {
  title: string;
  children: ReactNode;
  isEditing?: boolean;
  onEditClick?: () => void;
}

export default function ContractInfoCard({
  title,
  children,
  isEditing = false,
  onEditClick,
}: ContractInfoCardProps) {
  return (
    <section className="flex h-full flex-col gap-[33px] rounded-[12px] border border-[#EFEFEF] bg-white px-[30px] pb-6 pt-[30px]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-bold leading-[1.3] text-[#343434]">{title}</h2>
        {onEditClick ? (
          isEditing ? (
            <button
              type="button"
              onClick={onEditClick}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
            >
              Guardar
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Editar ${title}`}
              onClick={onEditClick}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] text-[#858585] transition-colors hover:bg-[#F5FAFB] hover:text-[#0097B2]"
            >
              <Pencil size={18} />
            </button>
          )
        ) : null}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}
