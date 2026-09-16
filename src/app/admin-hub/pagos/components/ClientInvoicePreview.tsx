"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { InvoiceDetail } from "../types/invoice-detail.types";

interface ClientInvoicePreviewProps {
  invoice: InvoiceDetail;
  /** Sombra y bordes redondeados. Se apaga al renderizar dentro de un thumbnail. */
  interactive?: boolean;
}

/** Ancho de página A4 a 96dpi, igual que el frame del diseño. */
const PAGE_WIDTH = 794;

const HEADER_GRADIENT =
  "linear-gradient(103deg, #0097B2 0%, #0B8CA6 52%, #0A7F97 100%)";
const META_BG = "#0A7C93";
const HAIRLINE = "#EFEFEF";

const EMISOR = {
  nombre: "ANDES WORKFORCE",
  descripcion: "Servicios de contratación y nómina",
  email: "billing@teamandes.com",
};

interface PreviewLine {
  id: string;
  label: string;
  detail: string | null;
  amount: string;
}

interface PreviewSection {
  id: string;
  title: string;
  lines: PreviewLine[];
  subtotal: string;
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** El cobro de un contrato por hora es tarifa × horas; el resto va a precio fijo. */
function payrollLineDetail(
  entry: InvoiceDetail["payrollEntries"][number],
  client: string
): string {
  const base = [entry.position, client].filter(Boolean).join(" - ");
  if (!entry.esHourly) return base;

  const rate = entry.tarifaHoraria ?? 0;
  const hours = entry.horasTrabajadas ?? 0;
  return `${base} · ${formatMoney(rate)}/h × ${hours}h`;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-end justify-between border-b border-[#1F1F1F] pb-2">
      <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[1.6px] text-[#1F1F1F]">
        {title}
      </p>
      <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[1.6px] text-[#1F1F1F]">
        Amount
      </p>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-[3px]">
      <p className="text-[8.5px] font-semibold uppercase leading-[12px] tracking-[1.1px] text-white/60">
        {label}
      </p>
      <p className="truncate text-[12px] font-medium leading-[18px] text-white">
        {value}
      </p>
    </div>
  );
}

export default function ClientInvoicePreview({
  invoice,
  interactive = true,
}: ClientInvoicePreviewProps) {
  const sections = useMemo<PreviewSection[]>(() => {
    const result: PreviewSection[] = [];

    if (invoice.payrollEntries.length > 0) {
      result.push({
        id: "services",
        title: "Services",
        lines: invoice.payrollEntries.map((entry) => ({
          id: entry.id,
          label: entry.contractorName,
          detail: payrollLineDetail(entry, invoice.client),
          amount: formatMoney(entry.clientPrice),
        })),
        subtotal: invoice.payrollSubtotal,
      });
    }

    if (invoice.additionalFees.length > 0) {
      result.push({
        id: "additional-fees",
        title: "Additional fees",
        lines: invoice.additionalFees.map((fee) => ({
          id: fee.id,
          label: fee.description,
          detail: [fee.contractor, fee.position].filter(Boolean).join(" - ") || null,
          amount: fee.amount,
        })),
        subtotal: invoice.additionalFeesSubtotal,
      });
    }

    for (const section of invoice.sections) {
      if (section.items.length === 0) continue;

      result.push({
        id: section.id,
        title: section.title,
        lines: section.items.map((item) => ({
          id: item.id,
          label: item.description || item.type,
          detail: item.contractor || null,
          amount: item.amount,
        })),
        subtotal: section.subtotal,
      });
    }

    return result;
  }, [invoice]);

  const contractCount = invoice.payrollEntries.length;
  const paymentTerms = `Payment due within 30 days of the issue date.${
    contractCount > 0 ? ` ${contractCount} contrato(s).` : ""
  }`;

  return (
    <div className="w-full overflow-x-auto">
      <div
        className={`mx-auto flex flex-col overflow-hidden bg-white ${
          interactive
            ? "rounded-2xl shadow-[0px_12px_48px_0px_rgba(15,42,71,0.16),0px_2px_6px_0px_rgba(0,0,0,0.06)]"
            : ""
        }`}
        style={{ width: PAGE_WIDTH }}
      >
        <header
          className="flex items-center justify-between px-10 py-8"
          style={{ backgroundImage: HEADER_GRADIENT }}
        >
          <div className="flex items-center gap-4">
            <Image
              src="/LOGO_ANDES_BLANCO_TRANSPARENTE.png"
              alt="Andes Workforce"
              width={140}
              height={58}
              className="h-[58px] w-[140px] shrink-0 object-contain object-center"
              priority
            />
            <div className="flex flex-col items-start">
              <p className="text-[15px] font-bold leading-[21px] tracking-[0.6px] text-white">
                {EMISOR.nombre}
              </p>
              <p className="pt-[3px] text-[11px] leading-[16px] text-white/75">
                {EMISOR.descripcion}
              </p>
              <p className="text-[11px] leading-[16px] text-white/75">
                {EMISOR.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-[30px] font-bold leading-[38px] tracking-[6px] text-white">
              INVOICE
            </p>
            <p className="pt-[6px] text-[11px] leading-[16px] tracking-[1.2px] text-white/75">
              {invoice.numeroFactura ?? "—"}
            </p>
          </div>
        </header>

        <div
          className="grid grid-cols-5 gap-4 px-10 py-4"
          style={{ backgroundColor: META_BG }}
        >
          <MetaField label="Bill to" value={invoice.client} />
          <MetaField label="Issue date" value={invoice.issueDate} />
          <MetaField label="Due date" value={invoice.dueDate} />
          <MetaField label="Billing period" value={invoice.period} />
          <div className="flex min-w-0 flex-col items-start gap-[3px]">
            <p className="text-[8.5px] font-semibold uppercase leading-[12px] tracking-[1.1px] text-white/60">
              Total due
            </p>
            <p className="truncate text-[19px] font-bold leading-[26px] tracking-[-0.3px] text-white">
              {invoice.grandTotal}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-10 pb-8 pt-9">
          {sections.map((section) => (
            <section key={section.id} className="flex w-full flex-col pb-8">
              <SectionHeader title={section.title} />

              {section.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between gap-6 border-b py-[14px]"
                  style={{ borderColor: HAIRLINE }}
                >
                  <div className="flex min-w-0 flex-col items-start">
                    <p className="truncate text-[13px] font-medium leading-[19px] text-[#1F1F1F]">
                      {line.label}
                    </p>
                    {line.detail ? (
                      <p className="truncate pt-[2px] text-[11px] leading-[16px] text-[#858585]">
                        {line.detail}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-[13px] font-semibold leading-[19px] text-[#1F1F1F]">
                    {line.amount}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-end gap-8 pt-3">
                <p className="text-[9.5px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-[#858585]">
                  Subtotal
                </p>
                <p className="text-[13px] font-semibold leading-[19px] text-[#1F1F1F]">
                  {section.subtotal}
                </p>
              </div>
            </section>
          ))}

          <div className="flex justify-end pt-2">
            <div className="flex w-[280px] flex-col">
              <div className="flex items-center justify-between py-[7px]">
                <p className="text-[12px] leading-[18px] text-[#707070]">Subtotal</p>
                <p className="text-[12px] leading-[18px] text-[#525252]">
                  {invoice.grandTotal}
                </p>
              </div>
              <div
                className="flex items-center justify-between border-b py-[7px]"
                style={{ borderColor: HAIRLINE }}
              >
                <p className="text-[12px] leading-[18px] text-[#707070]">Taxes</p>
                <p className="text-[12px] leading-[18px] text-[#525252]">$0.00</p>
              </div>
              <div className="flex items-center justify-between pt-[14px]">
                <p className="text-[11px] font-bold uppercase leading-[16px] tracking-[1.2px] text-[#1F1F1F]">
                  Total
                </p>
                <p className="text-[19px] font-bold leading-[26px] tracking-[-0.3px] text-[#1F1F1F]">
                  {invoice.grandTotal}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col">
          <div
            className="flex flex-col border-t px-10 py-5"
            style={{ borderColor: HAIRLINE }}
          >
            <p className="text-[9px] font-bold uppercase leading-[13px] tracking-[1.4px] text-[#525252]">
              Payment terms
            </p>
            <p className="pt-[6px] text-[10.5px] leading-[16px] text-[#858585]">
              {paymentTerms}
            </p>
          </div>

          <div
            className="flex items-center justify-between border-t bg-[#FAFAFA] px-10 py-3"
            style={{ borderColor: HAIRLINE }}
          >
            <p className="text-[10px] leading-[15px] text-[#C8C8C8]">
              Computer-generated document · valid without signature
            </p>
            <p className="text-[10px] font-medium leading-[15px] text-[#858585]">
              {invoice.issueDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
