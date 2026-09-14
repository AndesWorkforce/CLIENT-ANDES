"use client";

import Link from "next/link";
import { FadeIn } from "../../about/components/Reveal";

export default function CTASection() {
  return (
    <section
      className="relative flex flex-col items-center gap-12 overflow-hidden px-6 py-0 sm:gap-[95px] md:px-12"
      style={{
        backgroundImage:
          "linear-gradient(161.94deg, #9ed4dd 1.44%, #22bcd8 40%, #0097b2 100%)",
      }}
    >
      <div className="h-px w-full bg-white/30" aria-hidden />

      <FadeIn className="relative mx-auto flex w-full max-w-[896px] flex-col items-center text-center">
        <p className="text-[14px] font-semibold uppercase leading-[1.3] tracking-[1.4px] text-white">
          Get Started Today
        </p>

        <h2 className="mt-4 max-w-[720px] text-[32px] font-bold leading-[1.3] text-white drop-shadow-[0px_1px_2px_rgba(0,0,0,0.15)] sm:text-[44px] md:text-[60px]">
          Ready to scale your team with remote talent?
        </h2>

        <p className="mt-6 max-w-[576px] text-[16px] font-medium leading-[1.6] text-white sm:text-[18px]">
          Join 200+ companies already building high-performing teams with Latin
          American talent through Andes Workforce.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/pages/services"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "ads_click_CTA_FindTalent", {});
              }
            }}
            className="inline-flex items-center justify-center rounded-[20px] bg-white px-[13px] py-3 text-[16px] font-medium leading-[1.2] text-[#0097b2] transition-colors hover:bg-gray-50"
          >
            Find Talent Now
          </Link>
          <Link
            href="/pages/offers"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "ads_click_CTA_JoinTeam", {});
              }
            }}
            className="inline-flex items-center justify-center gap-1 rounded-[20px] px-[13px] py-3 text-[16px] font-medium leading-[1.2] text-white transition-colors hover:bg-white/10"
          >
            Join Our Team
            <span aria-hidden>→</span>
          </Link>
        </div>
      </FadeIn>

      <div className="h-px w-full bg-black/10" aria-hidden />
    </section>
  );
}
