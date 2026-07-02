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
  buildNominaMonthOptions,
  getCurrentNominaMonthOption,
  getPayrollVariables,
  isoDateToNominaMonthOption,
  monthOptionToPeriod,
} from "../data/payroll-data";
import type { PayrollVariableStatus } from "../data/mock-payroll-variables";
import NominasTable from "./NominasTable";

const STATUS_FILTER_OPTIONS: { value: PayrollVariableStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
  { value: "Emitido", label: "Emitido" },
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

function isDateInRange(dateStr: string, fromDate: string, toDate: string): boolean {
  const date = parseDisplayDateToIso(dateStr);
  if (!date) return true;

  if (fromDate && date < fromDate) return false;
  if (toDate && date > toDate) return false;

  return true;
}

export default function NominasPageContent() {
  const monthOptions = useMemo(() => buildNominaMonthOptions(), []);
  const currentMonthOption = useMemo(() => getCurrentNominaMonthOption(), []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthOption);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [emittedRowIds, setEmittedRowIds] = useState<Set<string>>(new Set());

  // Cuando se selecciona un rango de fechas, actualizar automáticamente el mes seleccionado
  useEffect(() => {
    if (fromDate) {
      const monthOption = isoDateToNominaMonthOption(fromDate);
      if (monthOption && monthOptions.includes(monthOption)) {
        setSelectedMonth(monthOption);
      }
    }
  }, [fromDate, monthOptions]);

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

  const clientFilterOptions = buildFilterOptions(allRows.map((row) => row.client));

  function clearFilters() {
    setClientFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setSelectedMonth(currentMonthOption);
  }

  const hasActiveFilters = Boolean(clientFilter || statusFilter || fromDate || toDate);
  const isMonthFilterDisabled = Boolean(fromDate || toDate);

  // Actualizar el estado visual de las filas según si fueron emitidas
  const displayedRowsWithEmittedStatus = useMemo(() => {
    return allRows.map((row) => ({
      ...row,
      status: emittedRowIds.has(row.id) ? ("Emitido" as const) : row.status,
    }));
  }, [allRows, emittedRowIds]);

  const filteredRowsWithEmittedStatus = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...displayedRowsWithEmittedStatus];

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
  }, [displayedRowsWithEmittedStatus, searchQuery, clientFilter, statusFilter]);

  const selectedRows = displayedRowsWithEmittedStatus.filter((row) => selectedIds.has(row.id));
  const hasSelectedRows = selectedIds.size > 0;

  function validateNominas() {
    const errors: string[] = [];
    const nominasSeleccionadas = displayedRowsWithEmittedStatus.filter((row) => 
      selectedIds.has(row.id)
    );

    if (nominasSeleccionadas.length === 0) {
      errors.push("Por favor selecciona al menos una nómina para emitir.");
      return errors;
    }

    // Validación 1: Verificar que pertenecen al mes seleccionado
    const nominasFueraDeMes = nominasSeleccionadas.filter(
      (row) => row.period !== monthOptionToPeriod(selectedMonth)
    );
    if (nominasFueraDeMes.length > 0) {
      errors.push(
        `Las siguientes nóminas no pertenecen al mes seleccionado (${selectedMonth}):`
      );
      nominasFueraDeMes.forEach((row) => {
        errors.push(`  • ${row.contractorName} (${row.client}) - Período: ${row.period}`);
      });
    }

    // Validación 2: Verificar que no están ya emitidas
    const nominasYaEmitidas = nominasSeleccionadas.filter((row) => row.status === "Emitido");
    if (nominasYaEmitidas.length > 0) {
      errors.push("Las siguientes nóminas ya fueron emitidas:");
      nominasYaEmitidas.forEach((row) => {
        errors.push(`  • ${row.contractorName} (${row.client})`);
      });
    }

    // Validación 3: Verificar que TODAS están en estado Aprobado
    const nominasNoAprobadas = nominasSeleccionadas.filter(
      (row) => row.status !== "Aprobado"
    );
    if (nominasNoAprobadas.length > 0) {
      errors.push("Todas las nóminas deben estar aprobadas antes de emitirse. Las siguientes nóminas NO están aprobadas:");
      nominasNoAprobadas.forEach((row) => {
        errors.push(`  • ${row.contractorName} (${row.client}) - Estado actual: ${row.status}`);
      });
    }

    return errors;
  }

  function handleEmitirNominas() {
    const errors = validateNominas();
    setValidationErrors(errors);

    if (errors.length > 0) {
      setShowResultModal(true);
    } else {
      setShowConfirmModal(true);
    }
  }

  function handleConfirmEmision() {
    // Marcar las nóminas seleccionadas como emitidas
    const newEmittedIds = new Set(emittedRowIds);
    selectedIds.forEach((id) => newEmittedIds.add(id));
    setEmittedRowIds(newEmittedIds);

    // Cerrar modal de confirmación y abrir modal de éxito
    setShowConfirmModal(false);
    setValidationErrors([]);
    setShowResultModal(true);
    setSelectedIds(new Set());
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-black leading-[1.3]">Nóminas</h1>
        <button
          type="button"
          onClick={handleEmitirNominas}
          disabled={!hasSelectedRows}
          className={`px-6 py-3 rounded-[8px] text-[14px] font-semibold transition-all ${
            hasSelectedRows
              ? "bg-[#0097B2] text-white hover:bg-[#008099] shadow-sm"
              : "bg-[#EFEFEF] text-[#C8C8C8] cursor-not-allowed"
          }`}
        >
          Emitir nóminas {hasSelectedRows ? `(${selectedIds.size})` : ""}
        </button>
      </div>

      <AdminHubSelect
        value={selectedMonth}
        onChange={setSelectedMonth}
        options={monthOptions.map((month) => ({ value: month, label: month }))}
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

      <NominasTable 
        rows={filteredRowsWithEmittedStatus} 
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
      />

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[12px] shadow-lg max-w-[500px] w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-[#0097B2]">
              <h2 className="text-[20px] font-bold text-white">
                Confirmar Emisión de Nóminas
              </h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-[#EFEFEF]">
                  <span className="text-[14px] font-semibold text-[#525252]">Mes:</span>
                  <span className="text-[14px] text-[#343434]">{selectedMonth}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#EFEFEF]">
                  <span className="text-[14px] font-semibold text-[#525252]">
                    Registros seleccionados:
                  </span>
                  <span className="text-[14px] text-[#343434]">{selectedIds.size}</span>
                </div>
              </div>
              <div className="bg-[#D4F4E2] rounded-[8px] px-4 py-3">
                <p className="text-[14px] text-[#2D6A4F] leading-relaxed">
                  ✓ Todas las validaciones han pasado correctamente. Las nóminas seleccionadas están listas para ser emitidas.
                </p>
              </div>
              <p className="text-[14px] text-[#858585] leading-relaxed">
                ¿Deseas continuar con la emisión de estas nóminas?
              </p>
            </div>
            <div className="px-6 py-4 bg-[#F8F8F8] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 rounded-[8px] bg-white border border-[#C8C8C8] text-[#525252] text-[14px] font-semibold hover:bg-[#F8F8F8] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmEmision}
                className="px-5 py-2 rounded-[8px] bg-[#0097B2] text-white text-[14px] font-semibold hover:bg-[#008099] transition-colors"
              >
                Confirmar Emisión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultado (Éxito o Error) */}
      {showResultModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[12px] shadow-lg max-w-[500px] w-full mx-4 overflow-hidden">
            <div
              className={`px-6 py-4 ${
                validationErrors.length === 0 ? "bg-[#D4EDDA]" : "bg-[#F8D7DA]"
              }`}
            >
              <h2
                className={`text-[20px] font-bold ${
                  validationErrors.length === 0 ? "text-[#155724]" : "text-[#721C24]"
                }`}
              >
                {validationErrors.length === 0
                  ? "✓ Nóminas Emitidas Exitosamente"
                  : "⚠ Errores de Validación"}
              </h2>
            </div>
            <div className="px-6 py-6">
              {validationErrors.length === 0 ? (
                <p className="text-[14px] text-[#343434] leading-relaxed">
                  Las nóminas han sido emitidas correctamente y su estado se ha actualizado.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-[14px] text-[#721C24] font-semibold">
                    No se puede continuar con la emisión:
                  </p>
                  <div className="bg-[#FFF5F5] rounded-[8px] px-4 py-3">
                    <ul className="text-[13px] text-[#343434] space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="leading-relaxed">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-[#F8F8F8] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowResultModal(false);
                  setValidationErrors([]);
                }}
                className="px-5 py-2 rounded-[8px] bg-[#0097B2] text-white text-[14px] font-semibold hover:bg-[#008099] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
