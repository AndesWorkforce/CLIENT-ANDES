"use client";

import { useState } from "react";
import { jobs, Job } from "./data/mockData";
import FilterModal from "./components/FilterModal";
import JobDetailModal from "./components/JobDetailModal";

// Importar el tipo FilterValues de FilterModal para reutilizarlo
import type { FilterValues } from "./components/FilterModal";

export default function JobOffersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(
    jobs.length > 0 ? jobs[0] : null
  );
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showJobDetail, setShowJobDetail] = useState<boolean>(false);

  // Estados para los filtros
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyFilters = (filterData: FilterValues) => {
    // Aquí implementaríamos la lógica de filtrado con los nuevos chips
    // Por ahora, simplemente mantenemos la lista original
    console.log("Filtros aplicados:", filterData);
    setFilteredJobs(jobs);
  };

  const handleClearFilters = () => {
    // Opcional: implementar lógica adicional de limpieza
    setFilteredJobs(jobs);
  };

  const openJobDetailModal = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se dispare el onClick del div padre
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  return (
    <div className="container mx-auto bg-white min-h-screen">
      {/* Información Importante Banner */}
      <div className="bg-blue-50 m-4 rounded-lg p-4">
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
              Información Importante
            </h2>
            <p className="text-blue-600 text-xs">
              Recuerda que tienes que completar tu perfil para poder postularte
            </p>
          </div>
        </div>
      </div>

      {/* Servicios Requeridos y Filtros */}
      <div className="px-4 py-2 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-[#08252A]">
          Servicios Requeridos
        </h1>
        <button
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
        </button>
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

      {/* Lista de servicios */}
      <div className="px-4 space-y-3 pb-20">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border-[#B6B4B4] border rounded-[10px] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            onClick={() => handleSelectJob(job)}
          >
            <div className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-[#08252A]">
                    Especialidad de Diseño UX/UI
                  </h3>
                  <p className="text-gray-500 text-sm">Globant</p>
                </div>
                <div
                  className="text-[#0097B2] cursor-pointer"
                  onClick={(e) => openJobDetailModal(job, e)}
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
              <div className="border-t border-gray-200"></div>
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
              <span>Feb 12</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
