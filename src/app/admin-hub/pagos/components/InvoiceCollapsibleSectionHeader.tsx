"use client";

import { ChevronDown } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoiceCollapsibleSectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  subtotal?: string;
  subtotalIsNegative?: boolean;
  aggregateStatus?: "Pendiente" | "Aprobado";
}

export default function InvoiceCollapsibleSectionHeader({
  title,
  isOpen,
  onToggle,
  subtotal,
  subtotalIsNegative,
  aggregateStatus,
}: InvoiceCollapsibleSectionHeaderProps) {
  const showCollapsedSummary = !isOpen && subtotal !== undefined;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 bg-white px-6 py-5 text-left ${
        isOpen ? "border-b border-[#EFEFEF]" : ""
      }`}
    >
      <ChevronDown
        size={21}
        className={`shrink-0 text-[#525252] transition-transform ${isOpen ? "" : "-rotate-90"}`}
      />
      <span className="text-[16px] font-bold leading-[1.3] text-[#525252]">{title}</span>

      {showCollapsedSummary && (
        <div className="ml-auto flex shrink-0 items-center gap-4">
          {aggregateStatus && <InvoiceStatusBadge status={aggregateStatus} enlarged />}
          <span
            className={`text-[16px] font-semibold leading-[1.3] whitespace-nowrap ${
              subtotalIsNegative ? "text-[#B42318]" : "text-[#525252]"
            }`}
          >
            {subtotal}
          </span>
        </div>
      )}
    </button>
  );
}
