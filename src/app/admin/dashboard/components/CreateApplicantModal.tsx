import { useState } from "react";
import { EyeIcon, EyeOffIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNotificationStore } from "@/store/notifications.store";
import { createApplicant } from "../actions/applicants.actions";

// Esquema de validación para el formulario
const applicantSchema = z
  .object({
    nombre: z.string().min(2, "Name is required"),
    apellido: z.string().min(2, "Last name is required"),
    correo: z.string().email("Invalid email"),
    telefono: z.string().min(7, "Invalid phone number").optional(),
    contrasena: z.string().min(8, "The password must be at least 8 characters"),
    confirmContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmContrasena, {
    message: "The passwords do not match",
    path: ["confirmContrasena"],
  });

type ApplicantFormValues = z.infer<typeof applicantSchema>;

interface CreateApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicantCreated: () => void;
}

export default function CreateApplicantModal({
  isOpen,
  onClose,
  onApplicantCreated,
}: CreateApplicantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    contrasena: false,
    confirmContrasena: false,
  });

  const { addNotification } = useNotificationStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
  });

  function togglePasswordVisibility(field: string): void {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  const onSubmit = async (data: ApplicantFormValues) => {
    try {
      setIsSubmitting(true);

      // Extraer confirmContrasena ya que no se envía al API
      const { confirmContrasena, ...applicantData } = data;

      // Llamar a la API para crear el postulante
      const response = await createApplicant(applicantData);

      if (response.success) {
        addNotification(response.message, "success");
        reset();
        onApplicantCreated();
      } else {
        addNotification(response.error || response.message, "error");
      }
    } catch (error) {
      console.error("Error al crear postulante:", error);
      addNotification("Unexpected error creating applicant", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Cabecera */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Create Applicant
          </h3>
          <p className="text-sm text-gray-500">
            Complete the form to register a new applicant
          </p>
        </div>

        {/* Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1 text-[#0097B2] font-medium">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter the name"
                className="bg-transparent text-black border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                {...register("nombre")}
              />
              {errors.nombre && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.nombre.message}
                </span>
              )}
            </div>

            {/* Last name */}
            <div>
              <label className="block text-sm mb-1 text-[#0097B2] font-medium">
                Last name
              </label>
              <input
                type="text"
                placeholder="Enter the last name"
                className="bg-transparent text-black border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                {...register("apellido")}
              />
              {errors.apellido && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.apellido.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-[#0097B2] font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter the email"
                className="bg-transparent text-black border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                {...register("correo")}
              />
              {errors.correo && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.correo.message}
                </span>
              )}
            </div>

            {/* Phone number (optional) */}
            <div>
              <label className="block text-sm mb-1 text-[#0097B2] font-medium">
                Phone number (optional)
              </label>
              <input
                type="tel"
                placeholder="Enter the phone number"
                className="bg-transparent text-black border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                {...register("telefono")}
              />
              {errors.telefono && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.telefono.message}
                </span>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm mb-1 text-[#0097B2] font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.contrasena ? "text" : "password"}
                  placeholder="Enter the password"
                  className="bg-transparent text-black border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                  {...register("contrasena")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => togglePasswordVisibility("contrasena")}
                >
                  {showPassword.contrasena ? (
                    <EyeOffIcon
                      size={20}
                      color="#0097B2"
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      size={20}
                      color="#0097B2"
                      className="cursor-pointer"
                    />
                  )}
                </button>
              </div>
              {errors.contrasena && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.contrasena.message}
                </span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm mb-1 text-[#0097B2] font-medium">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmContrasena ? "text" : "password"}
                  placeholder="Confirm the password"
                  className="bg-transparent text-black border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                  {...register("confirmContrasena")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => togglePasswordVisibility("confirmContrasena")}
                >
                  {showPassword.confirmContrasena ? (
                    <EyeOffIcon
                      size={20}
                      color="#0097B2"
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      size={20}
                      color="#0097B2"
                      className="cursor-pointer"
                    />
                  )}
                </button>
              </div>
              {errors.confirmContrasena && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.confirmContrasena.message}
                </span>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a8f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Applicant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
