import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

type ActionType = "remove" | "activate";

interface CandidateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidateName: string;
  action: ActionType;
}

export default function CandidateActionModal({
  isOpen,
  onClose,
  onConfirm,
  candidateName,
  action,
}: CandidateActionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const getTitle = () => {
    return action === "remove" ? "Eliminar Candidato" : "Activar Candidato";
  };

  const getMessage = () => {
    return action === "remove"
      ? `¿Estás seguro que deseas eliminar a ${candidateName}? Esta acción no se puede deshacer.`
      : `¿Estás seguro que deseas activar a ${candidateName}? El candidato recuperará acceso a la plataforma.`;
  };

  const getButtonText = () => {
    return action === "remove" ? "Eliminar" : "Activar";
  };

  const getButtonClass = () => {
    return action === "remove"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700";
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error al procesar la acción:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{getTitle()}</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle
              size={24}
              className={
                action === "remove" ? "text-red-500" : "text-green-500"
              }
            />
            <p className="ml-3 text-gray-700">{getMessage()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 text-white rounded-md ${getButtonClass()} disabled:opacity-50 flex items-center`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Procesando...
              </>
            ) : (
              getButtonText()
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
