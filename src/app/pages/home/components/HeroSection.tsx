"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2d5a87] to-[#4a90a4] py-12 md:py-6 overflow-hidden min-h-[80vh] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container: 2 columns */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-10 items-center gap-10">
          {/* Left: Texts */}
          <div className="text-white text-center md:text-left md:col-span-6 max-w-none mx-auto md:mx-0">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-1 leading-tight">
              <span className="inline md:whitespace-nowrap">
                Elevate Your Business
              </span>
              <br />
              <span className="md:text-5xl text-[#00ffff]">
                with Skilled Professionals{" "}
              </span>
              <br />
              <span className="md:text-5xl text-[#00ffff] ">
                from Latin America
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl mb-2 leading-relaxed text-gray-100">
              Connect with top-tier professionals{" "}
              <span className="text-[#00ffff]">
                reducing overhead costs by up to 60%
              </span>{" "}
              <br />
              while maintaining exceptional quality and seamless collaboration.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-start">
              <Link
                href="/pages/offers"
                className="inline-flex items-center bg-white text-[#0097B2] border-2 border-transparent px-4 sm:px-7 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all hover:shadow-xl hover:bg-white hover:text-[#0097B2] transform hover:scale-[1.02]"
              >
                Find Talent Now
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center border-2 bg-[#0097B2] border-[#0097B2] text-white px-4 sm:px-7 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all hover:shadow-xl hover:bg-white hover:text-[#0097B2] transform hover:scale-[1.02]"
              >
                Join Network
              </Link>
            </div>
          </div>

          {/* Right: White logo - hidden on mobile */}
          <div className="hidden md:flex justify-start md:justify-start md:col-span-4 relative md:-mt-26 md:-ml-20">
            <img
              src="/LOGO_ANDES_BLANCO_TRANSPARENTE.png"
              alt="Andes Workforce"
              className="w-full max-w-[680px] md:max-w-[780px] lg:max-w-[880px] opacity-70 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
