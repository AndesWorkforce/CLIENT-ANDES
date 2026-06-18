import { notFound } from "next/navigation";
import { getPersonaDetail } from "../data/mock-persona-detail";
import PersonaDetailContent from "../components/PersonaDetailContent";

interface PersonaDetailPageProps {
  params: Promise<{ personaId: string }>;
}

export default async function PersonaDetailPage({ params }: PersonaDetailPageProps) {
  const { personaId } = await params;
  const detail = getPersonaDetail(personaId);

  if (!detail) {
    notFound();
  }

  return <PersonaDetailContent detail={detail} />;
}
