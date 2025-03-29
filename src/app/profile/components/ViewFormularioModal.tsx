"use client";

import { useRef } from "react";
import { X } from "lucide-react";

interface ViewFormularioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewFormularioModal({
  isOpen,
  onClose,
}: ViewFormularioModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
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
        className="bg-white w-full max-w-md rounded-lg overflow-hidden"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="flex items-center p-4 relative border-b border-gray-200">
          <div className="w-6" />
          <h2 className="text-lg font-medium w-full text-center text-[#0097B2]">
            Your completed form
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 bg-[#07A836] rounded-full flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Form completed!
            </h3>
            <p className="text-gray-600 mt-2">
              You have completed the form with your personal information. If you
              need to modify any data, you can do so here.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 bg-[#0097B2] text-white font-medium rounded-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
