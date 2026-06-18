"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import AdminHubDatePicker from "./AdminHubDatePicker";

interface AdminHubDateRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  fromLabel?: string;
  toLabel?: string;
  className?: string;
}

/**
 * Componente de selector de rango de fechas para Admin Hub
 * Permite seleccionar una fecha "desde" y una fecha "hasta"
 * Valida que la fecha inicial no sea mayor que la fecha final
 * y que la fecha final no sea mayor que la fecha actual
 */
export default function AdminHubDateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  fromLabel = "Desde",
  toLabel = "Hasta",
  className = "",
}: AdminHubDateRangePickerProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Obtener la fecha actual en formato ISO (YYYY-MM-DD)
  const todayIso = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Validar el rango de fechas cada vez que cambien
  useEffect(() => {
    if (fromDate && toDate) {
      if (fromDate > toDate) {
        setValidationError("La fecha inicial no puede ser mayor que la fecha final");
      } else if (toDate > todayIso) {
        setValidationError("La fecha final no puede ser mayor que la fecha actual");
      } else {
        setValidationError(null);
      }
    } else if (toDate && toDate > todayIso) {
      setValidationError("La fecha final no puede ser mayor que la fecha actual");
    } else {
      setValidationError(null);
    }
  }, [fromDate, toDate, todayIso]);

  const handleFromDateChange = (date: string) => {
    // Si ya hay una fecha final y la nueva fecha inicial es mayor, limpiar la fecha final
    if (toDate && date > toDate) {
      onToDateChange("");
    }
    // Si la fecha inicial es mayor que hoy, no permitirla
    if (date > todayIso) {
      return;
    }
    onFromDateChange(date);
  };

  const handleToDateChange = (date: string) => {
    // Si la fecha final es mayor que hoy, no permitirla
    if (date > todayIso) {
      return;
    }
    // Si ya hay una fecha inicial y la nueva fecha final es menor, limpiar la fecha inicial
    if (fromDate && date < fromDate) {
      onFromDateChange("");
    }
    onToDateChange(date);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[14px] text-[#858585]">
          <Calendar size={18} className="shrink-0" />
          <span className="font-medium whitespace-nowrap">Rango de fechas:</span>
        </div>

        <div className="flex min-w-0 flex-wrap items-end gap-2">
          <div className="w-[min(180px,100%)]">
            <AdminHubDatePicker
              label={fromLabel}
              value={fromDate}
              onChange={handleFromDateChange}
              placeholder="dd.mm.aa"
              required={false}
              maxDate={toDate || todayIso}
            />
          </div>

          <span className="hidden pb-3 text-[14px] text-[#858585] sm:inline">-</span>

          <div className="w-[min(180px,100%)]">
            <AdminHubDatePicker
              label={toLabel}
              value={toDate}
              onChange={handleToDateChange}
              placeholder="dd.mm.aa"
              required={false}
              minDate={fromDate || undefined}
              maxDate={todayIso}
            />
          </div>
        </div>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 text-[12px] text-[#E33434] sm:ml-[124px]">
          <AlertCircle size={14} />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
