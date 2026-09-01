"use client";

import Link from "next/link";

export default function CtaSection() {
  return (
    <section
      className="relative flex w-full flex-col items-stretch justify-center gap-12 overflow-hidden py-0 sm:gap-[95px]"
      style={{
        backgroundImage:
          "linear-gradient(-14.77deg, #97d5e0 0%, #22bcd8 40%, #145262 100%)",
      }}
    >
      <div className="h-px w-full bg-white/30" aria-hidden />

      <div className="mx-auto flex w-full max-w-[1092px] flex-col items-start px-[18px] sm:px-6">
        <p className="text-[14px] font-semibold uppercase leading-5 tracking-[1.4px] text-white/80">
          Get Started Today
        </p>

        <h2 className="mt-4 text-left text-[32px] font-bold leading-[1.2] text-white drop-shadow-[0px_1px_2px_rgba(0,0,0,0.15)] sm:text-[48px] md:text-[60px] md:leading-[75px]">
          Ready to take the next step
        </h2>

        <p className="mt-6 text-left text-[16px] font-normal leading-[1.6] text-white/80 sm:text-[18px]">
          Connecting businesses and talent to build stronger teams.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/pages/services"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "ads_click_AboutPage_FindTalent", {});
              }
            }}
            className="inline-flex items-center justify-center gap-1 rounded-[20px] bg-white px-[13px] py-3 text-[16px] font-medium leading-[1.2] text-[#0097b2] transition-colors hover:bg-gray-50"
          >
            Find Talent Now
            <span className="relative size-[18px] shrink-0 overflow-hidden">
              <img
                src="/images/about/cta-chevron-teal.svg"
                alt=""
                width={18}
                height={18}
                className="size-full"
              />
            </span>
          </Link>
          <Link
            href="/pages/offers"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "ads_click_AboutPage_JoinTeam", {});
              }
            }}
            className="inline-flex items-center justify-center gap-1 rounded-[20px] px-[13px] py-3 text-[16px] font-medium leading-[1.2] text-white transition-colors hover:bg-white/10"
          >
            Join Us
            <span className="relative size-[18px] shrink-0 overflow-hidden">
              <img
                src="/images/about-arrow.svg"
                alt=""
                width={18}
                height={18}
                className="size-full"
              />
            </span>
          </Link>
        </div>
      </div>

      <div className="h-px w-full bg-black/10" aria-hidden />
    </section>
  );
}
