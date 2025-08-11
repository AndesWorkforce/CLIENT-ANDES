import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

// Tipo para la experiencia
export interface AdminExperience {
  id?: string;
  cargo: string;
  empresa: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  esActual?: boolean;
  descripcion: string;
}

interface AdminExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AdminExperience) => Promise<void>;
  experienceData?: AdminExperience;
}

export default function AdminExperienceModal({
  isOpen,
  onClose,
  experienceData,
  onSave,
}: AdminExperienceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [atPresent, setAtPresent] = useState(experienceData?.esActual || false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data: AdminExperience = {
        id: experienceData?.id,
        cargo: formData.get("cargo") as string,
        empresa: formData.get("empresa") as string,
        fechaInicio: `${formData.get("startMonth")} ${formData.get(
          "startYear"
        )}`,
        fechaFin: atPresent
          ? null
          : `${formData.get("endMonth")} ${formData.get("endYear")}`,
        esActual: atPresent,
        descripcion: formData.get("descripcion") as string,
      };

      await onSave(data);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Años y meses para los selects
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
            <div className="grid grid-cols-2 gap-2">
              <select
                name="startMonth"
                value={formValues.startMonth}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={`start-${month}`} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="startYear"
                value={formValues.startYear}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={`start-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <label className="text-sm text-[#6D6D6D]">
                End Date<span className="text-red-500">*</span>
              </label>
              <div className="ml-4 flex items-center">
                <input
                  type="checkbox"
                  id="atPresent"
                  checked={atPresent}
                  onChange={(e) => setAtPresent(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="atPresent"
                  className="text-sm text-[#6D6D6D] cursor-pointer"
                >
                  Currently working here
                </label>
              </div>
            </div>
            {!atPresent && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="endMonth"
                  value={formValues.endMonth}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-md"
                  required={!atPresent}
                  disabled={atPresent}
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={`end-${month}`} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="endYear"
                  value={formValues.endYear}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-md"
                  required={!atPresent}
                  disabled={atPresent}
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={`end-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm text-[#6D6D6D] mb-1"
            >
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleInputChange}
              placeholder="Enter a description of your responsibilities and achievements"
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007d8a] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
