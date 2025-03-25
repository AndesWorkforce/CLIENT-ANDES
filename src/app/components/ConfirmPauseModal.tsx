"use client";

import { useRef } from "react";
import { X } from "lucide-react";

interface ConfirmPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isPaused?: boolean;
}

export default function ConfirmPauseModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  cancelButtonText = "Cancelar",
  isPaused = false,
}: ConfirmPauseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const defaultConfirmText = isPaused ? "Sí, Publicar" : "Sí, Pausar";

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <div className="w-6" />
          <h2 className="text-lg font-medium text-center text-[#0097B2]">
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-center">{message}</p>

          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={onConfirm}
              className="w-full py-2.5 px-6 rounded-md font-medium bg-[#0097B2] hover:bg-[#007A8F] text-white cursor-pointer"
            >
              {confirmButtonText || defaultConfirmText}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-6 rounded-md font-medium border border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
