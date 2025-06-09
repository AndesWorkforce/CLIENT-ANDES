"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PlusCircle,
  Search,
  Calendar,
  ChevronRight,
  PauseCircle,
  PlayCircle,
  Loader2,
  Trash2,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import ApplicantsModal, {
  EstadoPostulacion,
} from "@/app/admin/dashboard/components/ApplicantsModal";
import {
  getPublishedOffers,
  toggleOfferStatus,
  deleteOffer,
} from "./actions/offers.actions";
import { Offer } from "@/app/types/offers";
import ViewOfferModal from "@/app/components/ViewOfferModal";
import EditOfferModal from "@/app/components/EditOfferModal";
import ConfirmPauseModal from "@/app/components/ConfirmPauseModal";
import { useNotificationStore } from "@/store/notifications.store";
import { updateOffer } from "./save-offers/actions/save-offers.actions";
import OfferCardSkeleton from "./components/OfferCardSkeleton";
import { useAuthStore } from "@/store/auth.store";
import OffersSkeleton from "./components/OffersSkeleton";
import AssignOfferModal from "./components/AssignOfferModal";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
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
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [offerToToggle, setOfferToToggle] = useState<Offer | null>(null);
  const [selectedJob, setSelectedJob] = useState<Offer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [offerToAssign, setOfferToAssign] = useState<Offer | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreOffers();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, loadingMore, hasMore]
  );

  const handleSelectJob = (job: Offer) => {
    setSelectedJob(job);
  };

  const fetchPublishedOffers = async (reset = true) => {
    if (reset) {
      setIsLoading(true);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getPublishedOffers(
        reset ? 1 : currentPage,
        10,
        searchTerm
      );

      if (!response.success) {
        addNotification(
          "Error al cargar ofertas: " + response.message,
          "error"
        );
        return;
      }

      // Extraer los datos de la respuesta
      const offerData = response.data.data || [];

      if (reset) {
        setOffers(offerData);
        if (offerData.length > 0) {
          setSelectedJob(offerData[0]);
        } else {
          setSelectedJob(null);
        }
      } else {
        setOffers((prevOffers) => [...prevOffers, ...offerData]);
      }

      setHasMore(response.hasMore || false);
    } catch (error) {
      console.error("[Dashboard] Error getting published offers:", error);
      addNotification("Error al cargar ofertas", "error");
    } finally {
      if (reset) {
        setIsLoading(false);
        setIsSearching(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreOffers = async () => {
    if (!hasMore || loadingMore || isLoading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setLoadingMore(true);

    try {
      const response = await getPublishedOffers(nextPage, 10, searchTerm);

      if (
        response.success &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setOffers((prev) => [...prev, ...response.data.data]);
        setHasMore(response.hasMore || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("[Dashboard] Error loading more offers:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    fetchPublishedOffers(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openApplicantsModal = (offer: Offer) => {
    if (offer.postulaciones && offer.postulaciones.length > 0) {
      setSelectedOffer(offer);
      setIsApplicantsModalOpen(true);
    } else {
      addNotification("This offer has no applicants yet", "info");
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
          addNotification("Offer updated successfully", "success");

          // Recargar ofertas
          await fetchPublishedOffers();
        } else {
          addNotification(`Error updating offer: ${response.message}`, "error");
        }
      } else {
        addNotification("Create new offer function not implemented", "warning");
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      addNotification("Error saving offer", "error");
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

  // Función para manejar la eliminación de una oferta
  const handleDeleteOffer = (offer: Offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  // Función para confirmar la eliminación
  const confirmDeleteOffer = async () => {
    if (!offerToDelete || !offerToDelete.id) return;

    try {
      const response = await deleteOffer(offerToDelete.id);

      if (response.success) {
        addNotification(response.message, "success");
        await fetchPublishedOffers();
        if (selectedJob?.id === offerToDelete.id) {
          setSelectedJob(offers.length > 1 ? offers[0] : null);
        }
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      addNotification("Error deleting offer", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    }
  };

  const handleAssignOffer = (offer: Offer) => {
    setOfferToAssign(offer);
    setIsAssignModalOpen(true);
  };

  useEffect(() => {
    fetchPublishedOffers();
  }, []);

  console.log(
    "\n\n\n [AdminDashboardPage] selectedOffer",
    selectedOffer,
    "\n\n\n"
  );

  const LoadingIndicator = () => (
    <div className="flex justify-center py-4">
      <div className="animate-pulse flex space-x-2">
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search bar visible in all views */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-md shadow-sm flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="focus:ring-[#0097B2] focus:border-[#0097B2] block w-full pl-10 pr-4 sm:text-sm border-gray-300 rounded-l-md"
                  disabled={isSearching}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2] disabled:bg-[#0097B2]/70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Offers list with loading state mobile */}
        <div className="space-y-4 md:hidden ">
          {isLoading || isSearching ? (
            // Mostrar 3 skeletons mientras carga
            <>
              <OfferCardSkeleton />
              <OfferCardSkeleton />
              <OfferCardSkeleton />
            </>
          ) : offers.length > 0 ? (
            <>
              {offers.map((offer) => (
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
                            Paused
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
                        <button
                          className="text-gray-400 hover:text-[#0097B2] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignOffer(offer);
                          }}
                        >
                          <Bookmark size={20} className="text-[#0097B2]" />
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
                        <span>{offer.postulacionesCount || 0} applicants</span>
                        <ChevronRight size={24} className="text-[#6D6D6D]" />
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Botón de eliminar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOffer(offer);
                          }}
                          className="cursor-pointer"
                        >
                          <Trash2 size={20} className="text-red-600" />
                        </button>

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
              ))}

              {/* Elemento de observación para cargar más */}
              {loadingMore && <LoadingIndicator />}

              {hasMore && !loadingMore && (
                <div ref={loadMoreRef} className="h-10"></div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                No offers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : "Start creating a new offer"}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link
                    href="/admin/dashboard/offers"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Create new offer
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vista desktop - Layout de dos columnas */}
        {!isLoading && !isSearching && offers.length > 0 ? (
          <div className="hidden md:flex mt-4 px-4 gap-6">
            {/* Columna izquierda - Listado de ofertas */}
            <div className="w-1/3 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
              <div className="space-y-3 pr-2">
                {offers.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white border rounded-[10px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer transition-all ${
                      selectedJob?.id === job.id
                        ? "border-[#0097B2] border-l-8 bg-blue-50"
                        : "border-[#B6B4B4] border hover:border-[#0097B2]"
                    }`}
                    onClick={() => handleSelectJob(job)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center w-full">
                          {selectedJob?.id === job.id && (
                            <div className="w-2 h-2 rounded-full bg-[#0097B2] mr-2" />
                          )}
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-medium text-[#08252A]">
                              {job.titulo}
                            </h3>
                            <button
                              className="text-gray-400 hover:text-[#0097B2] cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignOffer(job);
                              }}
                            >
                              <Bookmark size={20} className="text-[#0097B2]" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="pb-4">
                        <div className="border-t border-gray-200" />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center text-xs text-[#0097B2]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-[#0097B2]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{job.fechaCreacion?.split("T")[0]}</span>
                        </div>
                        <div
                          className="flex items-center text-xs text-gray-500 gap-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openApplicantsModal(job);
                          }}
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
                          <span>{job.postulacionesCount || 0} applicants</span>
                          <ChevronRight size={24} className="text-[#6D6D6D]" />
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Botón de eliminar */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOffer(job);
                            }}
                            className="cursor-pointer"
                          >
                            <Trash2 size={20} className="text-red-600" />
                          </button>

                          {/* Botón de pausa/reactivar */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePause(job);
                            }}
                            className="cursor-pointer"
                          >
                            {job.estado === "pausado" ? (
                              <PlayCircle
                                size={22}
                                className="text-green-600"
                              />
                            ) : (
                              <PauseCircle
                                size={22}
                                className="text-amber-600"
                              />
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
                              openEditModal(job);
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
                ))}

                {/* Elemento de observación para cargar más */}
                {loadingMore && <LoadingIndicator />}

                {hasMore && !loadingMore && (
                  <div ref={loadMoreRef} className="h-10"></div>
                )}
              </div>
            </div>

            {/* Right column - Selected offer details */}
            <div className="w-2/3 border border-[#B6B4B4] rounded-[10px] overflow-hidden shadow-sm p-6">
              {selectedJob && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-[#08252A]">
                      {selectedJob.titulo}
                    </h2>
                    <p className="text-gray-600 mt-1">{/* Andes */}</p>
                    <div className="flex items-center text-xs text-[#0097B2] mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-[#0097B2]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{selectedJob.fechaCreacion?.split("T")[0]}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-[#08252A] mb-2">
                      About the job
                    </h3>
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: selectedJob.descripcion,
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    {!user?.rol.includes("ADMIN") &&
                      !user?.rol.includes("EMPLEADO_ADMIN") && (
                        <button
                          className="bg-gradient-to-b from-[#0097B2] via-[#0092AC] to-[#00404C] text-white px-6 py-3 rounded-md text-[16px] font-[600] transition-all hover:shadow-lg w-full cursor-pointer"
                          onClick={() => {
                            if (!user) {
                              addNotification(
                                "You must be logged in to apply",
                                "info"
                              );
                              return;
                            }
                          }}
                        >
                          Apply
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : isLoading || isSearching ? (
          <OffersSkeleton />
        ) : (
          <div className="hidden md:block text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              No offers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "Start creating a new offer"}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/admin/dashboard/offers"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Create new offer
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Applicants modal */}
      {selectedOffer && (
        <ApplicantsModal
          isOpen={isApplicantsModalOpen}
          onClose={closeApplicantsModal}
          serviceTitle={selectedOffer?.titulo || ""}
          offerId={selectedOffer.id || ""}
          applicants={
            selectedOffer?.postulaciones?.map((postulacion) => ({
              id: postulacion.candidato.id,
              nombre: postulacion.candidato.nombre,
              apellido: postulacion.candidato.apellido,
              correo: postulacion.candidato.correo,
              telefono: postulacion.candidato.telefono,
              fotoPerfil: postulacion.candidato.fotoPerfil,
              videoPresentacion: postulacion.candidato.videoPresentacion,
              postulationId: postulacion.id,
              estadoPostulacion:
                postulacion.estadoPostulacion as EstadoPostulacion,
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

      {offerToToggle && (
        <ConfirmPauseModal
          isOpen={isPauseModalOpen}
          onClose={() => setIsPauseModalOpen(false)}
          onConfirm={confirmTogglePause}
          title={
            offerToToggle.estado === "pausado" ? "Publish offer" : "Pause offer"
          }
          message={
            offerToToggle.estado === "pausado"
              ? "Are you sure you want to publish this offer? Users will be able to see it again."
              : "Are you sure you want to pause this offer? Users will not be able to see it while it is paused."
          }
          isPaused={offerToToggle.estado === "pausado"}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && offerToDelete && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete offer
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {`Are you sure you want to delete the offer "${offerToDelete.titulo}
              "? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setOfferToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOffer}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de asignación */}
      <AssignOfferModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        offerId={offerToAssign?.id || ""}
        offerTitle={offerToAssign?.titulo || ""}
      />
    </div>
  );
}
