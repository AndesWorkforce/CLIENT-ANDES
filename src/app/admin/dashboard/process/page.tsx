"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { getPublishedOffers } from "../actions/offers.actions";
import { Offer } from "@/app/types/offers";

export default function ProcessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState<(Offer & { isExpanded: boolean })[]>([]);

  const fetchPublishedOffers = async () => {
    setIsLoading(true);
    try {
      const response = await getPublishedOffers();
      console.log("[Dashboard] Published offers:", response);
      setOffers(response.data.data);
    } catch (error) {
      console.error("[Dashboard] Error getting published offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // // Simular cierre de sesión
  // const handleLogout = () => {
  //   router.push("/admin/login");
  // };

  // Función para expandir/contraer una oferta
  const toggleOffer = (id: string) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, isExpanded: !offer.isExpanded } : offer
      )
    );
  };

  useEffect(() => {
    fetchPublishedOffers();
  }, []);

  console.log("[Process] Offers:", offers);

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
                  onClick={() => toggleOffer(offer.id || "")}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {offer.isExpanded ? (
                      <ChevronUp size={20} className="text-[#0097B2]" />
                    ) : (
                      <ChevronDown size={20} className="text-[#0097B2]" />
                    )}
                    <span className="text-start font-medium text-sm  ">
                      Oferta
                    </span>
                  </div>
                  <div className="text-[#6D6D6D] text-start text-sm">
                    {offer.titulo}
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
                          {offer.postulaciones?.length}
                        </div>
                      </div>

                      {/* Fila de entrevistas */}
                      <div className="grid grid-cols-2">
                        <div className="flex items-center text-[#6D6D6D]">
                          <Clock size={16} className="text-[#0097B2] mr-2" />
                          <span>En entrevista</span>
                        </div>
                        <div className="text-[#6D6D6D] font-medium">
                          {
                            offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "EN_EVALUACION"
                            )?.length
                          }
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
                          {
                            offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "FINALISTA"
                            )?.length
                          }
                        </div>
                      </div>

                      {/* Fila de rechazados */}
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                          <span>Rechazados</span>
                        </div>
                        <div className="text-[#6D6D6D] font-medium">
                          {
                            offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "RECHAZADA"
                            )?.length
                          }
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
                          {
                            offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "ACEPTADA"
                            )?.length
                          }
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
