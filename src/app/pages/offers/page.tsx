"use client";

import { useEffect, useState } from "react";
import FilterModal from "./components/FilterModal";
import OffersAccessGuard from "./components/OffersAccessGuard";
import OffersLandingPage from "./components/OffersLandingPage";

import type { FilterValues } from "./components/FilterModal";
import {
  applyToOffer,
  getOffers,
  userIsAppliedToOffer,
  checkApplicationHistory,
} from "./actions/jobs.actions";
import { Offer } from "@/app/types/offers";
import ViewOfferModal from "@/app/components/ViewOfferModal";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { useRouter } from "next/navigation";
import { ApplicationWarningModal } from "@/components/ui/application-warning-modal";
import { ApplicationHistoryStatus } from "@/interfaces/jobs.types";

export default function JobOffersPage() {
  const { user } = useAuthStore();

  // Show landing page for non-authenticated users
  if (!user) {
    return <OffersLandingPage />;
  }

  // Authenticated users see the job offers system below
  return <AuthenticatedOffersPage />;
}

function AuthenticatedOffersPage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Offer | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<Offer[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [offerToView, setOfferToView] = useState<Offer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [showInfoMessage, setShowInfoMessage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidProfileUserState, setIsValidProfileUserState] =
    useState<boolean>(false);
  const [appliedOfferIds, setAppliedOfferIds] = useState<string[]>([]);
  const [showCentralNotification, setShowCentralNotification] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [offerToApply, setOfferToApply] = useState<string | null>(null);
  const [applicationHistoryMap, setApplicationHistoryMap] = useState<
    Map<string, ApplicationHistoryStatus>
  >(new Map());
  const [currentApplicationHistory, setCurrentApplicationHistory] =
    useState<ApplicationHistoryStatus | null>(null);
  const [loadingApplications, setLoadingApplications] = useState<Set<string>>(
    new Set()
  );

  console.log(selectedJob);

  const isValidProfileUser = async () => {
    try {
      const response = await userIsAppliedToOffer(user?.id || "");
      if (response.success) {
        if (response.data?.perfilCompleto === "COMPLETO") {
          setIsValidProfileUserState(true);
        } else {
          setIsValidProfileUserState(false);
        }
      }
    } catch (error) {
      console.error(
        "[Navbar] Error al verificar el perfil del usuario:",
        error
      );
    }
  };

  const handleApplyFilters = (filterData: FilterValues) => {
    console.log("Filtros aplicados:", filterData);
    setFilteredJobs(filteredJobs);
  };

  const handleClearFilters = () => {
    setFilteredJobs(filteredJobs);
  };

  const handleViewOffer = (offer: Offer) => {
    setOfferToView(offer);
    setIsViewModalOpen(true);
  };

  const handleApplyToOffer = async (offerId: string) => {
    if (!offerId) return;

    // This function should only be called when we're sure we want to apply
    // (after user has confirmed through the warning modal if needed)
    const { success, message } = await applyToOffer(offerId);

    if (success) {
      const newAppliedOffers = [...appliedOfferIds, offerId];
      setAppliedOfferIds(newAppliedOffers);

      localStorage.setItem(
        `applied_offers_${user?.id}`,
        JSON.stringify(newAppliedOffers)
      );

      // Update application history map to reflect new application
      setApplicationHistoryMap((prev) =>
        new Map(prev).set(offerId, {
          hasApplied: true,
          isActive: true,
          wasRejected: false,
          applicationDate: new Date().toISOString(),
        })
      );

      setShowCentralNotification(true);
      setShowWarningModal(false);
      setCurrentApplicationHistory(null);

      setTimeout(() => setShowCentralNotification(false), 3000);
    } else {
      // Backend returned an error - this should be rare now since we check history first
      console.error("Backend error when applying:", message);

      // Handle specific error cases
      if (message.includes("Ya tienes un contrato activo")) {
        addNotification(
          "You have an active contract for this offer. Please wait until it's finalized before applying to another offer.",
          "info"
        );
      } else if (message.includes("Ya te has postulado a esta propuesta")) {
        addNotification("You have already applied to this job", "info");
      } else if (
        message.includes(
          "No puedes postularte hasta que tu perfil esté completo"
        )
      ) {
        addNotification(
          "You cannot apply until your profile is complete.",
          "info"
        );
      } else if (message.includes("Tu usuario se encuentra bloqueado")) {
        addNotification(
          "Your account is blocked. Please request an unblock in the claims section before applying.",
          "error"
        );
      } else if (message.includes("Ya tienes una postulación activa")) {
        addNotification(
          "You already have an active application. Please wait until it's rejected or accepted before applying to another offer.",
          "info"
        );
      } else if (
        message.includes(
          "No puedes volver a postularte a una oferta donde fuiste rechazado"
        )
      ) {
        addNotification(
          "You cannot reapply to a job offer where you were previously rejected.",
          "info"
        );
      } else if (
        message.includes("This job is only available for people from")
      ) {
        addNotification(message, "info");
      } else {
        addNotification(
          "Error applying to this job. Please try again.",
          "error"
        );
      }

      setShowWarningModal(false);
      setCurrentApplicationHistory(null);
    }

    // Always remove loading state after processing
    setLoadingApplications((prev) => {
      const newSet = new Set(prev);
      newSet.delete(offerId);
      return newSet;
    });
    setOfferToApply(null);
  };

  const handleInitiateApplication = async (offerId: string) => {
    if (!user) {
      addNotification("You must be logged in to apply", "info");
      router.push("/auth/login");
      return;
    }

    // Check if already applied based on localStorage (for immediate feedback)
    if (appliedOfferIds.includes(offerId)) {
      addNotification("You have already applied to this job", "info");
      return;
    }

    // Check if already loading this application
    if (loadingApplications.has(offerId)) {
      return;
    }

    // Set loading state immediately
    setLoadingApplications((prev) => new Set(prev).add(offerId));
    setOfferToApply(offerId);

    try {
      // Check application history from backend
      const result = await checkApplicationHistory(offerId);
      console.log("Application history result:", result);

      if (result.success && result.data) {
        const historyData = result.data;
        console.log("History data:", historyData);

        // Handle different scenarios based on history
        if (historyData.hasApplied && historyData.isActive) {
          // User has an active application
          console.log("User has active application");
          const historyStatus: ApplicationHistoryStatus = {
            hasApplied: true,
            wasRejected: false,
            isActive: true,
            applicationDate: historyData.applicationDate,
          };
          setCurrentApplicationHistory(historyStatus);
          setShowWarningModal(true);
          return;
        }

        if (historyData.hasApplied && historyData.wasRejected) {
          // User was rejected before, do not allow reapplication
          console.log("User was rejected before");
          addNotification(
            "You cannot reapply to a job offer where you were previously rejected.",
            "info"
          );
          setOfferToApply(null);
          return;
        }

        if (
          historyData.hasApplied &&
          !historyData.isActive &&
          !historyData.wasRejected
        ) {
          // User applied before but status is unclear, show warning
          console.log("User applied before, unclear status");
          const historyStatus: ApplicationHistoryStatus = {
            hasApplied: true,
            wasRejected: false,
            isActive: false,
            applicationDate: historyData.applicationDate,
          };
          setCurrentApplicationHistory(historyStatus);
          setShowWarningModal(true);
          return;
        }
      }

      // No previous application or no issues found, show standard confirmation modal
      console.log("No previous application, showing standard modal");
      setCurrentApplicationHistory(null);
      setShowWarningModal(true);
    } catch (error) {
      console.error("Error checking application history:", error);
      addNotification(
        "Error checking application status. Please try again.",
        "error"
      );
      // Remove loading state on error
      setLoadingApplications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(offerId);
        return newSet;
      });
      setOfferToApply(null);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      const response = await getOffers();
      console.log("[OFERTS VIEW ALL]:", response);
      if (response.success) {
        const offers: Offer[] = response.data.data || [];

        // Priorizar activas/en proceso arriba: publicado/pausado primero
        const statusPriority: Record<string, number> = {
          publicado: 0,
          publicada: 0, // por compatibilidad
          pausado: 1,
          pausada: 1,
          borrador: 2,
          cerrada: 3,
          cerrado: 3,
        };

        const sorted = [...offers].sort((a, b) => {
          const pa = statusPriority[(a.estado || "").toLowerCase()] ?? 99;
          const pb = statusPriority[(b.estado || "").toLowerCase()] ?? 99;
          if (pa !== pb) return pa - pb;
          // Secundario: fecha publicación/creación más reciente primero
          const fa = a.fechaPublicacion || a.fechaCreacion || "";
          const fb = b.fechaPublicacion || b.fechaCreacion || "";
          return (new Date(fb).getTime() || 0) - (new Date(fa).getTime() || 0);
        });

        setFilteredJobs(sorted);
        if (sorted.length > 0) {
          setSelectedJob(sorted[0]);
        }
      }
      setIsLoading(false);
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    if (user) {
      isValidProfileUser();
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const storedAppliedOffers = localStorage.getItem(
        `applied_offers_${user.id}`
      );
      if (storedAppliedOffers) {
        try {
          const parsedOffers = JSON.parse(storedAppliedOffers);
          setAppliedOfferIds(parsedOffers);
        } catch (error) {
          console.error("Error al parsear ofertas aplicadas:", error);
          setAppliedOfferIds([]);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    const loadApplicationHistory = async () => {
      if (!user?.id || filteredJobs.length === 0) return;

      const historyPromises = filteredJobs.map(async (job) => {
        if (!job.id) return null;

        try {
          const result = await checkApplicationHistory(job.id);
          if (result.success && result.data) {
            const historyStatus: ApplicationHistoryStatus = {
              hasApplied: result.data.hasApplied,
              wasRejected: result.data.wasRejected,
              isActive: result.data.isActive,
              applicationDate: result.data.applicationDate,
            };
            return { offerId: job.id, status: historyStatus };
          }
        } catch (error) {
          console.error(`Error loading history for offer ${job.id}:`, error);
        }
        return null;
      });

      const results = await Promise.all(historyPromises);
      const newHistoryMap = new Map<string, ApplicationHistoryStatus>();

      results.forEach((result) => {
        if (result) {
          newHistoryMap.set(result.offerId, result.status);
        }
      });

      setApplicationHistoryMap(newHistoryMap);
    };

    loadApplicationHistory();
  }, [user?.id, filteredJobs]);

  // Helper function to get button state for a specific offer
  const getButtonState = (offerId: string) => {
    const history = applicationHistoryMap.get(offerId);
    const isLoading = loadingApplications.has(offerId);

    if (isLoading) {
      return {
        text: "Applying...",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed",
        showSpinner: true,
      };
    }

    if (appliedOfferIds.includes(offerId)) {
      return {
        text: "Applied",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed",
        showSpinner: false,
      };
    }

    if (history?.isActive) {
      return {
        text: "Apply",
        disabled: true,
        className: "bg-[#0097B2] cursor-not-allowed",
        showSpinner: false,
      };
    }

    if (history?.wasRejected) {
      return {
        text: "Previously Rejected",
        disabled: true,
        className: "bg-[#0097B2] cursor-not-allowed",
        showSpinner: false,
      };
    }

    return {
      text: "Apply",
      disabled: false,
      className:
        "bg-gradient-to-b from-[#0097B2] via-[#0092AC] to-[#00404C] hover:shadow-lg cursor-pointer",
      showSpinner: false,
    };
  };

  return (
    <OffersAccessGuard>
      {/* Pantalla completa para usuarios no logueados */}
      {!user ? (
        <div
          className="min-h-screen flex items-center justify-center text-white relative"
          style={{
            backgroundImage: "url('/images/teamwork.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay para dar transparencia y mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0097B2]/80 to-[#4A90E2]/80"></div>

          {/* Contenido centrado */}
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Finding Talent is Easier than Ever
              </h1>

              <div className="space-y-6 mb-10 text-center">
                <div className="flex items-center justify-center">
                  <span className="text-base md:text-lg">
                    Once registered, professionals can explore available
                    contract opportunities tailored to their skills and
                    experience. Businesses can log in to view applicants for
                    their openings, review profiles, and select finalists, with
                    dedicated support from Andes staff throughout the process to
                    ensure a smooth and efficient experience. Our platform is
                    designed to connect top talent with meaningful, professional
                    engagements, efficiently and securely.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="bg-white text-[#0097B2] min-w-[200px] px-8 py-2 rounded-lg font-semibold text-lg hover:bg-[#0097B2] hover:text-white transition-colors cursor-pointer shadow-lg"
                >
                  Join Now
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="  bg-white min-w-[200px] text-[#0097B2] px-8 py-2 rounded-lg font-semibold text-lg hover:bg-[#0097B2] hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto bg-white min-h-screen">
          {!isValidProfileUserState && showInfoMessage && (
            <div className="bg-blue-50 m-4 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_616_13239)">
                        <path
                          d="M10.0001 18.3333C14.6025 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6025 1.66667 10.0001 1.66667C5.39771 1.66667 1.66675 5.39763 1.66675 10C1.66675 14.6024 5.39771 18.3333 10.0001 18.3333Z"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 13.3333V10"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 6.66667H10.0083"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_616_13239">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-blue-800 font-medium text-sm">
                      Important information
                    </h2>
                    <p className="text-blue-600 text-xs">
                      Register or login to complete your application
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoMessage(false)}
                  className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Modales */}
          <FilterModal
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            selectedSeniority={selectedSeniority}
            setSelectedSeniority={setSelectedSeniority}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

          {/* Nueva vista de tarjetas para usuarios logueados */}
          <div className="px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Current Open Positions
              </h2>
              <p className="text-gray-600">
                Browse our latest opportunities and apply directly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {isLoading ? (
                // Skeleton para tarjetas
                <>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={`bg-white border-l-4 border-gray-200 rounded-lg p-6 shadow-sm ${
                        index % 2 === 0
                          ? "border-l-[#0097B2]"
                          : "border-l-blue-500"
                      }`}
                    >
                      {/* Header con título y badge */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded-full w-16 ml-2 animate-pulse"></div>
                      </div>

                      {/* Descripción */}
                      <div className="mb-4">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>

                      {/* Tags */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded w-18 animate-pulse"></div>
                        </div>
                      </div>

                      {/* Salary y botón */}
                      <div className="flex justify-between items-center">
                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                filteredJobs.map((job, index) => {
                  const buttonState = getButtonState(job.id || "");

                  // Extraer información de ubicación de la descripción
                  const descripcionText =
                    job.descripcion?.replace(/<[^>]*>/g, "").toLowerCase() ||
                    "";
                  const isRemote =
                    descripcionText.includes("remote") ||
                    descripcionText.includes("remot") ||
                    job.modalidad?.toLowerCase().includes("remot") ||
                    job.ubicacion?.toLowerCase().includes("remot");

                  // Extraer ubicación específica si está mencionada
                  const locationMatch = descripcionText.match(
                    /(?:remote\s*[-–—]\s*|location:\s*)([a-z\s]+(?:america|states|canada|mexico|chile|argentina|colombia|peru|ecuador|bolivia|uruguay|paraguay|venezuela|brazil))/i
                  );
                  const extractedLocation = locationMatch
                    ? locationMatch[1].trim()
                    : null;

                  // Colores del borde lateral rotando
                  const borderColors = [
                    "border-l-[#0097B2]", // Teal (principal)
                    "border-l-blue-500", // Azul
                    "border-l-[#0097B2]", // Teal (principal)
                  ];
                  const borderColor = borderColors[index % borderColors.length];

                  return (
                    <div
                      key={job.id}
                      className={`bg-white border-l-4 ${borderColor} shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
                      onClick={() => handleViewOffer(job)}
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {job.titulo}
                            </h3>
                            <span className="bg-[#0097B2] text-white text-xs px-2 py-1 rounded-full">
                              {isRemote ? "Remote" : "On-site"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {extractedLocation ||
                              (isRemote ? "Remote" : job.ubicacion || "Remote")}
                          </p>
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                          <p
                            className="text-gray-700 text-sm leading-relaxed"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {job.descripcion
                              ? job.descripcion
                                  .replace(/<[^>]*>/g, "")
                                  .substring(0, 140)
                              : "Join our team and contribute to meaningful projects with our experienced team."}
                          </p>
                        </div>

                        {/* Skills/Tags */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {job.modalidad && (
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {job.modalidad}
                              </span>
                            )}
                            {job.seniority && (
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {job.seniority}
                              </span>
                            )}
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              Full-Time
                            </span>
                          </div>
                        </div>

                        {/* Salary y Apply Button */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#0097B2] font-semibold text-sm">
                            $2,500 - $4,500 USD
                          </span>
                          <button
                            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                              buttonState.disabled
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-[#0097B2] hover:bg-[#007A8F] text-white"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!buttonState.disabled && job?.id) {
                                handleInitiateApplication(job.id);
                              }
                            }}
                            disabled={buttonState.disabled}
                          >
                            {buttonState.showSpinner && (
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            )}
                            {buttonState.text}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {offerToView && (
            <ViewOfferModal
              isOpen={isViewModalOpen}
              onClose={() => setIsViewModalOpen(false)}
              offer={offerToView}
            />
          )}

          {showWarningModal && currentApplicationHistory && (
            <ApplicationWarningModal
              isOpen={showWarningModal}
              onClose={() => {
                setShowWarningModal(false);
                setCurrentApplicationHistory(null);
                // Clear loading state when modal is closed
                if (offerToApply) {
                  setLoadingApplications((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(offerToApply);
                    return newSet;
                  });
                  setOfferToApply(null);
                }
              }}
              onConfirm={() => {
                if (offerToApply) {
                  handleApplyToOffer(offerToApply);
                }
              }}
              historyStatus={currentApplicationHistory}
              isLoading={false}
            />
          )}

          {showWarningModal && !currentApplicationHistory && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Important Notice
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  You can only apply to one offer at a time. Once this
                  application is completed, you&apos;ll be able to apply to
                  another offer. Are you sure this is the offer you want to
                  apply to?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setShowWarningModal(false);
                      // Clear loading state when modal is closed
                      if (offerToApply) {
                        setLoadingApplications((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(offerToApply);
                          return newSet;
                        });
                        setOfferToApply(null);
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#0097B2] text-white rounded-md font-medium hover:bg-[#007A8F] transition-colors cursor-pointer"
                    onClick={() => {
                      if (offerToApply) {
                        handleApplyToOffer(offerToApply);
                      }
                    }}
                  >
                    Confirm Application
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCentralNotification && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Your application has been submitted
                </h3>
                <button
                  className="mt-6 bg-[#0097B2] text-white px-5 py-2 rounded-md font-medium cursor-pointer"
                  onClick={() => setShowCentralNotification(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </OffersAccessGuard>
  );
}
