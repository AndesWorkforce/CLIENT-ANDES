"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-[#FCFEFF] py-8 md:py-20 overflow-hidden">
      {/* Background Circle */}
      <div className="absolute left-0 top-0 z-0">
        <Image
          src="https://appwiseinnovations.dev/Andes/elipse.png"
          alt="Background Circle"
          width={300}
          height={300}
          className="opacity-70"
        />
      </div>

      {/* Content Container */}
      <div className="container items-center mx-auto px-5 md:px-8 lg:px-12 relative z-10 flex flex-row md:items-start">
        {/* Left Content */}
        <div className="w-[65%] pr-2 md:px-20">
          <h1 className="text-[32px] md:text-[50px] font-bold mb-6 text-[#17323A]">
            Are you looking for <span className="text-[#0097B2]">talent</span>{" "}
            or a <span className="text-[#0097B2]">job</span>?
          </h1>

          <div className="space-y-5 mb-10 text-[#17323A]">
            <p className="text-lg md:text-base">
              If you have a vacancy you need filled, we provide a limitless
              source of personnel ready to start working now!
            </p>

            <p className="text-lg md:text-base">
              If you are a fluent English speaker and you are interested in
              working virtually for an employer in the United States, we will
              find a perfect fit for you!
            </p>
          </div>

          <Link
            href="/auth/register"
            className="inline-flex items-center bg-[#0097B2] text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-md font-medium transition-all hover:shadow-lg hover:bg-[#00404C]"
          >
            Get Started <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Right Content - Image */}
        <div className="w-[35%] flex justify-center items-start pt-4">
          <Image
            src="https://appwiseinnovations.dev/Andes/hero-1.png"
            alt="Professional Team"
            width={300}
            height={300}
            className="rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
