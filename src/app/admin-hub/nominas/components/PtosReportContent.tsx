"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import InvoiceFilterSelect from "../../pagos/components/InvoiceFilterSelect";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import {
  getPtosReport,
  type PtoContratista,
  type PtosReport,
} from "../actions/ptos-report.actions";

const SEARCH_DEBOUNCE_MS = 350;

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function currentPeriodo(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Últimos 18 meses como opciones de período. */
function buildPeriodoOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 18; i += 1) {
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

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** Un PTO puede descontarse por días hábiles o por horas de ausencia parcial. */
function describeCantidad(dia: PtoContratista["dias"][number]): string {
  if (dia.modo === "por_horas") {
    const horas = dia.horasAusencia ?? 0;
    return `${horas} ${horas === 1 ? "hora" : "horas"}`;
  }
  return `${dia.diasLaborables} ${dia.diasLaborables === 1 ? "día" : "días"}`;
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-1 rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-4">
      <span className="text-[12px] leading-[1.3] text-[#858585]">{label}</span>
      <span className="text-[22px] font-bold leading-[1.3] text-[#343434]">{value}</span>
    </div>
  );
}

export default function PtosReportContent() {
  const [periodo, setPeriodo] = useState(currentPeriodo);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [report, setReport] = useState<PtosReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const periodoOptions = useMemo(buildPeriodoOptions, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getPtosReport({ periodo, search: search || undefined });

    if (!result.success || !result.data) {
      setReport(null);
      setError(result.message ?? "Error al obtener el reporte de PTOs");
    } else {
      setReport(result.data);
    }
    setIsLoading(false);
  }, [periodo, search]);

  useEffect(() => {
    void load();
  }, [load]);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const hasFilters = Boolean(search) || periodo !== currentPeriodo();
  const cellClass =
    "px-3 py-5 text-[14px] tracking-[0.28px] text-[#858585] whitespace-nowrap";

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: "Reporte de PTOs" },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold leading-[1.3] text-[#343434]">
          Reporte de PTOs
        </h1>
        <p className="text-[14px] leading-[1.3] text-[#707070]">
          Ausencias no pagadas aplicadas en el período. No se cuentan fines de semana
          ni festivos del país de facturación.
        </p>
      </div>

      <div className={ADMIN_HUB_FILTERS_ROW_CLASS}>
        <AdminHubSearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Buscar contratista o puesto"
        />
        <InvoiceFilterSelect
          label="Período"
          value={periodo}
          onChange={setPeriodo}
          options={periodoOptions}
          placeholder="Período"
        />
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setPeriodo(currentPeriodo());
              setSearchInput("");
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
      ) : !report || report.cantidadContratistas === 0 ? (
        <div className="rounded-[8px] border border-[#EFEFEF] bg-white px-5 py-8 text-center text-[14px] text-[#707070]">
          No hay PTOs aplicados en este período.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <SummaryCard
              label="Contratistas"
              value={String(report.cantidadContratistas)}
            />
            <SummaryCard
              label="Días hábiles"
              value={String(report.totalDiasLaborables)}
            />
            <SummaryCard
              label="Descuento en nómina"
              value={formatMoney(report.totalDescuentoNomina)}
            />
            <SummaryCard
              label="Descuento en facturación"
              value={formatMoney(report.totalDescuentoFactura)}
            />
          </div>

          <AdminHubTableShell>
            <table className="w-full min-w-[900px] border-collapse bg-white">
              <thead>
                <tr className="border-b border-[#EFEFEF]">
                  <th className="w-12 rounded-tl-[12px] px-4 py-5" />
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Contratista
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Cliente
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Días hábiles
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Horas
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Nómina
                  </th>
                  <th className="rounded-tr-[12px] px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Facturación
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.contratistas.map((contratista) => {
                  const isExpanded = expandedIds.has(
                    contratista.procesoContratacionId,
                  );

                  return [
                    <tr
                      key={contratista.procesoContratacionId}
                      className={ADMIN_HUB_TABLE_ROW}
                    >
                      <td className="px-4 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            toggleExpanded(contratista.procesoContratacionId)
                          }
                          aria-expanded={isExpanded}
                          aria-label={`Ver detalle de ${contratista.nombreCompleto}`}
                          className="text-[#858585] transition-colors hover:text-[#0097B2]"
                        >
                          {isExpanded ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </button>
                      </td>
                      <td className={cellClass}>
                        <span className="font-medium text-[#343434]">
                          {contratista.nombreCompleto}
                        </span>
                        <span className="block text-[12px] text-[#A5A5A5]">
                          {contratista.puestoTrabajo}
                        </span>
                      </td>
                      <td className={cellClass}>{contratista.empresaNombre}</td>
                      <td className={cellClass}>{contratista.totalDiasLaborables}</td>
                      <td className={cellClass}>
                        {contratista.totalHorasAusencia || "—"}
                      </td>
                      <td className={cellClass}>
                        {formatMoney(contratista.totalDescuentoNomina)}
                      </td>
                      <td className={cellClass}>
                        {formatMoney(contratista.totalDescuentoFactura)}
                      </td>
                    </tr>,

                    isExpanded && (
                      <tr
                        key={`${contratista.procesoContratacionId}-detalle`}
                        className="border-b border-[#EFEFEF] bg-[#FAFAFA]"
                      >
                        <td />
                        <td colSpan={6} className="px-3 py-4">
                          <div className="flex flex-col gap-2">
                            {contratista.dias.map((dia) => (
                              <div
                                key={dia.diaLibreId}
                                className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] text-[#707070]"
                              >
                                <span className="min-w-[170px] text-[#525252]">
                                  {formatFecha(dia.fechaInicio)} –{" "}
                                  {formatFecha(dia.fechaFin)}
                                </span>
                                <span className="min-w-[90px]">
                                  {describeCantidad(dia)}
                                </span>
                                <span className="min-w-[130px]">
                                  × {formatMoney(dia.tarifaAplicada)}
                                  {dia.modo === "por_horas" ? "/h" : "/día"}
                                </span>
                                <span className="min-w-[100px] font-medium text-[#525252]">
                                  {formatMoney(dia.montoNomina)}
                                </span>
                                {dia.notas && (
                                  <span className="text-[#A5A5A5]">{dia.notas}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ),
                  ];
                })}
              </tbody>
            </table>
          </AdminHubTableShell>
        </>
      )}
    </div>
  );
}
