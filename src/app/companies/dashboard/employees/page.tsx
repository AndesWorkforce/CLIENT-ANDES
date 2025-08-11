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
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
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
