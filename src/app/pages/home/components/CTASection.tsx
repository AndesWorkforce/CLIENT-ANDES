"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#00224d] rounded-[50px] p-[50px] flex flex-col items-center gap-[30px]">
          <h2 className="text-white text-[40px] font-bold leading-[65px] text-center w-full">
            Ready to build your team?
          </h2>
          <Link
            href="/pages/contact"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined" && (window as any).gtagSendEvent) {
                (window as any).gtagSendEvent("/pages/contact");
              } else {
                window.location.href = "/pages/contact";
              }
            }}
            className="inline-flex items-center justify-center bg-[#0097b2] text-white text-[16px] font-medium px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] hover:bg-[#007a8f] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
