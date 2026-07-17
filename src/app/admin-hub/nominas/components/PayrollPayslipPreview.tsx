"use client";

import Image from "next/image";
import { useMemo, type ReactNode } from "react";
import { formatMoney } from "../data/payroll-data";
import type {
  PayrollDetail,
  PayrollDetailPaymentLine,
} from "../types/nomina-detail.types";
import { buildPayslipPreviewData } from "../lib/payslip-format";

interface PayrollPayslipPreviewProps {
  detail: PayrollDetail;
}

const BORDER = "border-[#808080]";
const LABEL_BG = "bg-[#d9d9d9]";

function PayslipInlineField({
  label,
  value,
  labelWidth = "42%",
}: {
  label: string;
  value: string;
  labelWidth?: string;
}) {
  return (
    <div className={`flex min-h-[32px] border ${BORDER}`}>
      <div
        className={`flex items-center ${LABEL_BG} px-2 py-1 text-[11px] leading-tight text-black`}
        style={{ width: labelWidth }}
      >
        {label}
      </div>
      <div
        className={`flex flex-1 items-center border-l ${BORDER} bg-white px-2 py-1 text-[12px] leading-tight text-black`}
      >
        {value}
      </div>
    </div>
  );
}

function PayslipStackedDateField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-[2px] pl-[1px] text-[11px] leading-tight text-black">{label}</p>
      <div
        className={`flex min-h-[32px] items-center border ${BORDER} bg-white px-2 py-1 text-[12px] leading-tight text-black`}
      >
        {value}
      </div>
    </div>
  );
}

function LedgerLine({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[34px] shrink-0 border-b border-black px-2 py-[9px] text-[12px] leading-tight text-black">
      {children}
    </div>
  );
}

function LedgerSpacerLine() {
  return (
    <div
      className="min-h-[34px] shrink-0 border-b border-black"
      aria-hidden="true"
    />
  );
}

function padPaymentLines(
  lines: PayrollDetailPaymentLine[],
  targetCount: number
): (PayrollDetailPaymentLine | null)[] {
  return [
    ...lines,
    ...Array.from({ length: Math.max(0, targetCount - lines.length) }, () => null),
  ];
}

function PayslipLedgerTable({
  title,
  lines,
  totalLabel,
  totalAmount,
  totalLabelClassName,
}: {
  title: string;
  lines: (PayrollDetailPaymentLine | null)[];
  totalLabel: string;
  totalAmount: string;
  totalLabelClassName: string;
}) {
  return (
    <div className={`flex h-full flex-col border ${BORDER} bg-white`}>
      <div
        className={`shrink-0 border-b ${BORDER} ${LABEL_BG} py-2 text-center text-[12px] font-bold tracking-wide text-black`}
      >
        {title}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {lines.map((line, index) =>
          line ? (
            <LedgerLine key={line.id ?? `${line.label}-${index}`}>
              {line.label}: {line.value}
            </LedgerLine>
          ) : (
            <LedgerSpacerLine key={`spacer-${index}`} />
          )
        )}
        <div className="min-h-0 flex-1" aria-hidden="true" />
      </div>

      <div className={`mt-auto flex shrink-0 border-t ${BORDER}`}>
        <div
          className={`flex flex-1 items-center px-2 py-2 text-[12px] font-bold text-black ${totalLabelClassName}`}
        >
          {totalLabel}
        </div>
        <div
          className={`flex w-[108px] items-center justify-end border-l ${BORDER} bg-white px-2 py-2 text-[12px] font-bold text-black`}
        >
          {totalAmount}
        </div>
      </div>
    </div>
  );
}

function TotalSummaryRow({
  label,
  value,
  valueClassName = "bg-white",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className={`flex min-h-[40px] border ${BORDER}`}>
      <div
        className={`flex w-[52%] items-center ${LABEL_BG} px-2 text-[11px] font-bold leading-tight text-black`}
      >
        {label}
      </div>
      <div
        className={`flex flex-1 items-center justify-end border-l ${BORDER} px-2 text-[13px] font-bold leading-tight text-black ${valueClassName}`}
      >
        {value}
      </div>
    </div>
  );
}

export default function PayrollPayslipPreview({ detail }: PayrollPayslipPreviewProps) {
  const payslip = useMemo(() => buildPayslipPreviewData(detail), [detail]);

  const { paddedEarnings, paddedDeductions } = useMemo(() => {
    const rowCount = Math.max(detail.earnings.length, detail.deductions.length, 1);

    return {
      paddedEarnings: padPaymentLines(detail.earnings, rowCount),
      paddedDeductions: padPaymentLines(detail.deductions, rowCount),
    };
  }, [detail.deductions, detail.earnings]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="mx-auto min-w-[900px] max-w-[1000px] bg-white p-5 font-[Calibri,Arial,Helvetica,sans-serif]">
        <div className="mb-4 flex items-start gap-6">
          <div className="w-[34%] space-y-3">
            <PayslipStackedDateField label="Start day:" value={payslip.startDate} />
            <PayslipStackedDateField label="End Date:" value={payslip.endDate} />
          </div>

          <div className="flex-1" />

          <div className="flex w-[30%] justify-end pt-1">
            <Image
              src="/logo-andes.png"
              alt="Andes Workforce"
              width={220}
              height={90}
              className="h-[88px] w-auto object-contain"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-5 gap-y-2">
          <div className="space-y-2">
            <PayslipInlineField label="Contractor Name:" value={payslip.contractorName} />
            <PayslipInlineField label="Hired Since:" value={payslip.hiredSince} />
          </div>
          <div className="space-y-2">
            <PayslipInlineField label="Position:" value={payslip.position} />
            <PayslipInlineField label="e-mail:" value={payslip.email} />
          </div>
          <div className="space-y-2">
            <PayslipInlineField label="Monthly Payment:" value={payslip.monthlyPayment} />
            <PayslipInlineField
              label="National Holiday Rate:"
              value={payslip.nationalHolidayRate}
            />
          </div>
        </div>

        <div className="my-5 h-[16px] bg-[#7f7f7f]" />

        <div className="grid grid-cols-3 items-stretch gap-5">
          <PayslipLedgerTable
            title="EARNINGS"
            lines={paddedEarnings}
            totalLabel="Total Earnings:"
            totalAmount={formatMoney(detail.totalEarnings)}
            totalLabelClassName="bg-[#bdd7ee]"
          />

          <PayslipLedgerTable
            title="DEDUCTIONS"
            lines={paddedDeductions}
            totalLabel="Total Deductions:"
            totalAmount={formatMoney(detail.totalDeductions)}
            totalLabelClassName="bg-[#f8cbad]"
          />

          <div className="flex flex-col justify-center gap-5 py-2">
            <TotalSummaryRow
              label="TOTAL GROSS PAY:"
              value={formatMoney(detail.totalEarnings)}
              valueClassName="bg-[#bdd7ee]"
            />
            <TotalSummaryRow
              label="TOTAL DEDUCTIONS:"
              value={formatMoney(detail.totalDeductions)}
              valueClassName="bg-[#d9d9d9]"
            />
            <TotalSummaryRow
              label="TOTAL NET PAY:"
              value={formatMoney(detail.totalAmount)}
              valueClassName="bg-[#bdd7ee] text-[15px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
