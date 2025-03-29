import { X } from "lucide-react";

interface ProfileModalSkeletonProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModalSkeleton({
  isOpen,
  onClose,
}: ProfileModalSkeletonProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div
        className="relative bg-white w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="space-y-4">
            {/* Contact Info Card Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                <hr className="border-[#E2E2E2] my-2" />
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-2"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-2"></div>
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Button Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Video Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Skills Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PC Specs Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[1, 2].map((index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full border mr-2">
                          <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience/Education tabs Skeleton */}
            <div className="mt-6 mb-4 relative">
              <div className="relative">
                {/* Tabs Skeleton */}
                <div className="flex">
                  <div className="py-3 px-8 rounded-tl-2xl border-t border-l border-gray-300 bg-white">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="py-3 px-8 rounded-tr-2xl border-t border-r border-gray-300 bg-white">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex-grow border-b border-gray-300"></div>
                </div>

                {/* Content Panel Skeleton */}
                <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white relative p-4">
                  <div className="space-y-6">
                    {[1, 2].map((index) => (
                      <div
                        key={index}
                        className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
