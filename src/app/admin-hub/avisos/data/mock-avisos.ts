import type { AvisoGroupConfig } from "../types/avisos.types";

/**
 * Configuración de grupos de avisos para la UI.
 * Los avisos se agrupan automáticamente en "Hoy" o "Anterior" basándose en su fecha de creación.
 */
export const AVISO_GROUPS: AvisoGroupConfig[] = [
  { id: "hoy", label: "Hoy" },
  { id: "anterior", label: "Anterior" },
];
