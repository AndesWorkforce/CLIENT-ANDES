"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="relative rounded-[50px] overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/b704eba031a01681d8957203b6efbd28aefd1def.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-[rgba(193,223,228,0.58)]" />
          <div className="relative flex flex-col items-center gap-[20px] px-[50px] py-[60px]">
            <h2 className="text-[#336e79] text-[40px] font-bold leading-[1.2] text-center">
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
              className="inline-flex items-center justify-center bg-[#336e79] text-white text-[22px] font-medium px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] hover:bg-[#27575f] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
