"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Filter, Plus } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { includesSearchText, normalizeSearchText } from "../../lib/search-text";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubDateRangePicker from "../../components/AdminHubDateRangePicker";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import { ADMIN_HUB_CLEAR_FILTERS_CLASS, ADMIN_HUB_FILTER_BUTTON_CLASS, ADMIN_HUB_FILTERS_ROW_CLASS } from "../../components/admin-hub-filter-styles";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import {
  approveNominaVariable,
  approveNominaVariablesBulk,
  deleteNominaVariable,
  getNominaVariables,
  rejectNominaVariable,
} from "../actions/payroll-variables.actions";
import {
  matchesPayrollVariableCategory,
  PAYROLL_VARIABLE_TABS,
  type PayrollVariable,
  type PayrollVariableCategory,
  type PayrollVariableStatus,
  type PayrollVariableType,
} from "../data/mock-payroll-variables";
import CreatePayrollVariableDrawer from "./CreatePayrollVariableDrawer";
import PayrollVariablesTable from "./PayrollVariablesTable";
import AdminHubConfirmModal from "./AdminHubConfirmModal";
import { useAdminHubI18n } from "../../i18n";

function buildFilterOptions<T>(items: T[], getValue: (item: T) => string) {
  return Array.from(new Set(items.map(getValue))).map((value) => ({
    value,
    label: value,
  }));
}

/**
 * Convierte una fecha en formato MM.DD.YY a formato ISO YYYY-MM-DD
 * Ejemplo: "03.21.26" -> "2026-03-21"
 */
