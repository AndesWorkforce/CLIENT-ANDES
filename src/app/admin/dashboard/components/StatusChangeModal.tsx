import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import type { CandidateStatus } from "../postulants/page";
import { sendBlacklistNotification } from "../actions/sendEmail.actions";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus?: CandidateStatus;
  onStatusChange: (
    candidateId: string,
    status: CandidateStatus,
    notes?: string
  ) => void;
  candidateName?: string;
  candidateId: string;
  candidateEmail: string;
}

export default function StatusChangeModal({
  isOpen,
  onClose,
  currentStatus = "ACTIVE",
  onStatusChange,
  candidateName = "this candidate",
  candidateId,
  candidateEmail,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<CandidateStatus>(currentStatus);
  const [statusNotes, setStatusNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  if (!isOpen) return null;

  const statusOptions: {
    value: CandidateStatus;
    label: string;
    color: string;
    description: string;
  }[] = [
    {
      value: "ACTIVE",
      label: "Active",
      color: "bg-green-100 text-green-800 border-green-300",
      description: "Candidate is active and can be assigned to jobs",
    },
    {
      value: "FAVORITE",
      label: "Favorite",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      description: "Candidate marked as favorite for quick access",
    },
    {
      value: "DISMISS",
      label: "Dismiss",
      color: "bg-gray-100 text-gray-800 border-gray-300",
      description: "Candidate is dismissed but not blocked",
    },
    {
      value: "BLACKLIST",
      label: "Blacklist",
      color: "bg-red-100 text-red-800 border-red-300",
      description: "Candidate is blacklisted and cannot apply to jobs",
    },
  ];

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onStatusChange(
        candidateId,
        selectedStatus,
        statusNotes || undefined
      );

      // Enviar email si el estado es BLACKLIST
      if (selectedStatus === "BLACKLIST") {
        try {
          await sendBlacklistNotification(candidateName, candidateEmail);
        } catch (error) {
          console.error("Error sending blacklist notification:", error);
        }
      }

      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Change Candidate Status
          </h3>
          <p className="text-sm text-gray-500">
            Select a new status for {candidateName}
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <div
                key={option.value}
                className={`border p-3 rounded-lg cursor-pointer flex items-start transition-colors ${
                  selectedStatus === option.value
                    ? "border-[#0097B2] bg-[#0097B2]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedStatus(option.value)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${option.color}`}
                    >
                      {option.label}
                    </span>
                    {selectedStatus === option.value && (
                      <CheckCircle size={16} className="text-[#0097B2] ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Notes field */}
            <div className="mt-4">
              <label
                htmlFor="statusNotes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes (optional)
              </label>
              <textarea
                id="statusNotes"
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#0097B2] focus:border-[#0097B2]"
                placeholder="Add any relevant notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a8f] disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
