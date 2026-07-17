export interface PayrollHolidayOption {
  id: string;
  nombre: string;
  codigoPais: string;
  pais: string;
  dia: number;
  mes: number;
  /** Fecha ISO YYYY-MM-DD cuando existe en BD */
  fecha: string | null;
  activo: boolean;
}

export function holidayFechaIso(holiday: PayrollHolidayOption, year = new Date().getFullYear()): string {
  if (holiday.fecha) {
    return holiday.fecha.slice(0, 10);
  }
  return `${year}-${String(holiday.mes).padStart(2, "0")}-${String(holiday.dia).padStart(2, "0")}`;
}

export function formatHolidayLabel(holiday: PayrollHolidayOption): string {
  const iso = holidayFechaIso(holiday);
  const datePart = new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${holiday.nombre} (${datePart})`;
}
