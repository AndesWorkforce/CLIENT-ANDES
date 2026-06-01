"use client";

import Image from "next/image";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="relative w-full min-h-[308px] sm:h-[356px] overflow-hidden">
      {/* Background image */}
      <Image
        src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Call+to+Action+-Fondo.jpg"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
      {/* Dark teal overlay */}
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.85)]" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-[55px] sm:py-0 px-[21px] sm:px-10 md:px-20">
        <div className="flex flex-col gap-[22px] sm:gap-6 max-w-full sm:max-w-[666px]">
          <h2 className="text-[22px] sm:text-4xl md:text-[48px] font-bold text-white leading-[1.3] drop-shadow-[0px_4px_4px_#11525e]">
            Ready to take the next step?
          </h2>
          <p className="text-[18px] sm:text-[22px] font-medium text-white leading-[1.2]">
            Connecting businesses and talent to build stronger teams.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-[10px] sm:gap-4">
            <Link
              href="/pages/contact"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "ads_click_AboutPage_FindTalent", {});
                }
              }}
              className="bg-white rounded-[20px] px-6 py-3 text-[rgba(4,78,92,0.85)] text-[16px] sm:text-lg md:text-[20px] font-medium leading-[1.2] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] hover:bg-gray-100 transition-colors text-center"
            >
              Find Talent Now
            </Link>
            <Link
              href="/pages/jobs"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "ads_click_AboutPage_JoinTeam", {});
                }
              }}
              className="border border-white rounded-[20px] px-6 py-3 text-white text-[16px] sm:text-lg md:text-[20px] font-medium leading-[1.2] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors text-center"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
