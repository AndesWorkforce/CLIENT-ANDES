import type { JornadaLaboral, MockProcesoContratacion } from "./mock-contracts";

const PAIS_LABELS: Record<string, string> = {
  AR: "Argentina",
  CO: "Colombia",
  MX: "México",
  US: "Estados Unidos",
  VE: "Venezuela",
};

export function getPaisDisplay(paisCodigo: string | null, paisFacturacion: string | null): string {
  const code = paisCodigo ?? paisFacturacion;
  if (!code) return "—";
  return PAIS_LABELS[code] ?? code;
}

/** Plazo del contrato según `fechaFinalizacion` (ProcesoContratacion). */
export function getTipoContratoDisplay(fechaFinalizacion: string | null): string {
  return fechaFinalizacion ? "Plazo fijo" : "Indeterminado";
}

export function getTipoJornadaDisplay(tipoJornada: JornadaLaboral): string {
  return tipoJornada === "FULL_TIME" ? "Tiempo completo" : "Medio tiempo";
}

/** Método de pago derivado de campos de Usuario (`usaDollarApp`, `bancoNombre`). */
export function getMetodoPagoDisplay(contract: Pick<MockProcesoContratacion, "usaDollarApp" | "bancoNombre">): string {
  if (contract.usaDollarApp) return "Dolar App";
  if (contract.bancoNombre) return contract.bancoNombre;
  return "—";
}

export type ContractStatusLabel = "Activo" | "Inactivo";

export function getContractStatusLabel(activo: boolean): ContractStatusLabel {
  return activo ? "Activo" : "Inactivo";
}
