"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { InvoiceAdditionalFee } from "../data/mock-invoice-details";
import InvoiceAdditionalFeesTable from "./InvoiceAdditionalFeesTable";

interface InvoiceAdditionalFeesSectionProps {
  items: InvoiceAdditionalFee[];
  subtotal: string;
  defaultOpen?: boolean;
  onApproveItem: (itemId: string) => void;
  onRejectItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function InvoiceAdditionalFeesSection({
  items,
  subtotal,
  defaultOpen = true,
  onApproveItem,
  onRejectItem,
  onDeleteItem,
}: InvoiceAdditionalFeesSectionProps) {
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
        <span className="text-[16px] font-bold leading-[1.3] text-[#525252]">Adicionales</span>
      </button>
      {isOpen && (
        <InvoiceAdditionalFeesTable
          items={items}
          subtotal={subtotal}
          onApprove={onApproveItem}
          onReject={onRejectItem}
          onDelete={onDeleteItem}
        />
      )}
    </div>
  );
}
