"use client";

import { useState, useRef } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
  selectedDepartments: string[];
  setSelectedDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDates: string[];
  setSelectedDates: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSeniority: string[];
  setSelectedSeniority: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLocation: string[];
  setSelectedLocation: React.Dispatch<React.SetStateAction<string[]>>;
}

// Datos de ejemplo para los filtros
const departmentOptions: FilterOption[] = [
  { id: "tecnologia", label: "Tecnología" },
  { id: "marketing", label: "Marketing" },
  { id: "ventas", label: "Ventas" },
  { id: "telecomunicaciones", label: "Telecomunicaciones" },
  { id: "educacion", label: "Educación" },
  { id: "diseno", label: "Diseño" },
];

const dateOptions: FilterOption[] = [
  { id: "ultimas-24h", label: "Últimas 24 h" },
  { id: "ultimo-mes", label: "Último mes" },
  { id: "ultima-semana", label: "Última semana" },
];

const seniorityOptions: FilterOption[] = [
  { id: "junior", label: "Junior" },
  { id: "semi-senior", label: "Semi senior" },
  { id: "senior", label: "Senior" },
  { id: "entry-level", label: "Entry level" },
];

const locationOptions: FilterOption[] = [
  { id: "remoto", label: "Remoto" },
  { id: "hibrido", label: "Híbrido" },
  { id: "presencial", label: "Presencial" },
];

type CategoryType = "department" | "date" | "seniority" | "location";

export default function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  selectedDepartments,
  setSelectedDepartments,
  selectedDates,
  setSelectedDates,
  selectedSeniority,
  setSelectedSeniority,
  selectedLocation,
  setSelectedLocation,
}: FilterModalProps) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("department");

  // Referencia al contenido del modal
  const modalRef = useRef<HTMLDivElement>(null);

  // Usar el hook sin especificar el tipo genérico
  useOutsideClick(modalRef, onClose, isOpen);

  const toggleDepartment = (id: string) => {
    setSelectedDepartments((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const toggleDate = (id: string) => {
    setSelectedDates((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const toggleSeniority = (id: string) => {
    setSelectedSeniority((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const toggleLocation = (id: string) => {
    setSelectedLocation((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      departments: selectedDepartments,
      dates: selectedDates,
      seniority: selectedSeniority,
      locations: selectedLocation,
    });
    onClose();
  };

  const clearFilters = () => {
    setSelectedDepartments([]);
    setSelectedDates([]);
    setSelectedSeniority([]);
    setSelectedLocation([]);
    onClearFilters();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#08252A33] z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-11/12 max-w-md overflow-hidden"
      >
        {/* Botón de cierre (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-row">
          {/* Columna izquierda con etiquetas */}
          <div className="w-1/3 bg-gray-100 m-3 rounded-lg flex flex-col">
            <div
              className={`py-5 cursor-pointer text-center ${
                activeCategory === "department"
                  ? "bg-white m-3 rounded-lg shadow-sm"
                  : ""
              }`}
              onClick={() => setActiveCategory("department")}
            >
              <h3 className="font-medium">Departamento</h3>
            </div>
            <div
              className={`py-5 cursor-pointer text-center ${
                activeCategory === "date"
                  ? "bg-white m-3 rounded-lg shadow-sm"
                  : ""
              }`}
              onClick={() => setActiveCategory("date")}
            >
              <h3 className="font-medium">
                Fecha de
                <br />
                publicación
              </h3>
            </div>
            <div
              className={`py-5 cursor-pointer text-center ${
                activeCategory === "seniority"
                  ? "bg-white m-3 rounded-lg shadow-sm"
                  : ""
              }`}
              onClick={() => setActiveCategory("seniority")}
            >
              <h3 className="font-medium">Seniority</h3>
            </div>
            <div
              className={`py-5 cursor-pointer text-center ${
                activeCategory === "location"
                  ? "bg-white m-3 rounded-lg shadow-sm"
                  : ""
              }`}
              onClick={() => setActiveCategory("location")}
            >
              <h3 className="font-medium">Ubicación</h3>
            </div>
          </div>

          {/* Columna derecha con chips */}
          <div className="w-2/3 p-4">
            {/* Departamento chips */}
            {activeCategory === "department" && (
              <div className="flex flex-wrap gap-2">
                {departmentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleDepartment(option.id)}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                      selectedDepartments.includes(option.id)
                        ? "bg-[#0097B2] text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Fecha de publicación chips */}
            {activeCategory === "date" && (
              <div className="flex flex-wrap gap-2">
                {dateOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleDate(option.id)}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                      selectedDates.includes(option.id)
                        ? "bg-[#0097B2] text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Seniority chips */}
            {activeCategory === "seniority" && (
              <div className="flex flex-wrap gap-2">
                {seniorityOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleSeniority(option.id)}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                      selectedSeniority.includes(option.id)
                        ? "bg-[#0097B2] text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Ubicación chips */}
            {activeCategory === "location" && (
              <div className="flex flex-wrap gap-2">
                {locationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleLocation(option.id)}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                      selectedLocation.includes(option.id)
                        ? "bg-[#0097B2] text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t-[2px] border-gray-200 flex justify-center gap-5">
          <button
            onClick={clearFilters}
            className="text-[#0097B2] font-medium cursor-pointer"
          >
            Limpiar filtros
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-[#0097B2] text-white py-1 px-4 rounded-md cursor-pointer"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </div>
  );
}
