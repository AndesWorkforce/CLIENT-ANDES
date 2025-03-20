"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import TabsNavigation from "../components/TabsNavigation";

// Interfaz para representar una oferta de trabajo
interface JobOffer {
  id: number;
  title: string;
  applicants: number;
  inInterview: number;
  inTest: number;
  hired: number;
  isExpanded: boolean;
}

export default function ProcessPage() {
  const router = useRouter();

  // Estado para simular las ofertas de trabajo
  const [offers, setOffers] = useState<JobOffer[]>([
    {
      id: 1,
      title: "Servicio de diseño gráfico",
      applicants: 20,
      inInterview: 5,
      inTest: 2,
      hired: 0,
      isExpanded: true,
    },
    {
      id: 2,
      title: "Servicio de administrativo",
      applicants: 15,
      inInterview: 3,
      inTest: 1,
      hired: 2,
      isExpanded: false,
    },
    {
      id: 3,
      title: "Servicio de contaduría",
      applicants: 10,
      inInterview: 2,
      inTest: 0,
      hired: 1,
      isExpanded: false,
    },
    {
      id: 4,
      title: "Servicio de programador",
      applicants: 30,
      inInterview: 7,
      inTest: 4,
      hired: 2,
      isExpanded: false,
    },
    {
      id: 5,
      title: "Servicio de secretaría",
      applicants: 12,
      inInterview: 3,
      inTest: 1,
      hired: 0,
      isExpanded: false,
    },
  ]);

  // Simular cierre de sesión
  const handleLogout = () => {
    router.push("/admin/login");
  };

  // Función para expandir/contraer una oferta
  const toggleOffer = (id: number) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, isExpanded: !offer.isExpanded } : offer
      )
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Contenido principal */}
      <main className="flex-1 w-full py-6">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Lista de ofertas */}
          <div className="divide-y divide-gray-200">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className={`${
                  index === 0 ? "border-t-[2px] " : ""
                }border-b-[2px] border-[#E2E2E2] `}
              >
                {/* Cabecera de la oferta (siempre visible) */}
                <div
                  className={`p-4 flex items-center justify-between cursor-pointer ${
                    offer.isExpanded ? "bg-gray-50" : ""
                  }`}
                  onClick={() => toggleOffer(offer.id)}
                >
                  <div className="grid grid-cols-2 space-x-2">
                    {offer.isExpanded ? (
                      <ChevronUp size={20} className="text-[#0097B2]" />
                    ) : (
                      <ChevronDown size={20} className="text-[#0097B2]" />
                    )}
                    <span className="font-medium">Oferta</span>
                  </div>
                  <div className="text-[#6D6D6D] flex-1 px-4">
                    {offer.title}
                  </div>
                </div>

                {/* Contenido expandible */}
                {offer.isExpanded && (
                  <div className="bg-white pl-10 pb-2">
                    <div className="space-y-4">
                      {/* Fila de postulantes */}
                      <div className="grid grid-cols-2">
                        <div className="flex items-center text-[#6D6D6D]">
                          <Users size={16} className="text-[#0097B2] mr-2" />
                          <span>Postulantes</span>
                        </div>
                        <div className="text-[#6D6D6D] font-medium">
                          {offer.applicants}
                        </div>
                      </div>

                      {/* Fila de entrevistas */}
                      <div className="grid grid-cols-2">
                        <div className="flex items-center text-[#6D6D6D]">
                          <Clock size={16} className="text-[#0097B2] mr-2" />
                          <span>En entrevista</span>
                        </div>
                        <div className="text-[#6D6D6D] font-medium">
                          {offer.inInterview}
                        </div>
                      </div>

                      {/* Fila de pruebas */}
                      <div className="grid grid-cols-2">
                        <div className="flex items-center text-[#6D6D6D]">
                          <CheckCircle
                            size={16}
                            className="text-[#0097B2] mr-2"
                          />
                          <span>En prueba</span>
                        </div>
                        <div className="text-[#6D6D6D] font-medium">
                          {offer.inTest}
                        </div>
                      </div>

                      {/* Fila de contratados */}
                      <div className="grid grid-cols-2">
                        <div className="flex items-center text-[#6D6D6D]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0097B2"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <polyline points="17 11 19 13 23 9"></polyline>
                          </svg>
                          <span>Contratados</span>
                        </div>
                        <div className="text-[#6D6D6D] font-medium">
                          {offer.hired}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
