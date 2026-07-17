"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContratoListItem } from "../../contratos/actions/contratos.actions";
import { getContratosForVariables } from "../actions/payroll-variables.actions";

export interface PayrollContractOption {
  procesoContratacionId: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  paisCodigo: string | null;
  /** País de facturación (tarifas/festivos); preferido sobre paisCodigo del usuario. */
  paisFacturacionCodigo: string | null;
}

export function usePayrollContractOptions() {
  const [contracts, setContracts] = useState<PayrollContractOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const result = await getContratosForVariables();
      if (cancelled) return;

      const mapped = (result.data ?? []).map((item: ContratoListItem) => ({
        procesoContratacionId: item.id,
        usuarioId: item.usuarioId,
        nombreCompleto: item.nombreCompleto,
        puestoTrabajo: item.puestoTrabajo,
        empresaNombre: item.empresaNombre,
        paisCodigo: item.paisCodigo,
        paisFacturacionCodigo: item.paisFacturacionCodigo ?? null,
      }));

      setContracts(mapped);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const contractorOptions = useMemo(() => {
    const byUser = new Map<string, PayrollContractOption>();
    for (const contract of contracts) {
      if (!byUser.has(contract.usuarioId)) {
        byUser.set(contract.usuarioId, contract);
      }
    }
    return Array.from(byUser.values()).map((contract) => ({
      value: contract.usuarioId,
      label: contract.nombreCompleto,
    }));
  }, [contracts]);

  function getContractsForContractor(usuarioId: string): PayrollContractOption[] {
    return contracts.filter((contract) => contract.usuarioId === usuarioId);
  }

  function getContract(
    usuarioId: string,
    procesoContratacionId: string,
  ): PayrollContractOption | undefined {
    return contracts.find(
      (contract) =>
        contract.usuarioId === usuarioId &&
        contract.procesoContratacionId === procesoContratacionId,
    );
  }

  return {
    contracts,
    loading,
    contractorOptions,
    getContractsForContractor,
    getContract,
  };
}
