"use client";

import { useRef, useState } from "react";
import { X, Info, Upload } from "lucide-react";

interface PCRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function PCRequirementsModal({
  isOpen,
  onClose,
  onSave,
}: PCRequirementsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pcScreenshot, setPcScreenshot] = useState<File | null>(null);
  const [internetScreenshot, setInternetScreenshot] = useState<File | null>(
    null
  );

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handlePcScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPcScreenshot(e.target.files[0]);
    }
  };

  const handleInternetScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setInternetScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
    onClose();
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
        <div className="flex justify-between items-center px-4 py-3">
          <div className="w-6" />
          <h2 className="text-[#0097B2] text-lg font-semibold">
            Requerimientos PC
          </h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          <p className="text-gray-700 text-sm">
            Please send me a screenshot from your computer confirming the
            minimum PC requirements:
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start space-x-2 mb-2">
              <div className="text-blue-500 mt-0.5 flex-shrink-0">
                <Info size={18} />
              </div>
              <span className="font-medium text-blue-800">
                Información Importante
              </span>
            </div>

            <div className="space-y-3 text-sm text-blue-800 pl-6">
              <div>
                <p className="font-medium">PC Specs</p>
                <ul className="space-y-1 pl-5 list-disc text-blue-700">
                  <li>Windows 10/11 -or- Mac OS (≥ (or higher)</li>
                  <li>32 GB + of Free Hard Drive/Storage Space</li>
                  <li>1.6 GHz + Processor</li>
                  <li>4 GB + RAM</li>
                </ul>
              </div>

              <div>
                <p className="font-medium">Internet</p>
                <ul className="space-y-1 pl-5 list-disc text-blue-700">
                  <li>
                    25 Mbps + Download / 10 Mbps + Upload Speed
                    <br />
                    (can be checked using this link:{" "}
                    <a
                      href="https://www.speedtest.net/"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.speedtest.net/
                    </a>
                    )
                  </li>
                  <li>
                    Wired/Direct Connection to Modem/Router
                    <br />
                    (WiFi connection not recommended)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones para subir capturas */}
          <div className="space-y-3">
            <div>
              <input
                type="file"
                id="pc-screenshot"
                accept="image/*"
                className="hidden"
                onChange={handlePcScreenshotChange}
              />
              <label
                htmlFor="pc-screenshot"
                className="flex items-center justify-between w-full bg-white border border-gray-300 py-3 px-15 rounded-md cursor-pointer hover:bg-gray-50"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span className="text-[#6D6D6D] font-bold">
                  Screenshot PC specs
                </span>
                <div className="h-8 w-8 rounded-full bg-[#0097B2] flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </label>
              {pcScreenshot && (
                <p className="text-xs text-gray-500 mt-1 pl-2">
                  {pcScreenshot.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="file"
                id="internet-screenshot"
                accept="image/*"
                className="hidden"
                onChange={handleInternetScreenshotChange}
              />
              <label
                htmlFor="internet-screenshot"
                className="flex items-center justify-between w-full bg-white border border-gray-300 py-3 px-15 rounded-md cursor-pointer hover:bg-gray-50"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span className="text-[#6D6D6D] font-bold">
                  Screenshot internet speed
                </span>
                <div className="h-8 w-8 rounded-full bg-[#0097B2] flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </label>
              {internetScreenshot && (
                <p className="text-xs text-gray-500 mt-1 pl-2">
                  {internetScreenshot.name}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-col space-y-2">
            <button
              type="submit"
              disabled={!pcScreenshot || !internetScreenshot}
              className={`w-full py-2.5 px-6 rounded-md font-medium ${
                !pcScreenshot || !internetScreenshot
                  ? "bg-[#B6B4B4] text-gray-700 cursor-not-allowed"
                  : "bg-[#0097B2] text-white"
              }`}
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#0097B2] py-1 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
