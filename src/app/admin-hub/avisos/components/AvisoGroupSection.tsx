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
        className={`flex w-full items-center bg-white ${
          expanded
            ? "rounded-t-[12px] border-b border-[#EFEFEF]"
            : "rounded-[12px]"
        }`}
      >
        <div className="flex h-16 flex-1 items-center gap-3.5 pl-4">
          <ChevronDown
            size={21}
            className={`shrink-0 text-[#707070] transition-transform ${expanded ? "" : "-rotate-90"}`}
            aria-hidden
          />
          <h2 className="text-[16px] font-bold leading-[1.3] text-[#525252]">{label}</h2>
        </div>
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
