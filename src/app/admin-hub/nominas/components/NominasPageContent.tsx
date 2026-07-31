"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CircleCheck, Download, FileText, Filter } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import AdminHubSelect from "../../components/AdminHubSelect";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import { getContratos } from "../../contratos/actions/contratos.actions";
import {
  approveNominasBulk,
  getNominas,
  type NominasPagination,
} from "../actions/nominas.actions";
import {
  buildNominaMonthOptions,
  getCurrentNominaMonthOption,
  isValidAnioMes,
  monthOptionToPeriod,
  nominaMonthOptionToAnioMes,
  type PayrollRow,
} from "../data/payroll-data";
import type { PayrollVariableStatus } from "../data/mock-payroll-variables";
import NominasTable from "./NominasTable";
import AdminHubConfirmModal from "./AdminHubConfirmModal";
import { useNotificationStore } from "@/store/notifications.store";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

const ACTION_BTN_BASE =
  "inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] px-[22px] text-[14px] font-medium leading-[1.2] transition-colors";
const ACTION_BTN_PRIMARY = `${ACTION_BTN_BASE} bg-[#0097B2] text-white hover:bg-[#008099]`;
const ACTION_BTN_SECONDARY = `${ACTION_BTN_BASE} border border-[#0097B2] text-[#0097B2] hover:bg-[#F5FAFB]`;
const ACTION_BTN_DISABLED = `${ACTION_BTN_BASE} cursor-not-allowed border border-[#C8C8C8] bg-white text-[#C8C8C8]`;


const STATUS_FILTER_OPTIONS: { value: PayrollVariableStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
  { value: "Emitido", label: "Emitido" },
];

function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));
}

