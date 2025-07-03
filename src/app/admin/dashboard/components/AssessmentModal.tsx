import { useState } from "react";
import { X } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function AssessmentModal({
  isOpen,
  onClose,
  onUpload,
}: AssessmentModalProps) {
  const { addNotification } = useNotificationStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    try {
      // Pasar el archivo directamente al callback
      await onUpload(file);
      addNotification("Assessment uploaded successfully", "success");
      onClose();
    } catch {
      addNotification("Error uploading assessment", "error");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-[#0097B2] text-lg font-semibold">
            Upload Assessment
          </h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          <button
            type="submit"
            className="ml-2 px-3 py-1 bg-[#0097B2] text-white rounded"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
      </div>
    </div>
  );
}
