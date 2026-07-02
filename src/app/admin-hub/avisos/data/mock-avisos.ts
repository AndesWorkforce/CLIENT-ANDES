import type { AvisoGroupConfig, AvisoNotification } from "../types/avisos.types";

export const AVISO_GROUPS: AvisoGroupConfig[] = [
  { id: "hoy", label: "Hoy" },
  { id: "anterior", label: "Anterior" },
];

export const MOCK_AVISO_NOTIFICATIONS: AvisoNotification[] = [
  {
    id: "aviso-1",
    titulo: "Gastos sin registrar antes del cierre",
    categoria: "Facturación",
    descripcion:
      "Se detectaron gastos pendientes de carga para este período. Registrarlos antes del cierre evita desfasajes en el reporte mensual.",
    actionLabel: "Ir a Pagos",
    actionUrl: "/admin-hub/pagos",
    tiempoRelativo: "Hace 10 min",
    leida: false,
    grupo: "hoy",
  },
  {
    id: "aviso-2",
    titulo: "Gastos sin registrar antes del cierre",
    categoria: "Facturación",
    descripcion:
      "Se detectaron gastos pendientes de carga para este período. Registrarlos antes del cierre evita desfasajes en el reporte mensual.",
    actionLabel: "Ir a Pagos",
    actionUrl: "/admin-hub/pagos",
    tiempoRelativo: "Hace 10 min",
    leida: false,
    grupo: "hoy",
  },
  {
    id: "aviso-3",
    titulo: "Nóminas pendientes de aprobación",
    categoria: "Nóminas",
    descripcion:
      "El empleado Juan Pérez tiene su nómina del período Jun 1–15 en estado pendiente. El cierre es en 2 días.",
    actionLabel: "Ir a Nóminas",
    actionUrl: "/admin-hub/nominas",
    tiempoRelativo: "Hace 22 min",
    leida: false,
    grupo: "hoy",
  },
  {
    id: "aviso-4",
    titulo: "Gastos sin registrar antes del cierre",
    categoria: "Facturación",
    descripcion:
      "Se detectaron gastos pendientes de carga para este período. Registrarlos antes del cierre evita desfasajes en el reporte mensual.",
    actionLabel: "Ir a Pagos",
    actionUrl: "/admin-hub/pagos",
    tiempoRelativo: "Hace 10 min",
    leida: true,
    grupo: "anterior",
  },
  {
    id: "aviso-5",
    titulo: "Gastos sin registrar antes del cierre",
    categoria: "Facturación",
    descripcion:
      "Se detectaron gastos pendientes de carga para este período. Registrarlos antes del cierre evita desfasajes en el reporte mensual.",
    actionLabel: "Ir a Pagos",
    actionUrl: "/admin-hub/pagos",
    tiempoRelativo: "Hace 10 min",
    leida: true,
    grupo: "anterior",
  },
  {
    id: "aviso-6",
    titulo: "Nóminas pendientes de aprobación",
    categoria: "Nóminas",
    descripcion:
      "El empleado Juan Pérez tiene su nómina del período Jun 1–15 en estado pendiente. El cierre es en 2 días.",
    actionLabel: "Ir a Nóminas",
    actionUrl: "/admin-hub/nominas",
    tiempoRelativo: "Hace 22 min",
    leida: true,
    grupo: "anterior",
  },
  {
    id: "aviso-7",
    titulo: "Contratos pendientes de firma",
    categoria: "Nóminas",
    descripcion: "Hay 3 contratos nuevos esperando revisión y firma del administrador.",
    actionLabel: "Ir a Contratos",
    actionUrl: "/admin-hub/contratos",
    tiempoRelativo: "Hace 2 días",
    leida: true,
    grupo: "anterior",
  },
  {
    id: "aviso-8",
    titulo: "Factura emitida con observaciones",
    categoria: "Facturación",
    descripcion:
      "La factura #INV-2042 fue emitida con una observación del cliente. Revisá los comentarios antes del cierre.",
    actionLabel: "Ir a Pagos",
    actionUrl: "/admin-hub/pagos",
    tiempoRelativo: "Hace 3 días",
    leida: true,
    grupo: "anterior",
  },
  {
    id: "aviso-9",
    titulo: "Variables de nómina sin aprobar",
    categoria: "Nóminas",
    descripcion: "Existen 4 variables de nómina pendientes de aprobación para el período actual.",
    actionLabel: "Ir a Nóminas",
    actionUrl: "/admin-hub/nominas/variables",
    tiempoRelativo: "Hace 4 días",
    leida: true,
    grupo: "anterior",
  },
];

export function getUnreadAvisosCount(): number {
  return MOCK_AVISO_NOTIFICATIONS.filter((aviso) => !aviso.leida).length;
}
