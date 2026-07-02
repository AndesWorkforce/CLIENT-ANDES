"use client";

import Link from "next/link";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
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
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import { MOCK_CONTRACTORS } from "../../nominas/data/mock-contractors";
import { getPersonaProfile, personaToDetailPath } from "../data/mock-persona-detail";
import type { PersonaStatus } from "../data/mock-persona-detail";
import PersonaStatusBadge from "./PersonaStatusBadge";

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

export default function PersonasPageContent() {
  const allContractors = useMemo(() => MOCK_CONTRACTORS, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredContractors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...allContractors];

    if (query) {
      result = result.filter((contractor) => {
        const primaryContract = contractor.contracts[0];
        const profile = getPersonaProfile(contractor);
        const country = profile.nationality || contractor.countryName;

        return (
          contractor.name.toLowerCase().includes(query) ||
          country.toLowerCase().includes(query) ||
          (primaryContract?.client.toLowerCase().includes(query) ?? false) ||
          (primaryContract?.position.toLowerCase().includes(query) ?? false) ||
          profile.status.toLowerCase().includes(query)
        );
      });
    }

    if (countryFilter) {
      result = result.filter((contractor) => {
        const profile = getPersonaProfile(contractor);
        return (profile.nationality || contractor.countryName) === countryFilter;
      });
    }

    if (clientFilter) {
      result = result.filter(
        (contractor) => contractor.contracts[0]?.client === clientFilter
      );
    }

    if (positionFilter) {
      result = result.filter(
        (contractor) => contractor.contracts[0]?.position === positionFilter
      );
    }

    if (statusFilter) {
      result = result.filter(
        (contractor) => getPersonaProfile(contractor).status === statusFilter
      );
    }

    return result;
  }, [
    allContractors,
    searchQuery,
    countryFilter,
    clientFilter,
    positionFilter,
    statusFilter,
  ]);

  const countryFilterOptions = buildFilterOptions(
    allContractors.map(
      (contractor) => getPersonaProfile(contractor).nationality || contractor.countryName
    )
  );
  const clientFilterOptions = buildFilterOptions(
    allContractors.map((contractor) => contractor.contracts[0]?.client ?? "")
  );
  const positionFilterOptions = buildFilterOptions(
    allContractors.map((contractor) => contractor.contracts[0]?.position ?? "")
  );

  function clearFilters() {
    setCountryFilter("");
    setClientFilter("");
    setPositionFilter("");
    setStatusFilter("");
  }

  const hasActiveFilters = Boolean(
    countryFilter || clientFilter || positionFilter || statusFilter
  );

  const allSelected =
    filteredContractors.length > 0 &&
    filteredContractors.every((contractor) => selectedIds.has(contractor.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContractors.map((contractor) => contractor.id)));
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
              onChange={setCountryFilter}
              options={countryFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Cliente"
              placeholder="Cliente"
              value={clientFilter}
              onChange={setClientFilter}
              options={clientFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Puesto"
              placeholder="Puesto"
              value={positionFilter}
              onChange={setPositionFilter}
              options={positionFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Estado"
              placeholder="Estado"
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
                  ? "cursor-pointer text-[#0097B2] hover:text-[#008099]"
                  : "cursor-default text-[#C8C8C8]"
              }`}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

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
              <th className={`w-[108px] ${ADMIN_HUB_TABLE_HEAD_LAST_CELL} pr-6`} />
            </tr>
          </thead>
          <tbody>
            {filteredContractors.map((contractor) => {
              const primaryContract = contractor.contracts[0];
              const profile = getPersonaProfile(contractor);

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
                  <td className={cellClass}>
                    {profile.nationality || contractor.countryName}
                  </td>
                  <td className={cellClass}>{primaryContract?.client ?? "—"}</td>
                  <td className={cellClass}>{primaryContract?.position ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PersonaStatusBadge status={profile.status} />
                  </td>
                  <td className="w-[108px] whitespace-nowrap py-3 pl-3 pr-6 text-right">
                    <Link
                      href={personaToDetailPath(contractor)}
                      className="inline-block text-[14px] font-medium leading-none text-[#0097B2] transition-colors hover:text-[#008099]"
                    >
                      Ver Perfil
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminHubTableShell>
    </div>
  );
}
