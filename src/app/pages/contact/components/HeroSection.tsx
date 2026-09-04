"use client";

import { FadeIn, ABOUT_MOTION } from "../../about/components/Reveal";
import { servicesAssets } from "@/app/pages/services/services-assets";

export default function HeroSection() {
  return (
    <section
      id="contact-hero"
      className="relative h-[360px] w-full overflow-hidden sm:h-[505px]"
    >
      <img
        src={servicesAssets.contactHeroBg}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      <div
        className="absolute inset-0 bg-[rgba(4,78,92,0.5)]"
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-center px-[18px] pt-[66px] sm:px-[82px] sm:pt-[77px]">
        <FadeIn
          duration={ABOUT_MOTION.heroDuration}
          className="flex w-full max-w-[601px] flex-col items-start gap-[13px] text-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
        >
          <h1 className="text-[32px] font-bold leading-[1.3] sm:text-[48px]">
            Let&apos;s build your remote team
          </h1>
          <p className="text-[16px] font-medium leading-[1.2] sm:text-[20px]">
            Tell us about your business needs and we&apos;ll help you find the
            right talent.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
