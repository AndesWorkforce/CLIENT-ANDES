"use client";

import { useRef } from "react";
import { X } from "lucide-react";

export const IT_SUPPORT_PORTAL_URL =
  "https://teamandes.atlassian.net/servicedesk/customer/portal/2";

interface ItSupportRedirectModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function ItSupportRedirectModal({
  open,
  onClose,
  onAccept,
}: ItSupportRedirectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  function handleClickOutside(event: React.MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4"
      onClick={handleClickOutside}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="it-support-modal-title"
        className="w-full max-w-md overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-[#EFEFEF] px-5 py-4">
          <div className="w-5" />
          <h2
            id="it-support-modal-title"
            className="text-[18px] font-bold leading-[1.3] text-[#343434]"
          >
            Request IT Support
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#858585] transition-colors hover:text-[#343434]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="text-center text-[14px] leading-[1.5] text-[#525252]">
            You are about to be redirected to our Jira Service Desk portal to
            submit an IT support ticket. Do you agree to continue?
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#C8C8C8] px-[22px] text-[14px] font-medium leading-[1.2] text-[#858585] transition-colors hover:bg-[#F8F8F8]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
