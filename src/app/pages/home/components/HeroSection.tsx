"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#00224d] h-[600px] overflow-hidden relative">
      <div className="container mx-auto w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* Left: Logo + Headline + Subtitle + CTA */}
        <div className="flex flex-col gap-5 justify-center text-center md:text-left px-6 md:px-12 lg:px-20">
            {/* Color logo */}
            <div className="flex justify-center md:justify-start">
              <Image
                src="/logo-andes.png"
                alt="Andes Workforce"
                width={180}
                height={46}
                className="h-auto"
                priority
              />
            </div>

            {/* Headline */}
            <h1 className="text-white font-bold text-4xl md:text-5xl leading-[1.35]">
              Work with{" "}
              <span className="text-[#0097b2]">top talent</span>
              <br />
              from{" "}
              <span className="text-[#0097b2]">Latin America</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white text-lg md:text-xl leading-relaxed tracking-[0.2px]">
              Connect with{" "}
              <span className="text-[#0097b2]">highly skilled professionals</span>
              {" "}and cut operating costs by up to{" "}
              <span className="text-[#0097b2]">60%</span>
              , without compromising quality or efficiency
            </p>

            {/* CTA */}
            <div className="flex justify-center md:justify-start">
              <Link
                href="/pages/offers"
                className="inline-flex items-center bg-[#0097b2] text-white px-6 py-3 rounded-[20px] font-medium text-lg shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] transition-all hover:bg-[#007a91]"
              >
                Find Talent Now
              </Link>
            </div>
          </div>

        {/* Right: imagen cortada por el borde derecho */}
        <div className="hidden md:block h-full relative">
          <div className="absolute inset-y-10 left-8 -right-6 rounded-l-[25px] overflow-hidden -rotate-2">
            <Image
              src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/andes_hero_home.jpg"
              alt="Andes Workforce Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
