"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubDateRangePicker from "../../components/AdminHubDateRangePicker";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import {
  getHistorial,
  type HistorialPagination,
} from "../actions/historial.actions";
import type { HistorialItem, HistorialModulo } from "../types/historial.types";
import { HISTORIAL_MODULO_LABEL } from "../types/historial.types";
import HistorialTable from "./HistorialTable";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

const MODULO_OPTIONS = (
  Object.entries(HISTORIAL_MODULO_LABEL) as [HistorialModulo, string][]
).map(([value, label]) => ({ value, label }));

export default function HistorialPageContent() {
  const [rows, setRows] = useState<HistorialItem[]>([]);
  const [pagination, setPagination] = useState<HistorialPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [usuarioQuery, setUsuarioQuery] = useState("");
  const [debouncedUsuario, setDebouncedUsuario] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [moduloFilter, setModuloFilter] = useState<HistorialModulo | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedUsuario(usuarioQuery.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [usuarioQuery]);

  const loadHistorial = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getHistorial({
      page,
      limit: PAGE_SIZE,
      modulo: moduloFilter || undefined,
      usuario: debouncedUsuario || undefined,
      desde: fromDate || undefined,
      hasta: toDate || undefined,
    });

    if (!response.success || !response.data) {
      setRows([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        page: 1,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }));
      setError(response.message || "No se pudo cargar el historial");
      setLoading(false);
      return;
    }

    setRows(response.data);
    if (response.pagination) {
      setPagination(response.pagination);
    }
    setLoading(false);
  }, [page, moduloFilter, debouncedUsuario, fromDate, toDate]);

  useEffect(() => {
    void loadHistorial();
  }, [loadHistorial]);

  function clearFilters() {
    setModuloFilter("");
    setFromDate("");
    setToDate("");
    setUsuarioQuery("");
    setDebouncedUsuario("");
    setPage(1);
  }

  const hasActiveFilters = Boolean(
    moduloFilter || fromDate || toDate || debouncedUsuario,
  );

  const visiblePages = useMemo(() => {
    const total = pagination.totalPages;
    if (total <= 1) return [];
    const current = pagination.page;
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const pages: number[] = [];
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [pagination.page, pagination.totalPages]);

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Historial</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <AdminHubSearchInput
            value={usuarioQuery}
            onChange={setUsuarioQuery}
            placeholder="Buscar por usuario"
          />

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
          <div className={`${ADMIN_HUB_FILTERS_ROW_CLASS} items-end`}>
            <InvoiceFilterSelect
              label="Filtrar por Módulo"
              placeholder="Módulo"
              value={moduloFilter}
              onChange={(value) => {
                setModuloFilter((value as HistorialModulo) || "");
                setPage(1);
              }}
              options={MODULO_OPTIONS}
            />
            <AdminHubDateRangePicker
              variant="filter"
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={(date) => {
                setFromDate(date);
                setPage(1);
              }}
              onToDateChange={(date) => {
                setToDate(date);
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
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {error && !loading ? (
        <div className="rounded-[8px] border border-[#FECDCA] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[8px] border border-[#EFEFEF] bg-white p-6">
          <TableSkeleton />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-[12px] border border-[#EFEFEF] bg-white px-6 py-12 text-center text-[14px] text-[#858585]">
          {hasActiveFilters
            ? "No hay acciones que coincidan con los filtros aplicados."
            : "Aún no hay acciones registradas en el Admin Hub."}
        </div>
      ) : (
        <HistorialTable rows={rows} />
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-[#858585]">
            Mostrando página {pagination.page} de {pagination.totalPages} (
            {pagination.total} acciones)
          </p>

          <div className="inline-flex overflow-hidden rounded-[8px] border border-[#EFEFEF]">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPreviousPage}
              className="flex items-center justify-center px-3 py-2 text-[#0097B2] transition-colors hover:bg-[#F8F8F8] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Página anterior"
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
              aria-label="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
