"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-white h-[600px] overflow-hidden">
      {/* Background image (right side, ~57% width on desktop) */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[57%] h-full translate-x-[80px]">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/andes_hero_home.jpg"
          alt="Andes Workforce Team"
          fill
          priority
          className="object-cover"
        />
        {/* White-to-transparent gradient on top of image (soft fade from left) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255,255,255) 2%, rgba(228,228,228,0.65) 10%, rgba(185,185,185,0.10) 18%, rgba(115,115,115,0) 100%)",
          }}
        />
      </div>

      {/* Subtle cyan tint overlay across the whole hero (right side stronger) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(270deg, rgba(34,188,216,0.40) 0%, rgba(255,255,255,0) 80%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 md:px-12 lg:px-20">
        <div className="h-full max-w-[601px] flex flex-col gap-[30px] justify-center">
          {/* Logo (colored) */}
          <div className="flex">
            <div className="relative w-[175px] h-[66px]">
              <Image
                src="/logo-andes.png"
                alt="Andes Workforce"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-[#343434] text-4xl md:text-[52px] leading-[1.3]">
            Work with{" "}
            <span className="text-[#0097b2]">top talent</span>
            <br />
            from{" "}
            <span className="text-[#0097b2]">Latin America</span>
          </h1>

          {/* Subtitle */}
          <p className="font-medium text-[#343434] text-base md:text-[20px] leading-[1.2]">
            Connect with{" "}
            <span className="text-[#0097b2]">highly skilled professionals</span>
            {" "}and cut operating costs by up to{" "}
            <span className="text-[#0097b2]">60%</span>
            , without compromising quality or efficiency
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-[10px]">
            <Link
              href="/pages/services"
              className="inline-flex items-center justify-center bg-[#0097b2] text-white font-semibold text-[20px] leading-[1.3] px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors hover:bg-[#007a91]"
            >
              Find Talent Now
            </Link>
            <Link
              href="/pages/offers"
              className="inline-flex items-center justify-center bg-white border border-[#0097b2] text-[#0097b2] font-semibold text-[20px] leading-[1.3] px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors hover:bg-[#0097b2] hover:text-white"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
