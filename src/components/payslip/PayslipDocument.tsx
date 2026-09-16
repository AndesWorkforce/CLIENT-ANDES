"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Documento del desprendible de pago.
 *
 * Es puramente presentacional y lo comparten el detalle de nómina del Admin Hub
 * y la vista del contratista en `currentApplication`, para que el desprendible
 * que ve el contratista sea exactamente el mismo que genera administración.
 */

export interface PayslipLineItem {
  id: string;
  label: string;
  value: string;
}

export interface PayslipDocumentRow {
  id: string;
  label: string;
  value: string;
  /** Sub-ítems desplegables. Sin ellos la fila es simple. */
  items?: PayslipLineItem[];
  /** Muestra el chevron aunque no haya sub-ítems: "sin datos en el período". */
  expandable?: boolean;
}

export interface PayslipDocumentData {
  contractorName: string;
  position: string;
  /** Campos que el backend del contratista todavía no expone se muestran como "—". */
  hiredSince?: string;
  email?: string;
  startDate: string;
  monthlyBase: string;
  holidayRate?: string;
  ptoBalance?: string;
  netPay: string;
  grossPay: string;
  totalEarnings: string;
  totalDeductions: string;
  totalDeductionsSigned: string;
  generatedOn: string;
  earningRows: PayslipDocumentRow[];
  deductions: PayslipLineItem[];
}

interface PayslipDocumentProps {
  data: PayslipDocumentData;
  /** Sombra y filas desplegables. Se apaga al renderizar dentro de un thumbnail. */
  interactive?: boolean;
}

const TEAL_GRADIENT =
  "linear-gradient(172.85deg, #0097B2 3.67%, #0097B2 54.63%, #137486 96.33%)";
const EMPTY_DEDUCTION_SLOTS = 6;
/** Separador entre columnas y filas: gris muy claro, como en el diseño. */
const HAIRLINE = "#EFEFEF";
const DASH = "—";

function SidebarField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start">
      <p className="flex h-6 items-center text-[9px] font-semibold uppercase leading-[13.5px] tracking-[0.8px] text-white/[0.38]">
        {label}
      </p>
      <div className="pt-[2px] text-[12px] font-medium leading-[18px] text-white">
        {children}
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center justify-center py-4 ${
        accent ? "" : "bg-white"
      }`}
      style={accent ? { backgroundImage: TEAL_GRADIENT } : undefined}
    >
      <p
        className={`text-[9px] font-bold uppercase leading-[13.5px] tracking-[1px] ${
          accent ? "text-[#DFFAFF]" : "text-[#858585]"
        }`}
      >
        {label}
      </p>
      <p
        className={`whitespace-nowrap pt-[2px] font-bold tracking-[-0.3px] ${
          accent
            ? "text-[20px] leading-[30px] text-white"
            : "text-[17px] leading-[25px] text-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ColumnHeader({
  label,
  barClassName,
}: {
  label: string;
  barClassName: string;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className={`h-3 w-[2.5px] shrink-0 rounded-[2px] ${barClassName}`} />
      <p className="text-[9.5px] font-bold uppercase leading-[14.25px] tracking-[1.4px] text-[#858585]">
        {label}
      </p>
    </div>
  );
}

function LineRow({
  label,
  value,
  muted = false,
  leading,
}: {
  label: string;
  value?: string;
  muted?: boolean;
  leading?: ReactNode;
}) {
  const textClass = muted ? "text-[#C8C8C8]" : "text-[#525252]";

  return (
    <div
      className="flex w-full items-center justify-between border-b py-2"
      style={{ borderColor: HAIRLINE }}
    >
      <div className="flex min-w-0 items-center gap-[7px]">
        {leading}
        <p className={`truncate text-[13px] font-normal leading-[19px] ${textClass}`}>
          {label}
        </p>
      </div>
      {value ? (
        <p
          className={`shrink-0 text-[13px] font-semibold leading-[19px] ${
            muted ? "text-[#C8C8C8]" : "text-black"
          }`}
        >
          {value}
        </p>
      ) : null}
    </div>
  );
}

