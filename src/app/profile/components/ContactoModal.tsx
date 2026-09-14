"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfileContext } from "../context/ProfileContext";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { updateProfilePersonal } from "../actions/profile.actions";
import { ALL_COUNTRIES } from "@/lib/countries";

interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

function flagUrl(iso2: string): string {
  return `https://flagcdn.com/w80/${iso2.toLowerCase()}.png`;
}

function getLocalCountryOptions(): CountryOption[] {
  return ALL_COUNTRIES.map((country) => ({
    code: country.code,
    name: country.name,
    flag: flagUrl(country.code),
  }));
}

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
  const [countries, setCountries] = useState<CountryOption[]>(() =>
    getLocalCountryOptions()
  );
  const [loading, setLoading] = useState(false);

  const datosPersonales =
    profile.datosPersonales as unknown as DatosPersonalesExtendidos;

  useEffect(() => {
    if (!isOpen) return;

    const fetchCountries = async () => {
      setLoading(true);
      try {
        // restcountries v3.1 está deprecado; usamos countriesnow + fallback local.
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/flag/images"
        );
        if (!response.ok) {
          throw new Error("Error fetching countries");
        }

        const result = (await response.json()) as {
          error?: boolean;
          data?: Array<{ name: string; iso2: string; flag: string }>;
        };

        if (result.error || !Array.isArray(result.data)) {
          throw new Error("Invalid countries response");
        }

        const sortedCountries = [...result.data]
          .filter((country) => country.name && country.iso2)
          .map((country) => ({
            code: country.iso2,
            name: country.name,
            flag: country.flag || flagUrl(country.iso2),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries, using local fallback:", error);
        setCountries(getLocalCountryOptions());
      } finally {
        setLoading(false);
      }
    };

    void fetchCountries();
  }, [isOpen]);

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryName = e.target.value;
    const country = countries.find((c) => c.name === selectedCountryName);

    if (country) {
      setValue("pais", country.name);
      setValue("paisImagen", country.flag);
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
                  placeholder="Please type your home address"
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
                      <option key={country.code} value={country.name}>
                        {country.name}
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
