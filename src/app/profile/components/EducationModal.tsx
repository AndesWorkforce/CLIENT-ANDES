"use client";

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Education } from "@/app/types/education";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Education) => void;
  educationData?: Education;
}

export default function EducationModal({
  isOpen,
  onClose,
  onSave,
  educationData,
}: EducationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [atPresente, setAtPresente] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formValues, setFormValues] = useState({
    degree: "",
    institution: "",
    startYear: "",
    endYear: "",
  });

  // Extraer año de las fechas (si existen)
  const parseDate = (dateStr?: string | null) => {
    if (!dateStr) return { year: "" };

    // Si es solo un año (YYYY)
    if (/^\d{4}$/.test(dateStr)) {
      return { year: dateStr };
    }

    // Si tiene formato Mes Año, extraer solo el año
    const parts = dateStr.split(" ");
    return {
      year: parts.length > 1 ? parts[1] : parts[0] || "",
    };
  };

  // Función para limpiar el formulario
  const resetForm = () => {
    setFormValues({
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
    });
    setAtPresente(false);
  };

  // Inicializar valores cuando cambia educationData o el modal se abre/cierra
  useEffect(() => {
    if (educationData) {
      console.log("Actualizando formulario con datos:", educationData);

      const startDate = parseDate(educationData.añoInicio);
      const endDate = parseDate(educationData.añoFin);

      setFormValues({
        degree: educationData.titulo || "",
        institution: educationData.institucion || "",
        startYear: startDate.year,
        endYear: endDate.year,
      });

      setAtPresente(
        educationData.añoFin === "Presente" || educationData.añoFin === null
      );
    } else if (isOpen) {
      // Si el modal se abre y no hay educationData, resetear formulario
      resetForm();
    }
  }, [educationData, isOpen]);

  // Validar formulario
  useEffect(() => {
    const validateForm = () => {
      // Validar campos requeridos
      const degreeValid = !!formValues.degree.trim();
      const institutionValid = !!formValues.institution.trim();
      const startYearValid = !!formValues.startYear;

      // Validar fecha de finalización (o al presente)
      const endDateValid = atPresente || !!formValues.endYear;

      return degreeValid && institutionValid && startYearValid && endDateValid;
    };

    setIsFormValid(validateForm());
  }, [formValues, atPresente]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  const isEditing = !!educationData?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Education = {
      institucion: formValues.institution,
      titulo: formValues.degree,
      añoInicio: formValues.startYear,
      añoFin: atPresente ? null : formValues.endYear,
      esActual: atPresente || undefined,
    };

    // Añadir ID si estamos editando
    if (isEditing && educationData?.id) {
      data.id = educationData.id;
    }

    console.log("Enviando datos de educación:", data);
    onSave(data);
    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-lg overflow-hidden"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="flex items-center p-4 relative">
          <div className="w-6"></div>
          <h2 className="text-lg font-medium w-full text-center text-[#0097B2]">
            Educación
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="degree"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Título/Carrera<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formValues.degree}
              onChange={handleInputChange}
              placeholder="Ingresa el título/carrera"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="institution"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Institución<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formValues.institution}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre de la institución"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              Año de inicio<span className="text-red-500">*</span>
            </label>
            <select
              name="startYear"
              value={formValues.startYear}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230097B2' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
              required
            >
              <option value="">Selecciona un año</option>
              {Array.from(
                { length: 50 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              Año de finalización<span className="text-red-500">*</span>
            </label>
            <select
              name="endYear"
              value={formValues.endYear}
              onChange={handleInputChange}
              className={`w-full p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none ${
                atPresente ? "cursor-not-allowed bg-gray-100" : ""
              }`}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230097B2' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
              disabled={atPresente}
              required={!atPresente}
            >
              <option value="">Selecciona un año</option>
              {Array.from(
                { length: 50 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="atPresente"
                checked={atPresente}
                onChange={(e) => {
                  setAtPresente(e.target.checked);
                  if (e.target.checked) {
                    // Limpiar los campos de fecha de finalización
                    setFormValues((prev) => ({
                      ...prev,
                      endYear: "",
                    }));
                  }
                }}
                className="h-4 w-4 text-[#0097B2] rounded focus:ring-[#0097B2]"
              />
              <label
                htmlFor="atPresente"
                className="ml-2 block text-sm text-[#6D6D6D]"
              >
                Al presente
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 px-4 font-medium rounded-md transition-colors ${
                isFormValid
                  ? "bg-[#0097B2] hover:bg-[#0097B2]/80 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Guardar
            </button>
            {!isFormValid && (
              <p className="text-amber-600 text-sm text-center">
                Por favor completa todos los campos requeridos
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-[#0097B2] py-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
