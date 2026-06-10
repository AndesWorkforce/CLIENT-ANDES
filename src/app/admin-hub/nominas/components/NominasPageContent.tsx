"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import AdminHubSelect from "../../components/AdminHubSelect";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import {
  buildPayrollRows,
  getPayrollVariables,
  monthOptionToPeriod,
  NOMINA_MONTH_OPTIONS,
} from "../data/payroll-data";
import type { PayrollVariableStatus } from "../data/mock-payroll-variables";
import NominasTable from "./NominasTable";

const STATUS_FILTER_OPTIONS: { value: PayrollVariableStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
];

function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values)).map((value) => ({ value, label: value }));
}

export default function NominasPageContent() {
  const [selectedMonth, setSelectedMonth] = useState(
    NOMINA_MONTH_OPTIONS.find((m) => m.includes("2026")) ?? NOMINA_MONTH_OPTIONS[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const period = monthOptionToPeriod(selectedMonth);
  const variables = getPayrollVariables();

  const allRows = useMemo(
    () => buildPayrollRows(period, variables),
    [period, variables]
  );

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...allRows];

    if (query) {
      result = result.filter(
        (row) =>
          row.contractorName.toLowerCase().includes(query) ||
          row.position.toLowerCase().includes(query) ||
          row.client.toLowerCase().includes(query) ||
          row.period.toLowerCase().includes(query)
      );
    }

    if (clientFilter) {
      result = result.filter((row) => row.client === clientFilter);
    }

    if (statusFilter) {
      result = result.filter((row) => row.status === statusFilter);
    }

    return result;
  }, [allRows, searchQuery, clientFilter, statusFilter]);

  const clientFilterOptions = buildFilterOptions(allRows.map((row) => row.client));

  function clearFilters() {
    setClientFilter("");
    setStatusFilter("");
  }

  const hasActiveFilters = Boolean(clientFilter || statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Nóminas</h1>

      <AdminHubSelect
        value={selectedMonth}
        onChange={setSelectedMonth}
        options={NOMINA_MONTH_OPTIONS.map((month) => ({ value: month, label: month }))}
        variant="filter"
      />

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

      <NominasTable rows={filteredRows} />
    </div>
  );
}
