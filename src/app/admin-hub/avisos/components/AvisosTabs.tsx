"use client";

import type { AvisoTab } from "../types/avisos.types";

interface AvisosTabsProps {
  activeTab: AvisoTab;
  counts: Record<AvisoTab, number>;
  onChange: (tab: AvisoTab) => void;
}

const TABS: { id: AvisoTab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "no-leidas", label: "No leídas" },
  { id: "leidas", label: "Leídas" },
];

export default function AvisosTabs({ activeTab, counts, onChange }: AvisosTabsProps) {
  return (
    <div className="border-b border-[#EFEFEF]">
      <div className="flex flex-wrap gap-[38px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-[13px] pb-0 transition-colors ${
                isActive ? "text-[#0097B2]" : "text-[#858585] hover:text-[#0097B2]"
              }`}
            >
              <span className="flex h-[18px] items-center gap-[3px] text-[14px] font-medium leading-[1.2]">
                {tab.label}
                <span
                  className={`inline-flex min-w-[22px] items-center justify-center rounded-full px-[6px] py-[2px] text-[12px] font-semibold leading-[1.3] ${
                    isActive ? "bg-[#1A8FA0] text-white" : "bg-[#C8C8C8] text-[#707070]"
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </span>
              {isActive ? <span className="h-0.5 w-full rounded-full bg-[#0097B2]" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
