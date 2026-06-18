import { notFound } from "next/navigation";
import { getVariableDetail } from "../../data/mock-variable-detail";
import PayrollVariableDetailContent from "../../components/PayrollVariableDetailContent";

interface PayrollVariableDetailPageProps {
  params: Promise<{ variableId: string }>;
}

export default async function PayrollVariableDetailPage({
  params,
}: PayrollVariableDetailPageProps) {
  const { variableId } = await params;
  const detail = getVariableDetail(variableId);

  if (!detail) {
    notFound();
  }

  return <PayrollVariableDetailContent detail={detail} />;
}
