import type { Aviso } from "../types/avisos.types";

export const mockAvisos: Aviso[] = [
  {
    id: "1",
    tipo: "Nomina",
    estado: "Pendiente",
    descripcion: "Nómina de Mayo 2026 próxima a cerrar - Quedan 3 días",
    url: "/admin-hub/nominas",
  },
  {
    id: "2",
    tipo: "Contrato",
    estado: "Pendiente",
    descripcion: "5 contratos requieren aprobación y firma",
    url: "/admin-hub/contratos",
  },
  {
    id: "3",
    tipo: "Pago",
    estado: "Revisado",
    descripcion: "Pagos de la quincena verificados y listos para procesar",
    url: "/admin-hub/pagos",
  },
  {
    id: "4",
    tipo: "Nomina",
    estado: "Cerrado",
    descripcion: "Nómina de Abril 2026 cerrada y procesada exitosamente",
    url: "/admin-hub/nominas",
  },
  {
    id: "5",
    tipo: "General",
    estado: "Pendiente",
    descripcion: "Actualización de políticas de recursos humanos pendiente",
    url: "/admin-hub/configuracion",
  },
  {
    id: "6",
    tipo: "Contrato",
    estado: "Revisado",
    descripcion: "3 renovaciones de contrato revisadas por legal",
    url: "/admin-hub/contratos",
  },
  {
    id: "7",
    tipo: "Pago",
    estado: "Pendiente",
    descripcion: "Bonificaciones del trimestre pendientes de validación",
    url: "/admin-hub/pagos",
  },
];
