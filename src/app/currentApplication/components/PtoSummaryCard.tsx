"use client";

import { CalendarCheck, Info } from "lucide-react";
import {
  formatPtoDias,
  formatPtoDiasLargo,
} from "@/components/payslip/pto-format";
import type { MyPayslipDetail } from "../actions/payslips.actions";

interface PtoSummaryCardProps {
  detail: MyPayslipDetail;
}

/**
 * Resumen de PTO del período.
 *
 * Se muestra siempre, incluso sin descuentos en el mes: el contratista tiene
 * que poder ver su saldo sin tener que deducirlo de la tabla de deducciones,
 * que es donde estaba mezclado antes.
 */
export default function PtoSummaryCard({ detail }: PtoSummaryCardProps) {
  const huboDescuento = detail.ptoUsadoEsteMes > 0;
  const saldoNegativo = detail.ptoDisponible < 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <CalendarCheck size={16} className="text-[#0097B2]" />
        <h4 className="text-sm font-semibold text-gray-900">
          Personal Time Off (PTO)
        </h4>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div
          className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 ${
            saldoNegativo
              ? "border-red-200 bg-red-50"
              : "border-[#0097B2]/20 bg-[#F0FAFE]"
          }`}
        >
          <span className="text-[11px] uppercase tracking-wide text-gray-500">
            Disponibles
          </span>
          <span
            className={`text-lg font-bold ${
              saldoNegativo ? "text-red-700" : "text-[#00637A]"
            }`}
          >
            {formatPtoDias(detail.ptoDisponible)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-gray-500">
            Descontados este mes
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatPtoDias(detail.ptoUsadoEsteMes)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-gray-500">
            Acumulados
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatPtoDias(detail.ptoDevengado)}
          </span>
        </div>
      </div>

      {huboDescuento ? (
        <div className="mt-3 rounded-lg bg-[#FDECE2] px-3 py-2">
          <p className="text-xs text-[#9A4B12]">
            Este mes se descontaron{" "}
            <span className="font-semibold">
              {formatPtoDiasLargo(detail.ptoUsadoEsteMes)}
            </span>{" "}
            por ausencias. El detalle del monto está en la tabla de deducciones.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex items-start gap-1.5">
          <Info size={13} className="mt-0.5 shrink-0 text-gray-400" />
          <p className="text-xs text-gray-500">
            No tuviste ausencias descontadas en este período.
          </p>
        </div>
      )}

      {saldoNegativo && (
        <p className="mt-2 text-xs text-red-700">
          Tomaste más días de los acumulados hasta este período.
        </p>
      )}

      <p className="mt-3 text-[11px] text-gray-400">
        Se acumulan 1,25 días por mes, hasta 15 días al año.
      </p>
    </div>
  );
}
