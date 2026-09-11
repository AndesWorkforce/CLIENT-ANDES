"use client";

import { FadeIn, ABOUT_MOTION } from "../../about/components/Reveal";

export default function HeroSection() {
  return (
    <section
      id="services-hero"
      className="relative flex h-[332px] w-full items-center justify-start md:h-[600px]"
    >
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
      <div className="container relative z-10 w-full px-[20px] pt-[66px] md:px-[40px] md:pt-[77px]">
        <FadeIn
          duration={ABOUT_MOTION.heroDuration}
          className="flex w-fit max-w-[789px] flex-col gap-[10px] text-white"
        >
          <h1 className="font-bold text-[32px] leading-[1.3] md:text-[48px] xl:text-[64px]">
            Hire Top-Tier Talent
            <br />
            <span className="text-white md:text-[#89E9FA]">
              Tailored to Your Needs
            </span>
          </h1>
          <p className="w-0 min-w-full font-medium text-[14px] leading-[1.3] md:text-[22px] md:font-semibold xl:text-[28px]">
            Browse expert profiles and hire securely with dedicated support from
            Andes Workforce
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
