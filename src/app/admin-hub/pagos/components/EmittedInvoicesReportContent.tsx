"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import {
  downloadInvoicePdf,
  getReporteFacturasEmitidas,
  type ReporteFacturasEmitidas,
} from "../actions/pagos.actions";
import InvoiceFilterSelect from "./InvoiceFilterSelect";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** Últimos 24 meses como opciones de rango. */
function buildPeriodoOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    options.push({ value, label: `${MESES[date.getMonth()]} ${date.getFullYear()}` });
  }
  return options;
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatFechaHora(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getUTCFullYear()}`;
}

/** El período viaja como YYYY-MM; la UI de descarga lo espera como "Mes AAAA". */
function periodoToDisplay(periodo: string): string {
  const [anio, mes] = periodo.split("-").map(Number);
  return `${MESES[mes - 1]} ${anio}`;
}

export default function EmittedInvoicesReportContent() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [report, setReport] = useState<ReporteFacturasEmitidas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descargando, setDescargando] = useState<string | null>(null);

  const periodoOptions = useMemo(buildPeriodoOptions, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getReporteFacturasEmitidas({
      desde: desde || undefined,
      hasta: hasta || undefined,
    });

    if (!result.success || !result.data) {
      setReport(null);
      setError(result.message ?? "Error al obtener el reporte");
    } else {
      setReport(result.data);
    }
    setIsLoading(false);
  }, [desde, hasta]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDownload(empresaId: string, periodo: string, numero: string) {
    setDescargando(numero);
    try {
      const result = await downloadInvoicePdf(empresaId, periodoToDisplay(periodo));
      if (!result.success || !result.data) return;

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
      setDescargando(null);
    }
  }

  const hasFilters = Boolean(desde || hasta);
  const cellClass =
    "px-3 py-5 text-[14px] tracking-[0.28px] text-[#858585] whitespace-nowrap";
  const headClass =
    "px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]";

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Pagos", href: "/admin-hub/pagos" },
      { label: "Facturas emitidas" },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold leading-[1.3] text-[#343434]">
          Facturas emitidas
        </h1>
        <p className="text-[14px] leading-[1.3] text-[#707070]">
          Registro oficial de facturas emitidas, con la traza de quién aprobó y
          quién emitió cada documento.
        </p>
      </div>

      <div className={ADMIN_HUB_FILTERS_ROW_CLASS}>
        <InvoiceFilterSelect
          label="Desde"
          placeholder="Desde"
          value={desde}
          onChange={setDesde}
          options={periodoOptions}
        />
        <InvoiceFilterSelect
          label="Hasta"
          placeholder="Hasta"
          value={hasta}
          onChange={setHasta}
          options={periodoOptions}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setDesde("");
              setHasta("");
            }}
            className={ADMIN_HUB_CLEAR_FILTERS_CLASS}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="rounded-[8px] border border-[#F5C2C7] bg-[#FDF2F3] px-5 py-4 text-[14px] text-[#B02A37]">
          {error}
        </div>
      ) : !report || report.cantidad === 0 ? (
        <div className="rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-8 text-center text-[14px] text-[#707070]">
          No hay facturas emitidas en este rango.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[180px] flex-1 flex-col gap-1 rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-4">
              <span className="text-[12px] leading-[1.3] text-[#858585]">
                Facturas emitidas
              </span>
              <span className="text-[22px] font-bold leading-[1.3] text-[#343434]">
                {report.cantidad}
              </span>
            </div>
            <div className="flex min-w-[180px] flex-1 flex-col gap-1 rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-4">
              <span className="text-[12px] leading-[1.3] text-[#858585]">
                Total facturado
              </span>
              <span className="text-[22px] font-bold leading-[1.3] text-[#343434]">
                {formatMoney(report.totalFacturado)}
              </span>
            </div>
          </div>

          <AdminHubTableShell>
            <table className="w-full min-w-[1000px] border-collapse bg-white">
              <thead>
                <tr className="border-b border-[#EFEFEF]">
                  <th className={`${headClass} rounded-tl-[12px]`}>N.º de factura</th>
                  <th className={headClass}>Cliente</th>
                  <th className={headClass}>Período</th>
                  <th className={headClass}>Total</th>
                  <th className={headClass}>Aprobada por</th>
                  <th className={headClass}>Emitida por</th>
                  <th className={headClass}>Emitida el</th>
                  <th className={`${headClass} rounded-tr-[12px] w-[60px]`} />
                </tr>
              </thead>
              <tbody>
                {report.facturas.map((factura) => (
                  <tr key={factura.numeroFactura} className={ADMIN_HUB_TABLE_ROW}>
                    <td className={cellClass}>
                      <span className="font-medium text-[#343434]">
                        {factura.numeroFactura}
                      </span>
                      {factura.estado === "PAGADA" && (
                        <span className="ml-2 rounded-full bg-[#E6F7EC] px-2 py-0.5 text-[11px] text-[#1F7A45]">
                          Pagada
                        </span>
                      )}
                    </td>
                    <td className={cellClass}>{factura.empresaNombre}</td>
                    <td className={cellClass}>{periodoToDisplay(factura.periodo)}</td>
                    <td className={cellClass}>{formatMoney(factura.totalFacturar)}</td>
                    <td className={cellClass}>{factura.aprobadoPor ?? "—"}</td>
                    <td className={cellClass}>{factura.emitidaPor ?? "—"}</td>
                    <td className={cellClass}>{formatFechaHora(factura.emitidaEn)}</td>
                    <td className="px-3 py-5 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            factura.empresaId,
                            factura.periodo,
                            factura.numeroFactura,
                          )
                        }
                        disabled={descargando === factura.numeroFactura}
                        aria-label={`Descargar ${factura.numeroFactura}`}
                        className="text-[#858585] transition-colors hover:text-[#0097B2] disabled:opacity-50"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminHubTableShell>
        </>
      )}
    </div>
  );
}
