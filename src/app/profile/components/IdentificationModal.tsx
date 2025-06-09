"use client";

import { useEffect, useRef, useState } from "react";
import { X, Info, Upload } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { saveIdentificationImages } from "../actions/identification-actions";
import { useProfileContext } from "../context/ProfileContext";

interface IdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
}

export default function IdentificationModal({
  isOpen,
  onClose,
  candidateId,
}: IdentificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { profile } = useProfileContext();
  const { addNotification } = useNotificationStore();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);

  console.log("[IdentificationModal] uploadProgress:", uploadProgress);

  const uploadImage = async (
    file: File | null,
    type: string
  ): Promise<string> => {
    if (!file) {
      throw new Error("No se puede subir una imagen nula");
    }
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

      const publicUrl = await response.text();
      return publicUrl;
    } catch (error) {
      console.error(
        `[IdentificationModal] Error uploading image of ${type}:`,
        error
      );
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (frontPreviewUrl) URL.revokeObjectURL(frontPreviewUrl);
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    };
  }, [frontPreviewUrl, backPreviewUrl]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontImage(file);

      if (frontPreviewUrl) URL.revokeObjectURL(frontPreviewUrl);
      setFrontPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackImage(file);

      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
      setBackPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id && !candidateId) {
      console.error("[IdentificationModal] No user ID available");
      return;
    }

    if (!frontImage && !backImage) {
      addNotification("Please select at least one image", "error");
      return;
    }

    console.log("[IdentificationModal] Front image:", frontImage);
    console.log("[IdentificationModal] Back image:", backImage);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const frontImageUrl = await uploadImage(frontImage, "Front photo");
      setUploadProgress(50);

      console.log(
        "[IdentificationModal] URL de la imagen de front:",
        frontImageUrl
      );
      const backImageUrl = await uploadImage(backImage, "Back photo");
      setUploadProgress(80);

      console.log(
        "[IdentificationModal] URL de la imagen de back:",
        backImageUrl
      );

      const userId = candidateId || user?.id;
      if (!userId) return;

      const result = await saveIdentificationImages(
        userId,
        frontImageUrl,
        backImageUrl
      );

      if (result.success) {
        addNotification("Images uploaded successfully", "success");
        onClose();
      } else {
        addNotification(`Error uploading images: ${result.error}`, "error");
      }
    } catch (error) {
      console.error("[IdentificationModal] Error:", error);
      addNotification("An unexpected error occurred", "error");
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
        className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="w-6" />
          <h2 className="text-[#0097B2] text-lg font-semibold">
            Identity Document
          </h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 flex-1 custom-scrollbar">
          {!showUploadForm &&
          profile.archivos?.fotoCedulaFrente &&
          profile.archivos?.fotoCedulaDorso ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Front Photo
                  </h3>
                  <div className="aspect-[3/2] rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={profile.archivos.fotoCedulaFrente}
                      alt="ID Front"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Back Photo
                  </h3>
                  <div className="aspect-[3/2] rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={profile.archivos.fotoCedulaDorso}
                      alt="ID Back"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm mb-4">
                  If you want to change your document photos, you need to upload
                  new images.
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-[#0097B2] text-white px-4 py-2 rounded-md hover:bg-[#007d8a] transition-colors"
                >
                  Upload New Photos
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-700 text-sm">
                Please upload your identity document images:
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
                  <ul className="space-y-1 pl-5 list-disc text-blue-700">
                    <li>Make sure the images are clear and legible</li>
                    <li>The document must be valid</li>
                    <li>All corners of the document must be visible</li>
                    <li>Avoid reflections or shadows in the photos</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    id="front-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFrontImageChange}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="front-image"
                    className={`flex items-center justify-between w-full bg-white border border-gray-300 py-3 px-4 rounded-md cursor-pointer ${
                      isUploading
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-[#6D6D6D] font-medium">
                      Front photo of document
                    </span>
                    <div className="h-8 w-8 rounded-full bg-[#0097B2] flex items-center justify-center">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                  </label>
                  {frontImage && frontPreviewUrl && (
                    <div className="mt-2">
                      <div className="flex flex-col">
                        <img
                          src={frontPreviewUrl}
                          alt="Front preview"
                          className="h-32 w-full object-contain rounded border border-gray-300 mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          {frontImage.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    id="back-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBackImageChange}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="back-image"
                    className={`flex items-center justify-between w-full bg-white border border-gray-300 py-3 px-4 rounded-md cursor-pointer ${
                      isUploading
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-[#6D6D6D] font-medium">
                      Back photo of document
                    </span>
                    <div className="h-8 w-8 rounded-full bg-[#0097B2] flex items-center justify-center">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                  </label>
                  {backImage && backPreviewUrl && (
                    <div className="mt-2">
                      <div className="flex flex-col">
                        <img
                          src={backPreviewUrl}
                          alt="Back preview"
                          className="h-32 w-full object-contain rounded border border-gray-300 mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          {backImage.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007d8a] transition-colors disabled:opacity-50"
                  disabled={isUploading || (!frontImage && !backImage)}
                >
                  {isUploading ? "Uploading..." : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
