"use client";

import Image from "next/image";

export default function ArticleHeroSection() {
  return (
    <section className="relative w-full bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/blog/hero-miguel-rendon.jpg"
          alt="Meet Miguel Rendon"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Header Content */}
      <div className="max-w-[1284px] mx-auto px-[18px] md:px-[44px] py-[44px] md:py-[66px]">
        {/* Category Badge */}
        <div className="inline-flex items-center justify-center px-[16px] py-[5px] bg-[#F8F8F8] rounded-[24px] mb-[22px]">
          <span className="font-semibold text-[14px] text-[#0097B2] leading-[1.3]">
            INTERVIEW
          </span>
        </div>

        {/* Title */}
        <h1 className="font-bold text-[32px] md:text-[52px] leading-[1.3] text-black mb-[22px] max-w-[900px]">
          Meet Miguel Rendon: From the idea to building careers across Latin America
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-[8px] text-[14px]">
          <span className="font-semibold text-[#343434]">Andes Workforce Team</span>
          <span className="text-[#525252] font-medium">•</span>
          <span className="font-medium text-[#525252]">May 28, 2025</span>
        </div>
      </div>
    </section>
  );
}
