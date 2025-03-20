"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { ExperienceData } from "@/app/types/experience-data";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExperienceData) => void;
  experienceData?: ExperienceData;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  onSave,
  experienceData,
}: ExperienceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [atPresent, setAtPresent] = useState(
    experienceData?.currentlyWorking || false
  );

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!experienceData?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: ExperienceData = {
      position: formData.get("position") as string,
      company: formData.get("company") as string,
      startDate: `${formData.get("startMonth")} ${formData.get("startYear")}`,
      endDate: atPresent
        ? "Presente"
        : `${formData.get("endMonth")} ${formData.get("endYear")}`,
      currentlyWorking: atPresent,
      description: formData.get("description") as string,
    };

    // Añadir ID si estamos editando
    if (isEditing && experienceData?.id) {
      data.id = experienceData.id;
    }

    onSave(data);
    onClose();
  };

  // Extraer mes y año de las fechas (si existen)
  const parseDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "Presente") return { month: "", year: "" };
    const parts = dateStr.split(" ");
    return {
      month: parts[0] || "",
      year: parts[1] || "",
    };
  };

  const startDate = parseDate(experienceData?.startDate);
  const endDate = parseDate(experienceData?.endDate);

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
            Experiencia
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
              htmlFor="position"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Puesto<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              defaultValue={experienceData?.position || ""}
              placeholder="Ingresa el nombre del puesto"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Empresa<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              defaultValue={experienceData?.company || ""}
              placeholder="Ingresa el nombre de la empresa"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              Fecha de inicio<span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <select
                name="startMonth"
                defaultValue={startDate.month}
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
                <option value="">Mes</option>
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
                defaultValue={startDate.year}
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
                <option value="">Año</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#6D6D6D] mb-1">
              Fecha de finalización<span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <select
                name="endMonth"
                defaultValue={endDate.month}
                className="w-1/2 p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none"
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
                <option value="">Mes</option>
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
                defaultValue={endDate.year}
                className="w-1/2 p-2 border border-gray-300 rounded-md text-[#6D6D6D] appearance-none"
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
                <option value="">Año</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
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
                onChange={() => setAtPresent(!atPresent)}
                className="h-4 w-4 text-[#0097B2] rounded focus:ring-[#0097B2]"
              />
              <label
                htmlFor="atPresent"
                className="ml-2 block text-sm text-[#6D6D6D]"
              >
                Al presente
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Descripción del puesto<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={experienceData?.description || ""}
              placeholder="Escribe cuáles son tus tareas"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#B6B4B4] text-[#6D6D6D] font-medium rounded-md"
            >
              Guardar
            </button>
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
