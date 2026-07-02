"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AvisoNotification } from "../types/avisos.types";
import AvisoNotificationRow from "./AvisoNotificationRow";

interface AvisoGroupSectionProps {
  label: string;
  avisos: AvisoNotification[];
  defaultExpanded?: boolean;
}

export default function AvisoGroupSection({
  label,
  avisos,
  defaultExpanded = true,
}: AvisoGroupSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (avisos.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden rounded-[12px] border border-[#EFEFEF]">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-center border-b border-[#EFEFEF] bg-white"
      >
        <div className="flex size-16 shrink-0 items-center justify-center rounded-tl-[12px] border-r border-[#EFEFEF]">
          <ChevronDown
            size={21}
            className={`text-[#707070] transition-transform ${expanded ? "" : "-rotate-90"}`}
            aria-hidden
          />
        </div>
        <div className="flex h-16 flex-1 items-center px-3">
          <h2 className="text-[16px] font-bold leading-[1.3] text-[#525252]">{label}</h2>
        </div>
        <div className="hidden h-16 w-[102px] shrink-0 border-l border-[#EFEFEF] sm:block" />
        <div className="h-16 w-[69px] shrink-0 rounded-tr-[12px] border-l border-[#EFEFEF]" />
      </button>

      {expanded
        ? avisos.map((aviso, index) => (
            <AvisoNotificationRow
              key={aviso.id}
              aviso={aviso}
              isFirst={false}
              isLast={index === avisos.length - 1}
            />
          ))
        : null}
    </section>
  );
}
