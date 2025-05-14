"use client";

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Education } from "@/app/types/education";
import { useAuthStore } from "@/store/auth.store";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: Education) => void;
  educationData?: Education;
  candidateId?: string;
}

export default function EducationModal({
  isOpen,
  onClose,
  onSave,
  educationData,
  candidateId,
}: EducationModalProps) {
  const { user } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [atPresente, setAtPresente] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formValues, setFormValues] = useState({
    degree: "",
    institution: "",
    startYear: "",
    endYear: "",
  });

  const parseDate = (dateStr?: string | null) => {
    if (!dateStr) return { year: "" };

    if (/^\d{4}$/.test(dateStr)) {
      return { year: dateStr };
    }

    const parts = dateStr.split(" ");
    return {
      year: parts.length > 1 ? parts[1] : parts[0] || "",
    };
  };

  const resetForm = () => {
    setFormValues({
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
    });
    setAtPresente(false);
  };

  useEffect(() => {
    if (educationData) {
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
      resetForm();
    }
  }, [educationData, isOpen]);

  useEffect(() => {
    const validateForm = () => {
      const degreeValid = !!formValues.degree.trim();
      const institutionValid = !!formValues.institution.trim();
      const startYearValid = !!formValues.startYear;

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

    if (isEditing && educationData?.id) {
      data.id = educationData.id;
    }

    onSave(candidateId || user?.id || "", data);
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
            Education
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
              Degree/Major<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formValues.degree}
              onChange={handleInputChange}
              placeholder="Enter the degree/major"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="institution"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Institution<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formValues.institution}
              onChange={handleInputChange}
              placeholder="Enter the name of the institution"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              Start Year<span className="text-red-500">*</span>
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
              <option value="">Select a year</option>
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
              End Year<span className="text-red-500">*</span>
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
              <option value="">Select a year</option>
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
                Present
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 px-4 font-medium rounded-md transition-colors cursor-pointer ${
                isFormValid
                  ? "bg-[#0097B2] hover:bg-[#0097B2]/80 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Save
            </button>
            {!isFormValid && (
              <p className="text-amber-600 text-sm text-center">
                Please complete all required fields
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-[#0097B2] py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
