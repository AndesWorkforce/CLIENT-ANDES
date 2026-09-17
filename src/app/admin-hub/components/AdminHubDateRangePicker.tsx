"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import AdminHubDatePicker from "./AdminHubDatePicker";
import { t } from "../i18n";

interface AdminHubDateRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  fromLabel?: string;
  toLabel?: string;
  className?: string;
  /** Fila de filtros: sin encabezado, alineado con otros controles */
  variant?: "default" | "filter";
  /**
   * Permite elegir fechas futuras. Por defecto no, porque los usos originales
   * acotan períodos ya ocurridos. Los filtros que miran fechas de finalización
   * de contrato sí lo necesitan: esas fechas suelen estar en el futuro.
   */
  allowFuture?: boolean;
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
  fromLabel,
  toLabel,
  className = "",
  variant = "default",
  allowFuture = false,
}: AdminHubDateRangePickerProps) {
  const resolvedFromLabel = fromLabel ?? t("dates.from");
  const resolvedToLabel = toLabel ?? t("dates.to");
  const [validationError, setValidationError] = useState<string | null>(null);
  // Coordina que "Desde" y "Hasta" nunca estén desplegados al mismo tiempo.
  const [openField, setOpenField] = useState<"from" | "to" | null>(null);

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
        setValidationError(t("dates.fromAfterTo"));
      } else if (!allowFuture && toDate > todayIso) {
        setValidationError(t("dates.toAfterToday"));
      } else {
        setValidationError(null);
      }
    } else if (!allowFuture && toDate && toDate > todayIso) {
      setValidationError(t("dates.toAfterToday"));
    } else {
      setValidationError(null);
    }
  }, [fromDate, toDate, todayIso, allowFuture, t]);

  const handleFromDateChange = (date: string) => {
    // Si ya hay una fecha final y la nueva fecha inicial es mayor, limpiar la fecha final
    if (toDate && date > toDate) {
      onToDateChange("");
    }
    // Si la fecha inicial es mayor que hoy, no permitirla
    if (!allowFuture && date > todayIso) {
      return;
    }
    onFromDateChange(date);
  };

  const handleToDateChange = (date: string) => {
    // Si la fecha final es mayor que hoy, no permitirla
    if (!allowFuture && date > todayIso) {
      return;
    }
    // Si ya hay una fecha inicial y la nueva fecha final es menor, limpiar la fecha inicial
    if (fromDate && date < fromDate) {
      onFromDateChange("");
    }
    onToDateChange(date);
  };

  const isFilterVariant = variant === "filter";

  const filterFieldClass = "max-w-[259px] min-w-[200px] flex-1 shrink-0";

  const dateFields = (
    <>
      <div className={isFilterVariant ? filterFieldClass : "w-[min(180px,100%)]"}>
        <AdminHubDatePicker
          variant={isFilterVariant ? "filter" : "form"}
          label={resolvedFromLabel}
          value={fromDate}
          onChange={handleFromDateChange}
          placeholder={t("dates.placeholder")}
          required={false}
          maxDate={toDate || (allowFuture ? undefined : todayIso)}
          onOpen={() => setOpenField("from")}
          forceClose={openField === "to"}
        />
      </div>

      <span
        className={`text-[14px] text-[#858585] ${
          isFilterVariant ? "shrink-0 self-end pb-3" : "hidden pb-3 sm:inline"
        }`}
      >
        -
      </span>

      <div className={isFilterVariant ? filterFieldClass : "w-[min(180px,100%)]"}>
        <AdminHubDatePicker
          variant={isFilterVariant ? "filter" : "form"}
          label={resolvedToLabel}
          value={toDate}
          onChange={handleToDateChange}
          placeholder={t("dates.placeholder")}
          required={false}
          minDate={fromDate || undefined}
          maxDate={allowFuture ? undefined : todayIso}
          onOpen={() => setOpenField("to")}
          forceClose={openField === "from"}
        />
      </div>
    </>
  );

  if (isFilterVariant) {
    return (
      <div className={`flex flex-wrap items-end gap-4 ${className}`}>
        {dateFields}
        {validationError ? (
          <div className="flex w-full basis-full items-center gap-2 text-[12px] text-[#E33434]">
            <AlertCircle size={14} />
            <span>{validationError}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[14px] text-[#858585]">
          <Calendar size={18} className="shrink-0" />
          <span className="font-medium whitespace-nowrap">{t("dates.rangeLabel")}</span>
        </div>

        <div className="flex min-w-0 flex-wrap items-end gap-2">{dateFields}</div>
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
