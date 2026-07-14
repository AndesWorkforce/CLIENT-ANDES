import { notFound } from "next/navigation";
import { getPersonaById } from "../actions/personas.actions";
import PersonaDetailContent from "../components/PersonaDetailContent";

interface PersonaDetailPageProps {
  params: Promise<{ personaId: string }>;
}

export default async function PersonaDetailPage({ params }: PersonaDetailPageProps) {
  const { personaId } = await params;
  const result = await getPersonaById(personaId);

  if (!result.success || !result.data) {
    notFound();
  }

  return <PersonaDetailContent detail={result.data} />;
}
