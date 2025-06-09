import { useState } from "react";
import { Employee, updateEmployee } from "../actions/employee.actions";
import { useNotificationStore } from "@/store/notifications.store";

interface EditEmployeeFormData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  residencia?: string;
}

interface Props {
  employee: Employee;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditEmployeeModal({
  employee,
  onClose,
  onUpdate,
}: Props) {
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EditEmployeeFormData>({
    nombre: employee.usuario.nombre,
    apellido: employee.usuario.apellido,
    correo: employee.usuario.correo,
    telefono: employee.usuario.telefono || "",
    residencia: employee.usuario.residencia || "",
  });

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
      const result = await updateEmployee(employee.usuario.id, formData);

      if (result.success) {
        addNotification("Employee updated successfully", "success");
        onUpdate();
        onClose();
      } else {
        addNotification(result.message || "Error updating employee", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification("Error updating employee", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit employee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

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
              {isLoading ? "Updating..." : "Update employee"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-[#0097B2] hover:text-[#007B8E] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
