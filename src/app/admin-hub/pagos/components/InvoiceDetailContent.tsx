"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { formatClientPrice } from "../../nominas/data/mock-contractors";
import type {
  InvoiceAdditionalFee,
  InvoiceDetail,
  InvoiceLineItem,
  InvoiceLineItemStatus,
  InvoicePayrollEntry,
  InvoiceSection,
} from "../data/mock-invoice-details";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import CreateInvoiceItemDrawer, { type MovementType } from "./CreateInvoiceItemDrawer";
import InvoiceAdditionalFeesSection from "./InvoiceAdditionalFeesSection";
import InvoiceClientInfoGrid from "./InvoiceClientInfoGrid";
import InvoiceDetailSection from "./InvoiceDetailSection";
import InvoiceEmitModal, { type InvoiceEmitModalVariant } from "./InvoiceEmitModal";
import InvoicePayrollSection from "./InvoicePayrollSection";

type TabKey = "all" | "nomina" | "adicionales" | "customer-charges" | "customer-credits";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "nomina", label: "Nóminas" },
  { key: "adicionales", label: "Adicionales" },
  { key: "customer-charges", label: "Cargos al cliente" },
  { key: "customer-credits", label: "Créditos al cliente" },
];

interface InvoiceDetailContentProps {
  invoice: InvoiceDetail;
}

function parseAmount(amount: string): number {
  const normalized = amount.replace(/[^\d-]/g, "");
  return parseInt(normalized, 10) || 0;
}

function formatAmount(value: number, isNegative?: boolean): string {
  const abs = Math.abs(value);
  const formatted = `$${abs.toLocaleString("es-ES")}`;
  return isNegative || value < 0 ? `-${formatted}` : formatted;
}

function recalculateSectionSubtotal(items: InvoiceLineItem[]): {
  subtotal: string;
  subtotalIsNegative?: boolean;
} {
  const total = items.reduce((sum, item) => {
    const val = parseAmount(item.amount);
    return sum + (item.amountIsNegative || item.amount.startsWith("-") ? -Math.abs(val) : val);
  }, 0);

  return {
    subtotal: formatAmount(total, total < 0),
    subtotalIsNegative: total < 0,
  };
}

function recalculatePayrollSubtotal(entries: InvoicePayrollEntry[]): string {
  const total = entries.reduce((sum, entry) => sum + entry.clientPrice, 0);
  return formatClientPrice(total);
}

function recalculateAdditionalFeesSubtotal(fees: InvoiceAdditionalFee[]): string {
  const total = fees.reduce((sum, fee) => sum + parseAmount(fee.amount), 0);
  return formatAmount(total);
}

function recalculateGrandTotal(
  payrollEntries: InvoicePayrollEntry[],
  additionalFees: InvoiceAdditionalFee[],
  sections: InvoiceSection[]
): string {
  const payrollTotal = payrollEntries.reduce((sum, e) => sum + e.clientPrice, 0);
  const additionalTotal = additionalFees.reduce(
    (sum, fee) => sum + parseAmount(fee.amount),
    0
  );
  const chargesTotal = parseAmount(
    sections.find((s) => s.tabKey === "customer-charges")?.subtotal ?? "0"
  );
  const creditsTotal = parseAmount(
    sections.find((s) => s.tabKey === "customer-credits")?.subtotal ?? "0"
  );
  return formatAmount(payrollTotal + additionalTotal + chargesTotal + creditsTotal);
}

