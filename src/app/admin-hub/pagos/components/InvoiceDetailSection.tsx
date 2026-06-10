"use client";

import { useState } from "react";
import type { InvoiceSection } from "../data/mock-invoice-details";
import { resolveLineItemsApprovalStatus } from "../lib/invoice-approval-status";
import InvoiceCollapsibleSectionHeader from "./InvoiceCollapsibleSectionHeader";
import InvoiceLineItemsTable from "./InvoiceLineItemsTable";

interface InvoiceDetailSectionProps {
  section: InvoiceSection;
  defaultOpen?: boolean;
  onApproveItem: (itemId: string) => void;
  onRejectItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function InvoiceDetailSection({
  section,
  defaultOpen = true,
  onApproveItem,
  onRejectItem,
  onDeleteItem,
}: InvoiceDetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const aggregateStatus = resolveLineItemsApprovalStatus(section.items);

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white">
      <InvoiceCollapsibleSectionHeader
        title={section.title}
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        subtotal={section.subtotal}
        subtotalIsNegative={section.subtotalIsNegative}
        aggregateStatus={aggregateStatus}
      />
      {isOpen && (
        <InvoiceLineItemsTable
          items={section.items}
          subtotal={section.subtotal}
          subtotalIsNegative={section.subtotalIsNegative}
          onApprove={onApproveItem}
          onReject={onRejectItem}
          onDelete={onDeleteItem}
        />
      )}
    </div>
  );
}
