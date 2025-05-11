import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { getCandidateActivityLogs } from "../actions/activity.logs.actions";

interface Propuesta {
  id: string;
  titulo: string;
}

interface Log {
  id: string;
  tipoEvento: string;
  descripcion: string;
  fechaEvento: string;
  propuesta?: Propuesta;
  creadoPor: string;
  datosAdicionales?: Record<string, any>;
}

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName?: string;
}

export default function ActivityLogModal({
  isOpen,
  onClose,
  candidateId,
  candidateName,
}: ActivityLogModalProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [postulante, setPostulante] = useState<any>(null);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const { addNotification } = useNotificationStore();

  const fetchCandidateLogs = async () => {
    setIsLoading(true);
    try {
      const response = await getCandidateActivityLogs(candidateId);

      if (!response.success) {
        addNotification(
          "Error loading activity logs: " + response.message,
          "error"
        );
        return;
      }

      setLogs(response.data?.data?.registrosBitacora || []);
      setPostulante(response.data?.data?.postulante || null);
      setTotalRegistros(response.data?.data?.totalRegistros || 0);
    } catch (error) {
      console.error("[Dashboard] Error getting candidate logs:", error);
      addNotification("Error loading activity logs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateLogs();
    }
  }, [isOpen, candidateId]);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Función para obtener el color según el tipo de evento
  const getEventTypeColor = (tipoEvento: string) => {
    switch (tipoEvento) {
      case "POSTULACION_CREADA":
        return "bg-green-100 text-green-800";
      case "POSTULACION_ACTUALIZADA":
        return "bg-blue-100 text-blue-800";
      case "POSTULACION_RECHAZADA":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener una versión amigable del tipo de evento
  const getEventTypeName = (tipoEvento: string) => {
    switch (tipoEvento) {
      case "POSTULACION_CREADA":
        return "Postulación creada";
      case "POSTULACION_ACTUALIZADA":
        return "Postulación actualizada";
      case "POSTULACION_RECHAZADA":
        return "Postulación rechazada";
      default:
        return tipoEvento.replace(/_/g, " ").toLowerCase();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Activity Logs</h3>
          {(postulante || candidateName) && (
            <p className="text-sm text-gray-500">
              {postulante
                ? `${postulante.nombre} ${postulante.apellido}`
                : candidateName}
              's activity
            </p>
          )}
          {totalRegistros > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Total records: {totalRegistros}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097B2]" />
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span
                        className={`text-xs py-1 px-2 rounded-full ${getEventTypeColor(
                          log.tipoEvento
                        )}`}
                      >
                        {getEventTypeName(log.tipoEvento)}
                      </span>
                      {log.propuesta && (
                        <span className="ml-2 text-sm text-gray-600">
                          - {log.propuesta.titulo}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">
                      {formatDate(log.fechaEvento)}
                    </span>
                  </div>
                  <p className="text-gray-700 my-2">{log.descripcion}</p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>Por: {log.creadoPor}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No activity logs found for this candidate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
