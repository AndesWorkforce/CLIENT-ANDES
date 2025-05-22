"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfileContext } from "../context/ProfileContext";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { updateProfilePersonal } from "../actions/profile.actions";

// Tipo para países
interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  cca2: string;
  cca3: string;
  capital: string[];
  region: string;
}

// Tipo extendido para los datos personales
interface DatosPersonalesExtendidos {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  residencia?: string;
  fotoPerfil?: string | null;
  pais?: string;
  paisImagen?: string;
}

// Esquema de validación con Zod
const contactoSchema = z.object({
  telefono: z
    .string()
    .min(7, "El número de teléfono debe tener al menos 7 caracteres")
    .regex(/^[+0-9() -]+$/, "Formato de número de teléfono inválido"),
  residencia: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres"),
  pais: z.string().optional(),
  paisImagen: z.string().optional(),
});

export type ContactoFormValues = z.infer<typeof contactoSchema>;

interface ContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
}

export default function ContactoModal({
  isOpen,
  onClose,
  candidateId,
}: ContactoModalProps) {
  const { profile } = useProfileContext();
  const { user } = useAuthStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  // Tratamos los datos personales como un tipo extendido
  const datosPersonales =
    profile.datosPersonales as unknown as DatosPersonalesExtendidos;

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,capital,region"
        );
        if (!response.ok) {
          throw new Error("Error fetching countries");
        }
        const data = await response.json();
        // Ordenar países por nombre común
        const sortedCountries = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        addNotification("Error fetching countries", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [addNotification]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      telefono: datosPersonales?.telefono || "",
      residencia: datosPersonales?.residencia || "",
      pais: datosPersonales?.pais || "",
      paisImagen: datosPersonales?.paisImagen || "",
    },
  });

  const selectedCountry = watch("pais");

  // Actualizar la imagen de la bandera cuando se selecciona un país
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryName = e.target.value;
    const country = countries.find(
      (c) => c.name.common === selectedCountryName
    );

    if (country) {
      setValue("pais", country.name.common);
      setValue("paisImagen", country.flags.png);
    } else {
      setValue("paisImagen", "");
    }
  };

  const onSubmit = async (data: ContactoFormValues) => {
    if (!user?.id) {
      addNotification("User not authenticated", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateProfilePersonal(
        candidateId || user.id,
        data
      );
      if (response.success) {
        addNotification("Contact information updated successfully", "success");
        onClose();
        reset();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error updating contact information:", error);
      addNotification("Error updating contact information", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
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

              <div>
                <label
                  htmlFor="residencia"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Residence or Address
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

              <div>
                <label
                  htmlFor="pais"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <div className="relative">
                  <select
                    id="pais"
                    {...register("pais")}
                    onChange={handleCountryChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.pais ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.cca3} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                  </select>
                  {loading && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-[#0097B2] border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                {errors.pais && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.pais.message}
                  </span>
                )}
              </div>

              {selectedCountry && watch("paisImagen") && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Selected flag:</span>
                  <img
                    src={watch("paisImagen")}
                    alt={`Flag of ${selectedCountry}`}
                    className="h-6 w-auto"
                  />
                </div>
              )}
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007d8a] cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
