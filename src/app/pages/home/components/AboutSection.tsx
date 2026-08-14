"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const images = [
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Secc%C3%B3n+About+Us+-+01.png",
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Secc%C3%B3n+About+Us+-+02.JPG",
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
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 md:flex-row md:items-center md:gap-16 md:px-8">
        <div className="flex w-full max-w-[576px] flex-col items-start">
          <p className="text-[12px] font-semibold uppercase leading-4 tracking-[1.8px] text-[#00b4a8]">
            About Us
          </p>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.1] tracking-[-0.96px] text-[#0a2540] sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52.8px]">
            Building bridges between talent and opportunity
          </h2>
          <p className="mt-6 text-[16px] font-normal leading-[26px] text-[#6a7282]">
            Andes Workforce is a talent platform specializing in connecting US
            and global companies with exceptional professionals from Latin
            America. We believe in creating long-term partnerships that benefit
            both employers and talent.
          </p>
          <p className="mt-5 pb-10 text-[16px] font-normal leading-[26px] text-[#6a7282]">
            Our experienced team of recruiters and talent specialists work
            tirelessly to ensure every match is not just a hire, but the
            beginning of a success story.
          </p>
          <Link
            href="/pages/about"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined" && window.gtagSendEvent) {
                window.gtagSendEvent(
                  "/pages/about",
                  "ads_click_About_LearnMore",
                );
              } else {
                window.location.href = "/pages/about";
              }
            }}
            className="inline-flex h-14 items-center gap-2 rounded-[14px] px-8 py-4 text-[16px] font-semibold leading-6 text-white transition-opacity hover:opacity-90"
            style={{
              backgroundImage:
                "linear-gradient(168deg, #00b4a8 0%, #008f85 100%)",
            }}
          >
            Learn More About Us
            <span className="relative size-[18px] shrink-0 overflow-hidden">
              <img
                src="/images/about-arrow.svg"
                alt=""
                width={18}
                height={18}
                className="size-full"
              />
            </span>
          </Link>
        </div>

        <div className="relative h-[280px] w-full max-w-[576px] overflow-hidden rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.1)] sm:h-[380px] md:h-[428px] md:flex-1">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Andes Workforce team"
              className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === activeImg ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
