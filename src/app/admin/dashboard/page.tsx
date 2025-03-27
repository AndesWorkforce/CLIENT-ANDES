"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Calendar,
  ChevronRight,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import ApplicantsModal from "./components/ApplicantsModal";
import {
  getPublishedOffers,
  toggleOfferStatus,
} from "./actions/offers.actions";
import { Offer } from "@/app/types/offers";
import ViewOfferModal from "@/app/components/ViewOfferModal";
import EditOfferModal from "@/app/components/EditOfferModal";
import ConfirmPauseModal from "@/app/components/ConfirmPauseModal";
import { useNotificationStore } from "@/store/notifications.store";
import { updateOffer } from "./save-offers/actions/save-offers.actions";
import OfferCardSkeleton from "./components/OfferCardSkeleton";

export default function AdminDashboardPage() {
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [offerToView, setOfferToView] = useState<Offer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] =
    useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | undefined>();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [offerToToggle, setOfferToToggle] = useState<Offer | null>(null);

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

  const openApplicantsModal = (offer: Offer) => {
    // Solo abrir el modal de postulantes si la oferta tiene postulaciones
    if (offer.postulaciones && offer.postulaciones.length > 0) {
      setSelectedOffer(offer);
      setIsApplicantsModalOpen(true);
    } else {
      addNotification("Esta oferta no tiene postulantes todavía", "info");
    }
  };

  const closeApplicantsModal = () => {
    setIsApplicantsModalOpen(false);
    setSelectedOffer(null);
  };

  const openEditModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setSelectedOfferId(offer.id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    console.log("[DEBUG] Cerrando modal de edición y limpiando estados");
    setIsEditModalOpen(false);
    setSelectedOffer(null);
    setSelectedOfferId(undefined);
    fetchPublishedOffers();
  };

  const handleViewOffer = (offer: Offer) => {
    setOfferToView(offer);
    setIsViewModalOpen(true);
  };

  const handleSaveOffer = async (offerData: Offer) => {
    try {
      const formData = new FormData();
      formData.append("title", offerData.titulo);

      // La descripción ahora es siempre HTML
      if (typeof offerData.descripcion === "string") {
        formData.append("description", offerData.descripcion);
      } else {
        // Si por alguna razón es un objeto, lo convertimos a string HTML
        formData.append(
          "description",
          typeof offerData.descripcion === "object"
            ? "<p>Contenido migrado desde formato anterior</p>"
            : String(offerData.descripcion || "")
        );
      }

      formData.append("estado", offerData.estado);

      if (offerData.id) {
        const response = await updateOffer(offerData.id, formData);
        if (response.success) {
          addNotification("Oferta actualizada correctamente", "success");

          // Recargar ofertas
          await fetchPublishedOffers();
        } else {
          addNotification(
            `Error al actualizar oferta: ${response.message}`,
            "error"
          );
        }
      } else {
        addNotification(
          "Función de crear nueva oferta no implementada",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error al guardar oferta:", error);
      addNotification("Error al guardar oferta", "error");
    }
  };

  const handleTogglePause = (offer: Offer) => {
    setOfferToToggle(offer);
    setIsPauseModalOpen(true);
  };

  const confirmTogglePause = async () => {
    if (!offerToToggle || !offerToToggle.id) return;

    const newStatus =
      offerToToggle.estado === "pausado" ? "publicado" : "pausado";

    try {
      const response = await toggleOfferStatus(offerToToggle.id, newStatus);
      if (response.success) {
        addNotification(response.message, "success");
        await fetchPublishedOffers();
      } else {
        addNotification(`Error: ${response.message}`, "error");
      }
    } catch (error) {
      console.error("Error al cambiar estado de la oferta:", error);
      addNotification("Error al cambiar estado de la oferta", "error");
    } finally {
      setIsPauseModalOpen(false);
      setOfferToToggle(null);
    }
  };

  useEffect(() => {
    fetchPublishedOffers();
  }, []);

  return (
    <div className="bg-white">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Actions and filters - Mantenerlos para la funcionalidad pero no visibles en el diseño actual */}
        <div className="hidden mb-8 flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/admin/dashboard/offers"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]"
            >
              <PlusCircle size={16} className="mr-2" />
              Nueva oferta
            </Link>

            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-[#0097B2] focus:border-[#0097B2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Offers list with loading state */}
        <div className="space-y-4">
          {isLoading ? (
            // Mostrar 3 skeletons mientras carga
            <>
              <OfferCardSkeleton />
              <OfferCardSkeleton />
              <OfferCardSkeleton />
            </>
          ) : offers.length > 0 ? (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg shadow-sm border border-[#B6B4B4] overflow-hidden"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">
                        {offer.titulo}
                      </h3>
                      {offer.estado === "pausado" && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-800">
                          Pausada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-[#0097B2] cursor-pointer"
                        onClick={() => handleViewOffer(offer)}
                      >
                        <ChevronRight size={24} className="text-[#0097B2]" />
                      </button>
                    </div>
                  </div>
                  <hr className="my-2 border-[#E2E2E2]" />
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-[#0097B2]" />
                        <span>{offer.fechaCreacion?.split("T")[0]}</span>
                      </div>
                    </div>
                    <div
                      className="flex items-center text-xs text-gray-500 gap-1 cursor-pointer"
                      onClick={() => openApplicantsModal(offer)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-[#0097B2]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.33301 12.25V11.0833C9.33301 10.4645 9.08717 9.871 8.64959 9.43342C8.21201 8.99583 7.61851 8.75 6.99967 8.75H2.91634C2.2975 8.75 1.70401 8.99583 1.26643 9.43342C0.82884 9.871 0.583008 10.4645 0.583008 11.0833V12.25"
                          stroke="#0097B2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.95833 6.41667C6.247 6.41667 7.29167 5.372 7.29167 4.08333C7.29167 2.79467 6.247 1.75 4.95833 1.75C3.66967 1.75 2.625 2.79467 2.625 4.08333C2.625 5.372 3.66967 6.41667 4.95833 6.41667Z"
                          stroke="#0097B2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.91699 6.41667L11.0837 7.58333L13.417 5.25"
                          stroke="#0097B2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{offer.postulacionesCount || 0} postulantes</span>
                      <ChevronRight size={24} className="text-[#6D6D6D]" />
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Botón de pausa/reactivar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePause(offer);
                        }}
                        className="cursor-pointer"
                      >
                        {offer.estado === "pausado" ? (
                          <PlayCircle size={22} className="text-green-600" />
                        ) : (
                          <PauseCircle size={22} className="text-amber-600" />
                        )}
                      </button>

                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(offer);
                        }}
                        className="cursor-pointer"
                      >
                        <g clipPath="url(#clip0_599_11221)">
                          <path
                            d="M10.083 3.66666H3.66634C3.18011 3.66666 2.7138 3.85981 2.36998 4.20363C2.02616 4.54744 1.83301 5.01376 1.83301 5.49999V18.3333C1.83301 18.8196 2.02616 19.2859 2.36998 19.6297C2.7138 19.9735 3.18011 20.1667 3.66634 20.1667H16.4997C16.9859 20.1667 17.4522 19.9735 17.796 19.6297C18.1399 19.2859 18.333 18.8196 18.333 18.3333V11.9167"
                            stroke="#0097B2"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16.958 2.29168C17.3227 1.92701 17.8173 1.72214 18.333 1.72214C18.8487 1.72214 19.3433 1.92701 19.708 2.29168C20.0727 2.65635 20.2776 3.15096 20.2776 3.66668C20.2776 4.18241 20.0727 4.67701 19.708 5.04168L10.9997 13.75L7.33301 14.6667L8.24967 11L16.958 2.29168Z"
                            stroke="#0097B2"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_599_11221">
                            <rect width="22" height="22" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                No se encontraron ofertas
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Intente con otra búsqueda"
                  : "Comience creando una nueva oferta"}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link
                    href="/admin/dashboard/offers"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Crear nueva oferta
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de postulantes */}
      {selectedOffer && (
        <ApplicantsModal
          isOpen={isApplicantsModalOpen}
          onClose={closeApplicantsModal}
          serviceTitle={selectedOffer?.titulo || ""}
          applicants={
            selectedOffer?.postulaciones?.map((postulacion) => ({
              id: postulacion.candidato.id,
              nombre: postulacion.candidato.nombre,
              apellido: postulacion.candidato.apellido,
              correo: postulacion.candidato.correo,
              telefono: postulacion.candidato.telefono,
              fotoPerfil: postulacion.candidato.fotoPerfil,
              videoPresentacion: postulacion.candidato.videoPresentacion,
            })) || []
          }
        />
      )}

      {/* Modal de edición de oferta */}
      {selectedOffer && (
        <EditOfferModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          offerId={selectedOfferId}
          onSave={handleSaveOffer}
          initialData={selectedOffer}
        />
      )}

      {/* Modal de visualización de oferta */}
      {offerToView && (
        <ViewOfferModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          offer={offerToView}
        />
      )}

      {/* Modal de confirmación para pausar/despausar oferta */}
      {offerToToggle && (
        <ConfirmPauseModal
          isOpen={isPauseModalOpen}
          onClose={() => setIsPauseModalOpen(false)}
          onConfirm={confirmTogglePause}
          title={
            offerToToggle.estado === "pausado"
              ? "Publicar oferta"
              : "Pausar oferta"
          }
          message={
            offerToToggle.estado === "pausado"
              ? "¿Estás seguro de que deseas volver a publicar esta oferta? Los usuarios podrán verla nuevamente."
              : "¿Estás seguro de que deseas pausar esta oferta? Los usuarios no podrán verla mientras esté pausada."
          }
          isPaused={offerToToggle.estado === "pausado"}
        />
      )}
    </div>
  );
}
