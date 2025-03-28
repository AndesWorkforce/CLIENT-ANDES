"use client";

import { useProfileContext } from "../context/ProfileContext";

interface ViewContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function ViewContactoModal({
  isOpen,
  onClose,
  onEdit,
}: ViewContactoModalProps) {
  const { profile } = useProfileContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Datos de Contacto</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Teléfono</h3>
              <p className="mt-1 text-gray-600">
                {profile.datosPersonales.telefono || "No especificado"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">
                Residencia o Domicilio
              </h3>
              <p className="mt-1 text-gray-600">
                {profile.datosPersonales.residencia || "No especificado"}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007d8a]"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
