"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  currentStatus: boolean;
}

export default function ConfirmStatusModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  currentStatus,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-[#17323A] mb-4">
          Confirmar cambio de estado
        </h3>
        <p className="text-sm text-[#17323A] mb-6">
          ¿Estás seguro que deseas {currentStatus ? "desactivar" : "activar"} al
          usuario <span className="font-semibold">{userName}</span>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#17323A] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0097B2] hover:bg-[#007B8E] rounded-lg transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
