"use client";

import Image from "next/image";
import { Clock, CalendarDays } from "lucide-react";
import { storyAssets } from "../story-assets";

export default function StoryHeroSection() {
  return (
    <section className="relative w-full bg-white">
      <div className="relative w-full h-[200px] md:h-[312px]">
        <Image
          src={storyAssets.hero}
          alt="The Story Behind Andes Workforce"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="max-w-[850px] mx-auto px-[18px] md:px-[44px] pt-[44px] pb-[11px] md:pb-[22px]">
        <div className="flex flex-col gap-[33px]">
          <div className="flex flex-wrap items-center gap-[22px]">
            <div className="inline-flex items-center justify-center px-[16px] py-[5px] bg-[#F8F8F8] rounded-[24px]">
              <span className="font-semibold text-[14px] text-[#0097B2] leading-[1.3]">
                COMPANY STORY
              </span>
            </div>
            <div className="flex items-center gap-[4px]">
              <Clock className="w-[18px] h-[18px] text-[#707070]" />
              <span className="font-medium text-[14px] text-[#707070] leading-[1.2]">
                6 min read
              </span>
            </div>
            <div className="flex items-center gap-[4px]">
              <CalendarDays className="w-[24px] h-[24px] text-[#707070]" />
              <span className="font-medium text-[14px] text-[#707070] leading-[1.2]">
                Jun 25, 2026
              </span>
            </div>
          </div>

          <h1 className="font-bold text-[24px] md:text-[32px] leading-[1.3] text-black w-full">
            The Story Behind Andes Workforce: Built on Trust Across Borders
          </h1>

          <p className="font-medium text-[16px] md:text-[18px] leading-[1.2] text-[#858585] w-full">
            From shipmates in the Navy to business partners — how trust built a
            company that connects talent and opportunity across borders.
          </p>

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

          <div className="w-full h-[1px] bg-[#EFEFEF]" />
        </div>
      </div>
    </section>
  );
}