export default function InvoiceDetailContent({ invoice: initialInvoice }: InvoiceDetailContentProps) {
  const { addNotification } = useNotificationStore();
  const [invoice, setInvoice] = useState<InvoiceDetail>(initialInvoice);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [emitModal, setEmitModal] = useState<InvoiceEmitModalVariant | null>(null);

  const invoiceLineItems = useMemo(
    () => invoice.sections.flatMap((section) => section.items),
    [invoice.sections]
  );

  const allItemsApproved = useMemo(
    () =>
      invoiceLineItems.length > 0 &&
      invoiceLineItems.every((item) => item.status === "Aprobado"),
    [invoiceLineItems]
  );

  const filteredPayrollEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return invoice.payrollEntries;

    return invoice.payrollEntries.filter(
      (entry) =>
        entry.contractorName.toLowerCase().includes(query) ||
        entry.position.toLowerCase().includes(query)
    );
  }, [invoice.payrollEntries, searchQuery]);

  const filteredAdditionalFees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return invoice.additionalFees;

    return invoice.additionalFees.filter(
      (fee) =>
        fee.contractor.toLowerCase().includes(query) ||
        fee.position.toLowerCase().includes(query) ||
        fee.description.toLowerCase().includes(query) ||
        fee.createdBy.toLowerCase().includes(query)
    );
  }, [invoice.additionalFees, searchQuery]);

  const visibleSections = useMemo(() => {
    if (activeTab === "nomina" || activeTab === "adicionales") {
      return [];
    }

    let sections =
      activeTab === "all"
        ? invoice.sections
        : invoice.sections.filter((s) => s.tabKey === activeTab);

    const query = searchQuery.trim().toLowerCase();
    if (!query) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.type.toLowerCase().includes(query) ||
            item.contractor.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.createdBy.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [invoice.sections, activeTab, searchQuery]);

  const showPayrollSection =
    (activeTab === "all" || activeTab === "nomina") && filteredPayrollEntries.length > 0;

  const showAdditionalFeesSection =
    (activeTab === "all" || activeTab === "adicionales") &&
    filteredAdditionalFees.length > 0;

  function handleItemCreated(item: InvoiceLineItem, movementType: MovementType) {
    if (movementType === "adicionales") return;

    const targetSection: InvoiceSection["tabKey"] =
      movementType === "customer-credits" ? "customer-credits" : "customer-charges";

    setInvoice((prev) => {
      const sections = prev.sections.map((section) => {
        if (section.tabKey !== targetSection) return section;

        const items = [...section.items, item];
        const { subtotal, subtotalIsNegative } = recalculateSectionSubtotal(items);
        return { ...section, items, subtotal, subtotalIsNegative };
      });

      return {
        ...prev,
        sections,
        grandTotal: recalculateGrandTotal(
          prev.payrollEntries,
          prev.additionalFees,
          sections
        ),
      };
    });

    addNotification("El ítem ingresado fue creado correctamente.", "success");
  }

  function handleAdditionalFeeCreated(fee: InvoiceAdditionalFee) {
    setInvoice((prev) => {
      const additionalFees = [...prev.additionalFees, fee];
      const additionalFeesSubtotal = recalculateAdditionalFeesSubtotal(additionalFees);

      return {
        ...prev,
        additionalFees,
        additionalFeesSubtotal,
        grandTotal: recalculateGrandTotal(
          prev.payrollEntries,
          additionalFees,
          prev.sections
        ),
      };
    });

    addNotification("El adicional fue creado correctamente.", "success");
  }

  function updateItemStatus(
    sectionId: string,
    itemId: string,
    status: InvoiceLineItemStatus,
    successMessage: string
  ) {
    setInvoice((prev) => {
      const sections = prev.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const items = section.items.map((item) =>
          item.id === itemId ? { ...item, status } : item
        );

        const { subtotal, subtotalIsNegative } = recalculateSectionSubtotal(items);
        return { ...section, items, subtotal, subtotalIsNegative };
      });

      return {
        ...prev,
        sections,
        grandTotal: recalculateGrandTotal(
          prev.payrollEntries,
          prev.additionalFees,
          sections
        ),
      };
    });

    addNotification(successMessage, "success");
  }

  function updateAdditionalFeeStatus(
    itemId: string,
    status: InvoiceLineItemStatus,
    successMessage: string
  ) {
    setInvoice((prev) => {
      const additionalFees = prev.additionalFees.map((fee) =>
        fee.id === itemId ? { ...fee, status } : fee
      );

      return {
        ...prev,
        additionalFees,
        additionalFeesSubtotal: recalculateAdditionalFeesSubtotal(additionalFees),
        grandTotal: recalculateGrandTotal(
          prev.payrollEntries,
          additionalFees,
          prev.sections
        ),
      };
    });

    addNotification(successMessage, "success");
  }

  function handleApproveItem(sectionId: string, itemId: string) {
    updateItemStatus(sectionId, itemId, "Aprobado", "El ítem fue aprobado correctamente.");
  }

  function handleRejectItem(sectionId: string, itemId: string) {
    updateItemStatus(sectionId, itemId, "Rechazado", "El ítem fue rechazado.");
  }

  function handleDeleteItem(sectionId: string, itemId: string) {
    setInvoice((prev) => {
      const sections = prev.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const items = section.items.filter((item) => item.id !== itemId);
        const { subtotal, subtotalIsNegative } = recalculateSectionSubtotal(items);
        return { ...section, items, subtotal, subtotalIsNegative };
      });

      return {
        ...prev,
        sections,
        grandTotal: recalculateGrandTotal(
          prev.payrollEntries,
          prev.additionalFees,
          sections
        ),
      };
    });

    addNotification("El ítem fue eliminado.", "success");
  }

  function handleApproveAdditionalFee(itemId: string) {
    updateAdditionalFeeStatus(itemId, "Aprobado", "El adicional fue aprobado correctamente.");
  }

  function handleRejectAdditionalFee(itemId: string) {
    updateAdditionalFeeStatus(itemId, "Rechazado", "El adicional fue rechazado.");
  }

  function handleDeleteAdditionalFee(itemId: string) {
    setInvoice((prev) => {
      const additionalFees = prev.additionalFees.filter((fee) => fee.id !== itemId);
      const additionalFeesSubtotal = recalculateAdditionalFeesSubtotal(additionalFees);

      return {
        ...prev,
        additionalFees,
        additionalFeesSubtotal,
        grandTotal: recalculateGrandTotal(
          prev.payrollEntries,
          additionalFees,
          prev.sections
        ),
      };
    });

    addNotification("El adicional fue eliminado.", "success");
  }

  function handleEmitInvoiceClick() {
    if (allItemsApproved) {
      setEmitModal("confirm-emit");
    } else {
      setEmitModal("cannot-emit");
    }
  }

  function handleConfirmEmit() {
    setEmitModal(null);
    addNotification("La factura fue emitida correctamente.", "success");
  }

  const payrollSubtotal = recalculatePayrollSubtotal(filteredPayrollEntries);
  const additionalFeesSubtotal = recalculateAdditionalFeesSubtotal(filteredAdditionalFees);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <AdminHubBreadcrumbs />

      <div>
        <h1 className="text-[32px] font-bold text-black leading-[1.3]">Factura</h1>
        <p className="text-[16px] font-semibold text-[#343434] leading-[1.3]">
          Cliente {invoice.client} - {invoice.period}
        </p>
      </div>

      <InvoiceClientInfoGrid invoice={invoice} />

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] text-[#0097B2] leading-5 hover:bg-[#DFFAFF] transition-colors"
        >
          <Download size={20} />
          Exportar
        </button>
        <button
          type="button"
          onClick={() => setIsCreateItemOpen(true)}
          className="inline-flex h-9 items-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors"
        >
          <Plus size={20} />
          Crear ítem
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border-b border-[#EFEFEF]">
          <div className="flex flex-wrap gap-[38px]">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center gap-3.5 pb-0 text-[14px] font-medium leading-[1.2] transition-colors ${
                    isActive ? "text-[#0097B2]" : "text-[#858585] hover:text-[#0097B2]"
                  }`}
                >
                  {tab.label}
                  {isActive && <span className="h-0.5 w-full rounded-full bg-[#0097B2]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full max-w-[320px]">
          <Search
            size={21}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C8C8C8]"
          />
          <input
            type="search"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-[8px] border border-[#C8C8C8] bg-white pl-11 pr-4 text-[14px] font-medium text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
          />
        </div>

        <div className="flex flex-col gap-6">
          {showPayrollSection && (
            <InvoicePayrollSection
              entries={filteredPayrollEntries}
              subtotal={payrollSubtotal}
            />
          )}

          {visibleSections.map((section) => (
            <InvoiceDetailSection
              key={section.id}
              section={section}
              onApproveItem={(itemId) => handleApproveItem(section.id, itemId)}
              onRejectItem={(itemId) => handleRejectItem(section.id, itemId)}
              onDeleteItem={(itemId) => handleDeleteItem(section.id, itemId)}
            />
          ))}

          {showAdditionalFeesSection && (
            <InvoiceAdditionalFeesSection
              items={filteredAdditionalFees}
              subtotal={additionalFeesSubtotal}
              onApproveItem={handleApproveAdditionalFee}
              onRejectItem={handleRejectAdditionalFee}
              onDeleteItem={handleDeleteAdditionalFee}
            />
          )}
        </div>

        <div className="flex w-full items-center justify-between rounded-[8px] border border-[#0097B2] bg-white px-6 py-4">
          <span className="text-[18px] font-bold text-[#0097B2]">Total</span>
          <span className="text-[18px] font-semibold text-[#0097B2]">{invoice.grandTotal}</span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] text-[#0097B2] leading-5 hover:bg-[#DFFAFF] transition-colors"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={handleEmitInvoiceClick}
            className="inline-flex h-9 items-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors"
          >
            Emitir Invoice
          </button>
        </div>
      </div>

      <CreateInvoiceItemDrawer
        open={isCreateItemOpen}
        client={invoice.client}
        onClose={() => setIsCreateItemOpen(false)}
        onItemCreated={handleItemCreated}
        onAdditionalFeeCreated={handleAdditionalFeeCreated}
      />

      {emitModal && (
        <InvoiceEmitModal
          open
          variant={emitModal}
          onClose={() => setEmitModal(null)}
          onPrimaryAction={() => {
            if (emitModal === "confirm-emit") {
              handleConfirmEmit();
            } else {
              setEmitModal(null);
            }
          }}
        />
      )}
    </div>
  );
}
