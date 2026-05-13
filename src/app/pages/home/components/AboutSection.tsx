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
    <section
      className="relative py-[60px] bg-[#1F5965] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(31,89,101,0.85) 0%, rgba(0,80,100,0.85) 100%), url('https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/88a77507bfcfb701f5c0eb2d264b3d1a8ed3a54c.jpg')",
      }}
    >
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-[80px]">
        {/* Left: text */}
        <div className="flex flex-col gap-[35px] md:w-[520px] shrink-0">
          <h2 className="text-white font-bold text-[34px] leading-tight">
            About Us
          </h2>
          <p className="text-white text-[17px] leading-[28px] text-justify">
            We bridge the gap between global opportunity and local excellence.
            Our mission is to empower Latin American professionals while
            providing world-class infrastructure for global enterprises.
          </p>
          <Link
            href="/pages/contact"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined" && (window as any).gtagSendEvent) {
                (window as any).gtagSendEvent("/pages/about");
              } else {
                window.location.href = "/pages/about";
              }
            }}
            className="inline-flex items-center justify-center bg-white text-[#0097b2] text-[18px] font-semibold px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] w-fit hover:bg-gray-100 transition-colors"
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
