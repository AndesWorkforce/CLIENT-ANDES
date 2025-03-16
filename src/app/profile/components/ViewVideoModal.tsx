"use client";

import { useRef } from "react";
import { X, Play } from "lucide-react";

interface ViewVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewVideoModal({
  isOpen,
  onClose,
}: ViewVideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
        className="bg-white w-full max-w-md rounded-lg overflow-hidden"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="flex items-center p-4 relative border-b border-gray-200">
          <div className="w-6"></div>
          <h2 className="text-lg font-medium w-full text-center text-[#0097B2]">
            Video Presentación
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-100 h-48 rounded-md flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full bg-[#0097B2] flex items-center justify-center opacity-80">
              <Play className="w-8 h-8 text-white" fill="white" />
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white px-2 py-1 rounded-md">
              1:30
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              ¡Video subido!
            </h3>
            <p className="text-gray-600 mt-2">
              Tu video de presentación se subió correctamente. Si necesitas
              reemplazarlo, puedes hacerlo desde aquí.
            </p>
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            <button
              type="button"
              className="w-full py-2 px-4 bg-[#0097B2] text-white font-medium rounded-md"
            >
              Reproducir video
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 border border-[#0097B2] text-[#0097B2] font-medium rounded-md"
            >
              Reemplazar video
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-[#0097B2] py-1"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
