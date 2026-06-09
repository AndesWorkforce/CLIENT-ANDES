"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { InvoicePayrollEntry } from "../data/mock-invoice-details";
import InvoicePayrollTable from "./InvoicePayrollTable";

interface InvoicePayrollSectionProps {
  entries: InvoicePayrollEntry[];
  subtotal: string;
  defaultOpen?: boolean;
}

export default function InvoicePayrollSection({
  entries,
  subtotal,
  defaultOpen = true,
}: InvoicePayrollSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full overflow-visible rounded-[8px] border border-[#EFEFEF] bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 border-b border-[#EFEFEF] bg-white px-6 py-5 text-left"
      >
        <ChevronDown
          size={21}
          className={`shrink-0 text-[#525252] transition-transform ${isOpen ? "" : "-rotate-90"}`}
        />
        <span className="text-[16px] font-bold leading-[1.3] text-[#525252]">Nóminas</span>
      </button>
      {isOpen && <InvoicePayrollTable entries={entries} subtotal={subtotal} />}
    </div>
  );
}
