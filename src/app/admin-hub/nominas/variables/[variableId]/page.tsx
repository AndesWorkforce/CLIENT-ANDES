import { notFound } from "next/navigation";
import { getNominaVariable } from "../../actions/payroll-variables.actions";
import { getVariableDetail } from "../../data/mock-variable-detail";
import PayrollVariableDetailContent from "../../components/PayrollVariableDetailContent";

interface PayrollVariableDetailPageProps {
  params: Promise<{ variableId: string }>;
}

function isApiVariableRef(variableId: string): boolean {
  return /^(overtime|holiday|ausencia|deduccion|income-variable):/.test(variableId);
}

export default async function PayrollVariableDetailPage({
  params,
}: PayrollVariableDetailPageProps) {
  const { variableId } = await params;
  const decodedId = decodeURIComponent(variableId);

  if (isApiVariableRef(decodedId)) {
    const result = await getNominaVariable(decodedId);
    if (!result.success || !result.data) {
      notFound();
    }
    return <PayrollVariableDetailContent detail={result.data} />;
  }

  const mockDetail = getVariableDetail(decodedId);
  if (!mockDetail) {
    notFound();
  }

  return <PayrollVariableDetailContent detail={mockDetail} />;
}
