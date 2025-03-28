"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfileContext } from "../context/ProfileContext";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { updateProfilePersonal } from "../actions/profile.actions";

// Esquema de validación con Zod
const contactoSchema = z.object({
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .regex(/^[+0-9() -]+$/, "Formato de teléfono inválido"),
  residencia: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres"),
});

export type ContactoFormValues = z.infer<typeof contactoSchema>;

interface ContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactoModal({ isOpen, onClose }: ContactoModalProps) {
  const { profile } = useProfileContext();
  const { user } = useAuthStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      telefono: profile.datosPersonales?.telefono || "",
      residencia: profile.datosPersonales?.residencia || "",
    },
  });

  // Función para guardar los datos del formulario
  const onSubmit = async (data: ContactoFormValues) => {
    if (!user?.id) {
      addNotification("Usuario no autenticado", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Datos a enviar:", data);
      const response = await updateProfilePersonal(user.id, data);
      if (response.success) {
        addNotification(
          "Datos de contacto actualizados correctamente",
          "success"
        );
        onClose();
        reset();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al guardar datos de contacto:", error);
      addNotification("Error al actualizar datos de contacto", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Datos de Contacto</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Campo de teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="text"
                  {...register("telefono")}
                  className={`w-full p-2 border rounded-md ${
                    errors.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1234567890"
                />
                {errors.telefono && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.telefono.message}
                  </span>
                )}
              </div>

              {/* Campo de residencia */}
              <div>
                <label
                  htmlFor="residencia"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Residencia o Domicilio
                </label>
                <input
                  id="residencia"
                  type="text"
                  {...register("residencia")}
                  className={`w-full p-2 border rounded-md ${
                    errors.residencia ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ciudad, País"
                />
                {errors.residencia && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.residencia.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  reset();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007d8a]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
