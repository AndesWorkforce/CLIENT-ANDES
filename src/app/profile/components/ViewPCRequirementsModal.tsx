"use client";

import { useRef, useState } from "react";
import { X, Monitor, Wifi, ChevronLeft } from "lucide-react";

interface ViewPCRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewPCRequirementsModal({
  isOpen,
  onClose,
}: ViewPCRequirementsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCapturas, setShowCapturas] = useState(false);
  const [activeCaptura, setActiveCaptura] = useState<"pc" | "internet" | null>(
    null
  );

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (activeCaptura) {
        setActiveCaptura(null);
      } else if (showCapturas) {
        setShowCapturas(false);
      } else {
        onClose();
      }
    }
  };

  const handleVerCapturas = () => {
    setShowCapturas(true);
  };

  const handleVolverDeCaptura = () => {
    setActiveCaptura(null);
  };

  const handleVolverACapturas = () => {
    setShowCapturas(false);
  };

  const verCapturaPC = () => {
    setActiveCaptura("pc");
  };

  const verCapturaInternet = () => {
    setActiveCaptura("internet");
  };

  if (!isOpen) return null;

  // Renderizar modal de captura específica (PC specs o Internet speed)
  if (activeCaptura) {
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
            <button
              onClick={handleVolverDeCaptura}
              className="absolute left-4 text-gray-400 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-medium w-full text-center text-[#0097B2]">
              {activeCaptura === "pc" ? "PC specs" : "Internet speed"}
            </h2>
            <button
              onClick={() => setActiveCaptura(null)}
              className="absolute right-4 text-gray-400 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            {activeCaptura === "pc" ? (
              <div className="flex justify-center items-center">
                <img
                  src="/pc-specs.png"
                  alt="PC Specifications"
                  className="w-full rounded-md"
                  onError={(e) => {
                    // Fallback para cuando la imagen no se encuentra
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/350x200?text=PC+Specifications";
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <img
                  src="/internet-speed.png"
                  alt="Internet Speed Test"
                  className="w-full rounded-md"
                  onError={(e) => {
                    // Fallback para cuando la imagen no se encuentra
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/350x200?text=Internet+Speed+Test";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar lista de capturas
  if (showCapturas) {
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
            <button
              onClick={handleVolverACapturas}
              className="absolute left-4 text-gray-400 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-medium w-full text-center text-[#0097B2]">
              Capturas verificadas
            </h2>
            <button
              onClick={() => setShowCapturas(false)}
              className="absolute right-4 text-gray-400 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4">
            <div
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={verCapturaPC}
            >
              <div className="p-3 bg-white border-b">
                <h3 className="text-sm font-medium text-center">PC specs</h3>
              </div>
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img
                  src="/pc-specs-thumb.png"
                  alt="PC Specifications"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para cuando la imagen no se encuentra
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150x100?text=PC+Specs";
                  }}
                />
              </div>
            </div>

            <div
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={verCapturaInternet}
            >
              <div className="p-3 bg-white border-b">
                <h3 className="text-sm font-medium text-center">
                  Internet speed
                </h3>
              </div>
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img
                  src="/internet-speed-thumb.png"
                  alt="Internet Speed Test"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para cuando la imagen no se encuentra
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150x100?text=Internet+Speed";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar modal principal
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
            Requerimientos PC
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 bg-[#07A836] rounded-full flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              ¡Requerimientos verificados!
            </h3>
            <p className="text-gray-600 mt-2">
              Has subido correctamente las capturas de pantalla que verifican
              los requerimientos de tu PC.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Monitor className="text-[#0097B2] mr-2" size={20} />
                <h4 className="font-medium text-[#0097B2]">
                  Especificaciones PC
                </h4>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Captura de pantalla verificada
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Wifi className="text-[#0097B2] mr-2" size={20} />
                <h4 className="font-medium text-[#0097B2]">
                  Velocidad de Internet
                </h4>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Captura de pantalla verificada
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            <button
              type="button"
              className="w-full py-2 px-4 bg-[#0097B2] text-white font-medium rounded-md"
              onClick={handleVerCapturas}
            >
              Ver capturas
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 border border-[#0097B2] text-[#0097B2] font-medium rounded-md"
            >
              Actualizar capturas
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