export default function NominasPageContent() {
  const monthOptions = useMemo(() => buildNominaMonthOptions(), []);
  const currentMonthOption = useMemo(() => getCurrentNominaMonthOption(), []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthOption);
  const [rows, setRows] = useState<PayrollRow[]>([]);
  const [pagination, setPagination] = useState<NominasPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [clientFilterOptions, setClientFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const { addNotification } = useNotificationStore();

  const periodoApi = useMemo(
    () => nominaMonthOptionToAnioMes(selectedMonth),
    [selectedMonth],
  );
  const periodDisplay = monthOptionToPeriod(selectedMonth);

  useEffect(() => {
    void (async () => {
      const response = await getContratos({ page: 1, limit: 500, estado: "Activo" });
      if (response.success && response.data) {
        setClientFilterOptions(
          buildFilterOptions(response.data.map((contract) => contract.empresaNombre)),
        );
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

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    setPage(1);
    setSelectedIds(new Set());
  }

  const loadNominas = useCallback(async () => {
    if (!isValidAnioMes(periodoApi)) {
      setRows([]);
      setError("El período seleccionado no es válido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getNominas({
      periodo: periodoApi,
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      cliente: clientFilter || undefined,
      estado: (statusFilter as PayrollVariableStatus) || undefined,
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
      setError(response.message || "No se pudieron cargar las nóminas");
      setLoading(false);
      return;
    }

    setRows(response.data);
    if (response.pagination) {
      setPagination(response.pagination);
    }
    setSelectedIds(new Set());
    setLoading(false);
  }, [periodoApi, page, debouncedSearch, clientFilter, statusFilter]);

  useEffect(() => {
    void loadNominas();
  }, [loadNominas]);

  function clearFilters() {
    setClientFilter("");
    setStatusFilter("");
    setPage(1);
  }

  const hasActiveFilters = Boolean(clientFilter || statusFilter);
  const hasSelectedRows = selectedIds.size > 0;

  const visiblePages = useMemo(() => {
    const total = pagination.totalPages;
    if (total <= 1) return [];

    const maxButtons = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxButtons / 2));
    const end = Math.min(total, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pagination.page, pagination.totalPages]);

  function validateNominas() {
    const errors: string[] = [];
    const nominasSeleccionadas = rows.filter((row) => selectedIds.has(row.id));

    if (nominasSeleccionadas.length === 0) {
      errors.push("Por favor selecciona al menos una nómina para aprobar.");
      return errors;
    }

    const nominasFueraDeMes = nominasSeleccionadas.filter(
      (row) => row.period !== periodDisplay,
    );
    if (nominasFueraDeMes.length > 0) {
      errors.push(
        `Las siguientes nóminas no pertenecen al mes seleccionado (${selectedMonth}):`,
      );
      nominasFueraDeMes.forEach((row) => {
        errors.push(`  • ${row.contractorName} (${row.client}) - Período: ${row.period}`);
      });
    }

    const nominasYaEmitidas = nominasSeleccionadas.filter(
      (row) => row.status === "Emitido",
    );
    if (nominasYaEmitidas.length > 0) {
      errors.push("Las siguientes nóminas ya fueron emitidas y no se pueden aprobar:");
      nominasYaEmitidas.forEach((row) => {
        errors.push(`  • ${row.contractorName} (${row.client})`);
      });
    }

    return errors;
  }

  function handleAprobarNominas() {
    const errors = validateNominas();
    setValidationErrors(errors);

    if (errors.length > 0) {
      setShowResultModal(true);
    } else {
      setShowConfirmModal(true);
    }
  }

  function handleEmitirNominas() {
    addNotification(
      "La emisión masiva de nóminas estará disponible próximamente.",
      "info",
    );
  }

  async function handleConfirmAprobacion() {
    const idsToApprove = rows
      .filter((row) => selectedIds.has(row.id) && row.status !== "Emitido")
      .map((row) => row.id);

    setIsApproving(true);
    try {
      const result = await approveNominasBulk({
        periodo: periodoApi,
        procesoContratacionIds: idsToApprove,
      });

      const failedResults = (result.results ?? []).filter((item) => !item.success);
      const nameById = new Map(
        rows.map((row) => [row.id, `${row.contractorName} (${row.client})`]),
      );

      if (failedResults.length > 0) {
        setValidationErrors(
          failedResults.map(
            (item) =>
              `  • ${nameById.get(item.procesoContratacionId) ?? item.procesoContratacionId}: ${item.message}`,
          ),
        );
        setShowConfirmModal(false);
        setShowResultModal(true);
      } else {
        setShowConfirmModal(false);
        setValidationErrors([]);
        addNotification(
          result.message || "Nóminas aprobadas correctamente",
          "success",
          "compact",
        );
      }

      setSelectedIds(new Set());
      await loadNominas();
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Nóminas</h1>

      <div className="flex flex-wrap items-center justify-between gap-[7px]">
        <AdminHubSelect
          value={selectedMonth}
          onChange={handleMonthChange}
          options={monthOptions.map((month) => ({ value: month, label: month }))}
          variant="filter"
        />
        {hasSelectedRows ? (
          <div className="flex flex-wrap items-center justify-end gap-[7px]">
            <button
              type="button"
              disabled
              title="Funcionalidad desactivada"
              aria-disabled="true"
              className={ACTION_BTN_DISABLED}
            >
              <Download size={24} aria-hidden />
              Exportar
            </button>
            <button
              type="button"
              onClick={handleAprobarNominas}
              className={ACTION_BTN_SECONDARY}
            >
              <CircleCheck size={24} aria-hidden />
              Aprobar ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={handleEmitirNominas}
              className={ACTION_BTN_PRIMARY}
            >
              <FileText size={24} aria-hidden />
              Emitir nóminas ({selectedIds.size})
            </button>
          </div>
        ) : null}
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
              onChange={(value) => {
                setClientFilter(value);
                setPage(1);
              }}
              options={clientFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Estado"
              placeholder="Pendiente"
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
          {hasActiveFilters || debouncedSearch
            ? "No hay nóminas que coincidan con los filtros aplicados."
            : "No hay nóminas para el período seleccionado."}
        </div>
      ) : (
        <NominasTable
          rows={rows}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
        />
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-[#858585]">
            Mostrando página {pagination.page} de {pagination.totalPages} (
            {pagination.total} nóminas)
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

      {showConfirmModal && (
        <AdminHubConfirmModal
          open
          title="Confirmar aprobación de nóminas"
          cancelLabel="Cancelar"
          confirmLabel={isApproving ? "Aprobando..." : "Confirmar aprobación"}
          confirmLoading={isApproving}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => void handleConfirmAprobacion()}
        >
          <div className="space-y-4">
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
            <div className="bg-[#DFFAFF] rounded-[8px] px-4 py-3">
              <p className="text-[14px] text-[#007A8C] leading-relaxed">
                Se aprobarán las variables pendientes de cada nómina y luego la nómina,
                siempre que no quede ninguna variable en estado Pendiente (Rechazado
                permitido).
              </p>
            </div>
            <p className="text-[14px] text-[#858585] leading-relaxed">
              ¿Deseas continuar con la aprobación?
            </p>
          </div>
        </AdminHubConfirmModal>
      )}

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
                  ? "✓ Nóminas aprobadas"
                  : "⚠ Errores al aprobar"}
              </h2>
            </div>
            <div className="px-6 py-6">
              {validationErrors.length === 0 ? (
                <p className="text-[14px] text-[#343434] leading-relaxed">
                  Las nóminas fueron aprobadas correctamente y su estado se actualizó.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-[14px] text-[#721C24] font-semibold">
                    No se pudo completar la aprobación de todas las nóminas:
                  </p>
                  <div className="bg-[#FFF5F5] rounded-[8px] px-4 py-3">
                    <ul className="text-[13px] text-[#343434] space-y-1">
                      {validationErrors.map((errorMessage, index) => (
                        <li key={index} className="leading-relaxed">
                          {errorMessage}
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
