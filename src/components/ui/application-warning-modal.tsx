"use client";

import { useRef } from "react";
import { AlertTriangle, Clock, X } from "lucide-react";
import { ApplicationHistoryStatus } from "@/interfaces/jobs.types";

interface ApplicationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  historyStatus: ApplicationHistoryStatus;
  isLoading?: boolean;
}

export function ApplicationWarningModal({
  isOpen,
  onClose,
  onConfirm,
  historyStatus,
  isLoading = false,
}: ApplicationWarningModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const getModalContent = () => {
    if (historyStatus.isActive) {
      return {
        icon: <Clock className="h-12 w-12 text-blue-500" />,
        title: "You have an active application",
        description:
          "You have already applied to this offer and your application is being processed.",
        confirmText: "Understood",
        showCancel: false,
      };
    }

    if (historyStatus.wasRejected) {
      return {
        icon: <AlertTriangle className="h-12 w-12 text-orange-500" />,
        title: "Previous application rejected",
        description: `You previously applied to this offer${
          historyStatus.applicationDate
            ? ` on ${new Date(
                historyStatus.applicationDate
              ).toLocaleDateString()}`
            : ""
        } and your application was rejected. Are you sure you want to apply again?`,
        confirmText: "Yes, apply again",
        showCancel: true,
      };
    }

    return {
      icon: <AlertTriangle className="h-12 w-12 text-gray-500" />,
      title: "Previous application",
      description: `You have previously applied to this offer${
        historyStatus.applicationDate
          ? ` on ${new Date(
              historyStatus.applicationDate
            ).toLocaleDateString()}`
          : ""
      }. Are you sure you want to apply again?`,
      confirmText: "Yes, apply again",
      showCancel: true,
    };
  };

  const content = getModalContent();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            {content.icon}
            <p className="mt-4 text-gray-600">{content.description}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {content.showCancel && (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={content.showCancel ? onConfirm : onClose}
              disabled={
                isLoading || (historyStatus.isActive && !content.showCancel)
              }
              className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
                content.showCancel
                  ? "bg-[#0097B2] hover:bg-[#007A8F]"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${
                isLoading || (historyStatus.isActive && !content.showCancel)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Processing..." : content.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
