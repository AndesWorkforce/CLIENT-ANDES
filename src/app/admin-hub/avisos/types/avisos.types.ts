export type AvisoCategory = "Facturación" | "Nóminas";

export type AvisoTab = "todos" | "no-leidas" | "leidas";

export type AvisoGroup = "hoy" | "anterior";

export interface AvisoNotification {
  id: string;
  titulo: string;
  categoria: AvisoCategory;
  descripcion: string;
  actionLabel: string;
  actionUrl: string;
  tiempoRelativo: string;
  leida: boolean;
  grupo: AvisoGroup;
}

export interface AvisoGroupConfig {
  id: AvisoGroup;
  label: string;
}
