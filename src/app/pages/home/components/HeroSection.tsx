"use client";

import Logo from "@/app/components/Logo";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2d5a87] to-[#4a90a4] py-20 md:py-32 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Elite Offshore Talent
            <br />
            <span className="text-[#0097B2]">for US Businesses</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-100">
            Connect with top-tier professionals from the Andes region while{" "}
            <span className="text-[#0097B2]">
              reducing overhead costs by up to 60%
            </span>{" "}
            while maintaining exceptional quality and seamless collaboration.
          </p>

          {/* Buttons Container with Logo */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center max-w-4xl mx-auto">
            {/* Buttons - side by side on mobile, left aligned on desktop */}
            <div className="flex flex-row gap-3 sm:gap-4 justify-center md:justify-start mb-8 md:mb-0">
              <Link
                href="/pages/offers"
                className="inline-flex items-center bg-white text-[#0097B2] px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition-all hover:shadow-xl hover:bg-gray-50 transform hover:scale-105"
              >
                Find Talent Now
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center border-2 border-white text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition-all hover:bg-white hover:text-[#0097B2] transform hover:scale-105"
              >
                Join Network
              </Link>
            </div>

            {/* Logo - bottom right on mobile, right aligned on desktop */}
            <div className="hidden md:block rounded-lg p-4 ml-8">
              <div className="flex items-center">
                <img
                  src="/logo-andes.png"
                  alt="Andes Workforce"
                  className="h-22"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Logo - positioned inside hero section, bottom right */}
        <div className="absolute bottom-[-4] right-4 md:hidden rounded-lg p-3 z-20">
          <div className="flex items-center">
            <img src="/logo-andes.png" alt="Andes Workforce" className="h-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
