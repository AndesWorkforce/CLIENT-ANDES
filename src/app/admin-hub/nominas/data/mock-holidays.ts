export interface MockHoliday {
  id: string;
  nombre: string;
  codigoPais: string;
  pais: string;
  dia: number;
  mes: number;
  fecha: string | null;
  activo: boolean;
}

/** Catálogo mock alineado con la tabla Holiday del backend. */
export const MOCK_HOLIDAYS: MockHoliday[] = [
  {
    id: "hol-co-001",
    nombre: "Día del Trabajo",
    codigoPais: "CO",
    pais: "Colombia",
    dia: 1,
    mes: 5,
    fecha: "2026-05-01",
    activo: true,
  },
  {
    id: "hol-co-002",
    nombre: "Festivo mock (prueba ausencias)",
    codigoPais: "CO",
    pais: "Colombia",
    dia: 5,
    mes: 5,
    fecha: "2026-05-05",
    activo: true,
  },
  {
    id: "hol-co-003",
    nombre: "Independencia de Colombia",
    codigoPais: "CO",
    pais: "Colombia",
    dia: 20,
    mes: 7,
    fecha: "2026-07-20",
    activo: true,
  },
  {
    id: "hol-mx-001",
    nombre: "Día de la Constitución",
    codigoPais: "MX",
    pais: "México",
    dia: 5,
    mes: 2,
    fecha: "2026-02-05",
    activo: true,
  },
  {
    id: "hol-mx-002",
    nombre: "Día de la Revolución",
    codigoPais: "MX",
    pais: "México",
    dia: 20,
    mes: 11,
    fecha: "2026-11-20",
    activo: true,
  },
  {
    id: "hol-mx-003",
    nombre: "Navidad",
    codigoPais: "MX",
    pais: "México",
    dia: 25,
    mes: 12,
    fecha: "2026-12-25",
    activo: true,
  },
  {
    id: "hol-ar-001",
    nombre: "Día de la Memoria",
    codigoPais: "AR",
    pais: "Argentina",
    dia: 24,
    mes: 3,
    fecha: "2026-03-24",
    activo: true,
  },
  {
    id: "hol-ar-002",
    nombre: "Día de la Independencia",
    codigoPais: "AR",
    pais: "Argentina",
    dia: 9,
    mes: 7,
    fecha: "2026-07-09",
    activo: true,
  },
  {
    id: "hol-ar-003",
    nombre: "Navidad",
    codigoPais: "AR",
    pais: "Argentina",
    dia: 25,
    mes: 12,
    fecha: "2026-12-25",
    activo: true,
  },
];

export function getHolidaysByCountry(countryCode: string): MockHoliday[] {
  return MOCK_HOLIDAYS.filter((h) => h.activo && h.codigoPais === countryCode);
}

export function formatHolidayLabel(holiday: MockHoliday): string {
  const datePart = holiday.fecha
    ? new Date(holiday.fecha + "T12:00:00").toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : `${String(holiday.dia).padStart(2, "0")}/${String(holiday.mes).padStart(2, "0")}`;
  return `${holiday.nombre} (${datePart})`;
}

export function findHoliday(holidayId: string): MockHoliday | undefined {
  return MOCK_HOLIDAYS.find((h) => h.id === holidayId);
}
