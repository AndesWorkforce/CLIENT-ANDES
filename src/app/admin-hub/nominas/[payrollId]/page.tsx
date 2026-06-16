import { notFound } from "next/navigation";
import { getPayrollDetail } from "../data/mock-payroll-detail";
import { monthOptionToPeriod, NOMINA_MONTH_OPTIONS } from "../data/payroll-data";
import PayrollDetailContent from "../components/PayrollDetailContent";

interface PayrollDetailPageProps {
  params: Promise<{ payrollId: string }>;
  searchParams: Promise<{ period?: string }>;
}

export default async function PayrollDetailPage({
  params,
  searchParams,
}: PayrollDetailPageProps) {
  const { payrollId } = await params;
  const { period: periodParam } = await searchParams;

  const defaultPeriod =
    monthOptionToPeriod(
      NOMINA_MONTH_OPTIONS.find((month) => month.includes("2026")) ??
        NOMINA_MONTH_OPTIONS[0]
    );

  const detail = getPayrollDetail(payrollId, periodParam ?? defaultPeriod);

  if (!detail) {
    notFound();
  }

  return <PayrollDetailContent detail={detail} />;
}
