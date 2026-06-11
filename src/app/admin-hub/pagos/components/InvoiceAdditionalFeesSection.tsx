"use client";

import { useState } from "react";
import type { InvoiceAdditionalFee } from "../data/mock-invoice-details";
import { resolveAdditionalFeesApprovalStatus } from "../lib/invoice-approval-status";
import InvoiceAdditionalFeesTable from "./InvoiceAdditionalFeesTable";
import InvoiceCollapsibleSectionHeader from "./InvoiceCollapsibleSectionHeader";

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
  const aggregateStatus = resolveAdditionalFeesApprovalStatus(items);

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white">
      <InvoiceCollapsibleSectionHeader
        title="Adicionales"
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        subtotal={subtotal}
        aggregateStatus={aggregateStatus}
      />
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
