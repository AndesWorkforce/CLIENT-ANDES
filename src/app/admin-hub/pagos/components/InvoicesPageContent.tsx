"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import {
  MOCK_INVOICES,
  MONTH_OPTIONS,
  type Invoice,
  type InvoiceStatus,
} from "../data/mock-invoices";
import InvoiceFilterSelect from "./InvoiceFilterSelect";
import InvoicesTable from "./InvoicesTable";

const CLIENT_FILTER_OPTIONS = Array.from(
  new Set(MOCK_INVOICES.map((inv) => inv.client))
).map((client) => ({ value: client, label: client }));

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

function parseInvoiceAmount(amount: string): number {
  return parseInt(amount.replace(/[^\d]/g, ""), 10) || 0;
}

function matchesAmountRange(amount: string, range: string): boolean {
  const value = parseInvoiceAmount(amount);
  switch (range) {
    case "0-10000":
      return value <= 10000;
    case "10000-15000":
      return value > 10000 && value <= 15000;
    case "15000-20000":
      return value > 15000 && value <= 20000;
    case "20000+":
      return value > 20000;
    default:
      return true;
  }
}

export default function InvoicesPageContent() {
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result: Invoice[] = [...MOCK_INVOICES];

    if (query) {
      result = result.filter(
        (inv) =>
          inv.clientId.toLowerCase().includes(query) ||
          inv.client.toLowerCase().includes(query) ||
          inv.period.toLowerCase().includes(query)
      );
    }

    if (clientFilter) {
      result = result.filter((inv) => inv.client === clientFilter);
    }

    if (amountFilter) {
      result = result.filter((inv) => matchesAmountRange(inv.totalAmount, amountFilter));
    }

    if (statusFilter) {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    return result;
  }, [searchQuery, clientFilter, amountFilter, statusFilter]);

  function clearFilters() {
    setClientFilter("");
    setAmountFilter("");
    setStatusFilter("");
  }

  const hasActiveFilters = Boolean(clientFilter || amountFilter || statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Invoices</h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-9 appearance-none rounded-[8px] border border-[#C8C8C8] bg-white pl-[22px] pr-10 text-[14px] text-[#525252] leading-5 cursor-pointer"
          >
            {MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#525252]"
          />
        </div>

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
          <div className="relative w-full max-w-[320px]">
            <Search
              size={21}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C8C8C8]"
            />
            <input
              type="search"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-[8px] border border-[#C8C8C8] bg-white pl-11 pr-4 text-[14px] font-medium text-[#525252] placeholder:text-[#C8C8C8] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
            className={`inline-flex h-10 items-center gap-1.5 rounded-[8px] border bg-white px-4 text-[14px] font-medium transition-colors ${
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
          <div className="flex flex-wrap items-center gap-4">
            <InvoiceFilterSelect
              label="Filtrar por Cliente"
              placeholder="Cliente"
              value={clientFilter}
              onChange={setClientFilter}
              options={CLIENT_FILTER_OPTIONS}
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
              className={`shrink-0 text-[14px] leading-[1.1] tracking-[0.28px] transition-colors ${
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

      <InvoicesTable invoices={filteredInvoices} />
    </div>
  );
}
