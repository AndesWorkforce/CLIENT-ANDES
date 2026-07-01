"use client";

import { Alerta, EstadoAlerta, PrioridadAlerta } from "../types/avisos.types";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

interface AlertsListProps {
  alerts: Alerta[];
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  onAlertClick?: (alert: Alerta) => void;
}

const PRIORIDAD_COLORS: Record<PrioridadAlerta, string> = {
  [PrioridadAlerta.CRITICA]: "bg-red-100 text-red-800 border-red-200",
  [PrioridadAlerta.ALTA]: "bg-orange-100 text-orange-800 border-orange-200",
  [PrioridadAlerta.MEDIA]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [PrioridadAlerta.BAJA]: "bg-blue-100 text-blue-800 border-blue-200",
};

const ESTADO_ICONS: Record<EstadoAlerta, React.ReactNode> = {
  [EstadoAlerta.PENDIENTE]: (
    <Clock className="w-5 h-5 text-yellow-600" />
  ),
  [EstadoAlerta.REVISADO]: (
    <AlertCircle className="w-5 h-5 text-blue-600" />
  ),
  [EstadoAlerta.RESUELTO]: (
    <CheckCircle2 className="w-5 h-5 text-green-600" />
  ),
  [EstadoAlerta.ANULADO]: (
    <XCircle className="w-5 h-5 text-gray-600" />
  ),
};

const TIPO_LABELS: Record<string, string> = {
  NOMINA_PENDIENTE: "Nómina Pendiente",
  VARIABLE_INGRESO_PENDIENTE: "Variable de Ingreso",
  DEDUCCION_PENDIENTE: "Deducción Pendiente",
  FACTURA_PENDIENTE: "Factura Pendiente",
  HORAS_EXTRA_PENDIENTE: "Horas Extra",
  DIAS_LIBRES_PENDIENTE: "Días Libres",
  OTRO: "Otro",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export default function AlertsList({
  alerts,
  loading,
  error,
  isEmpty,
  onRetry,
  onAlertClick,
}: AlertsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 rounded-lg h-24 w-full"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-800 font-medium mb-2">Error al cargar alertas</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="text-green-800 font-medium text-lg mb-1">
          ¡Todo al día!
        </p>
        <p className="text-green-600 text-sm">
          No hay alertas pendientes en este momento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          onClick={() => onAlertClick?.(alert)}
          className={`
            bg-white border rounded-lg p-4 transition-all
            ${onAlertClick ? "cursor-pointer hover:shadow-md hover:border-gray-300" : ""}
            ${PRIORIDAD_COLORS[alert.prioridad]}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {ESTADO_ICONS[alert.estado]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {alert.titulo}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                  {formatDate(alert.creadoEn)}
                </span>
              </div>

              {alert.descripcion && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {alert.descripcion}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {TIPO_LABELS[alert.tipo] || alert.tipo}
                </span>

                {alert.empresa && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                    {alert.empresa.nombre}
                  </span>
                )}

                {alert.procesoContratacion && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                    {alert.procesoContratacion.nombreCompleto}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
