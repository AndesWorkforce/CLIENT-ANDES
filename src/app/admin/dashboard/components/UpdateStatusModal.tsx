import React, { useState } from "react";
import { X } from "lucide-react";
import { updateApplicationStatus } from "../actions/update-application-status.server.actions";
import {
  EstadoPostulacion,
  STATUS_TRANSLATIONS,
  AVAILABLE_STATUSES,
} from "../types/application-status.types";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  postulacionId: string;
  candidatoId: string;
  currentStatus: EstadoPostulacion;
  candidatoName: string;
  onUpdate: () => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  postulacionId,
  candidatoId,
  currentStatus,
  candidatoName,
  onUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] =
    useState<EstadoPostulacion>(currentStatus);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateApplicationStatus(
        postulacionId,
        candidatoId,
        selectedStatus,
        notes.trim() || undefined
      );

      if (response.success) {
        onUpdate();
        onClose();
        // Aquí puedes agregar una notificación de éxito
      } else {
        // Aquí puedes agregar una notificación de error
        console.error("Error updating status:", response.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filtrar estados disponibles (excluir INCOMPLETO y BLACKLIST según los requerimientos)
  const availableStatuses = AVAILABLE_STATUSES.filter(
    (status) => status !== "PENDIENTE" || currentStatus === "PENDIENTE" // Permitir PENDIENTE solo si es el estado actual
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Status - {candidatoName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status: {STATUS_TRANSLATIONS[currentStatus]}
            </label>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as EstadoPostulacion)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {STATUS_TRANSLATIONS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal notes about this status change..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedStatus === currentStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
