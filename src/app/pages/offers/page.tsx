"use client";

import { useEffect, useState } from "react";
import FilterModal from "./components/FilterModal";

import type { FilterValues } from "./components/FilterModal";
import {
  applyToOffer,
  getOffers,
  userIsAppliedToOffer,
} from "./actions/jobs.actions";
import { Offer } from "@/app/types/offers";
import ViewOfferModal from "@/app/components/ViewOfferModal";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { useRouter } from "next/navigation";

export default function JobOffersPage() {
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

  const handleSelectJob = (job: Offer) => {
    setSelectedJob(job);
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
    const { success, message } = await applyToOffer(offerId);
    if (success) {
      const newAppliedOffers = [...appliedOfferIds, offerId];
      setAppliedOfferIds(newAppliedOffers);

      localStorage.setItem(
        `applied_offers_${user?.id}`,
        JSON.stringify(newAppliedOffers)
      );

      setShowCentralNotification(true);
      setShowWarningModal(false);

      setTimeout(() => setShowCentralNotification(false), 3000);
    } else {
      if (message === "Ya te has postulado a esta propuesta") {
        addNotification("You have already applied to this job", "info");
      } else if (
        message === "No puedes postularte hasta que tu perfil esté completo"
      ) {
        addNotification(
          "You cannot apply until your profile is complete.",
          "info"
        );
      } else if (
        message ===
        "Tu usuario se encuentra bloqueado, para realizar una postulación, debes solicitar el levantamiento de tu bloqueo en el apartado de reclamos"
      ) {
        addNotification(
          "Your account is blocked. Please request an unblock in the claims section before applying.",
          "error"
        );
      } else if (
        message ===
        "Ya tienes una postulación activa. Debes esperar a que sea rechazada o aceptada antes de postular a otra oferta."
      ) {
        addNotification(
          "You already have an active application. Please wait until it's rejected or accepted before applying to another offer.",
          "info"
        );
      } else if (
        message.includes("This job is only available for people from")
      ) {
        addNotification(message, "info");
      } else {
        addNotification("Error applying to this job", "error");
      }
      setShowWarningModal(false);
    }
  };

  const handleInitiateApplication = (offerId: string) => {
    if (!user) {
      addNotification("You must be logged in to apply", "info");
      router.push("/auth/login");
      return;
    }
    if (!appliedOfferIds.includes(offerId)) {
      setOfferToApply(offerId);
      setShowWarningModal(true);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      const response = await getOffers();
      if (response.success) {
        setFilteredJobs(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedJob(response.data.data[0]);
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

  // Skeleton para la vista móvil
  const MobileSkeletonItem = () => (
    <div className="bg-white border-[#B6B4B4] border rounded-[10px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-5 bg-gray-200 rounded-md w-40 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-20 animate-pulse"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="border-t border-gray-200" />
      </div>
      <div className="px-4 pt-0 pb-4 flex items-center">
        <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );

  // Skeleton para la vista desktop - Lista de ofertas
  const DesktopListSkeletonItem = () => (
    <div className="bg-white border border-[#B6B4B4] rounded-[10px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <div className="h-5 bg-gray-200 rounded-md w-40 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="pb-4">
          <div className="border-t border-gray-200" />
        </div>
        <div className="flex items-center">
          <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Skeleton para la vista de detalle
  const DetailSkeleton = () => (
    <div>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/4 mt-1 mb-2 animate-pulse"></div>
        <div className="flex items-center mt-2">
          <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-2 animate-pulse"></div>
      </div>

      <div className="mt-6">
        <div className="h-12 bg-gray-200 rounded-md w-full animate-pulse"></div>
      </div>
    </div>
  );

  return (
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

      {/* Servicios Requeridos y Filtros */}
      <div className="mt-2 px-4 py-2 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-[#08252A]">
          Required Services
        </h1>
        {/* OCULTAMOS EL BOTON DE FILTROS POR AHORA */}
        {/* <button
          className="flex items-center bg-white border-[#B6B4B4] border rounded-[10px] px-3 py-1 text-sm font-[500] cursor-pointer"
          onClick={() => setShowFilters(true)}
        >
          <span className="mr-2">Filtros</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_616_13233)">
              <path
                d="M13.625 13L9.25 13"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.75 13L2.375 13"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.625 8L8 8"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 8L2.375 8"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.625 3L10.5 3"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 3L2.375 3"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.25 14.875L9.25 11.125"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 9.875L5.5 6.125"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 4.875L10.5 1.125"
                stroke="#0097B2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_616_13233">
                <rect
                  width="15"
                  height="15"
                  fill="white"
                  transform="translate(0.5 15.5) rotate(-90)"
                />
              </clipPath>
            </defs>
          </svg>
        </button> */}
      </div>

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

      {/* Vista móvil - Lista de servicios */}
      <div className="md:hidden px-4 space-y-3 pb-20">
        {isLoading ? (
          // Skeleton para móvil
          <>
            <MobileSkeletonItem />
            <MobileSkeletonItem />
            <MobileSkeletonItem />
          </>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border-[#B6B4B4] border rounded-[10px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
              onClick={() => handleSelectJob(job)}
            >
              <div className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-[#08252A]">{job.titulo}</h3>
                    <p className="text-gray-500 text-sm">
                      {/* {job.datosExtra.empresa} */}
                    </p>
                  </div>
                  <div
                    className="text-[#0097B2] cursor-pointer"
                    onClick={() => handleViewOffer(job)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="border-t border-gray-200" />
              </div>
              <div className="px-4 pt-0 pb-4 flex items-center text-xs text-[#0097B2]">
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
            </div>
          ))
        )}
      </div>

      {/* Vista desktop - Layout de dos columnas */}
      <div className="hidden md:flex mt-4 px-4 gap-6">
        {/* Columna izquierda - Listado de ofertas */}
        <div className="w-1/3 overflow-y-auto custom-scrollbar max-h-[calc(100vh-150px)]">
          <div className="space-y-3 pr-2">
            {isLoading ? (
              // Skeleton para lista desktop
              <>
                <DesktopListSkeletonItem />
                <DesktopListSkeletonItem />
                <DesktopListSkeletonItem />
                <DesktopListSkeletonItem />
              </>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;

                return (
                  <div
                    key={job.id}
                    className={`bg-white border rounded-[10px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#0097B2] border-l-8 bg-blue-50"
                        : "border-[#B6B4B4] border hover:border-[#0097B2]"
                    }`}
                    onClick={() => handleSelectJob(job)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-[#0097B2] mr-2"></div>
                          )}
                          <div>
                            <h3 className="font-medium text-[#08252A]">
                              {job.titulo}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {/* Andes */}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pb-4">
                        <div className="border-t border-gray-200" />
                      </div>
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
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Columna derecha - Detalle de la oferta seleccionada */}
        <div className="w-2/3 border border-[#B6B4B4] rounded-[10px] overflow-hidden shadow-sm p-6">
          {isLoading ? (
            // Skeleton para detalle desktop
            <DetailSkeleton />
          ) : selectedJob ? (
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
                  dangerouslySetInnerHTML={{ __html: selectedJob.descripcion }}
                />
              </div>

              {/* <div className="mb-4">
                <h3 className="text-lg font-medium text-[#08252A] mb-2">
                  Requirements
                </h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedJob.requerimientos ||
                      "<p>No specific requirements listed.</p>",
                  }}
                />
              </div> */}

              <div className="mt-6">
                {!user?.rol.includes("ADMIN") &&
                  !user?.rol.includes("EMPLEADO_ADMIN") && (
                    <button
                      className={`${
                        appliedOfferIds.includes(selectedJob?.id || "")
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-b from-[#0097B2] via-[#0092AC] to-[#00404C] hover:shadow-lg cursor-pointer"
                      } text-white px-6 py-3 rounded-md text-[16px] font-[600] transition-all w-full`}
                      onClick={() => {
                        if (selectedJob?.id) {
                          handleInitiateApplication(selectedJob.id);
                        }
                      }}
                      disabled={appliedOfferIds.includes(selectedJob?.id || "")}
                    >
                      {appliedOfferIds.includes(selectedJob?.id || "")
                        ? "Applied"
                        : "Apply"}
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a job to view details
            </div>
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

      {showWarningModal && (
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
              You can only apply to one offer at a time. Once this application
              is completed, you&apos;ll be able to apply to another offer. Are
              you sure this is the offer you want to apply to?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setShowWarningModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#0097B2] text-white rounded-md font-medium hover:bg-[#007A8F] transition-colors"
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
            {/* <p className="text-gray-600">{centralNotificationMessage}</p> */}
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
  );
}
