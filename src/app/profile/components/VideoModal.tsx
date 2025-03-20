"use client";

import { useRef, useState } from "react";
import { X, Info, Upload, Eye, AlertCircle } from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function VideoModal({
  isOpen,
  onClose,
  onSave,
}: VideoModalProps) {
  const { profile } = useProfileContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<
    "idle" | "generating" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadUrl, setUploadUrl] = useState<string | null>(
    profile.archivos.videoPresentacion
  );
  const [error, setError] = useState<string | null>(null);
  console.log("uploadUrl", uploadUrl);
  // 100MB en bytes
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      // Prevenir cierre durante carga
      if (uploadState === "uploading" || uploadState === "generating") {
        return;
      }
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `El archivo excede el límite de 100MB. Tamaño actual: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const generateUploadUrl = async (filename: string) => {
    try {
      setUploadState("generating");
      // Reemplazar con la URL correcta de tu API
      const response = await fetch(
        `/api/files/generate-upload-url/video?filename=${encodeURIComponent(
          filename
        )}`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error("Error generando URL de carga:", err);
      throw new Error("No se pudo generar la URL para subir el video");
    }
  };

  const uploadToCloudflare = async (url: string, file: File) => {
    return new Promise<string>((resolve, reject) => {
      try {
        setUploadState("uploading");
        setUploadProgress(0);

        // Usar XMLHttpRequest para poder mostrar el progreso
        const xhr = new XMLHttpRequest();

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadState("success");
            const finalUrl = url.split("?")[0]; // Guardamos la URL base sin los parámetros
            setUploadUrl(finalUrl);
            resolve(finalUrl);
          } else {
            setUploadState("error");
            reject(new Error(`Error HTTP: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          setUploadState("error");
          reject(new Error("Error al subir el video a Cloudflare"));
        };

        xhr.send(file);
      } catch (err: unknown) {
        console.error("Error subiendo a Cloudflare:", err);
        setUploadState("error");
        reject(new Error("Error al subir el video a Cloudflare"));
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setError(null);
      const uploadUrl = await generateUploadUrl(selectedFile.name);
      setUploadUrl(uploadUrl);
      await uploadToCloudflare(uploadUrl, selectedFile);
    } catch (err) {
      console.log("err", err);
      if (err instanceof Error) {
        setError(err.message || "Error durante la carga");
      } else {
        setError("Error desconocido durante la carga");
      }
      setUploadState("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreeToTerms && uploadState === "success") {
      // Pasaríamos la URL del video subido si fuera necesario
      onSave();
      onClose();
    }
  };

  // Reset states cuando se cierra el modal
  const handleReset = () => {
    setSelectedFile(null);
    setUploadState("idle");
    setUploadProgress(0);
    setUploadUrl(null);
    setError(null);
  };

  const closeModal = () => {
    handleReset();
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
        <div className="flex justify-between items-center px-4 py-3 ">
          <div className="w-6" />
          <h2 className="text-[#0097B2] text-lg font-semibold">Subir video</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 cursor-pointer"
            disabled={
              uploadState === "uploading" || uploadState === "generating"
            }
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3.5">
          <p className="text-gray-700 text-sm">
            Please send a short video (1.5 minutes max) explaining what makes
            you a good candidate for this position.
          </p>
          <p className="text-red-500 font-bold text-sm">Maximum size 100MB</p>

          <div className="bg-[#FEF9C3] border border-[#F7E99E] rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <div className="text-[#CA8A04] mt-0.5">
                <Info size={18} />
              </div>
              <div>
                <h4 className="text-[#854D0E] font-medium text-sm">Warning</h4>
                <p className="text-[#854D0E] text-sm">
                  Please read the instructions carefully for making the video
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowInstructions(true)}
            className="flex items-center justify-center w-full bg-[#0097B2] text-white py-2.5 px-4 rounded-md cursor-pointer"
          >
            <Eye className="h-5 w-5 mr-2" />
            <span className="font-medium">Ver instrucciones</span>
          </button>

          {/* Selector de archivo y botón de carga */}
          <div className="space-y-3">
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={
                uploadState === "uploading" || uploadState === "generating"
              }
            />

            {uploadState === "idle" && (
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center w-full bg-[#E5F6F8] text-[#0097B2] py-2.5 px-4 rounded-md cursor-pointer"
              >
                <Upload className="h-5 w-5 mr-2" />
                <span className="font-medium">Subir video</span>
              </label>
            )}

            {selectedFile && uploadState === "idle" && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">
                  Archivo seleccionado: {selectedFile.name}
                </p>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full bg-[#0097B2] text-white py-2 px-4 rounded-md cursor-pointer"
                >
                  Comenzar carga
                </button>
              </div>
            )}

            {/* Barra de progreso */}
            {(uploadState === "uploading" || uploadState === "generating") && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600">
                  {uploadState === "generating"
                    ? "Preparando carga..."
                    : `Cargando: ${uploadProgress}%`}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#0097B2] h-2.5 rounded-full"
                    style={{
                      width:
                        uploadState === "generating"
                          ? "15%"
                          : `${uploadProgress}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Estado de éxito */}
            {uploadState === "success" && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  ¡Video cargado exitosamente!
                </p>
              </div>
            )}

            {/* Mensajes de error */}
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {uploadState === "error" && !error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">
                  Ocurrió un error durante la carga. Por favor intenta
                  nuevamente.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              className="mt-1 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              Disclosure: by sharing your personal video with Andes Workforce
              you agree to share your personal information and resume with your
              potential employer in efforts to find you a long-term job.
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={!agreeToTerms || uploadState !== "success"}
              className={`w-full py-2.5 px-6 rounded-md font-medium cursor-pointer ${
                !agreeToTerms || uploadState !== "success"
                  ? "bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-[#0097B2] text-white"
              }`}
            >
              Guardar
            </button>
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={closeModal}
                className="text-[#0097B2] py-1 cursor-pointer"
                disabled={
                  uploadState === "uploading" || uploadState === "generating"
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>

        {showInstructions && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-lg custom-scrollbar">
              <div className="flex items-center p-4 relative border-b">
                <h2 className="text-lg font-medium w-full text-center">
                  Introductory Video Instructions
                </h2>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute right-4 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-gray-700 text-sm">
                  Thank you for taking the time to apply with us, we hope that
                  you&apos;ll become part of our growing team very soon. As part
                  of our recruitment process, we recommend that you record a 1
                  to 2-minute video introducing yourself. We recommend using
                  www.loom.com, but it is not required.
                </p>

                <p className="text-gray-700 text-sm">
                  When recording, try to speak in a natural and relaxed manner
                  and include the following information:
                </p>

                <div className="space-y-2 text-gray-700 text-sm">
                  <h4 className="font-medium">Basic personal information</h4>
                  <ul className="list-none space-y-1 ml-4">
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Full name</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Where do you live</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Education</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Work experience and skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Most recent jobs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Brief description of daily duties</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>
                        Goals at previous jobs and how you achieved them
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Skills and software knowledge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Describe your best qualities</span>
                    </li>
                  </ul>

                  <h4 className="font-medium">Technical specifications</h4>
                  <ul className="list-none space-y-1 ml-4">
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Describe your home office setup</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>Internet speed</span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700 text-sm">
                  Finish your video and send us the generated link to:
                  info@andes-workforce.com and mention@teamandes.com
                </p>
                <p className="text-gray-700 text-sm">
                  Subject line: &quot;Your Name&quot; Introductory Video
                  DON&apos;T FORGET TO INCLUDE THE LINK
                </p>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInstructions(false)}
                    className="w-full bg-[#0097B2] text-white py-3 px-6 rounded-md hover:bg-[#007d93] transition-colors font-medium cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
