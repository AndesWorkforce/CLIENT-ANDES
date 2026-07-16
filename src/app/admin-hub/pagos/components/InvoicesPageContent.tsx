"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import AdminHubSelect from "../../components/AdminHubSelect";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import {
  buildNominaMonthOptions,
  getCurrentNominaMonthOption,
  monthOptionToPeriod,
} from "../../nominas/data/payroll-data";
import { getFacturas } from "../actions/pagos.actions";
import type { Invoice, InvoiceStatus } from "../types/invoice.types";
import { amountRangeToParams } from "../utils/facturas.utils";
import InvoiceFilterSelect from "./InvoiceFilterSelect";
import InvoicesTable from "./InvoicesTable";

const SEARCH_DEBOUNCE_MS = 350;

const AMOUNT_FILTER_OPTIONS = [
  { value: "0-10000", label: "Hasta $10.000" },
  { value: "10000-15000", label: "$10.000 – $15.000" },
  { value: "15000-20000", label: "$15.000 – $20.000" },
  { value: "20000+", label: "Más de $20.000" },
];

const STATUS_FILTER_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Pagado", label: "Pagado" },
  { value: "Vencido", label: "Vencido" },
];

function buildFilterOptions(invoices: Invoice[]) {
  return Array.from(new Set(invoices.map((inv) => inv.client))).map((client) => ({
    value: client,
    label: client,
  }));
}

function mergeClientFilterOptions(
  current: { value: string; label: string }[],
  incoming: { value: string; label: string }[],
) {
  return Array.from(
    new Map([...current, ...incoming].map((option) => [option.value, option])).values(),
  );
}

export default function InvoicesPageContent() {
  const monthOptions = useMemo(() => buildNominaMonthOptions(), []);
  const currentMonthOption = useMemo(() => getCurrentNominaMonthOption(), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthOption);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clientFilterOptions, setClientFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedPeriod = monthOptionToPeriod(selectedMonth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    const amountParams = amountFilter ? amountRangeToParams(amountFilter) : {};

    const result = await getFacturas({
      monthOption: selectedMonth,
      search: debouncedSearch,
      cliente: clientFilter || undefined,
      estado: (statusFilter as InvoiceStatus) || undefined,
      ...amountParams,
    });

    if (!result.success) {
      setError(result.message ?? "Error al cargar facturas");
      setInvoices([]);
      setLoading(false);
      return;
    }

    const items = result.data ?? [];
    setInvoices(items);
    setClientFilterOptions((prev) =>
      mergeClientFilterOptions(prev, buildFilterOptions(items)),
    );
    setLoading(false);
  }, [selectedMonth, debouncedSearch, clientFilter, amountFilter, statusFilter]);

  useEffect(() => {
    void fetchInvoices();
  }, [fetchInvoices]);

  function clearFilters() {
    setClientFilter("");
    setAmountFilter("");
    setStatusFilter("");
  }

  const hasActiveFilters = Boolean(clientFilter || amountFilter || statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Invoices</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHubSelect
          value={selectedMonth}
          onChange={setSelectedMonth}
          options={monthOptions.map((month) => ({ value: month, label: month }))}
          variant="filter"
        />

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] text-white leading-5 hover:bg-[#008099] transition-colors"
        >
          <Plus size={20} />
          Crear nuevo
        </button>
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
              label="Filtrar por Monto"
              placeholder="Monto"
              value={amountFilter}
              onChange={setAmountFilter}
              options={AMOUNT_FILTER_OPTIONS}
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

      {error && (
        <p className="text-[14px] text-[#B42318]">{error}</p>
      )}

      {loading ? (
        <TableSkeleton />
      ) : (
        <InvoicesTable invoices={invoices} displayPeriod={selectedPeriod} />
      )}
    </div>
  );
}
