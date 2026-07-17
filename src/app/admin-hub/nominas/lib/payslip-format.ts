import { findContract, findContractor } from "../data/mock-contractors";
import type { PayrollDetail } from "../types/nomina-detail.types";
import { getPersonaProfile } from "../../personas/data/mock-persona-detail";

const SPANISH_MONTHS: Record<string, number> = {
  Enero: 0,
  Febrero: 1,
  Marzo: 2,
  Abril: 3,
  Mayo: 4,
  Junio: 5,
  Julio: 6,
  Agosto: 7,
  Septiembre: 8,
  Octubre: 9,
  Noviembre: 10,
  Diciembre: 11,
};

export interface PayslipPreviewData {
  startDate: string;
  endDate: string;
  contractorName: string;
  hiredSince: string;
  position: string;
  email: string;
  monthlyPayment: string;
  nationalHolidayRate: string;
}

export function formatPayslipMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatEnglishDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function periodToDateRange(period: string): { start: string; end: string } {
  const [monthName, yearStr] = period.split(" ");
  const year = Number(yearStr);
  const monthIndex = SPANISH_MONTHS[monthName];

  if (Number.isNaN(year) || monthIndex === undefined) {
    return { start: "—", end: "—" };
  }

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);

  return {
    start: formatEnglishDate(start),
    end: formatEnglishDate(end),
  };
}

function contractDateToEnglish(date: string): string {
  const parts = date.split(".");
  if (parts.length !== 3) return date;

  const [day, month, year] = parts.map(Number);
  if ([day, month, year].some(Number.isNaN)) return date;

  return formatEnglishDate(new Date(year, month - 1, day));
}

export function buildPayslipPreviewData(detail: PayrollDetail): PayslipPreviewData {
  const { start, end } = periodToDateRange(detail.period);
  const contract = findContract(detail.contractorId, detail.contractId);
  const contractor = findContractor(detail.contractorId);
  const profile = contractor ? getPersonaProfile(contractor) : null;
  const monthlyPayment = contract?.clientPrice ?? detail.baseSalary;

  return {
    startDate: start,
    endDate: end,
    contractorName: detail.contractorName,
    hiredSince: contractDateToEnglish(detail.contractStartDate),
    position: detail.position,
    email: detail.contactEmail,
    monthlyPayment: formatPayslipMoney(monthlyPayment),
    nationalHolidayRate: (profile?.hrRateHolidays ?? 2).toFixed(1),
  };
}
