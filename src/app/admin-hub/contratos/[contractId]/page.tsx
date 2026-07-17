import { notFound } from "next/navigation";
import { getContratoById } from "../actions/contratos.actions";
import ContractDetailContent from "../components/ContractDetailContent";

interface ContractDetailPageProps {
  params: Promise<{ contractId: string }>;
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { contractId } = await params;
  const response = await getContratoById(contractId);

  if (!response.success || !response.data) {
    notFound();
  }

  return <ContractDetailContent detail={response.data} />;
}
