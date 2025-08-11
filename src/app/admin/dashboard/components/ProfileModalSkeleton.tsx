import React from "react";
import { X, RefreshCw, AlertCircle } from "lucide-react";

interface ProfileModalSkeletonProps {
  isOpen: boolean;
  onClose: () => void;
  onReload?: () => void;
  errorCount?: number; // Error counter
}

export default function ProfileModalSkeleton({
  isOpen,
  onClose,
  onReload,
  errorCount = 0,
}: ProfileModalSkeletonProps) {
  console.log(
    "[ProfileModalSkeleton] Showing skeleton - isOpen:",
    isOpen,
    "errorCount:",
    errorCount
  );

  if (!isOpen) return null;

  // If there have been several attempts, show specific error message
  const showTooManyRequestsWarning = errorCount > 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div
        className="relative p-4 bg-white w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Reload button */}
        {onReload && (
          <button
            onClick={onReload}
            className="absolute top-2 right-10 text-gray-500 hover:text-[#0097B2] cursor-pointer z-10 flex items-center"
          >
            <RefreshCw size={18} className="mr-1" />
            <span className="text-sm">Reload profile</span>
          </button>
        )}

        <div className="p-6">
          {/* Loading message */}
          <div
            className={`${
              showTooManyRequestsWarning
                ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                : "bg-blue-100 border-blue-500 text-blue-700"
            } border-l-4 p-4 rounded mb-4 flex items-center justify-between`}
          >
            <div>
              {showTooManyRequestsWarning ? (
                <>
                  <div className="flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    <p className="font-bold">Too many requests</p>
                  </div>
                  <p className="text-sm">
                    The server is busy. Please wait a few seconds and try again.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold">Loading profile...</p>
                  <p className="text-sm">This may take a few seconds.</p>
                </>
              )}
            </div>
            <div className="animate-spin">
              <RefreshCw size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Personal data */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="animate-pulse flex flex-col">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 animate-pulse flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            {/* Video */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
                <div className="aspect-video bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 mb-4 relative animate-pulse">
              <div className="flex">
                <div className="py-3 px-8 rounded-tl-2xl bg-gray-200 w-32 h-10"></div>
                <div className="py-3 px-8 rounded-tr-2xl bg-gray-200 ml-2 w-32 h-10"></div>
                <div className="flex-grow"></div>
              </div>
              <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white p-4">
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
