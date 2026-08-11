"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import type { AvisoNotification, AvisoCategory, AvisoGroup } from "../types/avisos.types";

// Enums del backend (deben coincidir con Prisma)
type BackendEstadoAlerta = "PENDIENTE" | "REVISADO" | "RESUELTO" | "ANULADO";
type BackendTipoAlerta =
  | "NOMINA_PENDIENTE"
  | "VARIABLE_INGRESO_PENDIENTE"
  | "DEDUCCION_PENDIENTE"
  | "FACTURA_PENDIENTE"
  | "HORAS_EXTRA_PENDIENTE"
  | "DIAS_LIBRES_PENDIENTE"
  | "OTRO";
type BackendPrioridadAlerta = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

interface BackendAlerta {
  id: string;
  tipo: BackendTipoAlerta;
  estado: BackendEstadoAlerta;
  prioridad: BackendPrioridadAlerta;
  titulo: string;
  descripcion?: string;
  empresaId?: string;
  procesoContratacionId?: string;
  nominaId?: string;
  incomeVariableId?: string;
  deduccionId?: string;
  metadata?: Record<string, unknown>;
  creadoEn: string;
  actualizadoEn?: string;
  resueltaEn?: string;
  creadoPorId?: string;
  resueltoPorId?: string;
  // Relaciones incluidas
  empresa?: { id: string; nombre: string };
  procesoContratacion?: { id: string; nombreCompleto: string; puestoTrabajo: string };
  nomina?: { id: string; periodo: string; estado: string };
  incomeVariable?: { id: string; categoria: string; monto: number; nota?: string };
  deduccion?: { id: string; monto: number; notas?: string };
}

export interface GetAvisosParams {
  estado?: BackendEstadoAlerta;
  tipo?: BackendTipoAlerta;
  prioridad?: BackendPrioridadAlerta;
  empresaId?: string;
}

export interface GetAvisosResult extends ApiResponse {
  data?: AvisoNotification[];
}

/**
 * Mapea el estado del backend a si está "leída" o no en la UI.
 * Regla: PENDIENTE o REVISADO = no leída; RESUELTO = leída; ANULADO = leída (ya atendida)
 */
function mapEstadoToLeida(estado: BackendEstadoAlerta): boolean {
  return estado === "RESUELTO" || estado === "ANULADO";
}

/**
 * Mapea el tipo de alerta del backend a la categoría de la UI.
 */
function mapTipoToCategoria(tipo: BackendTipoAlerta): AvisoCategory {
  switch (tipo) {
    case "NOMINA_PENDIENTE":
    case "VARIABLE_INGRESO_PENDIENTE":
    case "DEDUCCION_PENDIENTE":
    case "HORAS_EXTRA_PENDIENTE":
    case "DIAS_LIBRES_PENDIENTE":
      return "Nóminas";
    case "FACTURA_PENDIENTE":
      return "Facturación";
    default:
      return "Nóminas";
  }
}

/**
 * Genera la URL de acción basada en el tipo de alerta y los IDs relacionados.
 */
function generateActionUrl(alerta: BackendAlerta): string {
  const { tipo, nominaId, incomeVariableId, deduccionId, metadata } = alerta;

  switch (tipo) {
    case "NOMINA_PENDIENTE":
      return nominaId ? `/admin-hub/nominas/${nominaId}` : "/admin-hub/nominas";
    
    case "VARIABLE_INGRESO_PENDIENTE":
      // Ir directo al detalle de la variable de ingreso
      if (incomeVariableId) {
        return `/admin-hub/nominas/variables/${incomeVariableId}`;
      }
      // Fallback: intentar desde metadata
      if (metadata?.['incomeVariableId']) {
        return `/admin-hub/nominas/variables/${metadata['incomeVariableId']}`;
      }
      return "/admin-hub/nominas/variables";
    
    case "DEDUCCION_PENDIENTE":
      // Ir directo al detalle de la deducción
      if (deduccionId) {
        return `/admin-hub/nominas/variables/${deduccionId}`;
      }
      // Fallback: intentar desde metadata
      if (metadata?.['deduccionId']) {
        return `/admin-hub/nominas/variables/${metadata['deduccionId']}`;
      }
      return "/admin-hub/nominas/variables";
    
    case "HORAS_EXTRA_PENDIENTE":
      // Ir directo al detalle del registro de horas extra
      if (metadata?.['overtimeId']) {
        return `/admin-hub/nominas/variables/${metadata['overtimeId']}`;
      }
      return "/admin-hub/nominas/variables";
    
    case "DIAS_LIBRES_PENDIENTE":
      // Ir directo al detalle del día libre
      if (metadata?.['diaLibreId']) {
        return `/admin-hub/nominas/variables/${metadata['diaLibreId']}`;
      }
      return "/admin-hub/nominas/variables";
    
    case "FACTURA_PENDIENTE":
      return "/admin-hub/pagos";
    
    default:
      // Para tipos desconocidos (OTRO), intentar usar metadata
      if (metadata?.['customerChargeId']) {
        return "/admin-hub/pagos";
      }
      if (metadata?.['customerCreditId']) {
        return "/admin-hub/pagos";
      }
      return "/admin-hub/dashboard";
  }
}

