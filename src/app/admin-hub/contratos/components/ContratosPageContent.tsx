"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import AdminHubDateRangePicker from "../../components/AdminHubDateRangePicker";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import { t } from "../../i18n";
import {
  getContratos,
  type ContratoListItem,
  type ContratosPagination,
} from "../actions/contratos.actions";
import {
  getContractStatusLabel,
  getPaisDisplay,
  type ContractStatusLabel,
} from "../data/contract-display";
import type { JornadaLaboral } from "../data/mock-contracts";
import ContractsTable from "./ContractsTable";

/** Listado de contratos del Admin Hub. */
const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));
}

const STATUS_FILTER_VALUES: ContractStatusLabel[] = ["Activo", "Inactivo"];
const CONTRACT_TYPE_FILTER_VALUES: JornadaLaboral[] = [
  "FULL_TIME",
  "PART_TIME",
  "HOURLY_TIME",
];
const PAYMENT_METHOD_FILTER_VALUES = [
  "Dollar App",
  "Transferencia Bancaria",
  "No Especifica",
] as const;

function collectFilterOptions(contracts: ContratoListItem[]) {
  return {
    clients: buildFilterOptions(contracts.map((contract) => contract.empresaNombre)),
    countries: buildFilterOptions(
      contracts.map((contract) =>
        getPaisDisplay(contract.paisCodigo, contract.paisNombre),
      ),
    ),
    statuses: buildFilterOptions(
      contracts.map((contract) => getContractStatusLabel(contract.activo)),
    ),
  };
}

function mergeFilterOptions(
  current: ReturnType<typeof collectFilterOptions>,
  incoming: ReturnType<typeof collectFilterOptions>,
) {
  return {
    clients: buildFilterOptions([
      ...current.clients.map((option) => option.value),
      ...incoming.clients.map((option) => option.value),
    ]),
    countries: buildFilterOptions([
      ...current.countries.map((option) => option.value),
      ...incoming.countries.map((option) => option.value),
    ]),
    statuses: buildFilterOptions([
      ...current.statuses.map((option) => option.value),
      ...incoming.statuses.map((option) => option.value),
    ]),
  };
}

