"use client";

import { useRef, useState } from "react";
import { X, Play, Trash2 } from "lucide-react";
import { useProfileContext } from "../context/ProfileContext";
import { removeVideoPresentation } from "../actions/video-actions";
import { useNotificationStore } from "@/store/notifications.store";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useAuthStore } from "@/store/auth.store";

interface ViewVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewVideoModal({
  isOpen,
  onClose,
}: ViewVideoModalProps) {
  const { user } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { profile } = useProfileContext();
  const videoUrl = profile.archivos.videoPresentacion;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  const handleDeleteVideo = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteVideo = async () => {
    if (user?.id) {
      try {
        const result = await removeVideoPresentation(user.id);

        if (result.success) {
          addNotification(
            "Video de presentación eliminado correctamente",
            "success"
          );
        } else {
          addNotification(
            `Error deleting the video presentation: ${result.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error(
          "[ViewVideoModal] Error deleting the video presentation:",
          error
        );
        addNotification(
          "An unexpected error occurred while deleting the video presentation",
          "error"
        );
      } finally {
        setShowDeleteModal(false);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
              Video Presentation
            </h2>
            <button
              onClick={onClose}
              className="absolute right-4 text-gray-400 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {videoUrl ? (
              <div className="relative rounded-md overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full rounded-md"
                  onClick={togglePlay}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  preload="metadata"
                />

                {!isPlaying && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#0097B2] flex items-center justify-center opacity-80">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 h-48 rounded-md flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full bg-[#0097B2] flex items-center justify-center opacity-80">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white px-2 py-1 rounded-md">
                  0:00
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Video Presentation
              </h3>
              <p className="text-gray-600 mt-2">
                If you want to change your video, you must first delete this one
                and then upload a new one.
              </p>
            </div>

            <div className="pt-4 flex flex-col space-y-2">
              <button
                type="button"
                onClick={togglePlay}
                className="w-full py-2 px-4 bg-[#0097B2] hover:bg-[#0097B2]/80 text-white font-medium rounded-md cursor-pointer"
              >
                {isPlaying ? "Pause video" : "Play video"}
              </button>
              <button
                type="button"
                onClick={handleDeleteVideo}
                className="w-full py-2 px-4 border border-red-500 hover:bg-red-50 text-red-500 font-medium rounded-md cursor-pointer flex items-center justify-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete video
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[#0097B2] hover:text-[#0097B2]/80 py-1 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteVideo}
        title="Delete video"
        message="Are you sure you want to delete this video presentation? This action cannot be undone."
      />
    </>
  );
}
