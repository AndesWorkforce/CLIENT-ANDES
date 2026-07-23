"use client";

import { useState } from "react";
import ItSupportRedirectModal, {
  IT_SUPPORT_PORTAL_URL,
} from "@/app/components/ItSupportRedirectModal";
import { GUIDE_SUPPORT } from "../contractor-guide.data";

export default function GuideSupportSection() {
  const [showItSupportModal, setShowItSupportModal] = useState(false);

  function handleAcceptItSupport() {
    window.open(IT_SUPPORT_PORTAL_URL, "_blank", "noopener,noreferrer");
    setShowItSupportModal(false);
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[16px] bg-[#044e5c] px-6 py-10 sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute -right-6 -top-10 size-[208px] rounded-full bg-white/5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-8 top-[112px] size-[144px] rounded-full bg-white/5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-4 top-6 size-16 rounded-full bg-[rgba(0,213,190,0.1)]"
          aria-hidden
        />

        <div className="relative z-10 max-w-[768px]">
          <p className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#46ecd5]">
            {GUIDE_SUPPORT.eyebrow}
          </p>
          <h2 className="mt-1 text-[28px] sm:text-[32px] font-bold leading-[1.3] text-white">
            {GUIDE_SUPPORT.title}
          </h2>
          <p className="mt-[22px] max-w-[648px] text-[18px] sm:text-[20px] font-medium leading-[1.5] text-white/75">
            {GUIDE_SUPPORT.description}
          </p>
          <button
            type="button"
            onClick={() => setShowItSupportModal(true)}
            className="mt-8 inline-flex items-center justify-center rounded-[20px] bg-white px-[25px] py-3 text-[16px] font-semibold leading-[1.3] text-[#00786f] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors hover:bg-[#f4fffd]"
          >
            {GUIDE_SUPPORT.ctaLabel}
          </button>
        </div>
      </section>

      <ItSupportRedirectModal
        open={showItSupportModal}
        onClose={() => setShowItSupportModal(false)}
        onAccept={handleAcceptItSupport}
      />
    </>
  );
}
