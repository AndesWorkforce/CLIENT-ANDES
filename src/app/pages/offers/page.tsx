"use client";

import { useEffect, useState } from "react";
import { Job } from "./data/mockData";
import FilterModal from "./components/FilterModal";
import JobDetailModal from "./components/JobDetailModal";

import type { FilterValues } from "./components/FilterModal";
import { applyToOffer, getOffers } from "./actions/jobs.actions";
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
  const [showJobDetail, setShowJobDetail] = useState<boolean>(false);
  const [offerToView, setOfferToView] = useState<Offer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  // Estados para los filtros
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [showInfoMessage, setShowInfoMessage] = useState(true);

  const handleSelectJob = (job: Offer) => {
    setSelectedJob(job);
  };

  const handleApplyFilters = (filterData: FilterValues) => {
    // Aquí implementaríamos la lógica de filtrado con los nuevos chips
    // Por ahora, simplemente mantenemos la lista original
    console.log("Filtros aplicados:", filterData);
    setFilteredJobs(filteredJobs);
  };

  const handleClearFilters = () => {
    // Opcional: implementar lógica adicional de limpieza
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
      addNotification("Successfully applied to the job", "success");
    } else {
      if (message === "Ya te has postulado a esta propuesta") {
        addNotification("You have already applied to this job", "info");
      } else {
        addNotification(message || "Error applying to the job", "error");
      }
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      const response = await getOffers();
      if (response.success) {
        setFilteredJobs(response.data.data);
        // Seleccionar automáticamente la primera oferta para la vista desktop
        if (response.data.data.length > 0) {
          setSelectedJob(response.data.data[0]);
        }
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="container mx-auto bg-white min-h-screen">
      {showInfoMessage && (
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
      <div className="px-4 py-2 flex justify-between items-center">
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

      <JobDetailModal
        isOpen={showJobDetail}
        onClose={() => setShowJobDetail(false)}
        job={selectedJob as Job}
      />

      {/* Vista móvil - Lista de servicios */}
      <div className="md:hidden px-4 space-y-3 pb-20">
        {filteredJobs.map((job) => (
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
        ))}
      </div>

      {/* Vista desktop - Layout de dos columnas */}
      <div className="hidden md:flex mt-4 px-4 gap-6">
        {/* Columna izquierda - Listado de ofertas */}
        <div className="w-1/3 overflow-y-auto max-h-[calc(100vh-150px)]">
          <div className="space-y-3 pr-2">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              console.log(
                "Renderizando job:",
                job.id,
                "isSelected:",
                isSelected,
                "selectedJob?.id:",
                selectedJob?.id
              );

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
            })}
          </div>
        </div>

        {/* Columna derecha - Detalle de la oferta seleccionada */}
        <div className="w-2/3 border border-[#B6B4B4] rounded-[10px] overflow-hidden shadow-sm p-6">
          {selectedJob ? (
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
                      className="bg-gradient-to-b from-[#0097B2] via-[#0092AC] to-[#00404C] text-white px-6 py-3 rounded-md text-[16px] font-[600] transition-all hover:shadow-lg w-full cursor-pointer"
                      onClick={() => {
                        if (!user) {
                          addNotification(
                            "You must be logged in to apply",
                            "info"
                          );
                          router.push("/auth/login");
                          return;
                        }
                        handleApplyToOffer(selectedJob.id || "");
                      }}
                    >
                      Apply
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
    </div>
  );
}
