"use client";

import { useProfileContext } from "../context/ProfileContext";

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

  // Tratamos los datos personales como un tipo extendido
  const datosPersonales =
    profile.datosPersonales as unknown as DatosPersonalesExtendidos;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Información de Contacto
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Teléfono</h3>
              <p className="mt-1 text-gray-600">
                {datosPersonales.telefono || "No especificado"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">
                Residencia o Dirección
              </h3>
              <p className="mt-1 text-gray-600">
                {datosPersonales.residencia || "No especificado"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">País</h3>
              {datosPersonales.pais ? (
                <div className="mt-1 flex items-center space-x-2">
                  <p className="text-gray-600">{datosPersonales.pais}</p>
                  {datosPersonales.paisImagen && (
                    <img
                      src={datosPersonales.paisImagen}
                      alt={`Bandera de ${datosPersonales.pais}`}
                      className="h-5 w-auto"
                    />
                  )}
                </div>
              ) : (
                <p className="mt-1 text-gray-600">No especificado</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007d8a] cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
