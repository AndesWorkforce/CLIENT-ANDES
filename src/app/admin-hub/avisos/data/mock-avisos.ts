import type { AvisoGroupConfig } from "../types/avisos.types";

/**
 * Configuración de grupos de avisos para la UI.
 * Alerts are grouped automatically into "Today" or "Previous" based on created date.
 */
export const AVISO_GROUPS: AvisoGroupConfig[] = [
  { id: "hoy", label: "Today" },
  { id: "anterior", label: "Previous" },
];
