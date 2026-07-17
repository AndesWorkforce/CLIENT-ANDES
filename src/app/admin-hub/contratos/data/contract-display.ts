import type { JornadaLaboral, MockProcesoContratacion } from "./mock-contracts";

const PAIS_LABELS: Record<string, string> = {
  AR: "Argentina",
  CO: "Colombia",
  MX: "México",
  US: "Estados Unidos",
  VE: "Venezuela",
};

export function getPaisDisplay(
  paisCodigo: string | null,
  paisNombre?: string | null,
): string {
  if (paisNombre?.trim()) return paisNombre.trim();
  if (!paisCodigo) return "—";
  return PAIS_LABELS[paisCodigo] ?? paisCodigo;
}

/** Plazo del contrato según `fechaFinalizacion` (ProcesoContratacion). */
export function getTipoContratoDisplay(fechaFinalizacion: string | null): string {
  return fechaFinalizacion ? "Plazo fijo" : "Indeterminado";
}

export function getTipoJornadaDisplay(tipoJornada: JornadaLaboral | null): string {
  if (!tipoJornada) return "—";
  return tipoJornada === "FULL_TIME" ? "Full Time" : "Part Time";
}

export function tipoJornadaFromDisplay(label: string): JornadaLaboral | null {
  if (label === "Full Time") return "FULL_TIME";
  if (label === "Part Time") return "PART_TIME";
  return null;
}

/** Método de pago según `Usuario.usaDollarApp`. */
export function getMetodoPagoDisplay(
  source?: boolean | null | Pick<MockProcesoContratacion, "usaDollarApp">,
): string {
  if (source === null || source === undefined) {
    return "No Especifica";
  }

  if (typeof source === "boolean") {
    if (source === true) return "Dollar App";
    return "Transferencia Bancaria";
  }

  return getMetodoPagoDisplay(source.usaDollarApp);
}

export type ContractStatusLabel = "Activo" | "Inactivo";

export function getContractStatusLabel(activo: boolean): ContractStatusLabel {
  return activo ? "Activo" : "Inactivo";
}
