import { notFound } from "next/navigation";
import { getPayrollDetail } from "../data/mock-payroll-detail";
import { getCurrentNominaMonthOption, monthOptionToPeriod } from "../data/payroll-data";
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

  const defaultPeriod = monthOptionToPeriod(getCurrentNominaMonthOption());

  const detail = getPayrollDetail(payrollId, periodParam ?? defaultPeriod);

  if (!detail) {
    notFound();
  }

  return <PayrollDetailContent detail={detail} />;
}
