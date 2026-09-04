"use client";

import { FadeIn, ABOUT_MOTION } from "../../about/components/Reveal";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[332px] md:h-[600px] flex items-center justify-start">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Banner.webp')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,78,92,0.8) 20.19%, rgba(5,100,117,0.76) 53.99%, rgba(8,166,194,0.24) 71.95%)",
        }}
      />
      <div className="container relative z-10 w-full px-[20px] md:px-[40px]">
        <FadeIn
          duration={ABOUT_MOTION.heroDuration}
          className="max-w-[1063px] text-white"
        >
          <h1 className="mb-[30px] font-bold text-[32px] leading-[1.3] md:mb-[10px] md:text-[64px]">
            Hire Top-Tier{" "}
            <span className="text-white md:text-[#0bc8e9]">
              Talent Tailored to Your Needs
            </span>
          </h1>
          <p className="max-w-[353px] font-medium text-[14px] leading-[1.2] md:max-w-[831px] md:text-[28px] md:font-semibold md:leading-[1.3]">
            Browse expert profiles and hire securely with dedicated support from{" "}
            <span className="text-white md:text-[#0bc8e9]">Andes Workforce</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
