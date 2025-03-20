"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  FileText,
  Clock,
  Briefcase,
  Mail,
  Phone,
  Download,
  Video,
  CheckCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// Datos de ejemplo de un postulante
const mockApplicant = {
  id: 2,
  name: "Mariana Lopez",
  contact: {
    email: "marianalopez@gmail.com",
    phone: "11 4545 4545",
  },
  videoPresentation: "/video-sample.mp4",
  formData: {
    completed: true,
  },
  pcRequirements: {
    completed: true,
    specs: "/pc-specs.png",
    internet: "/internet-speed.png",
  },
  skills: [
    "Branding Strategy",
    "Marketing Design",
    "Social Media Design",
    "Video Editing",
    "Digital Illustration",
  ],
  experience: [
    {
      id: 1,
      title: "Diseñadora Gráfica",
      company: "Mercado Libre",
      fromDate: "Nov 2024",
      toDate: "Presente",
      description:
        "Creación de wireframes y prototipos en baja, media y alta fidelidad, adaptando cada proyecto a las especificaciones del cliente. Coordiné el handoff con los desarrolladores, proporcionando documentación detallada para una correcta implementación del diseño.",
    },
  ],
  education: [
    {
      id: 1,
      degree: "Diseño UX/UI",
      institution: "Coderhouse",
      year: "2022",
    },
    {
      id: 2,
      degree: "Diseño Gráfico",
      institution: "Universidad de Buenos Aires",
      year: "2020",
    },
  ],
  appliedTo: [
    {
      id: 1,
      title: "Especialidad de Diseño UX/UI",
      service: "Diseño gráfico",
      date: "16/02/2025",
    },
  ],
};

export default function ApplicantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicantId = params.id as string;

  const [applicant, setApplicant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Cargar datos del backend (simulado)
  useEffect(() => {
    // Protección de ruta comentada para desarrollo
    // const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    // if (!isLoggedIn) {
    //   router.push("/admin/login");
    //   return;
    // }

    // Simular carga de datos
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setApplicant(mockApplicant);
    };

    loadData();
  }, [applicantId, router]);

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-[#0097B2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Cargando información del postulante...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <button onClick={() => router.back()} className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </button>
            <h1 className="text-xl font-medium">Ver perfil postulante</h1>
          </div>
        </div>
      </header>

      {/* Información del postulante */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Cabecera del perfil */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {applicant.name}
            </h2>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {/* Datos de contacto */}
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 text-[#0097B2] mr-2" />
                  <span>{applicant.contact.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 text-[#0097B2] mr-2" />
                  <span>{applicant.contact.phone}</span>
                </div>

                {/* Postulaciones */}
                <div className="pt-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Postulaciones:
                  </h3>
                  {applicant.appliedTo.map((job: any) => (
                    <div key={job.id} className="flex items-start mb-2">
                      <Briefcase className="h-5 w-5 text-[#0097B2] mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-600">
                          Servicio: {job.service}
                        </p>
                        <p className="text-sm text-gray-600">
                          Fecha: {job.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Estado de la información */}
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Información completa:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        applicant.formData.completed
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      } mr-2`}
                    ></div>
                    <span className="text-gray-700">Formulario</span>
                    {applicant.formData.completed && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        applicant.videoPresentation
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      } mr-2`}
                    ></div>
                    <span className="text-gray-700">Video presentación</span>
                    {applicant.videoPresentation && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        applicant.pcRequirements.completed
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      } mr-2`}
                    ></div>
                    <span className="text-gray-700">Requerimientos PC</span>
                    {applicant.pcRequirements.completed && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Video presentación */}
                {applicant.videoPresentation && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Video presentación:
                    </h3>
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-32 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-[#0097B2]/20 to-[#0097B2]/40"></div>
                      <button className="relative z-10 flex items-center px-4 py-2 bg-white rounded-full shadow-sm text-[#0097B2] hover:bg-[#0097B2] hover:text-white transition">
                        <Video className="mr-2 h-5 w-5" />
                        <span>Reproducir video</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs para navegar el perfil */}
          <div className="border-t border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#0097B2] text-[#0097B2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "skills"
                    ? "border-b-2 border-[#0097B2] text-[#0097B2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Habilidades
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "experience"
                    ? "border-b-2 border-[#0097B2] text-[#0097B2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Experiencia
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "education"
                    ? "border-b-2 border-[#0097B2] text-[#0097B2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Educación
              </button>
              <button
                onClick={() => setActiveTab("pc")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "pc"
                    ? "border-b-2 border-[#0097B2] text-[#0097B2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                PC
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido según tab activo */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {activeTab === "profile" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información general
              </h3>
              <p className="text-gray-600">
                Postulante con perfil completo y verificado. Ha completado todos
                los requisitos para aplicar a las ofertas.
              </p>
              <div className="mt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]">
                  <Download className="mr-2 h-5 w-5" />
                  Descargar CV completo
                </button>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Habilidades
              </h3>
              <ul className="space-y-2">
                {applicant.skills.map((skill: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-[#0097B2] rounded-full mr-2"></div>
                    <span className="text-gray-700">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Experiencia
              </h3>
              {applicant.experience.map((exp: any) => (
                <div key={exp.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-medium text-gray-900">
                      {exp.title}
                    </h4>
                    <span className="text-sm text-gray-600">
                      {exp.fromDate} - {exp.toDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "education" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Educación
              </h3>
              {applicant.education.map((edu: any) => (
                <div key={edu.id} className="mb-4 last:mb-0">
                  <h4 className="text-base font-medium text-gray-900">
                    {edu.degree}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {edu.institution} · {edu.year}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pc" && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Requerimientos PC
              </h3>

              {applicant.pcRequirements.completed ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      Especificaciones PC
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={applicant.pcRequirements.specs}
                        alt="PC Specifications"
                        className="w-full h-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/800x400?text=PC+Specifications";
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      Velocidad de Internet
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={applicant.pcRequirements.internet}
                        alt="Internet Speed"
                        className="w-full h-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/800x400?text=Internet+Speed";
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">
                    El postulante aún no ha subido información sobre sus
                    requerimientos de PC.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
