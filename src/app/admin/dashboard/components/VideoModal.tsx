import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div
        className="relative bg-white rounded-lg w-full max-w-3xl mx-auto max-h-[90vh] flex flex-col"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <div className="p-4 border-b border-[#E2E2E2] text-start rounded-t-lg">
          <h3 className="text-base font-medium text-gray-900">
            Presentation video
          </h3>
        </div>

        <div className="p-4">
          <div className="w-full max-h-[75vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              playsInline
              className="max-h-[75vh] max-w-full w-auto h-auto object-contain rounded-lg"
            >
              Your browser does not support the video playback.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
