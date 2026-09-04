"use client";

import Image from "next/image";
import { FadeIn } from "./Reveal";

const stats = [
  { value: "+300", label: "Global Contractors" },
  { value: "+12", label: "Countries" },
  { value: "+15", label: "U.S.- based clients" },
];

export default function StatsSection() {
  return (
    <section className="relative w-full overflow-hidden py-[60px] sm:py-24">
      {/* Background image */}
      <Image
        src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Growing+with+results+-+Fondo.webp"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
      {/* Dark teal overlay */}
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.7)]" />

      <div className="relative z-10 max-w-[1074px] mx-auto px-[21px] sm:px-10 flex flex-col gap-8 sm:gap-[59px] items-center">
        {/* Title */}
        <FadeIn>
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-white text-center leading-[1.3]">
            Growing with <span className="text-[#22bcd8]">results</span>
          </h2>
        </FadeIn>

        {/* Stats grid */}
        <div className="flex flex-col gap-8 items-center w-full">
          <div className="grid grid-cols-3 gap-[11px] sm:gap-6 w-full">
            {stats.map((stat, index) => (
              <FadeIn
                key={stat.label}
                delay={0.5 + index * 0.26}
                className="bg-[rgba(4,78,92,0.73)] border border-[#044e5c] rounded-[12px] flex flex-col items-center justify-end px-[14px] sm:px-6 pb-[11px] sm:pb-8 pt-[60px] sm:pt-16"
              >
                <p className="text-[22px] sm:text-[48px] md:text-[64px] font-bold text-white leading-[1.3]">
                  {stat.value}
                </p>
                <p className="text-[14px] sm:text-[18px] md:text-[20px] font-semibold text-white leading-[1.3] text-center">
                  {stat.label}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Description */}
          <FadeIn delay={1.01} duration={0.7} className="w-full">
          <p className="text-[12px] sm:text-[18px] md:text-[20px] font-medium text-white text-center leading-[1.4] max-w-full">
            Since October 2023, Andes has grown into a global team of more than
            300 contractors across 12 countries, supporting 15 clients based in
            the United States. Our distributed model enables us to provide
            consistent, high&#8209;quality remote support while leveraging the
            exceptional professionalism, education, and talent of our
            international workforce.
          </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
