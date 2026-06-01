"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { InvoiceSection } from "../data/mock-invoice-details";
import InvoiceLineItemsTable from "./InvoiceLineItemsTable";

interface InvoiceDetailSectionProps {
  section: InvoiceSection;
  defaultOpen?: boolean;
}

export default function InvoiceDetailSection({
  section,
  defaultOpen = true,
}: InvoiceDetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 border-b border-[#EFEFEF] bg-white px-6 py-5 text-left"
      >
        <ChevronDown
          size={21}
          className={`shrink-0 text-[#525252] transition-transform ${isOpen ? "" : "-rotate-90"}`}
        />
        <span className="text-[16px] font-bold leading-[1.3] text-[#525252]">{section.title}</span>
      </button>
      {isOpen && (
        <InvoiceLineItemsTable
          items={section.items}
          subtotal={section.subtotal}
          subtotalIsNegative={section.subtotalIsNegative}
        />
      )}
    </div>
  );
}
