"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, UserCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { useProfileContext } from "../context/ProfileContext";

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  candidateId,
}: ProfilePhotoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { profile } = useProfileContext();
  const { addNotification } = useNotificationStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentPhoto = profile.datosPersonales.fotoPerfil;

  // Clean up preview URL on unmount or modal close
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (!isUploading) onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are accepted.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `The image exceeds the 5 MB limit. Current size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)} MB.`
      );
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const userId = candidateId || user?.id;
    if (!userId) {
      setError("Unable to determine the user ID.");
      return;
    }

    try {
      setError(null);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(`/api/users/${userId}/profile-photo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Error saving the profile photo.");
        return;
      }

      addNotification("Profile photo updated successfully!", "success");
      handleClose();
    } catch (err) {
      console.error("[ProfilePhotoModal] Error:", err);
      setError(
        err instanceof Error ? err.message : "Unexpected error during upload."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    const userId = candidateId || user?.id;
    if (!userId) return;

    try {
      setIsUploading(true);

      const response = await fetch(`/api/users/${userId}/profile-photo`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        addNotification(data.error || "Error removing the photo.", "error");
        return;
      }

      addNotification("Profile photo removed.", "success");
      handleClose();
    } catch (err) {
      console.error("[ProfilePhotoModal] Error removing photo:", err);
      addNotification("Unexpected error removing the photo.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
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
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="w-6" />
          <h2 className="text-[#0097B2] text-lg font-semibold">
            Profile Photo
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 cursor-pointer"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          <p className="text-gray-600 text-sm">
            Upload a clear photo of your face. Accepted formats: JPG, PNG,
            WEBP. Maximum size: 5 MB.
          </p>

          {/* Current / Preview photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#0097B2] bg-gray-100 flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : currentPhoto ? (
                <Image
                  src={currentPhoto}
                  alt="Current profile photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <UserCircle size={64} className="text-gray-300" />
              )}
            </div>

            {/* File input */}
            <label
              htmlFor="profile-photo-input"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0097B2] text-[#0097B2] text-sm font-medium cursor-pointer hover:bg-blue-50 transition-colors ${
                isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Upload size={16} />
              {selectedFile ? "Change photo" : "Select photo"}
            </label>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {selectedFile && (
              <p className="text-xs text-gray-500 text-center">
                {selectedFile.name} (
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {currentPhoto && !selectedFile && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="flex items-center gap-1 flex-1 justify-center py-2.5 rounded-lg border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={15} />
                Remove
              </button>
            )}

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="flex-1 py-2.5 rounded-lg bg-[#0097B2] text-white text-sm font-medium hover:bg-[#007a91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? "Uploading..." : "Save photo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
