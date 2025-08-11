import React, { useState } from "react";
import { X } from "lucide-react";
import { updateApplicationStatus } from "../actions/update-application-status.server.actions";
import {
  EstadoPostulacion,
  STATUS_TRANSLATIONS,
  AVAILABLE_STATUSES,
} from "../types/application-status.types";
import {
  sendAdvanceNextStep,
  sendContractJobEmail,
  sendInterviewInvitation,
} from "../actions/sendEmail.actions";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  postulacionId: string;
  candidatoId: string;
  currentStatus: EstadoPostulacion;
  candidatoName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicant: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (newStatus: string, applicant: any) => void | Promise<void>;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  postulacionId,
  candidatoId,
  currentStatus,
  candidatoName,
  applicant,
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
        // Determinar el nuevo stage (StageStatus) a partir del selectedStatus
        let newStage: string = "";
        switch (selectedStatus) {
          case "EN_EVALUACION":
            newStage = "FIRST_INTERVIEW_PENDING";
            break;
          case "PRIMERA_ENTREVISTA_REALIZADA":
            newStage = "FIRST_INTERVIEW_COMPLETED";
            break;
          case "EN_EVALUACION_CLIENTE":
            newStage = "SECOND_INTERVIEW_PENDING";
            break;
          case "SEGUNDA_ENTREVISTA_REALIZADA":
            newStage = "SECOND_INTERVIEW_COMPLETED";
            break;
          case "FINALISTA":
            newStage = "FINALIST";
            break;
          case "ACEPTADA":
            newStage = "HIRED";
            break;
          case "RECHAZADA":
            newStage = "TERMINATED";
            break;
          default:
            newStage = "AVAILABLE";
            break;
        }

        // Enviar correo según el nuevo stage
        try {
          switch (newStage) {
            case "FIRST_INTERVIEW_PENDING":
              // await sendInterviewInvitation(applicant.nombre, applicant.correo);
              await sendInterviewInvitation(
                applicant.candidateName,
                applicant.correo
              );
              break;
            case "SECOND_INTERVIEW_PENDING":
              // await sendAdvanceNextStep(applicant.nombre, applicant.correo);
              await sendAdvanceNextStep(applicant.nombre, applicant.correo);
              break;
            case "HIRED":
              // await sendContractJobEmail(applicant.nombre, applicant.correo);
              await sendContractJobEmail(
                applicant.candidateName,
                applicant.correo,
                applicant.titulo
              );
              break;
            case "TERMINATED":
              // await sendRejectionEmail(applicant.nombre, applicant.correo);
              break;
            case "FINALIST":
              // await sendFinalistEmail(applicant.nombre, applicant.correo);
              break;
            // Agrega más casos según los stages que manejes
            default:
              // No enviar correo para otros estados
              break;
          }
        } catch (emailError) {
          // Aquí puedes mostrar una notificación de error de correo
          console.error("Error enviando correo de stage:", emailError);
        }

        // Pasar el nuevo status y el postulante (applicant) al callback
        onUpdate(selectedStatus, applicant);
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
