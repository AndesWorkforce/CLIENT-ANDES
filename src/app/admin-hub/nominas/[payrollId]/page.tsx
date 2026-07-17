import { notFound } from "next/navigation";
import { getNominaById } from "../actions/nominas.actions";
import {
  displayPeriodToAnioMes,
  getCurrentNominaMonthOption,
  nominaMonthOptionToAnioMes,
} from "../data/payroll-data";
import PayrollDetailContent from "../components/PayrollDetailContent";

interface PayrollDetailPageProps {
  params: Promise<{ payrollId: string }>;
  searchParams: Promise<{ periodo?: string; period?: string }>;
}

export default async function PayrollDetailPage({
  params,
  searchParams,
}: PayrollDetailPageProps) {
  const { payrollId } = await params;
  const { periodo: periodoParam, period: legacyPeriodParam } =
    await searchParams;

  const defaultPeriodo = nominaMonthOptionToAnioMes(
    getCurrentNominaMonthOption(),
  );
  const periodoRaw =
    periodoParam ?? legacyPeriodParam ?? defaultPeriodo;
  const periodoAnioMes = displayPeriodToAnioMes(periodoRaw);

  const result = await getNominaById(payrollId, periodoAnioMes);

  if (!result.success || !result.data) {
    notFound();
  }

  return <PayrollDetailContent detail={result.data} />;
}
