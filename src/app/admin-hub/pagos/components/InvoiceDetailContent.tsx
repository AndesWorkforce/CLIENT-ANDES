"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Filter, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notifications.store";
import { formatClientPrice } from "../../nominas/data/mock-contractors";
import { 
  emitInvoice, 
  approveCustomerCharge, 
  cancelCustomerCharge,
  approveCustomerCredit
} from "../actions/pagos.actions";
import type {
  InvoiceAdditionalFee,
  InvoiceDetail,
  InvoiceLineItem,
  InvoiceLineItemStatus,
  InvoicePayrollEntry,
  InvoiceSection,
} from "../data/mock-invoice-details";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import CreateInvoiceItemDrawer, { type MovementType } from "./CreateInvoiceItemDrawer";
import InvoiceFilterSelect from "./InvoiceFilterSelect";
import InvoiceAdditionalFeesSection from "./InvoiceAdditionalFeesSection";
import InvoiceClientInfoGrid from "./InvoiceClientInfoGrid";
import InvoiceDetailSection from "./InvoiceDetailSection";
import InvoiceEmitModal, { type InvoiceEmitModalVariant } from "./InvoiceEmitModal";
import InvoicePayrollSection from "./InvoicePayrollSection";

type TabKey = "all" | "nomina" | "adicionales" | "customer-charges" | "customer-credits";

const DETAIL_STATUS_FILTER_OPTIONS = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

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
  const normalized = amount.replace(/[^\d.-]/g, "");
  return parseFloat(normalized) || 0;
}

