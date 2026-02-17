"use client";

import Image from "next/image";

interface HeroSectionProps {
  onContactClick: () => void;
}

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  return (
    <section className="relative w-full h-screen flex items-end justify-start px-8 md:px-16 py-[108px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/about_top.png"
          alt="Professional with headset"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[620px] flex flex-col gap-[30px]">
        <div className="flex flex-col gap-[20px] text-white">
          {/* Title */}
          <h1 className="text-[48px] font-bold leading-normal font-[family-name:var(--font-outfit)]">
            Hire <span className="text-[#00e5ff]">Top-Tier Talent</span>{" "}
            Tailored to Your Needs
          </h1>

          {/* Subtitle */}
          <p className="text-base leading-normal tracking-[0.16px]">
            <span className="font-bold text-[#00e5ff]">Browse expert profiles</span> and hire
            securely with{" "}
            <span className="font-bold text-[#00e5ff]">dedicated support</span>
            <br />
            from Andes Workforce
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-[10px] items-center">
          <button className="bg-[#0097b2] hover:bg-[#007A8F] text-white px-8 py-3 rounded-full text-base font-medium transition-colors cursor-pointer">
            Register Now
          </button>
          <button
            onClick={onContactClick}
            className="bg-white hover:bg-gray-100 text-[#0097b2] px-8 py-3 rounded-full text-base font-medium transition-colors cursor-pointer"
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
