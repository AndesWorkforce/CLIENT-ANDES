"use client";

import { useRef, useState } from "react";
import { X, Info, Upload } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { savePCRequirementsImages } from "../actions/pc-requirements-actions";

interface PCRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PCRequirementsModal({
  isOpen,
  onClose,
}: PCRequirementsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [pcScreenshot, setPcScreenshot] = useState<File | null>(null);
  const [internetScreenshot, setInternetScreenshot] = useState<File | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Función para subir una imagen al servidor
  const uploadImage = async (file: File, type: string): Promise<string> => {
    try {
      console.log(`[PCRequirements] Subiendo imagen de ${type}...`);

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "andesworkforce");

      // URL del endpoint
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const uploadEndpoint = `${apiBase}files/upload/image/IMAGE`;
      console.log("[PCRequirements] Endpoint de carga:", uploadEndpoint);

      // Realizar la carga con fetch
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      // Comprobar si la respuesta es correcta
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "[PCRequirements] Error en respuesta:",
          response.status,
          errorText
        );
        throw new Error(`Error HTTP: ${response.status}. ${errorText}`);
      }

      // Primero obtenemos la respuesta como texto
      const responseText = await response.text();
      console.log(
        `[PCRequirements] Respuesta del servidor (texto):`,
        responseText
      );

      let fileUrl: string;

      // Intentamos parsear como JSON, pero si falla asumimos que es la URL directa
      try {
        const result = JSON.parse(responseText);
        console.log(`[PCRequirements] Respuesta parseada como JSON:`, result);

        // Si es JSON, extraemos la URL del campo fileUrl
        if (result.fileUrl) {
          fileUrl = result.fileUrl;
        } else if (result.success && result.data) {
          // Otras posibles estructuras de respuesta
          fileUrl = result.data;
        } else {
          throw new Error("La respuesta no contiene una URL de archivo válida");
        }
      } catch (parseError) {
        // Si no es JSON válido, asumimos que el texto es directamente la URL
        console.log(
          `[PCRequirements] La respuesta no es JSON, usando como URL directa`
        );
        fileUrl = responseText.trim();

        // Verificamos que parezca una URL
        if (!fileUrl.startsWith("http")) {
          console.error(
            `[PCRequirements] La respuesta no parece ser una URL válida:`,
            fileUrl
          );
          throw new Error("La respuesta del servidor no es una URL válida");
        }
      }

      console.log(`[PCRequirements] URL final de la imagen:`, fileUrl);
      return fileUrl;
    } catch (error) {
      console.error(
        `[PCRequirements] Error al subir imagen de ${type}:`,
        error
      );
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pcScreenshot || !internetScreenshot) {
      addNotification(
        "Por favor, selecciona ambas capturas de pantalla",
        "error"
      );
      return;
    }

    if (!user?.id) {
      addNotification("No se pudo obtener la información del usuario", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Subir la primera imagen (PC specs)
      const pcImageUrl = await uploadImage(pcScreenshot, "PC specs");
      setUploadProgress(50);

      // Subir la segunda imagen (Internet speed)
      const internetImageUrl = await uploadImage(
        internetScreenshot,
        "Internet speed"
      );
      setUploadProgress(80);

      // Guardar ambas URLs en el perfil del usuario
      const result = await savePCRequirementsImages(
        user.id,
        pcImageUrl,
        internetImageUrl
      );
      setUploadProgress(100);

      if (result.success) {
        addNotification(
          "Requisitos de PC verificados correctamente",
          "success"
        );
        onClose();
      } else {
        throw new Error(result.error || "Error al guardar las imágenes");
      }
    } catch (error) {
      console.error("[PCRequirements] Error en el proceso de carga:", error);
      addNotification(
        error instanceof Error ? error.message : "Error al subir las imágenes",
        "error"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
            Por favor envía capturas de pantalla que confirmen los requisitos
            mínimos de tu PC:
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
              {internetScreenshot && (
                <p className="text-xs text-gray-500 mt-1 pl-2">
                  {internetScreenshot.name}
                </p>
              )}
            </div>
          </div>

          {/* Barra de progreso */}
          {isUploading && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0097B2] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="pt-4 flex flex-col space-y-2">
            <button
              type="submit"
              disabled={!pcScreenshot || !internetScreenshot || isUploading}
              className={`w-full py-2.5 px-6 rounded-md font-medium cursor-pointer ${
                !pcScreenshot || !internetScreenshot || isUploading
                  ? "bg-[#B6B4B4] text-gray-700 cursor-not-allowed"
                  : "bg-[#0097B2] text-white"
              }`}
            >
              {isUploading ? "Subiendo..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className={`text-[#0097B2] py-1 cursor-pointer ${
                isUploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