function formatAmount(value: number, isNegative?: boolean): string {
  const abs = Math.abs(value);
  const formatted = `$${abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function matchesDetailStatus(
  status: InvoiceLineItem["status"] | InvoicePayrollEntry["status"],
  filter: string
): boolean {
  if (!filter) return true;
  if (filter === "Aprobado") {
    return status === "Aprobado" || status === "Aprobada";
  }
  return status === filter;
}

function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));
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
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail>(initialInvoice);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("");
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [emitModal, setEmitModal] = useState<InvoiceEmitModalVariant | null>(null);
  const [isEmitting, setIsEmitting] = useState(false);
  const [isFooterDocked, setIsFooterDocked] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const footerDockSentinelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setFooterHeight(entry.contentRect.height);
    });

    resizeObserver.observe(footer);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const sentinel = footerDockSentinelRef.current;
    const scrollRoot = sentinel?.closest("main");
    if (!sentinel || !scrollRoot) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterDocked(entry.isIntersecting),
      { root: scrollRoot, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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

  const typeFilterOptions = useMemo(
    () =>
      buildFilterOptions([
        ...invoice.sections.flatMap((section) => section.items.map((item) => item.type)),
        ...invoice.additionalFees.map((fee) => fee.description),
      ]),
    [invoice.sections, invoice.additionalFees]
  );

  const contractorFilterOptions = useMemo(
    () =>
      buildFilterOptions([
        ...invoice.payrollEntries.map((entry) => entry.contractorName),
        ...invoice.additionalFees.map((fee) => fee.contractor),
        ...invoice.sections.flatMap((section) => section.items.map((item) => item.contractor)),
      ]),
    [invoice.payrollEntries, invoice.additionalFees, invoice.sections]
  );

  const filteredPayrollEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...invoice.payrollEntries];

    if (query) {
      result = result.filter(
        (entry) =>
          entry.contractorName.toLowerCase().includes(query) ||
          entry.position.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter((entry) => matchesDetailStatus(entry.status, statusFilter));
    }

    if (contractorFilter) {
      result = result.filter((entry) => entry.contractorName === contractorFilter);
    }

    return result;
  }, [invoice.payrollEntries, searchQuery, statusFilter, contractorFilter]);

  const filteredAdditionalFees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...invoice.additionalFees];

    if (query) {
      result = result.filter(
        (fee) =>
          fee.contractor.toLowerCase().includes(query) ||
          fee.position.toLowerCase().includes(query) ||
          fee.description.toLowerCase().includes(query) ||
          fee.createdBy.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter((fee) => matchesDetailStatus(fee.status, statusFilter));
    }

    if (contractorFilter) {
      result = result.filter((fee) => fee.contractor === contractorFilter);
    }

    if (typeFilter) {
      result = result.filter((fee) => fee.description === typeFilter);
    }

    return result;
  }, [
    invoice.additionalFees,
    searchQuery,
    statusFilter,
    contractorFilter,
    typeFilter,
  ]);

  const visibleSections = useMemo(() => {
    if (activeTab === "nomina" || activeTab === "adicionales") {
      return [];
    }

    let sections =
      activeTab === "all"
        ? invoice.sections
        : invoice.sections.filter((s) => s.tabKey === activeTab);

    const query = searchQuery.trim().toLowerCase();

    return sections
      .map((section) => {
        let items = [...section.items];

        if (query) {
          items = items.filter(
            (item) =>
              item.type.toLowerCase().includes(query) ||
              item.contractor.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query) ||
              item.createdBy.toLowerCase().includes(query)
          );
        }

        if (statusFilter) {
          items = items.filter((item) => matchesDetailStatus(item.status, statusFilter));
        }

        if (contractorFilter) {
          items = items.filter((item) => item.contractor === contractorFilter);
        }

        if (typeFilter) {
          items = items.filter((item) => item.type === typeFilter);
        }

        const { subtotal, subtotalIsNegative } = recalculateSectionSubtotal(items);
        return { ...section, items, subtotal, subtotalIsNegative };
      })
      .filter((section) => section.items.length > 0);
  }, [
    invoice.sections,
    activeTab,
    searchQuery,
    statusFilter,
    contractorFilter,
    typeFilter,
  ]);

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

  async function handleApproveItem(sectionId: string, itemId: string) {
    const section = invoice.sections.find((s) => s.id === sectionId);
    if (!section) return;

    if (section.tabKey === "customer-charges") {
      const result = await approveCustomerCharge(itemId);
      if (result.success) {
        addNotification("Cargo aprobado exitosamente", "success");
        setTimeout(() => router.refresh(), 500);
      } else {
        addNotification(result.message || "Error al aprobar el cargo", "error");
      }
    } else if (section.tabKey === "customer-credits") {
      const result = await approveCustomerCredit(itemId);
      if (result.success) {
        addNotification("Crédito aprobado exitosamente", "success");
        setTimeout(() => router.refresh(), 500);
      } else {
        addNotification(result.message || "Error al aprobar el crédito", "error");
      }
    } else {
      updateItemStatus(sectionId, itemId, "Aprobado", "El ítem fue aprobado correctamente.");
    }
  }

  function handleRejectItem(sectionId: string, itemId: string) {
    updateItemStatus(sectionId, itemId, "Rechazado", "El ítem fue rechazado.");
  }

  async function handleDeleteItem(sectionId: string, itemId: string) {
    const section = invoice.sections.find((s) => s.id === sectionId);
    if (!section) return;

    if (section.tabKey === "customer-charges") {
      const result = await cancelCustomerCharge(itemId);
      if (result.success) {
        addNotification("Cargo anulado exitosamente", "success");
        // Pequeño delay para asegurar que el backend actualizó los datos
        setTimeout(() => router.refresh(), 100);
      } else {
        addNotification(result.message || "Error al anular el cargo", "error");
      }
    } else {
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

  async function handleConfirmEmit() {
    setIsEmitting(true);
    
    try {
      const result = await emitInvoice(invoice.empresaId, invoice.period);
      
      if (result.success) {
        addNotification("La factura fue emitida correctamente.", "success");
        setEmitModal(null);
        
        // Refrescar la página para obtener el estado actualizado
        router.refresh();
      } else {
        addNotification(result.message || "Error al emitir la factura", "error");
      }
    } catch (error) {
      console.error("[INVOICE] Error al emitir factura:", error);
      addNotification("Error al emitir la factura", "error");
    } finally {
      setIsEmitting(false);
    }
  }

  const payrollSubtotal = recalculatePayrollSubtotal(filteredPayrollEntries);
  const additionalFeesSubtotal = recalculateAdditionalFeesSubtotal(filteredAdditionalFees);

  const hasActiveFilters = Boolean(statusFilter || typeFilter || contractorFilter);

  function clearFilters() {
    setStatusFilter("");
    setTypeFilter("");
    setContractorFilter("");
  }

  const showTypeFilter = activeTab !== "nomina";

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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <AdminHubSearchInput value={searchQuery} onChange={setSearchQuery} />

          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
            className={`${ADMIN_HUB_FILTER_BUTTON_CLASS} ${
              filtersOpen
                ? "border-[#0097B2] text-[#0097B2]"
                : "border-[#C8C8C8] text-[#858585] hover:border-[#0097B2] hover:text-[#0097B2]"
            }`}
          >
            Filtros
            <Filter size={18} />
          </button>
        </div>

        {filtersOpen && (
          <div className={ADMIN_HUB_FILTERS_ROW_CLASS}>
            <InvoiceFilterSelect
              label="Filtrar por Estado"
              placeholder="Pendiente"
              value={statusFilter}
              onChange={setStatusFilter}
              options={DETAIL_STATUS_FILTER_OPTIONS}
            />
            {showTypeFilter && (
              <InvoiceFilterSelect
                label="Filtrar por Tipo"
                placeholder="Tipo"
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeFilterOptions}
              />
            )}
            <InvoiceFilterSelect
              label="Filtrar por Contratista"
              placeholder="Contratista"
              value={contractorFilter}
              onChange={setContractorFilter}
              options={contractorFilterOptions}
            />
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`${ADMIN_HUB_CLEAR_FILTERS_CLASS} ${
                hasActiveFilters
                  ? "cursor-pointer text-[#0097B2] hover:text-[#008099]"
                  : "cursor-default text-[#C8C8C8]"
              }`}
            >
              Limpiar filtros
            </button>
          </div>
        )}

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

        <div ref={footerDockSentinelRef} className="h-px w-full shrink-0" aria-hidden />

        {!isFooterDocked && footerHeight > 0 ? (
          <div aria-hidden style={{ height: footerHeight }} />
        ) : null}

        <div
          ref={footerRef}
          className={`z-30 flex flex-col gap-3 border-t border-[#EFEFEF] bg-[#F8F8F8] px-6 py-4 shadow-[0_-4px_16px_rgba(112,112,112,0.08)] ${
            isFooterDocked
              ? "relative -mx-6 -mb-6 mt-6"
              : "fixed bottom-0 left-[280px] right-0"
          }`}
        >
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
              disabled={isEmitting}
              className="inline-flex h-9 items-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEmitting ? "Emitiendo..." : "Emitir Invoice"}
            </button>
          </div>
        </div>
      </div>

      <CreateInvoiceItemDrawer
        open={isCreateItemOpen}
        client={invoice.client}
        empresaId={invoice.empresaId}
        periodo={invoice.period}
        onClose={() => setIsCreateItemOpen(false)}
        onItemCreated={handleItemCreated}
        onAdditionalFeeCreated={handleAdditionalFeeCreated}
        onChargeCreated={() => router.refresh()}
      />

      {emitModal && (
        <InvoiceEmitModal
          open
          variant={emitModal}
          onClose={() => !isEmitting && setEmitModal(null)}
          onPrimaryAction={() => {
            if (emitModal === "confirm-emit") {
              handleConfirmEmit();
            } else {
              setEmitModal(null);
            }
          }}
          isLoading={isEmitting}
        />
      )}
    </div>
  );
}
