"use client";

import { useState } from "react";
import type { InvoiceSection } from "../data/mock-invoice-details";
import { resolveLineItemsApprovalStatus } from "../lib/invoice-approval-status";
import { useAdminHubI18n } from "../../i18n";
import InvoiceCollapsibleSectionHeader from "./InvoiceCollapsibleSectionHeader";
import InvoiceLineItemsTable from "./InvoiceLineItemsTable";
import type { HistorialModulo } from "../../historial/types/historial.types";

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
  const { t } = useAdminHubI18n();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const aggregateStatus = resolveLineItemsApprovalStatus(section.items);
  const title =
    section.tabKey === "customer-charges"
      ? t("pagos.sections.customerCharges")
      : t("pagos.sections.customerCredits");

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white">
      <InvoiceCollapsibleSectionHeader
        title={title}
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
          historialModulo={
            (section.tabKey === "customer-charges"
              ? "CUSTOMER_CHARGE"
              : "CUSTOMER_CREDIT") as HistorialModulo
          }
          historialEntidadTipo={
            section.tabKey === "customer-charges"
              ? "CustomerCharge"
              : "CustomerCredit"
          }
        />
      )}
    </div>
  );
}
