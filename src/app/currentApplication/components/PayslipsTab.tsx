"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, Download, FileText, RefreshCw } from "lucide-react";
import PayslipDocument from "@/components/payslip/PayslipDocument";
import { useAuthStore } from "@/store/auth.store";
import {
  downloadMyPayslip,
  getMyPayslipDetail,
  getMyPayslips,
  type MyPayslipDetail,
  type MyPayslipListItem,
} from "../actions/payslips.actions";
import { buildMyPayslipDocumentData } from "../lib/my-payslip-document";

function formatEmitido(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function PayslipsTab() {
  const [payslips, setPayslips] = useState<MyPayslipListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<MyPayslipDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  /** El email no viaja en el desprendible: sale de la sesión del contratista. */
  const email = useAuthStore((state) => state.user?.correo);

  const documentData = useMemo(
    () => (selected ? buildMyPayslipDocumentData(selected, email) : null),
    [selected, email],
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getMyPayslips();
    if (!result.success) {
      setError(result.message ?? "No pudimos cargar tus desprendibles de pago.");
      setPayslips([]);
    } else {
      setPayslips(result.data ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openDetail(periodo: string) {
    setIsLoadingDetail(true);
    setDetailError(null);

    const result = await getMyPayslipDetail(periodo);
    if (!result.success || !result.data) {
      setDetailError(result.message ?? "No pudimos cargar el desprendible.");
    } else {
      setSelected(result.data);
    }
    setIsLoadingDetail(false);
  }

  async function handleDownload(periodo: string) {
    setDownloading(periodo);
    try {
      const result = await downloadMyPayslip(periodo);
      if (!result.success || !result.data) {
        setDetailError(result.message ?? "No pudimos descargar el desprendible.");
        return;
      }

      const bytes = Uint8Array.from(atob(result.data.base64), (c) =>
        c.charCodeAt(0),
      );
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.filename;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  }

  // ── Estado: cargando ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-48 rounded bg-gray-200" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  // ── Estado: error ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
        >
          <RefreshCw size={14} />
          Reintentar
        </button>
      </div>
    );
  }

  // ── Detalle de un desprendible ────────────────────────────────────────────
  if (selected) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setDetailError(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0097B2] hover:text-[#008099]"
        >
          <ChevronLeft size={16} />
          Volver a mis desprendibles
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {selected.periodoDisplay}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {selected.startDate} – {selected.endDate}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Documento {selected.numeroDocumento} · emitido el{" "}
              {formatEmitido(selected.emitidoEn)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleDownload(selected.periodo)}
            disabled={downloading === selected.periodo}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0097B2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#008099] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            {downloading === selected.periodo ? "Descargando..." : "Descargar PDF"}
          </button>
        </div>

        {documentData ? <PayslipDocument data={documentData} /> : null}

        {detailError && (
          <p className="text-sm text-red-600">{detailError}</p>
        )}
      </div>
    );
  }

  // ── Estado: vacío ─────────────────────────────────────────────────────────
  if (payslips.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <FileText size={28} className="mx-auto text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">
          Todavía no tenés desprendibles de pago
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Vas a poder ver y descargar tu desprendible cuando tu nómina del mes sea
          emitida.
        </p>
      </div>
    );
  }

  // ── Listado de períodos ───────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {detailError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {detailError}
        </div>
      )}

      {payslips.map((payslip) => (
        <div
          key={payslip.periodo}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-[#0097B2]"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {payslip.periodoDisplay}
              </span>
              {payslip.estado === "PAGADA" && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                  Pagada
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              {payslip.puestoTrabajo} · {payslip.empresaNombre}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {payslip.numeroDocumento} · emitido el {formatEmitido(payslip.emitidoEn)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                Neto
              </span>
              <span className="text-sm font-bold text-gray-900">
                {payslip.totalNetPay}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void openDetail(payslip.periodo)}
              disabled={isLoadingDetail}
              className="rounded-lg border border-[#0097B2] px-3 py-1.5 text-xs font-medium text-[#0097B2] transition-colors hover:bg-[#DFFAFF] disabled:opacity-50"
            >
              Ver detalle
            </button>
            <button
              type="button"
              onClick={() => void handleDownload(payslip.periodo)}
              disabled={downloading === payslip.periodo}
              aria-label={`Descargar ${payslip.numeroDocumento}`}
              className="rounded-lg bg-[#0097B2] p-2 text-white transition-colors hover:bg-[#008099] disabled:opacity-50"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
