import type { ReactNode } from "react";
import { Pen } from "lucide-react";

interface ContractInfoCardProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}

export default function ContractInfoCard({ title, children, onEdit }: ContractInfoCardProps) {
  return (
    <section className="flex h-full flex-col gap-[33px] rounded-[12px] border border-[#EFEFEF] bg-white px-[30px] pb-6 pt-[30px]">
      <div className="flex items-center gap-2.5">
        <h2 className="text-[18px] font-bold leading-[1.3] text-[#343434]">{title}</h2>
        {onEdit ? (
          <button
            type="button"
            aria-label={`Editar ${title}`}
            onClick={onEdit}
            className="inline-flex size-4 items-center justify-center text-[#858585] transition-colors hover:text-[#0097B2]"
          >
            <Pen size={16} />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-[11px]">{children}</div>
    </section>
  );
}
