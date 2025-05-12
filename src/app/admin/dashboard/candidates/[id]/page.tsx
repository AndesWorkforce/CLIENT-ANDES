import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "../../actions/profile.actions";
import AdminExperienceManager from "../../components/AdminExperienceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "../../components/ProfileHeader";

interface CandidateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CandidateDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data } = await getProfile(id);

    if (!data) {
      return {
        title: "Candidato no encontrado",
      };
    }

    return {
      title: `${data.data.datosPersonales.nombre} ${data.data.datosPersonales.apellido} - Panel de Administración`,
    };
  } catch (error) {
    console.error("[CandidateDetailPage] Error generating metadata:", error);
    return {
      title: "Candidato - Panel de Administración",
    };
  }
}

export default async function CandidateDetailPage({
  params,
  searchParams,
}: CandidateDetailPageProps) {
  const { id } = await params;
  const { tab = "experiences" } = await searchParams;
  const response = await getProfile(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const candidate = response.data.data;

  return (
    <div className="p-6">
      <ProfileHeader
        name={`${candidate.datosPersonales.nombre} ${candidate.datosPersonales.apellido}`}
        email={candidate.datosPersonales.correo}
        phone={candidate.datosPersonales.telefono}
      />

      <Tabs defaultValue={tab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="experiences">Experiencia Laboral</TabsTrigger>
          <TabsTrigger value="education">Educación</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="files">Archivos</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences">
          <AdminExperienceManager candidateId={id} />
        </TabsContent>

        <TabsContent value="education">
          {/* Componente para gestionar educación */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-center text-gray-500">
              Sección de educación en desarrollo
            </p>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          {/* Componente para gestionar habilidades */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-center text-gray-500">
              Sección de habilidades en desarrollo
            </p>
          </div>
        </TabsContent>

        <TabsContent value="files">
          {/* Componente para gestionar archivos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-center text-gray-500">
              Sección de archivos en desarrollo
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
