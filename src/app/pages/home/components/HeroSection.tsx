"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentStyle, setContentStyle] = useState({
    opacity: 1,
    visibility: "visible" as "visible" | "hidden",
  });

  useEffect(() => {
    const updateContentVisibility = () => {
      const content = contentRef.current;
      if (!content) return;

      // At the top of the page, always keep full opacity
      if (window.scrollY <= 4) {
        setContentStyle({ opacity: 1, visibility: "visible" });
        return;
      }

      // Fade only when the block is about to enter the navbar zone
      const navClearance = 96;
      const top = content.getBoundingClientRect().top;
      const fadeStart = navClearance + 64;
      const fadeEnd = navClearance + 8;

      let opacity = 1;
      if (top < fadeStart) {
        opacity = Math.min(
          Math.max((top - fadeEnd) / (fadeStart - fadeEnd), 0),
          1
        );
      }

      setContentStyle({
        opacity,
        visibility: opacity < 0.02 ? "hidden" : "visible",
      });
    };

    updateContentVisibility();
    window.addEventListener("scroll", updateContentVisibility, { passive: true });
    window.addEventListener("resize", updateContentVisibility);

    return () => {
      window.removeEventListener("scroll", updateContentVisibility);
      window.removeEventListener("resize", updateContentVisibility);
    };
  }, []);

  return (
    <section id="home-hero" className="relative w-full overflow-hidden">
      <div className="relative min-h-[560px] md:min-h-[666px] flex flex-col">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/andes_hero_home.jpg"
            alt="Andes Workforce Team"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[rgba(0,34,77,0.7)] via-[56%] to-[rgba(0,34,77,0.6)]" />
        </div>

        {/* Content — starts below navbar so it never sits under the links */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-[120px] pb-[72px] md:pt-[140px] md:pb-[96px]">
          <div
            ref={contentRef}
            className="w-full max-w-[679px] flex flex-col gap-[26px] items-center text-center will-change-[opacity]"
            style={{
              opacity: contentStyle.opacity,
              visibility: contentStyle.visibility,
              transition: "opacity 100ms linear",
              pointerEvents: contentStyle.opacity < 0.15 ? "none" : "auto",
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-full px-[17px] py-[7px]">
              <span className="w-2 h-2 shrink-0 rounded-full bg-[#0bbfb0] opacity-50" />
              <span className="text-[rgba(255,255,255,0.9)] text-[12px] font-medium leading-4 tracking-[0.3px] uppercase">
                Latin America&apos;s Top Talent Marketplace
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-bold text-white text-[40px] sm:text-[56px] md:text-[72px] leading-[1.1] tracking-[-1.8px]">
              Work with <span className="text-[#0bc8e9]">top talent</span>
              <br />
              from Latin America
            </h1>

            {/* Subtitle */}
            <p className="text-[rgba(255,255,255,0.65)] text-[16px] md:text-[18px] font-medium leading-[1.6] max-w-[576px]">
              We connect high-growth companies with elite professionals across
              Latin America - handling every legal, administrative, and
              compliance detail so you can focus on building.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-[7px]">
              <Link
                href="/pages/services"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "ads_click_Hero_FindTalent", {});
                  }
                }}
                className="inline-flex items-center justify-center bg-[#0097b2] text-white font-medium text-[16px] leading-[1.2] px-[25px] py-[12px] rounded-[20px] transition-colors hover:bg-[#007a91]"
              >
                Find Talent Now
              </Link>
              <Link
                href="/pages/offers"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "ads_click_Hero_JoinTeam", {});
                  }
                }}
                className="inline-flex items-center gap-1 bg-transparent text-white font-medium text-[16px] leading-[1.2] px-[13px] py-[12px] rounded-[20px] transition-colors hover:bg-white/10"
              >
                <span>Join Our Team</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6.75 13.5L11.25 9L6.75 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
