import { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    try {
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
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleSelectFile}
            className="px-4 py-2 bg-[#0097B2] text-white rounded hover:bg-[#007a8f] transition-colors"
          >
            {file ? "Change PDF file" : "Select PDF file"}
          </button>
          {file && (
            <div className="text-sm text-gray-700 truncate">
              Selected file: <span className="font-medium">{file.name}</span>
            </div>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
      </div>
    </div>
  );
}
