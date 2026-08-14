"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24"
      style={{
        background:
          "linear-gradient(90deg, #1ec8c0 0%, #1298a4 48%, #0a6e82 100%)",
      }}
    >
      <div className="relative mx-auto flex w-full max-w-[896px] flex-col items-center text-center">
        <p className="text-[13px] font-semibold uppercase leading-5 tracking-[1.6px] text-white">
          Get Started Today
        </p>

        <h2 className="mt-4 max-w-[720px] text-[32px] font-bold leading-[1.2] text-white sm:text-[44px] md:text-[52px] md:leading-[1.2]">
          Ready to scale with the right team?
        </h2>

        <p className="mt-5 max-w-[560px] text-[16px] font-normal leading-[1.6] text-white/90 sm:text-[18px]">
          Join 200+ companies already building high-performing teams with Latin
          American talent through Andes Workforce.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/pages/services"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "ads_click_CTA_FindTalent", {});
              }
            }}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 py-3 text-[16px] font-semibold text-[#0c9b8e] shadow-[0px_8px_20px_rgba(0,0,0,0.12)] transition-colors hover:bg-gray-50"
          >
            Find Talent Now
            <span className="relative size-4 shrink-0 overflow-hidden">
              <img
                src="/images/cta-arrow.svg"
                alt=""
                width={16}
                height={16}
                className="size-full"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
