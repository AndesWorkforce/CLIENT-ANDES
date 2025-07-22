"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { getAssignedOffers, toggleOfferStatus } from "./actions/offers.actions";
import { Offer } from "@/app/types/offers";
import ViewOfferModal from "@/app/components/ViewOfferModal";
import ConfirmPauseModal from "@/app/components/ConfirmPauseModal";
import { useNotificationStore } from "@/store/notifications.store";
import OffersSkeleton from "@/app/admin/dashboard/components/OffersSkeleton";
import OfferCardSkeleton from "@/app/admin/dashboard/components/OfferCardSkeleton";
import ApplicantsModal from "@/app/admin/dashboard/components/ApplicantsModal";
import { EstadoPostulacion } from "@/app/admin/dashboard/actions/update-application-status.actions";

export default function CompanyDashboard() {
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [offerToView, setOfferToView] = useState<Offer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] =
    useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Offer | null>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);
  const [offerToToggle, setOfferToToggle] = useState<Offer | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleSelectJob = (job: Offer) => {
    setSelectedJob(job);
  };

  const fetchAssignedOffers = useCallback(
    async (reset = true) => {
      if (reset) {
        setIsLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await getAssignedOffers(
          reset ? 1 : currentPage,
          10,
          searchTerm
        );

        if (!response.success) {
          addNotification(response.message || "Error loading offers", "error");
          return;
        }

        const offerData = response.data?.data || [];
        console.log("🔍 [fetchAssignedOffers] Received offers:", offerData);
        console.log(
          "🔍 [fetchAssignedOffers] First offer detailed:",
          offerData[0]
        );

        if (reset) {
          setOffers(offerData);
          if (offerData.length > 0) {
            setSelectedJob(offerData[0]);
          }
        } else {
          setOffers((prevOffers) => [...prevOffers, ...offerData]);
        }

        setHasMore(response.hasMore || false);
      } catch (error) {
        console.error("[Companies] Error getting assigned offers:", error);
        addNotification("Error loading assigned offers", "error");
      } finally {
        if (reset) {
          setIsLoading(false);
          setIsSearching(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [currentPage, searchTerm, addNotification]
  );

  const loadMoreOffers = useCallback(async () => {
    if (!hasMore || loadingMore || isLoading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchAssignedOffers(false);
  }, [hasMore, loadingMore, isLoading, currentPage, fetchAssignedOffers]);

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
    [isLoading, loadingMore, hasMore, loadMoreOffers]
  );

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    fetchAssignedOffers(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUpdateApplicants = useCallback(() => {
    fetchAssignedOffers(true);
  }, [fetchAssignedOffers]);

  const openApplicantsModal = (offer: Offer) => {
    console.log("🔍 [openApplicantsModal] Debugging offer data:", {
      offerId: offer.id,
      titulo: offer.titulo,
      postulaciones: offer.postulaciones,
      postulacionesLength: offer.postulaciones?.length,
      _count: offer._count,
      postulacionesCount: offer.postulacionesCount,
      allOfferData: offer,
    });

    if (offer.postulaciones && offer.postulaciones.length > 0) {
      console.log(
        "✅ [openApplicantsModal] Opening modal with applicants:",
        offer.postulaciones.length
      );
      setSelectedOffer(offer);
      setIsApplicantsModalOpen(true);
    } else {
      console.log(
        "❌ [openApplicantsModal] No applicants found, showing notification"
      );
      addNotification("No applicants for this offer yet", "info");
    }
  };

  const closeApplicantsModal = () => {
    setIsApplicantsModalOpen(false);
    setSelectedOffer(null);
  };

  const handleViewOffer = (offer: Offer) => {
    setOfferToView(offer);
    setIsViewModalOpen(true);
  };

  const confirmTogglePause = async () => {
    if (!offerToToggle || !offerToToggle.id) return;

    const newStatus =
      offerToToggle.estado === "pausado" ? "publicado" : "pausado";

    try {
      const response = await toggleOfferStatus(offerToToggle.id, newStatus);
      if (response.success) {
        addNotification(response.message, "success");
        await fetchAssignedOffers();
      } else {
        addNotification(`Error: ${response.message}`, "error");
      }
    } catch {
      addNotification("Error changing offer status", "error");
    } finally {
      setIsPauseModalOpen(false);
      setOfferToToggle(null);
    }
  };

  useEffect(() => {
    fetchAssignedOffers();
  }, []);

  console.log("🔍 [CompanyDashboard] Offers:", offers);

  const LoadingIndicator = () => (
    <div className="flex justify-center py-4">
      <div className="animate-pulse flex space-x-2">
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
        <div className="w-2 h-2 bg-[#0097B2] rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search bar */}
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

        {/* Mobile offers list */}
        <div className="space-y-4 md:hidden">
          {isLoading || isSearching ? (
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
                      </div>
                      <button
                        className="text-gray-400 hover:text-[#0097B2] cursor-pointer"
                        onClick={() => handleViewOffer(offer)}
                      >
                        <ChevronRight size={24} className="text-[#0097B2]" />
                      </button>
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
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openApplicantsModal(offer)}
                            className="text-[#0097B2] hover:text-[#007B8E] text-sm font-medium flex items-center"
                          >
                            <span className="mr-1">
                              {offer._count?.postulaciones ||
                                offer.postulaciones?.length ||
                                0}
                            </span>
                            applicants
                          </button>
                        </div>
                        <ChevronRight size={24} className="text-[#6D6D6D]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loadingMore && <LoadingIndicator />}

              {hasMore && !loadingMore && (
                <div ref={loadMoreRef} className="h-10"></div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                No assigned offers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "You don't have any assigned offers yet"}
              </p>
            </div>
          )}
        </div>

        {/* Desktop view - Two column layout */}
        {!isLoading && !isSearching && offers.length > 0 ? (
          <div className="hidden md:flex mt-4 px-4 gap-6">
            {/* Left column - Offers list */}
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
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {selectedJob?.id === job.id && (
                            <div className="w-2 h-2 rounded-full bg-[#0097B2] mr-2" />
                          )}
                          <h3 className="font-medium text-[#08252A]">
                            {job.titulo}
                          </h3>
                        </div>
                      </div>
                      <div className="pb-4">
                        <div className="border-t border-gray-200" />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center text-xs text-[#0097B2]">
                          <Calendar className="h-4 w-4 mr-1" />
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
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openApplicantsModal(job);
                              }}
                              className="text-[#0097B2] hover:text-[#007B8E] text-sm font-medium flex items-center"
                            >
                              <span className="mr-1">
                                {job.postulacionesCount ||
                                  job._count?.postulaciones ||
                                  job.postulaciones?.length ||
                                  0}
                              </span>
                              applicants
                            </button>
                          </div>
                          <ChevronRight size={24} className="text-[#6D6D6D]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

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
                    <div className="flex items-center text-xs text-[#0097B2] mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{selectedJob.fechaCreacion?.split("T")[0]}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-[#08252A] mb-2">
                      Offer Description
                    </h3>
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: selectedJob.descripcion,
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => openApplicantsModal(selectedJob)}
                      className="bg-[#0097B2] text-white px-6 py-3 rounded-md text-[16px] font-[600] transition-all hover:bg-[#007A8F] w-full"
                    >
                      View Applicants (
                      {selectedJob.postulacionesCount ||
                        selectedJob._count?.postulaciones ||
                        selectedJob.postulaciones?.length ||
                        0}
                      )
                    </button>
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
              No assigned offers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : "You don't have any assigned offers yet"}
            </p>
          </div>
        )}
      </main>

      {/* Modal de postulantes */}
      {selectedOffer && (
        <ApplicantsModal
          isOpen={isApplicantsModalOpen}
          onClose={closeApplicantsModal}
          serviceTitle={selectedOffer?.titulo || ""}
          onUpdate={handleUpdateApplicants}
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
              serviceTitle: selectedOffer.titulo || "",
              preferenciaEntrevista: postulacion.preferenciaEntrevista ?? null,
            })) || []
          }
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

      {/* Modal de confirmación de pausa/activación */}
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
              : "Are you sure you want to pause this offer? Users won't be able to see it while it's paused."
          }
          isPaused={offerToToggle.estado === "pausado"}
        />
      )}
    </div>
  );
}
