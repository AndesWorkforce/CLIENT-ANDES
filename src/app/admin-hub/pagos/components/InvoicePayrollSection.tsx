"use client";

import { useState } from "react";
import type { InvoicePayrollEntry } from "../data/mock-invoice-details";
import { resolvePayrollApprovalStatus } from "../lib/invoice-approval-status";
import InvoiceCollapsibleSectionHeader from "./InvoiceCollapsibleSectionHeader";
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

  const aggregateStatus = resolvePayrollApprovalStatus(entries);

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white">
      <InvoiceCollapsibleSectionHeader
        title="Nóminas"
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        subtotal={subtotal}
        aggregateStatus={aggregateStatus}
      />
      {isOpen && <InvoicePayrollTable entries={entries} subtotal={subtotal} />}
    </div>
  );
}