function parseDisplayDateToIso(displayDate: string): string | null {
  if (!displayDate) return null;
  const parts = displayDate.split(".");
  if (parts.length !== 3) return null;
  
  const [month, day, year] = parts;
  // Asumimos que años de 2 dígitos son del siglo 21 (20XX)
  const fullYear = `20${year}`;
  
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Compara si una fecha está dentro de un rango (inclusive)
 */
function isDateInRange(dateStr: string, fromDate: string, toDate: string): boolean {
  const date = parseDisplayDateToIso(dateStr);
  if (!date) return true; // Si no se puede parsear, incluir por defecto
  
  if (fromDate && date < fromDate) return false;
  if (toDate && date > toDate) return false;
  
  return true;
}

const STATUS_FILTER_VALUES: PayrollVariableStatus[] = [
  "Pendiente",
  "Aprobado",
  "Rechazado",
  "Emitido",
];

const PAYROLL_VARIABLE_TAB_KEYS: Record<PayrollVariableCategory, string> = {
  todos: "nominas.tabs.all",
  overtimes: "nominas.tabs.overtimes",
  holidays: "nominas.tabs.holidays",
  deducciones: "nominas.tabs.deductions",
  incomeVariables: "nominas.tabs.incomeVariables",
};

interface PayrollVariablesPageContentProps {
  initialSearchQuery?: string;
}

export default function PayrollVariablesPageContent({
  initialSearchQuery = "",
}: PayrollVariablesPageContentProps) {
  const { addNotification } = useNotificationStore();
  const { t } = useAdminHubI18n();
  const statusFilterOptions = useMemo(
    () =>
      STATUS_FILTER_VALUES.map((value) => ({
        value,
        label: t(`status.payroll.${value}`),
      })),
    [t],
  );
  const [variables, setVariables] = useState<PayrollVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PayrollVariableCategory>("todos");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);
  const [isBulkApproving, setIsBulkApproving] = useState(false);

  const loadVariables = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const result = await getNominaVariables({
      search: searchQuery,
      cliente: clientFilter,
      categoria: activeTab,
    });
    if (!result.success) {
      setLoadError(result.message || t("nominas.variablesLoadError"));
      setVariables([]);
    } else {
      setVariables(result.data ?? []);
    }
    setLoading(false);
  }, [activeTab, clientFilter, searchQuery, t]);

  useEffect(() => {
    void loadVariables();
  }, [loadVariables]);

  const filteredVariables = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    let result = [...variables];

    if (activeTab !== "todos") {
      result = result.filter((item) => matchesPayrollVariableCategory(item, activeTab));
    }

    if (query) {
      result = result.filter(
        (item) =>
          includesSearchText(item.contractor, query) ||
          includesSearchText(item.client, query) ||
          includesSearchText(item.description, query) ||
          includesSearchText(item.type, query) ||
          includesSearchText(item.createdBy, query)
      );
    }

    if (clientFilter) {
      result = result.filter((item) => item.client === clientFilter);
    }

    if (typeFilter) {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (fromDate || toDate) {
      result = result.filter((item) => isDateInRange(item.date, fromDate, toDate));
    }

    return result;
  }, [
    activeTab,
    clientFilter,
    fromDate,
    searchQuery,
    statusFilter,
    toDate,
    typeFilter,
    variables,
  ]);

  async function handleApprove(itemId: string) {
    const result = await approveNominaVariable(itemId);
    if (!result.success) {
      addNotification(result.message || t("nominas.approveError"), "error");
      return;
    }
    await loadVariables();
    addNotification(t("nominas.variableApproved"), "success", "compact");
  }

  async function handleReject(itemId: string) {
    const result = await rejectNominaVariable(itemId);
    if (!result.success) {
      addNotification(result.message || t("nominas.rejectError"), "error");
      return;
    }
    await loadVariables();
    addNotification(t("nominas.variableRejected"), "success", "compact");
  }

  async function handleDelete(itemId: string) {
    const result = await deleteNominaVariable(itemId);
    if (!result.success) {
      addNotification(result.message || t("nominas.deleteError"), "error");
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
    await loadVariables();
    addNotification(t("nominas.variableDeleted"), "success", "compact");
  }

  async function handleBulkApproveConfirm() {
    const selected = filteredVariables.filter((item) => selectedIds.has(item.id));
    const pendingRefs = selected
      .filter((item) => item.status === "Pendiente")
      .map((item) => item.id);
    const skipped = selected.length - pendingRefs.length;

    setIsBulkApproving(true);
    try {
      const result = await approveNominaVariablesBulk(pendingRefs);
      await loadVariables();
      setSelectedIds(new Set());
      setShowApproveConfirmModal(false);

      if (result.failed && result.failed > 0) {
        addNotification(
          t("nominas.bulkApprovePartial", {
            approved: result.approved ?? 0,
            failed: result.failed,
            skipped,
          }),
          "warning",
        );
      } else if ((result.approved ?? 0) === 0 && skipped > 0) {
        addNotification(
          t("nominas.bulkApproveNonePending", { skipped }),
          "info",
          "compact",
        );
      } else {
        addNotification(
          `${t("nominas.bulkApproveSuccess", { approved: result.approved ?? 0 })}${
            skipped > 0 ? t("nominas.bulkApproveSkippedSuffix", { skipped }) : ""
          }.`,
          "success",
          "compact",
        );
      }
    } finally {
      setIsBulkApproving(false);
    }
  }

  function handleVariableCreated(variable: PayrollVariable) {
    void loadVariables();

    if (activeTab !== "todos" && activeTab !== variable.category) {
      setActiveTab(variable.category);
    }

    setSearchQuery("");
    setClientFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    addNotification(t("nominas.createdSuccess"), "success", "compact");
  }

  function clearFilters() {
    setClientFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
  }

  const hasActiveFilters = Boolean(clientFilter || typeFilter || statusFilter || fromDate || toDate);
  const hasSelectedRows = selectedIds.size > 0;

  const clientFilterOptions = buildFilterOptions(variables, (item) => item.client);
  const typeFilterOptions = buildFilterOptions(variables, (item) => item.type).map(
    (option) => ({
      value: option.value,
      label: t(`nominas.types.${option.value as PayrollVariableType}`),
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-bold text-black leading-[1.3]">
          {t("nominas.variablesTitle")}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          {hasSelectedRows ? (
            <button
              type="button"
              onClick={() => setShowApproveConfirmModal(true)}
              className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
            >
              <FileText size={24} aria-hidden />
              {t("nominas.approveVariablesN", { count: selectedIds.size })}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium text-white leading-5 hover:bg-[#008099] transition-colors"
          >
            <Plus size={20} />
            {t("nominas.createNew")}
          </button>
        </div>
      </div>

      <div className="border-b border-[#EFEFEF]">
        <div className="flex flex-wrap gap-[38px]">
          {PAYROLL_VARIABLE_TABS.map((tab) => {
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
                {t(PAYROLL_VARIABLE_TAB_KEYS[tab.key])}
                {isActive && (
                  <span className="h-0.5 w-full rounded-full bg-[#0097B2]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6">
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
            {t("common.filters")}
            <Filter size={18} />
          </button>
        </div>

        {filtersOpen && (
          <div className={`${ADMIN_HUB_FILTERS_ROW_CLASS} items-end`}>
            <AdminHubDateRangePicker
              variant="filter"
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
            <InvoiceFilterSelect
              label={t("nominas.filterClient")}
              placeholder={t("nominas.client")}
              value={clientFilter}
              onChange={setClientFilter}
              options={clientFilterOptions}
            />
            <InvoiceFilterSelect
              label={t("nominas.filterType")}
              placeholder={t("nominas.type")}
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeFilterOptions}
            />
            <InvoiceFilterSelect
              label={t("nominas.filterStatus")}
              placeholder={t("status.payroll.Pendiente")}
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusFilterOptions}
            />
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`${ADMIN_HUB_CLEAR_FILTERS_CLASS} pb-3 ${
                hasActiveFilters
                  ? "cursor-pointer text-[#0097B2] hover:text-[#008099]"
                  : "cursor-default text-[#C8C8C8]"
              }`}
            >
              {t("common.clearFilters")}
            </button>
          </div>
        )}
      </div>

      {loadError ? (
        <p className="text-sm text-red-600">{loadError}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[#525252]">{t("nominas.loadingVariables")}</p>
      ) : filteredVariables.length === 0 ? (
        <div className="rounded-[12px] border border-[#EFEFEF] bg-white px-6 py-12 text-center text-[14px] text-[#858585]">
          {t("nominas.emptyVariables")}
        </div>
      ) : (
        <PayrollVariablesTable
          variables={filteredVariables}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}

      <CreatePayrollVariableDrawer
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onVariableCreated={handleVariableCreated}
      />

      {showApproveConfirmModal && (
        <AdminHubConfirmModal
          open
          title={t("nominas.confirmApprovalVariablesTitle")}
          cancelLabel={t("common.cancel")}
          confirmLabel={
            isBulkApproving ? t("nominas.confirming") : t("nominas.confirmApproval")
          }
          confirmLoading={isBulkApproving}
          onClose={() => setShowApproveConfirmModal(false)}
          onConfirm={() => void handleBulkApproveConfirm()}
        >
          <div className="space-y-4">
            <p className="text-[14px] text-[#525252] leading-relaxed">
              {t("nominas.confirmApprovePendingHint")}
            </p>
            <div className="flex items-center justify-between py-2 border-b border-[#EFEFEF]">
              <span className="text-[14px] font-semibold text-[#525252]">
                {t("nominas.selected")}
              </span>
              <span className="text-[14px] text-[#343434]">{selectedIds.size}</span>
            </div>
          </div>
        </AdminHubConfirmModal>
      )}
    </div>
  );
}
