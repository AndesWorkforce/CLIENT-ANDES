"use client";

import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

interface PayrollVariableInfoCardProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}

export default function PayrollVariableInfoCard({
  title,
  children,
  onEdit,
}: PayrollVariableInfoCardProps) {
  return (
    <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-[30px] py-[33px]">
      <div className="mb-[23px] flex items-center justify-between">
        <h2 className="text-[18px] font-bold leading-[1.3] text-black">{title}</h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex size-8 items-center justify-center rounded-full border border-[#C8C8C8] text-[#858585] transition-colors hover:border-[#0097B2] hover:text-[#0097B2]"
            aria-label={`Editar ${title}`}
          >
            <Pencil size={16} />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-[18px]">{children}</div>
    </section>
  );
}
