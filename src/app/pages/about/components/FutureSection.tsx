"use client";

import { SlideIn } from "./Reveal";

export default function FutureSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-[88px] overflow-x-hidden">
      <div className="max-w-[1092px] mx-auto px-[18px] sm:px-6 flex flex-col-reverse lg:flex-row gap-[33px] lg:gap-[44px] items-center">
        <SlideIn from="left" className="w-full lg:w-[528px] shrink-0">
        <div className="relative w-full aspect-[528/364] lg:w-[528px] lg:h-[364px] lg:aspect-auto overflow-hidden rounded-[16px]">
          <img
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/The+future+we%E2%80%99re+building+-+Mission.webp"
            alt="The future we're building"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        </SlideIn>

        <div className="flex-1 w-full">
          <SlideIn from="right" delay={0.32}>
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            The future we&apos;re{" "}
            <span className="text-[#0097b2]">building</span>
          </h2>
          </SlideIn>
          <SlideIn from="right" delay={0.71}>
          <p className="mt-[22px] sm:mt-[33px] text-[14px] sm:text-lg md:text-[20px] text-black leading-[1.5]">
            To become a{" "}
            <strong className="font-semibold">leading reference</strong> in the
            development of{" "}
            <strong className="font-semibold">sustainable organizations</strong>
            , where both our clients and collaborators{" "}
            <strong className="font-semibold">grow together</strong>, driven by{" "}
            <strong className="font-semibold">collaborative</strong> and{" "}
            <strong className="font-semibold">innovative solutions</strong> that
            benefit everyone involved.
          </p>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
