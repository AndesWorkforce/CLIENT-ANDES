"use client";

import { useRef, useState } from "react";
import { X, Info, Upload, Eye, AlertCircle } from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";
import { saveVideoUrl } from "../actions/video-actions";
import { useAuthStore } from "@/store/auth.store";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
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

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // Maximum file size is 100MB

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
          `The file exceeds the 100MB limit. Current size: ${(
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

  const uploadVideo = async (file: File) => {
    try {
      setUploadState("uploading");
      setUploadProgress(15);

      const formData = new FormData();
      formData.append("file", file);

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const uploadEndpoint = `${apiBase}files/upload-video`;

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 5;
          return next < 90 ? next : prev;
        });
      }, 300);

      try {
        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorText = await response.text();
          setUploadState("error");
          throw new Error(`Error HTTP: ${response.status}. ${errorText}`);
        }

        const result = await response.json();

        if (!result.fileUrl) {
          throw new Error("The response does not contain a valid file URL");
        }

        setUploadProgress(100);
        setUploadUrl(result.fileUrl);
        setUploadState("success");

        return result.fileUrl;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (err) {
      console.error("[VideoUpload] Error durante la carga:", err);
      setUploadState("error");
      throw err instanceof Error
        ? err
        : new Error("Error desconocido durante la carga");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file has been selected");
      return;
    }

    try {
      setError(null);
      await uploadVideo(selectedFile);

      setUploadState("success");
    } catch (err) {
      console.error("[VideoUpload] Error during the upload process:", err);

      if (err instanceof Error) {
        const errorMessage = err.message || "Error during the upload process";
        console.error("[VideoUpload] Error message:", errorMessage);
        setError(errorMessage);
      } else {
        console.error("[VideoUpload] Unknown error:", err);
        setError("Unknown error during the upload process");
      }

      setUploadState("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agreeToTerms && uploadState === "success" && uploadUrl) {
      try {
        setError(null);

        const userId = useAuthStore.getState().user?.id || "";

        if (!userId) {
          setError("Error saving the video: Unable to determine the user ID");
          return;
        }

        const result = await saveVideoUrl(userId, uploadUrl);

        if (!result.success) {
          setError(`Error saving the video: ${result.error}`);
          return;
        }

        onClose();
      } catch (err) {
        console.error("[VideoModal] Unexpected error saving video URL:", err);
        setError("Unexpected error saving the video");
      }
    }
  };

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
          <h2 className="text-[#0097B2] text-lg font-semibold">Upload video</h2>
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
            <span className="font-medium">View instructions</span>
          </button>

          <div className="flex items-start space-x-2 pt-1 border p-3 rounded-lg border-gray-200 bg-gray-50">
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

          <div className="space-y-3">
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={
                !agreeToTerms ||
                uploadState === "uploading" ||
                uploadState === "generating"
              }
            />

            {uploadState === "idle" && (
              <label
                htmlFor="video-upload"
                className={`flex items-center justify-center w-full py-2.5 px-4 rounded-md ${
                  agreeToTerms
                    ? "bg-[#E5F6F8] text-[#0097B2] cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Upload className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {agreeToTerms ? "Upload video" : "Accept the terms to upload"}
                </span>
              </label>
            )}

            {selectedFile && uploadState === "idle" && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">
                  Selected file: {selectedFile.name}
                </p>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full bg-[#0097B2] text-white py-2 px-4 rounded-md cursor-pointer"
                  disabled={!agreeToTerms}
                >
                  Start upload
                </button>
              </div>
            )}

            {(uploadState === "uploading" || uploadState === "generating") && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600">
                  {uploadState === "generating"
                    ? "Preparing upload..."
                    : `Uploading: ${uploadProgress}%`}
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

            {uploadState === "success" && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  Video uploaded successfully!
                </p>
              </div>
            )}

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
                  An error occurred during the upload. Please try again.
                </p>
              </div>
            )}
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
              Save
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
                Cancel
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

                <h4 className="font-medium text-sm">Quick Production Tips</h4>
                <ul className="list-none space-y-1 ml-4 text-sm">
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      Good lighting: Face a window or use a ring light.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span> Clean background: Keep it simple and tidy.</span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      Clear audio: Use headphones with a mic or a quiet space.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      Camera at eye level: Avoid looking down at your laptop.
                    </span>
                  </li>
                </ul>

                <h4 className="font-medium text-sm">
                  Dress Code: Clean & Polished
                </h4>
                <ul className="list-none space-y-1 ml-4 text-sm">
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      Smart casual is your best bet—neat but not overly formal
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      Solid colors work best (avoid busy patterns, stripes, or
                      logos).
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      A collared shirt, blouse, or a nice top works great on
                      camera.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      If you`&lsquo;`re applying to a more traditional company,
                      go a little more polished. If it`&lsquo;`s a startup or
                      creative role, you can keep it more relaxed (but still
                      tidy).
                    </span>
                  </li>
                </ul>

                <h4 className="font-medium text-sm">Hair & Grooming</h4>
                <ul className="list-none space-y-1 ml-4 text-sm">
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      Clean, brushed hair and light grooming go a long way.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      No need to overdo makeup (if you wear it), but a bit of
                      polish helps on camera—just enough to look like you’d show
                      up to a video call ready.
                    </span>
                  </li>
                </ul>

                <h4 className="font-medium text-sm">Hair & Grooming</h4>
                <ul className="list-none space-y-1 ml-4 text-sm">
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      {" "}
                      Clean, brushed hair and light grooming go a long way.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      No need to overdo makeup (if you wear it), but a bit of
                      polish helps on camera—just enough to look like you’d show
                      up to a video call ready.
                    </span>
                  </li>
                </ul>

                <h4 className="font-medium text-sm">Posture & Presence</h4>
                <ul className="list-none space-y-1 ml-4 text-sm">
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span> Sit up straight, shoulders relaxed.</span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      Look into the camera when speaking (not at your own
                      video).
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      Smile warmly—people respond to energy, especially on
                      video!
                    </span>
                  </li>
                </ul>

                <h4 className="font-medium text-sm">Pro Tips</h4>
                <ul className="list-none space-y-1 ml-4 text-sm">
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      Wear something that makes you feel confident—it shows.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      Do a 10-second test recording before the real one to check
                      lighting, sound, and how your outfit looks on camera.
                    </span>
                  </li>
                  <li className="flex items-start font-light">
                    <span className="mr-2">-</span>
                    <span>
                      Avoid anything too reflective or noisy (like clunky
                      jewelry or glossy fabrics).
                    </span>
                  </li>
                </ul>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInstructions(false)}
                    className="w-full bg-[#0097B2] text-white py-3 px-6 rounded-md hover:bg-[#007d93] transition-colors font-medium cursor-pointer"
                  >
                    I understand
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
