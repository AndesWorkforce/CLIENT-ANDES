"use client";

import { useRef, useState } from "react";
import { X, Monitor, Wifi, ChevronLeft } from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";

interface ViewPCRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewPCRequirementsModal({
  isOpen,
  onClose,
}: ViewPCRequirementsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfileContext();
  const [showCapturas, setShowCapturas] = useState(false);
  const [activeCaptura, setActiveCaptura] = useState<"pc" | "internet" | null>(
    null
  );

  const pcSpecsImageUrl = profile.archivos.imagenRequerimientosPC || "";
  const internetSpeedImageUrl = profile.archivos.imagenTestVelocidad || "";

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
                  src={pcSpecsImageUrl}
                  alt="PC Specifications"
                  className="w-full rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/350x200?text=PC+Specifications";
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <img
                  src={internetSpeedImageUrl}
                  alt="Internet Speed Test"
                  className="w-full rounded-md"
                  onError={(e) => {
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
              Verified screenshots
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
                  src={pcSpecsImageUrl}
                  alt="PC Specifications"
                  className="w-full h-full object-cover"
                  onError={(e) => {
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
                  src={internetSpeedImageUrl}
                  alt="Internet Speed Test"
                  className="w-full h-full object-cover"
                  onError={(e) => {
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

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="flex items-center p-4 relative border-b border-gray-200">
          <div className="w-6"></div>
          <h2 className="text-lg font-medium w-full text-center text-[#0097B2]">
            PC Requirements
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
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
                PC Requirements verified!
              </h3>
              <p className="text-gray-600 mt-2">
                You have uploaded the screenshots that verify your PC
                requirements correctly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Monitor className="text-[#0097B2] mr-2" size={20} />
                  <h4 className="font-medium text-[#0097B2]">
                    PC Specifications
                  </h4>
                </div>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  Verified screenshot
                </p>

                <div className="rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={pcSpecsImageUrl}
                    alt="PC Specifications"
                    className="w-full object-contain"
                    style={{ maxHeight: "200px" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/350x200?text=PC+Specifications";
                    }}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Wifi className="text-[#0097B2] mr-2" size={20} />
                  <h4 className="font-medium text-[#0097B2]">Internet speed</h4>
                </div>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  Verified screenshot
                </p>

                <div className="rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={internetSpeedImageUrl}
                    alt="Internet Speed Test"
                    className="w-full object-contain"
                    style={{ maxHeight: "200px" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/350x200?text=Internet+Speed+Test";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col space-y-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[#0097B2] py-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
