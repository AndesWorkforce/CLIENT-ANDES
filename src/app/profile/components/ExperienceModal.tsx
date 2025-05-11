"use client";

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Experience } from "../actions/experience.actions";
import { useAuthStore } from "@/store/auth.store";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: Experience) => void;
  experienceData?: Experience;
  candidateId?: string;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  experienceData,
  onSave,
  candidateId,
}: ExperienceModalProps) {
  const { user } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [atPresent, setAtPresent] = useState(experienceData?.esActual || false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formValues, setFormValues] = useState({
    cargo: "",
    empresa: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    descripcion: "",
  });

  const parseDate = (dateStr?: string | null) => {
    if (!dateStr || dateStr === "Presente") return { month: "", year: "" };
    const parts = dateStr.split(" ");
    return {
      month: parts[0] || "",
      year: parts[1] || "",
    };
  };

  const resetForm = () => {
    setFormValues({
      cargo: "",
      empresa: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      descripcion: "",
    });
    setAtPresent(false);
  };

  useEffect(() => {
    if (experienceData) {
      const startDate = parseDate(experienceData.fechaInicio);
      const endDate = parseDate(experienceData.fechaFin);

      setFormValues({
        cargo: experienceData.cargo || "",
        empresa: experienceData.empresa || "",
        startMonth: startDate.month,
        startYear: startDate.year,
        endMonth: endDate.month,
        endYear: endDate.year,
        descripcion: experienceData.descripcion || "",
      });

      setAtPresent(experienceData.esActual || false);
    } else if (isOpen) {
      resetForm();
    }
  }, [experienceData, isOpen]);

  useEffect(() => {
    const validateForm = () => {
      const cargoValid = !!formValues.cargo.trim();
      const empresaValid = !!formValues.empresa.trim();
      const startDateValid = !!formValues.startMonth && !!formValues.startYear;
      const descripcionValid = !!formValues.descripcion.trim();

      const endDateValid =
        atPresent || (!!formValues.endMonth && !!formValues.endYear);

      return (
        cargoValid &&
        empresaValid &&
        startDateValid &&
        descripcionValid &&
        endDateValid
      );
    };

    setIsFormValid(validateForm());
  }, [formValues, atPresent]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Experience = {
      id: experienceData?.id,
      cargo: formData.get("cargo") as string,
      empresa: formData.get("empresa") as string,
      fechaInicio: `${formData.get("startMonth")} ${formData.get("startYear")}`,
      fechaFin: atPresent
        ? null
        : `${formData.get("endMonth")} ${formData.get("endYear")}`,
      esActual: atPresent,
      descripcion: formData.get("descripcion") as string,
    };

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
            Experience
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
              htmlFor="cargo"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Job<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              value={formValues.cargo}
              onChange={handleInputChange}
              placeholder="Enter the job"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="empresa"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Company<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formValues.empresa}
              onChange={handleInputChange}
              placeholder="Enter the company"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              Start Date<span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <select
                name="startMonth"
                value={formValues.startMonth}
                onChange={handleInputChange}
                className="w-1/2 p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none"
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
                <option value="">Month</option>
                <option value="Ene">Ene</option>
                <option value="Feb">Feb</option>
                <option value="Mar">Mar</option>
                <option value="Abr">Abr</option>
                <option value="May">May</option>
                <option value="Jun">Jun</option>
                <option value="Jul">Jul</option>
                <option value="Ago">Ago</option>
                <option value="Sep">Sep</option>
                <option value="Oct">Oct</option>
                <option value="Nov">Nov</option>
                <option value="Dic">Dic</option>
              </select>
              <select
                name="startYear"
                value={formValues.startYear}
                onChange={handleInputChange}
                className="w-1/2 p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none"
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
                <option value="">Year</option>
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
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              End Date<span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <select
                name="endMonth"
                value={formValues.endMonth}
                onChange={handleInputChange}
                className={`w-1/2 p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none ${
                  atPresent ? "cursor-not-allowed bg-gray-100" : ""
                }`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230097B2' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
                disabled={atPresent}
                required={!atPresent}
              >
                <option value="">Month</option>
                <option value="Ene">Ene</option>
                <option value="Feb">Feb</option>
                <option value="Mar">Mar</option>
                <option value="Abr">Abr</option>
                <option value="May">May</option>
                <option value="Jun">Jun</option>
                <option value="Jul">Jul</option>
                <option value="Ago">Ago</option>
                <option value="Sep">Sep</option>
                <option value="Oct">Oct</option>
                <option value="Nov">Nov</option>
                <option value="Dic">Dic</option>
              </select>
              <select
                name="endYear"
                value={formValues.endYear}
                onChange={handleInputChange}
                className={`w-1/2 p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none ${
                  atPresent ? "cursor-not-allowed bg-gray-100" : ""
                }`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230097B2' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
                disabled={atPresent}
                required={!atPresent}
              >
                <option value="">Year</option>
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
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="atPresent"
                checked={atPresent}
                onChange={(e) => {
                  setAtPresent(e.target.checked);
                  if (e.target.checked) {
                    setFormValues((prev) => ({
                      ...prev,
                      endMonth: "",
                      endYear: "",
                    }));
                  }
                }}
                className="h-4 w-4 text-[#0097B2] rounded focus:ring-[#0097B2]"
              />
              <label
                htmlFor="atPresent"
                className="ml-2 block text-sm text-[#6D6D6D]"
              >
                Present
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Job Description<span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleInputChange}
              placeholder="Enter the job description"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
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
