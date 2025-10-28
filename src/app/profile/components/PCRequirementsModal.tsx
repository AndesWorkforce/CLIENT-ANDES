"use client";

import { useEffect, useRef, useState } from "react";
import { X, Info, Upload } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { savePCRequirementsImages } from "../actions/pc-requirements-actions";

interface PCRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
  imagenRequerimientosPC?: string;
  imagenTestVelocidad?: string;
}

export default function PCRequirementsModal({
  isOpen,
  onClose,
  candidateId,
  imagenRequerimientosPC,
  imagenTestVelocidad,
}: PCRequirementsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [pcScreenshot, setPcScreenshot] = useState<File | null>(null);
  const [internetScreenshot, setInternetScreenshot] = useState<File | null>(
    null
  );
  const [pcPreviewUrl, setPcPreviewUrl] = useState<string | null>(
    imagenRequerimientosPC || null
  );
  const [internetPreviewUrl, setInternetPreviewUrl] = useState<string | null>(
    imagenTestVelocidad || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setPcPreviewUrl(imagenRequerimientosPC || null);
    setInternetPreviewUrl(imagenTestVelocidad || null);
  }, [imagenRequerimientosPC, imagenTestVelocidad]);

  useEffect(() => {
    return () => {
      // Solo revocamos las URLs si son URLs de objeto local
      if (pcPreviewUrl && pcPreviewUrl.startsWith("blob:"))
        URL.revokeObjectURL(pcPreviewUrl);
      if (internetPreviewUrl && internetPreviewUrl.startsWith("blob:"))
        URL.revokeObjectURL(internetPreviewUrl);
    };
  }, [pcPreviewUrl, internetPreviewUrl]);

  const handlePcScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPcScreenshot(file);

      if (pcPreviewUrl) URL.revokeObjectURL(pcPreviewUrl);
      setPcPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInternetScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInternetScreenshot(file);

      if (internetPreviewUrl) URL.revokeObjectURL(internetPreviewUrl);
      setInternetPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File, type: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "images");

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const uploadEndpoint = `${apiBase}files/upload/image/IMAGE`;

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Ahora el endpoint devuelve directamente la URL pública
      const publicUrl = await response.text();
      return publicUrl;
    } catch (error) {
      console.error(
        `[PCRequirements] Error uploading image of ${type}:`,
        error
      );
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que al menos tengamos una imagen para PC y una para internet (ya sea nueva o existente)
    if (
      (!pcScreenshot && !pcPreviewUrl) ||
      (!internetScreenshot && !internetPreviewUrl)
    ) {
      addNotification("Please select both screenshots", "error");
      return;
    }

    if (!user?.id) {
      addNotification("Unable to get user information", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    console.log("[PCRequirements] Iniciando el proceso de subida de imágenes");
    try {
      // Subir imagen de PC solo si hay un archivo nuevo
      let pcImageUrl = pcPreviewUrl || "";
      if (pcScreenshot) {
        pcImageUrl = await uploadImage(pcScreenshot, "PC specs");
        console.log("[PCRequirements] URL de la imagen de PC:", pcImageUrl);
      }
      setUploadProgress(50);

      // Subir imagen de internet solo si hay un archivo nuevo
      let internetImageUrl = internetPreviewUrl || "";
      if (internetScreenshot) {
        internetImageUrl = await uploadImage(
          internetScreenshot,
          "Internet speed"
        );
        console.log(
          "[PCRequirements] URL de la imagen de internet:",
          internetImageUrl
        );
      }
      setUploadProgress(80);

      const result = await savePCRequirementsImages(
        candidateId || user.id,
        pcImageUrl,
        internetImageUrl
      );
      setUploadProgress(100);

      console.log("[PCRequirements] Resultado de la operación:", result);

      if (result.success) {
        console.log("[PCRequirements] Notificación de éxito enviada");
        addNotification("PC requirements verified correctly", "success");
        onClose();
      } else {
        throw new Error(result.error || "Error saving the images");
      }
    } catch (error) {
      console.error("[PCRequirements] Error in the upload process:", error);
      addNotification(
        error instanceof Error ? error.message : "Error uploading the images",
        "error"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-4 py-3">
          <div className="w-6" />
          <h2 className="text-[#0097B2] text-lg font-semibold">
            PC Requirements
          </h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 flex-1 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-700 text-sm">
              Please send screenshots that confirm your minimum PC requirements:
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-2">
                <div className="text-blue-500 mt-0.5 flex-shrink-0">
                  <Info size={18} />
                </div>
                <span className="font-medium text-blue-800">
                  Important Information
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

            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  id="pc-screenshot"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePcScreenshotChange}
                  disabled={isUploading}
                />
                <label
                  htmlFor="pc-screenshot"
                  className={`flex items-center justify-between w-full bg-white border border-gray-300 py-3 px-15 rounded-md cursor-pointer ${
                    isUploading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                  style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                >
                  <span className="text-[#6D6D6D] font-bold">
                    Screenshot PC specs
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[#0097B2] flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </label>
                {pcPreviewUrl && (
                  <div className="mt-2">
                    <div className="flex flex-col">
                      <img
                        src={pcPreviewUrl}
                        alt="PC Screenshot Preview"
                        className="h-32 w-full object-contain rounded border border-gray-300 mb-1"
                      />
                      <p className="text-xs text-gray-500">
                        {pcScreenshot?.name || "Current PC specs screenshot"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  id="internet-screenshot"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInternetScreenshotChange}
                  disabled={isUploading}
                />
                <label
                  htmlFor="internet-screenshot"
                  className={`flex items-center justify-between w-full bg-white border border-gray-300 py-3 px-15 rounded-md cursor-pointer ${
                    isUploading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                  style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                >
                  <span className="text-[#6D6D6D] font-bold">
                    Screenshot internet speed
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[#0097B2] flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </label>
                {internetPreviewUrl && (
                  <div className="mt-2">
                    <div className="flex flex-col">
                      <img
                        src={internetPreviewUrl}
                        alt="Internet Speed Preview"
                        className="h-32 w-full object-contain rounded border border-gray-300 mb-1"
                      />
                      <p className="text-xs text-gray-500">
                        {internetScreenshot?.name ||
                          "Current internet speed screenshot"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0097B2] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </form>
        </div>

        <div className="pt-4 px-4 pb-4 bg-white">
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleSubmit}
              disabled={
                (!pcScreenshot && !pcPreviewUrl) ||
                (!internetScreenshot && !internetPreviewUrl) ||
                isUploading
              }
              className={`w-full py-2.5 px-6 rounded-md font-medium cursor-pointer ${
                (!pcScreenshot && !pcPreviewUrl) ||
                (!internetScreenshot && !internetPreviewUrl) ||
                isUploading
                  ? "bg-[#B6B4B4] text-gray-700 cursor-not-allowed"
                  : "bg-[#0097B2] text-white"
              }`}
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className={`text-[#0097B2] py-1 cursor-pointer ${
                isUploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
