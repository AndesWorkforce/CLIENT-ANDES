import { formatPtoDias } from "@/components/payslip/pto-format";
import { findContractor } from "../data/mock-contractors";
import type {
  PayrollDetail,
  PayrollDetailPaymentLine,
} from "../types/nomina-detail.types";
import type { PayrollVariable } from "../data/mock-payroll-variables";
import { getPersonaProfile } from "../../personas/data/mock-persona-detail";

export interface PayslipLineItem {
  id: string;
  label: string;
  value: string;
}

export interface PayslipPreviewData {
  contractorName: string;
  position: string;
  hiredSince: string;
  email: string;
  startDate: string;
  monthlyBase: string;
  holidayRate: string;
  ptoBalance: string;
  netPay: string;
  grossPay: string;
  totalEarnings: string;
  totalDeductions: string;
  totalDeductionsSigned: string;
  generatedOn: string;
  regularDaysLabel: string;
  regularDaysValue: string;
  holidaysValue: string;
  bonusTotal: string;
  bonusItems: PayslipLineItem[];
  variablesTotal: string;
  variableItems: PayslipLineItem[];
  deductions: PayslipLineItem[];
}

export function formatPayslipMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatShortEnglishDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseFlexibleDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (iso) {
    const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const dotted = trimmed.split(".");
  if (dotted.length === 3) {
    const [day, month, rawYear] = dotted.map(Number);
    if ([day, month, rawYear].some(Number.isNaN)) return null;
    const year = rawYear < 100 ? 2000 + rawYear : rawYear;
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatFlexibleDate(value: string): string {
  const date = parseFlexibleDate(value);
  return date ? formatShortEnglishDate(date) : value;
}

function startDateFromDetail(detail: PayrollDetail): string {
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(detail.periodoAnioMes)) {
    const [year, month] = detail.periodoAnioMes.split("-").map(Number);
    return formatShortEnglishDate(new Date(year, month - 1, 1));
  }

  return "—";
}

function parseLeadingQuantity(value: string): number | null {
  const match = /^(\d+(?:\.\d+)?)/.exec(value.trim());
  if (!match) return null;
  const quantity = Number(match[1]);
  return Number.isFinite(quantity) ? quantity : null;
}

function formatDayCount(count: number): string {
  return `${count} ${count === 1 ? "day" : "days"}`;
}

function formatHoursCount(count: number): string {
  return `${count} h`;
}

type EarningKind = "regular" | "holiday" | "bonus" | "variable";

function isBonusText(value: string): boolean {
  return /bonus/i.test(value);
}

function isHolidayText(value: string): boolean {
  return /holiday|festivo/i.test(value);
}

function isRegularText(value: string): boolean {
  return /d[ií]as regulares|horas trabajadas|regular days|hours worked/i.test(
    value
  );
}

function classifyEarningLine(line: PayrollDetailPaymentLine): EarningKind {
  if (line.id === "regular-days" || isRegularText(line.label)) return "regular";
  if (isBonusText(line.label)) return "bonus";
  if (isHolidayText(line.label)) return "holiday";
  return "variable";
}

function classifyVariable(variable: PayrollVariable): EarningKind | "deduction" {
  if (variable.amount < 0) return "deduction";
  if (variable.incomeCategory === "Bonus" || isBonusText(variable.type)) {
    return "bonus";
  }
  if (variable.type === "Holiday" || variable.category === "holidays") {
    return "holiday";
  }
  if (variable.amount > 0) return "variable";
  return "variable";
}

function toLineItem(
  line: PayrollDetailPaymentLine,
  index: number
): PayslipLineItem {
  return {
    id: line.id ?? `${line.label}-${index}`,
    label: line.label,
    value: line.value,
  };
}

function buildGroupedEarnings(detail: PayrollDetail): {
  regularDaysLabel: string;
  regularDaysValue: string;
  holidaysValue: string;
  bonusItems: PayslipLineItem[];
  variableItems: PayslipLineItem[];
} {
  const regularLine =
    detail.earnings.find((line) => classifyEarningLine(line) === "regular") ??
    null;
  const isHourly = Boolean(detail.esHourly);
  const quantity = regularLine ? parseLeadingQuantity(regularLine.value) : null;

  const holidayLines = detail.earnings.filter(
    (line) => classifyEarningLine(line) === "holiday"
  );
  const bonusLines = detail.earnings.filter(
    (line) => classifyEarningLine(line) === "bonus"
  );
  const variableLines = detail.earnings.filter(
    (line) => classifyEarningLine(line) === "variable"
  );

  const holidayFromVariables = detail.variables.filter(
    (variable) => classifyVariable(variable) === "holiday"
  ).length;

  const holidayCount = Math.max(holidayLines.length, holidayFromVariables);

  return {
    regularDaysLabel: isHourly ? "Hours worked" : "Regular Days",
    regularDaysValue:
      quantity == null
        ? "—"
        : isHourly
          ? formatHoursCount(quantity)
          : formatDayCount(quantity),
    holidaysValue: formatDayCount(holidayCount),
    bonusItems: bonusLines.map(toLineItem),
    variableItems: variableLines.map(toLineItem),
  };
}

function sumLineAmounts(lines: PayslipLineItem[]): number {
  return lines.reduce((sum, line) => {
    const match = /\$([\d,]+(?:\.\d+)?)/.exec(line.value);
    if (!match) return sum;
    const amount = Number(match[1].replace(/,/g, ""));
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}

export function buildPayslipPreviewData(detail: PayrollDetail): PayslipPreviewData {
  const contractor = findContractor(detail.contractorId);
  const profile = contractor ? getPersonaProfile(contractor) : null;
  const grouped = buildGroupedEarnings(detail);
  const bonusTotal = sumLineAmounts(grouped.bonusItems);
  const variablesTotal = sumLineAmounts(grouped.variableItems);
  const generatedDate = detail.desprendible?.emitidoEn
    ? formatFlexibleDate(detail.desprendible.emitidoEn)
    : formatShortEnglishDate(new Date());

  return {
    contractorName: detail.contractorName,
    position: detail.position,
    hiredSince: formatFlexibleDate(detail.contractStartDate),
    email: detail.contactEmail,
    startDate: startDateFromDetail(detail),
    monthlyBase: formatPayslipMoney(detail.baseSalary),
    holidayRate: `${(profile?.hrRateHolidays ?? 2).toFixed(1)}×`,
    ptoBalance:
      detail.ptoDisponible === undefined
        ? "—"
        : formatPtoDias(detail.ptoDisponible),
    netPay: formatPayslipMoney(detail.totalAmount),
    grossPay: formatPayslipMoney(detail.totalEarnings),
    totalEarnings: formatPayslipMoney(detail.totalEarnings),
    totalDeductions: formatPayslipMoney(detail.totalDeductions),
    totalDeductionsSigned: `− ${formatPayslipMoney(detail.totalDeductions)}`,
    generatedOn: generatedDate,
    ...grouped,
    bonusTotal: formatPayslipMoney(bonusTotal),
    variablesTotal: formatPayslipMoney(variablesTotal),
    deductions: detail.deductions.map(toLineItem),
  };
}
