"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { createEmployee } from "../actions/employee.actions";
import { useNotificationStore } from "@/store/notifications.store";

interface EmployeeFormData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  residencia?: string;
}

export default function NewEmployee() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    residencia: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Verificar permisos y empresa
  useEffect(() => {
    if (!user) {
      addNotification("Debes iniciar sesión", "error");
      router.push("/auth/login");
      return;
    }

    if (user.rol !== "EMPRESA") {
      addNotification("No tienes permisos para crear empleados", "error");
      router.push("/");
      return;
    }

    if (!user.empresaId) {
      addNotification("No se encontró la empresa asociada", "error");
      router.push("/companies/dashboard");
      return;
    }
  }, [user, router, addNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createEmployee(formData);

      if (result.success) {
        addNotification("Employee created successfully", "success");
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          contrasena: "",
          telefono: "",
          residencia: "",
        });
        router.push("/companies/dashboard/employees");
      } else {
        addNotification(result.message || "Error creating employee", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification("Error creating employee", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Si no hay usuario o empresa, no mostrar el formulario
  if (!user || !user.empresaId) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create new employee
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                minLength={8}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2] pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-[#0097B2] focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Ojo abierto
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Ojo cerrado
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.634A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone (optional)
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Residence (optional)
            </label>
            <input
              type="text"
              name="residencia"
              value={formData.residencia}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-[#0097B2] text-white py-2 px-4 rounded hover:bg-[#007B8E] transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create employee"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/companies/dashboard/employees")}
              className="w-full text-[#0097B2] hover:text-[#007B8E] transition-colors cursor-pointer"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
