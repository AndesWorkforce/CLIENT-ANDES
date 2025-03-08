"use client";

import { useState } from "react";

const departments = [
  { value: "todos", label: "Todos los departamentos" },
  { value: "diseño", label: "Diseño" },
  { value: "desarrollo", label: "Desarrollo" },
  { value: "marketing", label: "Marketing" },
  { value: "ventas", label: "Ventas" },
];

const dates = [
  { value: "todos", label: "Cualquier fecha" },
  { value: "2024-02-12", label: "Feb 12" },
  { value: "2024-02-10", label: "Feb 10" },
  { value: "2024-02-05", label: "Feb 5" },
];

const seniorities = [
  { value: "todos", label: "Cualquier seniority" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
];

const locations = [
  { value: "todos", label: "Cualquier ubicación" },
  { value: "remoto", label: "Remoto" },
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
];

const modalities = [
  { value: "todos", label: "Cualquier modalidad" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contrato" },
];

interface Filters {
  department: string;
  date: string;
  seniority: string;
  location: string;
  modality: string;
}

interface JobFiltersProps {
  onFilter: (filters: Filters) => void;
}

export default function JobFilters({ onFilter }: JobFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    department: "todos",
    date: "todos",
    seniority: "todos",
    location: "todos",
    modality: "todos",
  });

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-3">
        {/* Filtro de departamento */}
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#0097B2]"
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Filtro de fecha */}
        <div className="relative">
          <select
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#0097B2]"
          >
            {dates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Filtro de seniority */}
        <div className="relative">
          <select
            value={filters.seniority}
            onChange={(e) => handleFilterChange("seniority", e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#0097B2]"
          >
            {seniorities.map((seniority) => (
              <option key={seniority.value} value={seniority.value}>
                {seniority.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {/* Filtro de ubicación */}
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#0097B2]"
          >
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Filtro de modalidad */}
        <div className="relative">
          <select
            value={filters.modality}
            onChange={(e) => handleFilterChange("modality", e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#0097B2]"
          >
            {modalities.map((modality) => (
              <option key={modality.value} value={modality.value}>
                {modality.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