function ExpandableLine({
  label,
  value,
  items,
  interactive,
  expanded,
  onToggle,
}: {
  label: string;
  value: string;
  items: PayslipLineItem[];
  interactive: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const muted = items.length === 0;
  const canExpand = interactive && items.length > 0;
  const chevron = (
    <ChevronRight
      size={14}
      strokeWidth={2}
      className={`size-[14px] shrink-0 transition-transform ${
        expanded && canExpand ? "rotate-90" : ""
      } ${muted ? "text-[#C8C8C8]" : "text-[#525252]"}`}
      aria-hidden="true"
    />
  );

  return (
    <div className="w-full">
      {canExpand ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex w-full items-center justify-between border-b py-2 text-left"
          style={{ borderColor: HAIRLINE }}
        >
          <span className="flex min-w-0 items-center gap-[7px]">
            {chevron}
            <span className="truncate text-[13px] font-normal leading-[19px] text-[#525252]">
              {label}
            </span>
          </span>
          <span className="shrink-0 text-[13px] font-semibold leading-[19px] text-black">
            {value}
          </span>
        </button>
      ) : (
        <LineRow label={label} value={value} muted={muted} leading={chevron} />
      )}

      {canExpand && expanded
        ? items.map((item) => (
            <LineRow key={item.id} label={item.label} value={item.value} />
          ))
        : null}
    </div>
  );
}

