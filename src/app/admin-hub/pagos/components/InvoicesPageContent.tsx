"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  getFacturas,
  getPagosClientes,
  type PagosCliente,
} from "../actions/pagos.actions";
import type { Invoice, InvoiceStatus } from "../types/invoice.types";
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
  { value: "Pendiente", label: "Sin factura" },
  { value: "Borrador", label: "Borrador" },
  { value: "Aprobada", label: "Aprobada" },
  { value: "Emitida", label: "Emitida" },
  { value: "Pagado", label: "Pagado" },
  { value: "Anulada", label: "Anulada" },
];

/**
 * Fila del listado. Los clientes vienen de Empresa y la factura del período de
 * `admin-hub/facturas`: si existe se muestran su total y su estado reales, y si
 * todavía no se generó queda "Sin factura".
 */
function mapClienteToInvoiceRow(
  client: PagosCliente,
  period: string,
  factura?: Invoice,
): Invoice {
  return {
    id: factura?.id ?? client.id,
    clientId: client.id.slice(0, 8),
    empresaId: client.id,
    client: client.nombre,
    period,
    totalAmount: factura?.totalAmount ?? "—",
    status: factura?.status ?? "Pendiente",
  };
}

function buildClientFilterOptions(clients: PagosCliente[]) {
  return clients
    .map((client) => client.nombre)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((nombre) => ({ value: nombre, label: nombre }));
}

interface InvoicesPageContentProps {
  initialClients: PagosCliente[];
  initialError?: string | null;
}

export default function InvoicesPageContent({
  initialClients,
  initialError = null,
}: InvoicesPageContentProps) {
  const monthOptions = useMemo(() => buildNominaMonthOptions(), []);
  const currentMonthOption = useMemo(() => getCurrentNominaMonthOption(), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthOption);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clients, setClients] = useState<PagosCliente[]>(initialClients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const skipNextSearchFetch = useRef(true);

  const selectedPeriod = monthOptionToPeriod(selectedMonth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchClients = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);

    const result = await getPagosClientes({
      search: search || undefined,
      limit: 500,
    });

    if (!result.success) {
      setError(result.message ?? "Error al cargar clientes");
      setClients([]);
      setLoading(false);
      return;
    }

    setClients(result.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (skipNextSearchFetch.current) {
      skipNextSearchFetch.current = false;
      return;
    }
    void fetchClients(debouncedSearch);
  }, [debouncedSearch, fetchClients]);

  // Facturas reales del periodo, indexadas por empresa.
  const [facturasPorEmpresa, setFacturasPorEmpresa] = useState<
    Map<string, Invoice>
  >(new Map());

  useEffect(() => {
    let cancelado = false;

    void (async () => {
      const result = await getFacturas({ monthOption: selectedMonth, limit: 500 });
      if (cancelado) return;

      const mapa = new Map<string, Invoice>();
      for (const factura of result.data ?? []) {
        mapa.set(factura.empresaId, factura);
      }
      setFacturasPorEmpresa(mapa);
    })();

    return () => {
      cancelado = true;
    };
  }, [selectedMonth]);

  const clientFilterOptions = useMemo(
    () => buildClientFilterOptions(clients),
    [clients],
  );

  const invoices = useMemo(() => {
    const filtered = clientFilter
      ? clients.filter((client) => client.nombre === clientFilter)
      : clients;

    return filtered.map((client) =>
      mapClienteToInvoiceRow(
        client,
        selectedPeriod,
        facturasPorEmpresa.get(client.id),
      ),
    );
  }, [clients, clientFilter, selectedPeriod, facturasPorEmpresa]);

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
        <InvoicesTable
          invoices={invoices}
          displayPeriod={selectedPeriod}
          emptyMessage="No hay clientes registrados."
        />
      )}
    </div>
  );
}
