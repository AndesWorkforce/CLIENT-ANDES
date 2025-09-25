"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { createNewUserForCompany } from "../actions/company-employee.actions";
import { useNotificationStore } from "@/store/notifications.store";

interface Company {
  id: string;
  nombre: string;
}

interface CreateCompanyEmployeeModalProps {
  company: Company;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCompanyEmployeeModal({
  company,
  onClose,
  onSuccess,
}: CreateCompanyEmployeeModalProps) {
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados para nuevo usuario
  const [newUserData, setNewUserData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    residencia: "",
    rol: "EMPLEADO_EMPRESA", // Rol fijo para empresas existentes
  });

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newUserData.nombre ||
      !newUserData.apellido ||
      !newUserData.correo ||
      !newUserData.contrasena
    ) {
      addNotification("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await createNewUserForCompany({
        ...newUserData,
        empresaId: company.id,
      });

      if (result.success) {
        addNotification(
          "New employee created and assigned successfully",
          "success"
        );
        onSuccess?.();
        onClose();
      } else {
        addNotification(result.message || "Error creating employee", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification("Error creating employee", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNewUserChange = (field: string, value: string) => {
    setNewUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Employee to {company.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* New Employee Form */}
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={newUserData.nombre}
                  onChange={(e) =>
                    handleNewUserChange("nombre", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={newUserData.apellido}
                  onChange={(e) =>
                    handleNewUserChange("apellido", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newUserData.correo}
                onChange={(e) => handleNewUserChange("correo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newUserData.contrasena}
                  onChange={(e) =>
                    handleNewUserChange("contrasena", e.target.value)
                  }
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={newUserData.telefono}
                onChange={(e) =>
                  handleNewUserChange("telefono", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residence
              </label>
              <input
                type="text"
                value={newUserData.residencia}
                onChange={(e) =>
                  handleNewUserChange("residencia", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
              />
            </div>

            <div>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span> Employee
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  New employees will automatically be assigned as company
                  employees.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
