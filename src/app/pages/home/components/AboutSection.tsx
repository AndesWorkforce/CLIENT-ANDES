"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const images = [
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/Property+1%3DDefault.png",
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/Property+1%3DVariant2.png",
];

export default function AboutSection() {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-[60px] bg-[#00224d]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-[104px]">
        {/* Left: text */}
        <div className="flex flex-col gap-[35px] md:w-[450px] shrink-0">
          <h2 className="text-white font-bold text-[24px] leading-tight">
            About Us
          </h2>
          <p className="text-white text-[14px] leading-[25px] text-justify">
            We bridge the gap between global opportunity and local excellence.
            Our mission is to empower Latin American professionals while
            providing world-class infrastructure for global enterprises.
          </p>
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
            className="inline-flex items-center justify-center bg-[#0097b2] text-white text-[16px] font-medium px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] w-fit hover:bg-[#007a8f] transition-colors"
          >
            Read More
          </Link>
        </div>

        {/* Right: image with crossfade */}
        <div className="flex-1 w-full">
          <div className="-rotate-2 relative h-[350px] md:h-[470px] rounded-[25px] overflow-hidden">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="About Andes Workforce"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  i === activeImg ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
