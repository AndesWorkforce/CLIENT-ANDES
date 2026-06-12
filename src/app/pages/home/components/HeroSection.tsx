"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-white md:h-[calc(100dvh-45px)] h-[500px] md:h-[350px] overflow-hidden">
      {/* Background image (right side on desktop, full width on mobile) */}
      <div className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[57%] h-full">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/andes_hero_home.jpg"
          alt="Andes Workforce Team"
          fill
          priority
          className="object-cover"
        />
        {/* White-to-transparent gradient (desktop only) */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255,255,255) 2%, rgba(228,228,228,0.65) 10%, rgba(185,185,185,0.10) 18%, rgba(115,115,115,0) 100%)",
          }}
        />
        {/* Mobile overlay - cyan tint */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden bg-[rgba(4,78,92,0.70)]"
        />
      </div>

      {/* Subtle cyan tint overlay - covers entire section (desktop only) */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          backgroundImage:
            "linear-gradient(270deg, rgba(34,188,216,0.40) 0%, rgba(255,255,255,0) 80%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 md:px-12 lg:px-20">
        <div className="h-full max-w-full md:max-w-[601px] flex flex-col gap-[20px] md:gap-[30px] justify-center items-start text-left">
          {/* Logo (colored) */}
          <div className="flex">
            {/* Mobile logo - white */}
            <div className="relative w-[140px] h-[53px] md:hidden">
              <Image
                src="/LOGO_ANDES_BLANCO_TRANSPARENTE.png"
                alt="Andes Workforce"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Desktop logo - colored */}
            <div className="relative w-[175px] h-[66px] hidden md:block">
              <Image
                src="/logo-andes.png"
                alt="Andes Workforce"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-white md:text-[#343434] text-[28px] md:text-4xl lg:text-[52px] leading-[1.3]">
            Work with{" "}
            <span className="text-[#22BCD8] md:text-[#0097b2]">top talent</span>
            <br />
            from{" "}
            <span className="text-[#22BCD8] md:text-[#0097b2]">Latin America</span>
          </h1>

          {/* Subtitle */}
          <p className="font-medium text-white md:text-[#343434] text-[14px] md:text-base lg:text-[20px] leading-[1.2] max-w-[320px] md:max-w-none">
            Connect with{" "}
            <span className="text-[#22BCD8] md:text-[#0097b2]">highly skilled professionals</span>
            {" "}and cut operating costs by up to{" "}
            <span className="text-[#22BCD8] md:text-[#0097b2]">60%</span>
            , without compromising quality or efficiency
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col md:flex-row flex-wrap items-start gap-[10px] w-full md:w-auto">
            <Link
              href="/pages/services"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "ads_click_Hero_FindTalent", {});
                }
              }}
              className="inline-flex items-center justify-center bg-white md:bg-[#0097b2] text-[#044e5c] md:text-white font-medium md:font-semibold text-[16px] md:text-[20px] leading-[1.2] md:leading-[1.3] px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors md:hover:bg-[#007a91] md:w-auto"
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
              className="inline-flex items-center justify-center bg-transparent md:bg-white border border-[#dffaff] md:border-[#0097b2] text-white md:text-[#0097b2] font-medium md:font-semibold text-[16px] md:text-[20px] leading-[1.2] md:leading-[1.3] px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] md:shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors md:hover:bg-[#0097b2] md:hover:text-white md:w-auto"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
