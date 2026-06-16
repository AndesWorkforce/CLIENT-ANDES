import { notFound } from "next/navigation";
import { getContractDetail } from "../data/mock-contract-detail";
import ContractDetailContent from "../components/ContractDetailContent";

interface ContractDetailPageProps {
  params: Promise<{ contractId: string }>;
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { contractId } = await params;
  const detail = getContractDetail(contractId);

  if (!detail) {
    notFound();
  }

  return <ContractDetailContent detail={detail} />;
}
