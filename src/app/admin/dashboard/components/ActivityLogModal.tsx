//

import { useState, useEffect } from "react";
import { X, Edit2, Trash2, Save, XIcon } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import {
  createManualNote,
  getCandidateActivityLogs,
  updateActivityLog,
  deleteActivityLog,
} from "../actions/activity.logs.actions";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [postulante, setPostulante] = useState<any>(null);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [showAddNote, setShowAddNote] = useState(false);
  const [note, setNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Estados para edición
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados para eliminación
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [logToDelete, setLogToDelete] = useState<Log | null>(null);

  const { addNotification } = useNotificationStore();

  const fetchCandidateLogs = async () => {
    setIsLoading(true);
    try {
      const response = await getCandidateActivityLogs(candidateId);
      console.log("response", response);
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
      console.error("[ActivityLogModal] Error formatting date:", e);
      return dateString;
    }
  };

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

  const getEventTypeName = (tipoEvento: string) => {
    switch (tipoEvento) {
      case "POSTULACION_CREADA":
        return "Postulation created";
      case "POSTULACION_ACTUALIZADA":
        return "Postulation updated";
      case "POSTULACION_RECHAZADA":
        return "Postulation rejected";
      case "NOTA_MANUAL":
        return "Manual note";
      default:
        return tipoEvento.replace(/_/g, " ").toLowerCase();
    }
  };

  // Nueva función para agregar nota manual
  const handleAddNote = async () => {
    if (!note.trim()) return;
    setIsAdding(true);
    try {
      await createManualNote(candidateId, note);
      addNotification("Note added successfully", "success");
      setNote("");
      setShowAddNote(false);
      fetchCandidateLogs();
    } catch (error) {
      console.error("[ActivityLogModal] Error adding note:", error);
      addNotification("Error adding note", "error");
    } finally {
      setIsAdding(false);
    }
  };

  // Nueva función para iniciar edición de un log
  const handleStartEdit = (log: Log) => {
    setEditingLogId(log.id);
    setEditingText(log.descripcion);
  };

  // Nueva función para cancelar edición
  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditingText("");
  };

  // Nueva función para guardar edición
  const handleSaveEdit = async () => {
    if (!editingLogId || !editingText.trim()) return;

    setIsUpdating(true);
    try {
      const result = await updateActivityLog(editingLogId, editingText.trim());
      if (result.success) {
        addNotification("Log updated successfully", "success");
        setEditingLogId(null);
        setEditingText("");
        fetchCandidateLogs();
      } else {
        addNotification(result.message || "Error updating log", "error");
      }
    } catch (error) {
      console.error("[ActivityLogModal] Error updating log:", error);
      addNotification("Error updating log", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Nueva función para confirmar eliminación
  const handleDeleteConfirm = (log: Log) => {
    setLogToDelete(log);
    setShowDeleteConfirm(true);
  };

  // Nueva función para eliminar log
  const handleDeleteLog = async () => {
    if (!logToDelete) return;

    setDeletingLogId(logToDelete.id);
    try {
      const result = await deleteActivityLog(logToDelete.id);
      if (result.success) {
        addNotification("Log deleted successfully", "success");
        setShowDeleteConfirm(false);
        setLogToDelete(null);
        fetchCandidateLogs();
      } else {
        addNotification(result.message || "Error deleting log", "error");
      }
    } catch (error) {
      console.error("[ActivityLogModal] Error deleting log:", error);
      addNotification("Error deleting log", "error");
    } finally {
      setDeletingLogId(null);
    }
  };

  // Nueva función para verificar si un log se puede editar/eliminar
  const canEditLog = (log: Log) => {
    // Solo se pueden editar/eliminar notas manuales
    return log.tipoEvento === "NOTA_MANUAL";
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
              &apos;s activity
            </p>
          )}
          {totalRegistros > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Total records: {totalRegistros}
            </p>
          )}
        </div>

        {/* Add Note Button and Form */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          {!showAddNote ? (
            <button
              className="bg-[#0097B2] text-white px-3 py-1 rounded hover:bg-[#007a8f] text-sm"
              onClick={() => setShowAddNote(true)}
            >
              Add manual note
            </button>
          ) : (
            <div className="flex flex-col w-full gap-2">
              <textarea
                className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                rows={2}
                placeholder="Write a note for the candidate's log..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isAdding}
              />
              <div className="flex gap-2">
                <button
                  className="bg-[#0097B2] text-white px-3 py-1 rounded hover:bg-[#007a8f] text-sm"
                  onClick={handleAddNote}
                  disabled={isAdding || !note.trim()}
                >
                  {isAdding ? "Saving..." : "Save note"}
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                  onClick={() => {
                    setShowAddNote(false);
                    setNote("");
                  }}
                  disabled={isAdding}
                >
                  Cancel
                </button>
              </div>
            </div>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">
                        {formatDate(log.fechaEvento)}
                      </span>
                      {/* Botones de editar y eliminar solo para notas manuales */}
                      {canEditLog(log) && (
                        <div className="flex items-center space-x-1">
                          {editingLogId === log.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={isUpdating || !editingText.trim()}
                                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                title="Save changes"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                title="Cancel editing"
                              >
                                <XIcon size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(log)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit log"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(log)}
                                disabled={deletingLogId === log.id}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                title="Delete log"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenido del log - editable o readonly */}
                  {editingLogId === log.id ? (
                    <div className="my-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
                        rows={3}
                        disabled={isUpdating}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 my-2">{log.descripcion}</p>
                  )}

                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>By: {log.creadoPor}</span>
                    {isUpdating && editingLogId === log.id && (
                      <span className="text-blue-600">Saving...</span>
                    )}
                    {deletingLogId === log.id && (
                      <span className="text-red-600">Deleting...</span>
                    )}
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

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && logToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this log entry? This action cannot
              be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded mb-4">
              <p className="text-sm text-gray-700 italic">
                &quot;{logToDelete.descripcion.substring(0, 100)}
                {logToDelete.descripcion.length > 100 ? "..." : ""}&quot;
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLogToDelete(null);
                }}
                disabled={deletingLogId === logToDelete.id}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLog}
                disabled={deletingLogId === logToDelete.id}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {deletingLogId === logToDelete.id ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
