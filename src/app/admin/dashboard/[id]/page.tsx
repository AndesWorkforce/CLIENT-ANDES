"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Phone, Mail, FileText, Play } from "lucide-react";

interface Skill {
  name: string;
}

interface PCSpec {
  name: string;
  checked: boolean;
}

interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
}

interface ApplicantProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: Skill[];
  pcSpecs: PCSpec[];
  experiences: Experience[];
  education: Education[];
  hasResume: boolean;
  hasVideo: boolean;
}

export default function ApplicantProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    "experience"
  );
  const [profile, setProfile] = useState<ApplicantProfile>({
    id,
    name: "Mariana Lopez",
    email: "marianalopez@gmail.com",
    phone: "11 4545 4545",
    skills: [
      { name: "Branding Strategy" },
      { name: "Marketing Design" },
      { name: "Social Media Design" },
      { name: "Video Editing" },
      { name: "Digital Illustration" },
    ],
    pcSpecs: [
      { name: "PC rápida", checked: true },
      { name: "Internet rápido", checked: true },
    ],
    experiences: [
      {
        position: "Diseñadora Gráfica",
        company: "Estudio ABC",
        period: "Nov 2020 - Presente",
        description:
          "Creación de wireframes y prototipos en baja, media y alta fidelidad, asegurando una experiencia intuitiva para nuestros clientes. Coordiné el trabajo con los desarrolladores, proporcionando documentación detallada para asegurar la implementación correcta del diseño.",
      },
      {
        position: "Diseñadora Gráfica",
        company: "Agencia XYZ",
        period: "Nov 2024 - Presente",
        description:
          "Creación de wireframes y prototipos en baja, media y alta fidelidad, asegurando una experiencia intuitiva para nuestros usuarios y clientes. Coordiné el trabajo con los desarrolladores, proporcionando documentación detallada para asegurar la implementación correcta del diseño.",
      },
    ],
    education: [
      {
        degree: "Licenciatura en Diseño Gráfico",
        institution: "Universidad Nacional de Diseño",
        period: "2016 - 2020",
      },
      {
        degree: "Diplomado en UX/UI",
        institution: "Instituto de Diseño Digital",
        period: "2021",
      },
    ],
    hasResume: true,
    hasVideo: true,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Contact Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
              <h1 className="text-xl font-medium text-[#0097B2] mb-2">
                {profile.name}
              </h1>
              <h2 className="font-medium text-gray-900 mb-3">
                Datos de contacto
              </h2>
              <hr className="border-[#E2E2E2] my-2" />
              <div className="space-y-3">
                <div className="flex items-start">
                  <Phone size={18} className="text-[#0097B2] mr-2 mt-0.5" />
                  <span className="text-gray-700">{profile.phone}</span>
                </div>
                <div className="flex items-start">
                  <Mail size={18} className="text-[#0097B2] mr-2 mt-0.5" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Button */}
          {profile.hasResume && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <span className="font-medium text-gray-900">Formulario</span>
                <a href="#" className="text-[#0097B2] flex items-center">
                  <FileText size={18} className="mr-1" />
                  <span>Ver</span>
                </a>
              </div>
            </div>
          )}

          {/* Video */}
          {profile.hasVideo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <h2 className="font-medium text-gray-900 mb-3">
                  Video Presentación
                </h2>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center relative">
                  <button className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                    <Play size={32} className="text-[#0097B2] ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
              <h2 className="font-medium text-gray-900 mb-3">Skills</h2>
              <ul className="space-y-2">
                {profile.skills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#0097B2] mr-2">•</span>
                    <span className="text-gray-700">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PC Specs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4">
              <h2 className="font-medium text-gray-900 mb-3">
                Especificaciones PC
              </h2>
              <ul className="space-y-2">
                {profile.pcSpecs.map((spec, index) => (
                  <li key={index} className="flex items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full border mr-2 flex items-center justify-center">
                        {spec.checked && (
                          <div className="w-2 h-2 rounded-full bg-[#0097B2]"></div>
                        )}
                      </div>
                      <span className="text-gray-700">{spec.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Experience/Education tabs */}
          <div className="mt-6 mb-4 relative">
            <div
              className="relative"
              style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
            >
              {/* Primera sección - Pestañas en forma de L */}
              <div className="flex">
                {/* Experiencia */}
                <div
                  className={`py-3 px-8 rounded-tl-2xl border-t border-l ${
                    activeTab === "experience"
                      ? "text-[#6B7280] border-gray-300 border-r border-b-0 relative z-20 bg-white"
                      : "text-gray-500 border-gray-300 border-b border-r-0"
                  }`}
                  onClick={() => setActiveTab("experience")}
                  style={{ cursor: "pointer" }}
                >
                  <span className="text-lg font-medium">Experiencia</span>
                </div>

                {/* Educación */}
                <div
                  className={`py-3 px-8 rounded-tr-2xl border-t ${
                    activeTab === "education"
                      ? "text-[#6B7280] border-gray-300 border-r border-b-0 relative z-20 bg-white"
                      : "text-gray-500 border-gray-300 border-b border-r"
                  }`}
                  onClick={() => setActiveTab("education")}
                  style={{ cursor: "pointer" }}
                >
                  <span className="text-lg font-medium">Educación</span>
                </div>

                {/* Resto del borde superior */}
                <div className="flex-grow border-b border-gray-300" />
              </div>

              {/* Segunda sección - Panel con contenido */}
              <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white relative p-4">
                {activeTab === "experience" ? (
                  <div className="space-y-6">
                    {profile.experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium text-gray-800 text-lg">
                          {exp.position}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {exp.period}
                        </p>
                        <p className="text-sm text-gray-700 mt-3">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <div
                        key={index}
                        className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium text-gray-800 text-lg">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {edu.period}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