function TotalBanner({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "earnings" | "deductions";
}) {
  const isEarnings = variant === "earnings";

  return (
    <div
      className={`mt-4 flex w-full shrink-0 items-center justify-between rounded-[8px] border px-3 py-2.5 ${
        isEarnings
          ? "border-[rgba(0,151,178,0.18)] bg-[#F0FAFE]"
          : "border-[#FECACA] bg-[#FFF5F5]"
      }`}
    >
      <p
        className={`text-[10.5px] font-bold uppercase leading-[15.75px] tracking-[0.5px] ${
          isEarnings ? "text-[#0097B2]" : "text-[#EF4444]"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-[15px] font-bold leading-[22.5px] ${
          isEarnings ? "text-[#0F2A47]" : "text-[#EF4444]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function PayslipDocument({
  data,
  interactive = true,
}: PayslipDocumentProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const deductionRows = useMemo(() => {
    const emptyCount = Math.max(
      0,
      EMPTY_DEDUCTION_SLOTS - data.deductions.length
    );

    return [
      ...data.deductions,
      ...Array.from({ length: emptyCount }, (_, index) => ({
        id: `empty-deduction-${index}`,
        label: DASH,
        value: "",
      })),
    ];
  }, [data.deductions]);

  return (
    <div className="w-full overflow-x-auto">
      <div
        className={`mx-auto flex w-[1100px] overflow-hidden rounded-2xl bg-white ${
          interactive
            ? "shadow-[0px_12px_48px_0px_rgba(15,42,71,0.16),0px_2px_6px_0px_rgba(0,0,0,0.06)]"
            : ""
        }`}
      >
        <aside
          className="flex w-[270px] shrink-0 flex-col items-start p-8"
          style={{ backgroundImage: TEAL_GRADIENT }}
        >
          <div className="flex w-full shrink-0 justify-center">
            <Image
              src="/LOGO_ANDES_BLANCO_TRANSPARENTE.png"
              alt="Andes Workforce"
              width={196}
              height={76}
              className="h-[76px] w-[196px] object-contain object-center"
              priority
            />
          </div>

          <div className="flex w-full flex-col items-start pt-7">
            <p className="flex h-6 items-center text-[9.5px] font-semibold uppercase leading-[14.25px] tracking-[1px] text-white/40">
              Contractor name
            </p>
            <h2 className="pt-1 text-[15px] font-bold leading-[20.25px] text-white">
              {data.contractorName}
            </h2>
          </div>

          <div className="flex w-full flex-col items-start gap-3.5 pt-5">
            <SidebarField label="Position">{data.position}</SidebarField>
            <SidebarField label="contracted since">
              {data.hiredSince || DASH}
            </SidebarField>
            <SidebarField label="Email">
              <span className="break-all">{data.email || DASH}</span>
            </SidebarField>
          </div>
        </aside>

        <div
          className="h-auto w-[3px] shrink-0 bg-gradient-to-b from-[#0097B2] via-[#00BCD4] to-[#0097B2]"
          aria-hidden="true"
        />

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-stretch border-b border-[#F8F8F8]">
            <MetricCell label="Start date" value={data.startDate} />
            <MetricCell label="Monthly Base" value={data.monthlyBase} />
            <MetricCell label="Holiday Rate" value={data.holidayRate || DASH} />
            <MetricCell label="PTO BALANCE" value={data.ptoBalance || DASH} />
            <MetricCell label="Net Pay" value={data.netPay} accent />
          </div>

          <div className="flex min-h-[268px] items-stretch">
            <section className="flex w-[309px] shrink-0 flex-col items-start border-r border-[#EFEFEF] px-6 py-5">
              <ColumnHeader label="Earnings" barClassName="bg-[#0097B2]" />
              <div className="flex w-full flex-1 flex-col pt-3">
                {data.earningRows.map((row) =>
                  row.items || row.expandable ? (
                    <ExpandableLine
                      key={row.id}
                      label={row.label}
                      value={row.value}
                      items={row.items ?? []}
                      interactive={interactive}
                      expanded={Boolean(expandedRows[row.id])}
                      onToggle={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [row.id]: !prev[row.id],
                        }))
                      }
                    />
                  ) : (
                    <LineRow key={row.id} label={row.label} value={row.value} />
                  )
                )}
              </div>
              <TotalBanner
                label="Total Earnings"
                value={data.totalEarnings}
                variant="earnings"
              />
            </section>

            <section className="flex w-[309px] shrink-0 flex-col items-start border-r border-[#EFEFEF] px-6 py-5">
              <ColumnHeader label="Deductions" barClassName="bg-[#F87171]" />
              <div className="flex w-full flex-1 flex-col pt-3">
                {deductionRows.map((row) => (
                  <LineRow
                    key={row.id}
                    label={row.label}
                    value={row.value || undefined}
                    muted={!row.value}
                  />
                ))}
              </div>
              <TotalBanner
                label="Total Deductions"
                value={data.totalDeductions}
                variant="deductions"
              />
            </section>

            <section className="flex min-w-[200px] flex-1 flex-col items-start px-6 py-5">
              <ColumnHeader label="Summary" barClassName="bg-[#0F2A47]" />
              <div className="flex w-full flex-col gap-2 pt-3">
                <div className="flex h-[45px] w-full items-center justify-between rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5">
                  <p className="text-[10.5px] font-semibold uppercase leading-[15.75px] tracking-[0.4px] text-[#6B7280]">
                    Gross Pay
                  </p>
                  <p className="text-[13px] font-bold leading-[19.5px] text-black">
                    {data.grossPay}
                  </p>
                </div>
                <div className="flex h-[45px] w-full items-center justify-between rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5">
                  <p className="text-[10.5px] font-semibold uppercase leading-[15.75px] tracking-[0.4px] text-[#6B7280]">
                    Deductions
                  </p>
                  <p className="text-[13px] font-bold leading-[19.5px] text-black">
                    {data.totalDeductionsSigned}
                  </p>
                </div>
              </div>

              <div
                className="mt-auto flex w-full items-center justify-between rounded-[8px] p-3"
                style={{ backgroundImage: TEAL_GRADIENT }}
              >
                <div className="flex flex-col items-start">
                  <p className="text-[9px] font-bold uppercase leading-[13.5px] tracking-[1px] text-[#DFFAFF]">
                    Net Pay
                  </p>
                  <p className="text-[9px] font-normal leading-[13.5px] text-[#DFFAFF]">
                    Take-home
                  </p>
                </div>
                <p className="text-[18px] font-bold leading-[27px] tracking-[-0.3px] text-white">
                  {data.netPay}
                </p>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between border-t border-[#F8F8F8] bg-[#FAFAFA] px-6 py-3">
            <p className="text-[10px] leading-[15px] text-[#D1D5DB]">
              Computer-generated document · valid without signature
            </p>
            <p className="text-[10px] font-medium leading-[15px] text-[#858585]">
              Generated {data.generatedOn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
