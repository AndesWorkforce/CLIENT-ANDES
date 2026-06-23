"use client";

import { useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import {
  getContractStatusLabel,
  getMetodoPagoDisplay,
  getPaisDisplay,
  getTipoContratoDisplay,
} from "../data/contract-display";
import { getMockContracts } from "../data/mock-contracts";
import ContractsTable from "./ContractsTable";
import CreateContractDrawer from "./CreateContractDrawer";

function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values)).map((value) => ({ value, label: value }));
}

export default function ContratosPageContent() {
  const allContracts = useMemo(() => getMockContracts(), []);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [contractTypeFilter, setContractTypeFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredContracts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...allContracts];

    if (query) {
      result = result.filter(
        (contract) =>
          contract.nombreCompleto.toLowerCase().includes(query) ||
          contract.puestoTrabajo.toLowerCase().includes(query) ||
          contract.empresaNombre.toLowerCase().includes(query) ||
          contract.correo.toLowerCase().includes(query) ||
          (contract.correoEmpresa?.toLowerCase().includes(query) ?? false)
      );
    }

    if (clientFilter) {
      result = result.filter((contract) => contract.empresaNombre === clientFilter);
    }

    if (countryFilter) {
      result = result.filter(
        (contract) =>
          getPaisDisplay(contract.paisCodigo, contract.paisFacturacion) === countryFilter
      );
    }

    if (contractTypeFilter) {
      result = result.filter(
        (contract) =>
          getTipoContratoDisplay(contract.fechaFinalizacion) === contractTypeFilter
      );
    }

    if (paymentFilter) {
      result = result.filter(
        (contract) => getMetodoPagoDisplay(contract) === paymentFilter
      );
    }

    if (statusFilter) {
      result = result.filter(
        (contract) => getContractStatusLabel(contract.activo) === statusFilter
      );
    }

    return result;
  }, [
    allContracts,
    searchQuery,
    clientFilter,
    countryFilter,
    contractTypeFilter,
    paymentFilter,
    statusFilter,
  ]);

  const clientFilterOptions = buildFilterOptions(
    allContracts.map((contract) => contract.empresaNombre)
  );
  const countryFilterOptions = buildFilterOptions(
    allContracts.map((contract) =>
      getPaisDisplay(contract.paisCodigo, contract.paisFacturacion)
    )
  );
  const contractTypeFilterOptions = buildFilterOptions(
    allContracts.map((contract) => getTipoContratoDisplay(contract.fechaFinalizacion))
  );
  const paymentFilterOptions = buildFilterOptions(
    allContracts.map((contract) => getMetodoPagoDisplay(contract))
  );
  const statusFilterOptions = buildFilterOptions(
    allContracts.map((contract) => getContractStatusLabel(contract.activo))
  );

  function clearFilters() {
    setClientFilter("");
    setCountryFilter("");
    setContractTypeFilter("");
    setPaymentFilter("");
    setStatusFilter("");
  }

  const hasActiveFilters = Boolean(
    clientFilter || countryFilter || contractTypeFilter || paymentFilter || statusFilter
  );

  function handleCreateContract() {
    setCreateDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <h1 className="text-[32px] font-bold leading-[1.3] text-black">Contratos</h1>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreateContract}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#008099]"
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
              label="Filtrar por País"
              placeholder="País"
              value={countryFilter}
              onChange={setCountryFilter}
              options={countryFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Tipo de contrato"
              placeholder="Tipo de contrato"
              value={contractTypeFilter}
              onChange={setContractTypeFilter}
              options={contractTypeFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Método de pago"
              placeholder="Método de pago"
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={paymentFilterOptions}
            />
            <InvoiceFilterSelect
              label="Filtrar por Estado"
              placeholder="Estado"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusFilterOptions}
            />
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`shrink-0 text-[14px] leading-[1.1] tracking-[0.28px] transition-colors ${
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

      <ContractsTable contracts={filteredContracts} />

      <CreateContractDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
      />
    </div>
  );
}