export default function ContratosPageContent() {
  const [contracts, setContracts] = useState<ContratoListItem[]>([]);
  const [pagination, setPagination] = useState<ContratosPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    clients: [] as { value: string; label: string }[],
    countries: [] as { value: string; label: string }[],
    statuses: [] as { value: string; label: string }[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [contractTypeFilter, setContractTypeFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startFrom, setStartFrom] = useState("");
  const [startTo, setStartTo] = useState("");
  const [endFrom, setEndFrom] = useState("");
  const [endTo, setEndTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void (async () => {
      const response = await getContratos({ page: 1, limit: 500 });
      if (response.success && response.data) {
        setFilterOptions(collectFilterOptions(response.data));
      }
    })();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadContratos = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getContratos({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      cliente: clientFilter || undefined,
      pais: countryFilter || undefined,
      tipoJornada: (contractTypeFilter as JornadaLaboral) || undefined,
      estado: (statusFilter as ContractStatusLabel) || undefined,
      metodoPago: paymentFilter || undefined,
      fechaInicioDesde: startFrom || undefined,
      fechaInicioHasta: startTo || undefined,
      fechaFinDesde: endFrom || undefined,
      fechaFinHasta: endTo || undefined,
    });

    if (!response.success || !response.data) {
      setContracts([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        page: 1,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }));
      setError(response.message || t("contratos.loadError"));
      setLoading(false);
      return;
    }

    setContracts(response.data);
    if (response.pagination) {
      setPagination(response.pagination);
    }
    setFilterOptions((prev) =>
      mergeFilterOptions(prev, collectFilterOptions(response.data ?? [])),
    );
    setLoading(false);
  }, [
    page,
    debouncedSearch,
    clientFilter,
    countryFilter,
    contractTypeFilter,
    paymentFilter,
    statusFilter,
    startFrom,
    startTo,
    endFrom,
    endTo,
    t,
  ]);

  useEffect(() => {
    void loadContratos();
  }, [loadContratos]);

  function clearFilters() {
    setClientFilter("");
    setCountryFilter("");
    setContractTypeFilter("");
    setPaymentFilter("");
    setStatusFilter("");
    setStartFrom("");
    setStartTo("");
    setEndFrom("");
    setEndTo("");
    setPage(1);
  }

  const hasActiveFilters = Boolean(
    clientFilter ||
      countryFilter ||
      contractTypeFilter ||
      paymentFilter ||
      statusFilter ||
      startFrom ||
      startTo ||
      endFrom ||
      endTo,
  );

  const statusFilterOptions = useMemo(
    () =>
      STATUS_FILTER_VALUES.map((value) => ({
        value,
        label: t(`status.contract.${value}`),
      })),
    [t],
  );

  const contractTypeFilterOptions = useMemo(
    () =>
      CONTRACT_TYPE_FILTER_VALUES.map((value) => ({
        value,
        label: t(`jornada.${value}`),
      })),
    [t],
  );

  const paymentMethodFilterOptions = useMemo(
    () =>
      PAYMENT_METHOD_FILTER_VALUES.map((value) => ({
        value,
        label:
          value === "Dollar App"
            ? t("paymentMethod.dollarApp")
            : value === "Transferencia Bancaria"
              ? t("paymentMethod.bankTransfer")
              : t("paymentMethod.unspecified"),
      })),
    [t],
  );

  const visiblePages = useMemo(() => {
    const total = pagination.totalPages;
    if (total <= 1) return [];

    const maxButtons = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxButtons / 2));
    const end = Math.min(total, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pagination.page, pagination.totalPages]);

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <h1 className="text-[32px] font-bold leading-[1.3] text-black">{t("contratos.title")}</h1>

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
          <div className={ADMIN_HUB_FILTERS_ROW_CLASS}>
            <InvoiceFilterSelect
              label={t("contratos.filterClient")}
              placeholder={t("contratos.client")}
              value={clientFilter}
              onChange={(value) => {
                setClientFilter(value);
                setPage(1);
              }}
              options={filterOptions.clients}
            />
            <InvoiceFilterSelect
              label={t("contratos.filterCountry")}
              placeholder={t("contratos.country")}
              value={countryFilter}
              onChange={(value) => {
                setCountryFilter(value);
                setPage(1);
              }}
              options={filterOptions.countries}
            />
            <InvoiceFilterSelect
              label={t("contratos.filterType")}
              placeholder={t("contratos.type")}
              value={contractTypeFilter}
              onChange={(value) => {
                setContractTypeFilter(value);
                setPage(1);
              }}
              options={contractTypeFilterOptions}
            />
            <InvoiceFilterSelect
              label={t("contratos.filterPayment")}
              placeholder={t("contratos.paymentMethod")}
              value={paymentFilter}
              onChange={(value) => {
                setPaymentFilter(value);
                setPage(1);
              }}
              options={paymentMethodFilterOptions}
            />
            <InvoiceFilterSelect
              label={t("contratos.filterStatus")}
              placeholder={t("contratos.status")}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              options={statusFilterOptions}
            />
            <AdminHubDateRangePicker
              variant="filter"
              fromLabel={t("contratos.filterStartFrom")}
              toLabel={t("contratos.filterStartTo")}
              fromDate={startFrom}
              toDate={startTo}
              onFromDateChange={(value) => {
                setStartFrom(value);
                setPage(1);
              }}
              onToDateChange={(value) => {
                setStartTo(value);
                setPage(1);
              }}
            />
            {/* Las fechas de finalización suelen ser futuras, así que este rango
                no se topa en el día de hoy. */}
            <AdminHubDateRangePicker
              variant="filter"
              allowFuture
              fromLabel={t("contratos.filterEndFrom")}
              toLabel={t("contratos.filterEndTo")}
              fromDate={endFrom}
              toDate={endTo}
              onFromDateChange={(value) => {
                setEndFrom(value);
                setPage(1);
              }}
              onToDateChange={(value) => {
                setEndTo(value);
                setPage(1);
              }}
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
              {t("common.clearFilters")}
            </button>
          </div>
        )}
      </div>

      {error && !loading && (
        <div className="rounded-[8px] border border-[#FECDCA] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[8px] border border-[#EFEFEF] bg-white p-6">
          <TableSkeleton />
        </div>
      ) : (
        <ContractsTable contracts={contracts} />
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-[#858585]">
            {t("common.showingPage", {
              page: pagination.page,
              total: pagination.totalPages,
            })}
          </p>

          <div className="inline-flex overflow-hidden rounded-[8px] border border-[#EFEFEF]">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPreviousPage}
              className="flex items-center justify-center px-3 py-2 text-[#0097B2] transition-colors hover:bg-[#F8F8F8] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t("common.previousPage")}
            >
              <ChevronLeft size={18} />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`min-w-[40px] px-3 py-2 text-[14px] transition-colors ${
                  pagination.page === pageNumber
                    ? "bg-[#0097B2] text-white"
                    : "text-[#0097B2] hover:bg-[#F8F8F8]"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(pagination.totalPages, prev + 1))
              }
              disabled={!pagination.hasNextPage}
              className="flex items-center justify-center px-3 py-2 text-[#0097B2] transition-colors hover:bg-[#F8F8F8] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t("common.nextPage")}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
