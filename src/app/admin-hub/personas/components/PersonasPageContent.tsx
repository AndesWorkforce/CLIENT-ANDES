"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, MoreVertical } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import {
  getPersonas,
  type PersonaListItem,
  type PersonasPagination,
} from "../actions/personas.actions";
import { personaToDetailPath } from "../utils/persona-detail.utils";
import type { PersonaStatus } from "../types/persona-detail.types";
import PersonaStatusBadge from "./PersonaStatusBadge";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));
}

const STATUS_FILTER_OPTIONS: { value: PersonaStatus; label: string }[] = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

function collectFilterOptions(contractors: PersonaListItem[]) {
  return {
    countries: buildFilterOptions(
      contractors.map((contractor) => contractor.countryName),
    ),
    clients: buildFilterOptions(
      contractors.map((contractor) => contractor.contracts[0]?.client ?? ""),
    ),
    positions: buildFilterOptions(
      contractors.map((contractor) => contractor.contracts[0]?.position ?? ""),
    ),
  };
}

function mergeFilterOptions(
  current: ReturnType<typeof collectFilterOptions>,
  incoming: ReturnType<typeof collectFilterOptions>,
) {
  return {
    countries: buildFilterOptions([
      ...current.countries.map((option) => option.value),
      ...incoming.countries.map((option) => option.value),
    ]),
    clients: buildFilterOptions([
      ...current.clients.map((option) => option.value),
      ...incoming.clients.map((option) => option.value),
    ]),
    positions: buildFilterOptions([
      ...current.positions.map((option) => option.value),
      ...incoming.positions.map((option) => option.value),
    ]),
  };
}

export default function PersonasPageContent() {
  const [contractors, setContractors] = useState<PersonaListItem[]>([]);
  const [pagination, setPagination] = useState<PersonasPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as { value: string; label: string }[],
    clients: [] as { value: string; label: string }[],
    positions: [] as { value: string; label: string }[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await getPersonas({ page: 1, limit: 500 });
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

  const loadPersonas = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getPersonas({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      pais: countryFilter || undefined,
      cliente: clientFilter || undefined,
      puesto: positionFilter || undefined,
      estado: (statusFilter as PersonaStatus) || undefined,
    });

    if (!response.success || !response.data) {
      setContractors([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        page: 1,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }));
      setError(response.message || "No se pudieron cargar los contratistas");
      setLoading(false);
      return;
    }

    setContractors(response.data);
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
    countryFilter,
    clientFilter,
    positionFilter,
    statusFilter,
  ]);

  useEffect(() => {
    void loadPersonas();
  }, [loadPersonas]);

  useEffect(() => {
    if (!openMenuId) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-persona-row-menu]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [contractors]);

  function clearFilters() {
    setCountryFilter("");
    setClientFilter("");
    setPositionFilter("");
    setStatusFilter("");
    setPage(1);
  }

  const hasActiveFilters = Boolean(
    countryFilter || clientFilter || positionFilter || statusFilter,
  );

  const allSelected =
    contractors.length > 0 &&
    contractors.every((contractor) => selectedIds.has(contractor.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contractors.map((contractor) => contractor.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const visiblePages = useMemo(() => {
    const total = pagination.totalPages;
    if (total <= 1) return [];

    const maxButtons = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxButtons / 2));
    const end = Math.min(total, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pagination.page, pagination.totalPages]);

  const checkboxClass = "size-4 rounded border-[#EFEFEF] accent-[#0097B2]";

  const headClass =
    "px-3 py-5 text-left text-[14px] font-bold leading-[1.3] text-[#525252]";
  const cellClass =
    "px-3 py-3 text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585] whitespace-nowrap";

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Personas</h1>

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
              label="Filtrar por País"
              placeholder="País"
              value={countryFilter}
              onChange={(value) => {
                setCountryFilter(value);
                setPage(1);
              }}
              options={filterOptions.countries}
            />
            <InvoiceFilterSelect
              label="Filtrar por Cliente"
              placeholder="Cliente"
              value={clientFilter}
              onChange={(value) => {
                setClientFilter(value);
                setPage(1);
              }}
              options={filterOptions.clients}
            />
            <InvoiceFilterSelect
              label="Filtrar por Puesto"
              placeholder="Puesto"
              value={positionFilter}
              onChange={(value) => {
                setPositionFilter(value);
                setPage(1);
              }}
              options={filterOptions.positions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Estado"
              placeholder="Estado"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              options={STATUS_FILTER_OPTIONS}
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
        <AdminHubTableShell>
          <table className="w-full min-w-[700px] border-collapse bg-white">
            <thead>
              <tr className="border-b border-[#EFEFEF]">
                <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className={checkboxClass}
                    aria-label="Seleccionar todos"
                  />
                </th>
                <th className="py-5 pl-3 pr-3 text-left text-[14px] font-bold leading-[1.3] text-[#525252]">
                  Contratista
                </th>
                <th className={headClass}>País</th>
                <th className={headClass}>Cliente</th>
                <th className={headClass}>Puesto</th>
                <th className={headClass}>Estado</th>
                <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
              </tr>
            </thead>
            <tbody>
              {contractors.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-[14px] text-[#858585]"
                  >
                    No se encontraron contratistas con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                contractors.map((contractor) => {
                  const primaryContract = contractor.contracts[0];

                  return (
                    <tr key={contractor.id} className={ADMIN_HUB_TABLE_ROW}>
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(contractor.id)}
                          onChange={() => toggleOne(contractor.id)}
                          className={checkboxClass}
                          aria-label={`Seleccionar ${contractor.name}`}
                        />
                      </td>
                      <td className={`pl-3 pr-3 ${cellClass}`}>{contractor.name}</td>
                      <td className={cellClass}>{contractor.countryName}</td>
                      <td className={cellClass}>{primaryContract?.client ?? "—"}</td>
                      <td className={cellClass}>{primaryContract?.position ?? "—"}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <PersonaStatusBadge status={contractor.status} />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="relative inline-block" data-persona-row-menu>
                          <button
                            type="button"
                            aria-label="Más opciones"
                            aria-expanded={openMenuId === contractor.id}
                            aria-haspopup="menu"
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === contractor.id ? null : contractor.id,
                              )
                            }
                            className={`rounded p-1 transition-colors ${
                              openMenuId === contractor.id
                                ? "bg-[#DFFAFF] text-[#0097B2]"
                                : "text-[#858585] hover:text-[#0097B2]"
                            }`}
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === contractor.id && (
                            <div
                              role="menu"
                              className="absolute right-0 top-full z-50 mt-1 min-w-[148px] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
                            >
                              <Link
                                href={personaToDetailPath(contractor)}
                                role="menuitem"
                                onClick={() => setOpenMenuId(null)}
                                className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F8F8F8]"
                              >
                                Ver Perfil
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </AdminHubTableShell>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-[#858585]">
            Mostrando página {pagination.page} de {pagination.totalPages} (
            {pagination.total} contratistas)
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
