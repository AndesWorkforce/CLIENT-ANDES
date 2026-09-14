import type { AdminHubTranslate } from "../../i18n";
import {
  HISTORIAL_ACCION_LABEL,
  HISTORIAL_MODULO_LABEL,
  type HistorialAccion,
  type HistorialModulo,
} from "../types/historial.types";

export function translateHistorialModule(
  modulo: HistorialModulo,
  t: AdminHubTranslate,
): string {
  const key = `historial.modules.${modulo}`;
  const translated = t(key);
  return translated === key ? HISTORIAL_MODULO_LABEL[modulo] : translated;
}

export function translateHistorialAction(
  accion: HistorialAccion,
  t: AdminHubTranslate,
): string {
  const key = `historial.actions.${accion}`;
  const translated = t(key);
  return translated === key ? HISTORIAL_ACCION_LABEL[accion] : translated;
}
