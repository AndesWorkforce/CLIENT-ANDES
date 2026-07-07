"use client";

import Image from "next/image";
import { Clock, CalendarDays } from "lucide-react";

export default function ArticleHeroSection() {
  return (
    <section className="relative w-full bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-[200px] md:h-[312px]">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/blog/hero_blog.jpg"
          alt="Meet Miguel Rendon"
          fill
          className="object-cover object-[center_65%]"
          priority
        />
      </div>

      {/* Article Header Content */}
      <div className="max-w-[850px] mx-auto px-[18px] md:px-[44px] pt-[44px] pb-[11px] md:pb-[22px]">
        <div className="flex flex-col gap-[33px]">
          {/* Metadata: Category, Reading Time, Date */}
          <div className="flex flex-wrap items-center gap-[22px]">
            {/* Category Badge */}
            <div className="inline-flex items-center justify-center px-[16px] py-[5px] bg-[#F8F8F8] rounded-[24px]">
              <span className="font-semibold text-[14px] text-[#0097B2] leading-[1.3]">
                INTERVIEW
              </span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-[4px]">
              <Clock className="w-[18px] h-[18px] text-[#707070]" />
              <span className="font-medium text-[14px] text-[#707070] leading-[1.2]">
                10 min read
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-[4px]">
              <CalendarDays className="w-[24px] h-[24px] text-[#707070]" />
              <span className="font-medium text-[14px] text-[#707070] leading-[1.2]">
                Jun 25, 2026
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-bold text-[24px] md:text-[32px] leading-[1.3] text-black w-full">
            Meet Miguel Rendon: From the seas to building careers across Latin
            America
          </h1>

          {/* Subtitle */}
          <p className="font-medium text-[16px] md:text-[18px] leading-[1.2] text-[#858585] w-full">
            From BUD/S Training to founding Andes Workforce — a conversation about
            purpose, discipline, and the value of planning every step of your life.
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-[6px]">
            <div className="flex items-center justify-center w-[66px] h-[66px] bg-[#DFFAFF] rounded-[33px] p-[20px] flex-shrink-0">
              <span className="font-semibold text-[18px] text-[#0097B2] leading-[1.3]">
                AF
              </span>
            </div>
            <div className="flex flex-col w-[250px]">
              <span className="font-semibold text-[18px] text-[#343434] leading-[1.3]">
                Andes Workforce Team
              </span>
              <span className="font-medium text-[16px] text-[#707070] leading-[1.2]">
                Editorial
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#EFEFEF]" />
        </div>
      </div>
    </section>
  );
}
