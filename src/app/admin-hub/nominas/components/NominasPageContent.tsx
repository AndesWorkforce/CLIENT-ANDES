"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import AdminHubSelect from "../../components/AdminHubSelect";
import AdminHubDateRangePicker from "../../components/AdminHubDateRangePicker";
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
 * Convierte una fecha ISO (YYYY-MM-DD) al formato de mes de NOMINA_MONTH_OPTIONS
 * Ejemplo: "2026-03-21" -> "Marzo 2026"
 */
function isoDateToMonthOption(isoDate: string): string | null {
  if (!isoDate) return null;
  
  const date = new Date(isoDate + "T00:00:00");
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${year}`;
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

export default function NominasPageContent() {
  const defaultMonth = NOMINA_MONTH_OPTIONS.find((m) => m.includes("2026")) ?? NOMINA_MONTH_OPTIONS[0];
  
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Cuando se selecciona un rango de fechas, actualizar automáticamente el mes seleccionado
  useEffect(() => {
    if (fromDate) {
      const monthOption = isoDateToMonthOption(fromDate);
      if (monthOption && NOMINA_MONTH_OPTIONS.includes(monthOption)) {
        setSelectedMonth(monthOption);
      }
    }
  }, [fromDate]);

  const period = monthOptionToPeriod(selectedMonth);
  const allVariables = getPayrollVariables();

  // Filtrar variables por rango de fechas si está activo
  const filteredVariables = useMemo(() => {
    if (!fromDate && !toDate) return allVariables;
    return allVariables.filter((variable) => isDateInRange(variable.date, fromDate, toDate));
  }, [allVariables, fromDate, toDate]);

  const allRows = useMemo(
    () => buildPayrollRows(period, filteredVariables),
    [period, filteredVariables]
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
    setFromDate("");
    setToDate("");
    setSelectedMonth(defaultMonth);
  }

  const hasActiveFilters = Boolean(clientFilter || statusFilter || fromDate || toDate);
  const isMonthFilterDisabled = Boolean(fromDate || toDate);

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Nóminas</h1>

      <AdminHubSelect
        value={selectedMonth}
        onChange={setSelectedMonth}
        options={NOMINA_MONTH_OPTIONS.map((month) => ({ value: month, label: month }))}
        variant="filter"
        disabled={isMonthFilterDisabled}
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
          <div className="flex flex-col gap-4">
            <AdminHubDateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
            <div className="flex flex-wrap items-center gap-4">
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
                className={`shrink-0 text-[14px] leading-[1.1] tracking-[0.28px] transition-colors ${
                  hasActiveFilters
                    ? "text-[#0097B2] hover:text-[#008099] cursor-pointer"
                    : "text-[#C8C8C8] cursor-default"
                }`}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      <NominasTable rows={filteredRows} />
    </div>
  );
}
