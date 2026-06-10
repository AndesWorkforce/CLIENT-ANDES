"use client";

import { useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import {
  addPayrollVariable,
  getPayrollVariables,
  removePayrollVariable,
  updatePayrollVariableStatus,
} from "../data/payroll-data";
import {
  PAYROLL_VARIABLE_TABS,
  type PayrollVariable,
  type PayrollVariableCategory,
  type PayrollVariableStatus,
} from "../data/mock-payroll-variables";
import CreatePayrollVariableDrawer from "./CreatePayrollVariableDrawer";
import PayrollVariablesTable from "./PayrollVariablesTable";

function buildFilterOptions<T>(items: T[], getValue: (item: T) => string) {
  return Array.from(new Set(items.map(getValue))).map((value) => ({
    value,
    label: value,
  }));
}

const STATUS_FILTER_OPTIONS: { value: PayrollVariableStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

export const PAYROLL_VARIABLE_CREATED_TOAST =
  "La variable fue creada correctamente.";

export default function PayrollVariablesPageContent() {
  const { addNotification } = useNotificationStore();
  const [variables, setVariables] = useState<PayrollVariable[]>(() => getPayrollVariables());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PayrollVariableCategory>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredVariables = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...variables];

    if (activeTab !== "todos") {
      result = result.filter((item) => item.category === activeTab);
    }

    if (query) {
      result = result.filter(
        (item) =>
          item.contractor.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.createdBy.toLowerCase().includes(query)
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

    return result;
  }, [variables, activeTab, searchQuery, clientFilter, typeFilter, statusFilter]);

  function refreshVariables() {
    setVariables([...getPayrollVariables()]);
  }

  function handleApprove(itemId: string) {
    updatePayrollVariableStatus(itemId, "Aprobado");
    refreshVariables();
    addNotification("La variable fue aprobada correctamente.", "success", "compact");
  }

  function handleReject(itemId: string) {
    updatePayrollVariableStatus(itemId, "Rechazado");
    refreshVariables();
    addNotification("La variable fue rechazada.", "success", "compact");
  }

  function handleDelete(itemId: string) {
    removePayrollVariable(itemId);
    refreshVariables();
    addNotification("La variable fue eliminada.", "success", "compact");
  }

  function handleVariableCreated(variable: PayrollVariable) {
    addPayrollVariable(variable);
    setVariables([...getPayrollVariables()]);

    if (activeTab !== "todos" && activeTab !== variable.category) {
      setActiveTab(variable.category);
    }

    setSearchQuery("");
    setClientFilter("");
    setTypeFilter("");
    setStatusFilter("");
    addNotification(PAYROLL_VARIABLE_CREATED_TOAST, "success", "compact");
  }

  function clearFilters() {
    setClientFilter("");
    setTypeFilter("");
    setStatusFilter("");
  }

  const hasActiveFilters = Boolean(clientFilter || typeFilter || statusFilter);

  const clientFilterOptions = buildFilterOptions(variables, (item) => item.client);
  const typeFilterOptions = buildFilterOptions(variables, (item) => item.type);

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-bold text-black leading-[1.3]">
          Variable de nóminas
        </h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium text-white leading-5 hover:bg-[#008099] transition-colors"
        >
          <Plus size={20} />
          Crear nuevo
        </button>
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
                {tab.label}
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
            Filtros
            <Filter size={18} />
          </button>
        </div>

        {filtersOpen && (
          <div className={ADMIN_HUB_FILTERS_ROW_CLASS}>
            <InvoiceFilterSelect
              label="Filtrar por Cliente"
              placeholder="Cliente"
              value={clientFilter}
              onChange={setClientFilter}
              options={clientFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Tipo"
              placeholder="Tipo"
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Estado"
              placeholder="Pendiente"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
            />
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`${ADMIN_HUB_CLEAR_FILTERS_CLASS} ${
                hasActiveFilters
                  ? "text-[#0097B2] hover:text-[#008099] cursor-pointer"
                  : "text-[#C8C8C8] cursor-default"
              }`}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <PayrollVariablesTable
        variables={filteredVariables}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      <CreatePayrollVariableDrawer
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onVariableCreated={handleVariableCreated}
      />
    </div>
  );
}