/**
 * Genera el label del botón de acción basado en la categoría.
 */
function generateActionLabel(categoria: AvisoCategory): string {
  switch (categoria) {
    case "Nóminas":
      return "Ir a Nóminas";
    case "Facturación":
      return "Ir a Pagos";
    default:
      return "Ver detalle";
  }
}

/**
 * Calcula el tiempo relativo desde la fecha de creación.
 */
function getTimeRelative(creadoEn: string): string {
  const now = new Date();
  const created = new Date(creadoEn);
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Hace menos de 1 min";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return "Hace 1 día";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "Hace 1 semana" : `Hace ${weeks} semanas`;
  }
  const months = Math.floor(diffDays / 30);
  return months === 1 ? "Hace 1 mes" : `Hace ${months} meses`;
}

/**
 * Determina el grupo (hoy/anterior) basado en la fecha de creación.
 */
function getGrupo(creadoEn: string): AvisoGroup {
  const now = new Date();
  const created = new Date(creadoEn);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());

  return createdDate.getTime() === today.getTime() ? "hoy" : "anterior";
}

/**
 * Mapea una alerta del backend a la estructura de la UI.
 */
function mapBackendAlertaToUI(alerta: BackendAlerta): AvisoNotification {
  const categoria = mapTipoToCategoria(alerta.tipo);
  const leida = mapEstadoToLeida(alerta.estado);
  const actionUrl = generateActionUrl(alerta);
  const actionLabel = generateActionLabel(categoria);
  const tiempoRelativo = getTimeRelative(alerta.creadoEn);
  const grupo = getGrupo(alerta.creadoEn);

  return {
    id: alerta.id,
    titulo: alerta.titulo,
    categoria,
    descripcion: alerta.descripcion || "",
    actionLabel,
    actionUrl,
    tiempoRelativo,
    leida,
    grupo,
  };
}

/**
 * Obtiene todas las alertas del sistema con filtros opcionales.
 */
export async function getAvisos(params?: GetAvisosParams): Promise<GetAvisosResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get("admin-hub/alerts", {
      params: {
        ...(params?.estado ? { estado: params.estado } : {}),
        ...(params?.tipo ? { tipo: params.tipo } : {}),
        ...(params?.prioridad ? { prioridad: params.prioridad } : {}),
        ...(params?.empresaId ? { empresaId: params.empresaId } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener avisos",
      };
    }

    const alertas = Array.isArray(response.data?.data) ? response.data.data : [];
    const mappedAvisos = alertas.map((alerta: BackendAlerta) => mapBackendAlertaToUI(alerta));

    return {
      success: true,
      message: "Avisos obtenidos correctamente",
      data: mappedAvisos,
    };
  } catch (error) {
    console.error("[AVISOS] Error al obtener avisos:", error);
    return {
      success: false,
      message: "Error al obtener avisos",
    };
  }
}

/**
 * Obtiene solo las alertas pendientes (no leídas).
 */
export async function getAvisosPendientes(): Promise<GetAvisosResult> {
  return getAvisos({ estado: "PENDIENTE" });
}

/**
 * Obtiene el conteo de avisos no leídos.
 */
export async function getUnreadAvisosCount(): Promise<number> {
  const result = await getAvisos();
  if (!result.success || !result.data) return 0;
  return result.data.filter((aviso) => !aviso.leida).length;
}

/**
 * Actualiza una alerta (estado y/o prioridad).
 */
export interface UpdateAlertParams {
  estado?: BackendEstadoAlerta;
  prioridad?: BackendPrioridadAlerta;
}

export async function updateAlert(
  avisoId: string,
  params: UpdateAlertParams
): Promise<ApiResponse> {
  const axios = await createServerAxios();

  try {
    const response = await axios.patch(`admin-hub/alerts/${avisoId}`, params);

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al actualizar el aviso",
      };
    }

    return {
      success: true,
      message: "Aviso actualizado correctamente",
    };
  } catch (error: any) {
    console.error("[AVISOS] Error al actualizar aviso:", error);
    
    // Manejo específico de 404
    if (error.response?.status === 404) {
      return {
        success: false,
        message: "Aviso no encontrado",
      };
    }

    return {
      success: false,
      message: "Error al actualizar el aviso",
    };
  }
}

/**
 * Marca una alerta como resuelta (leída).
 */
export async function markAvisoAsRead(avisoId: string): Promise<ApiResponse> {
  return updateAlert(avisoId, { estado: "RESUELTO" });
}
