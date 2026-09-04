"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SlideIn } from "../../about/components/Reveal";

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
    <section className="overflow-x-hidden bg-white py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 md:flex-row md:items-center md:gap-16 md:px-8">
        <div className="flex w-full max-w-[576px] flex-col items-start">
          <SlideIn from="left" offset={400}>
            <p className="text-[14px] font-semibold uppercase leading-[1.3] tracking-[1.4px] text-[#0097b2]">
              ABOUT US
            </p>
          </SlideIn>
          <SlideIn from="left" offset={660} delay={0.21}>
            <h2 className="mt-3 text-[32px] font-bold leading-[1.1] text-[#0a2540] sm:text-[40px] md:text-[48px]">
              <span className="text-[#0097b2]">Building bridges </span>
              between talent and opportunity
            </h2>
          </SlideIn>
          <SlideIn from="left" offset={800} delay={0.46}>
            <p className="mt-6 text-[16px] font-normal leading-[1.6] text-[#707070]">
              Andes Workforce is a Latin American talent marketplace connecting
              U.S. and global companies with exceptional offshore and nearshore
              professionals. We believe in building long-term partnerships that
              benefit both employers and talent.
            </p>
          </SlideIn>
          <SlideIn from="left" offset={800} delay={0.46}>
            <p className="mt-5 pb-10 text-[16px] font-normal leading-[26px] text-[#707070]">
              Our recruiters and talent specialists work closely with every
              client to make sure each match is more than a hire — it&apos;s the
              start of a lasting partnership.
            </p>
          </SlideIn>
          <SlideIn from="left" offset={800} delay={0.71}>
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
            className="inline-flex items-center gap-2 rounded-[20px] bg-[#0097b2] px-[25px] py-3 text-[16px] font-medium leading-[1.2] text-white transition-opacity hover:opacity-90"
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
          </SlideIn>
        </div>

        <SlideIn from="right" offset={900} delay={1.13} className="w-full max-w-[661px] md:flex-1">
        <div className="relative h-[280px] w-full overflow-hidden rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.1)] sm:h-[380px] md:h-[452px]">
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
        </SlideIn>
      </div>
    </section>
  );
}
