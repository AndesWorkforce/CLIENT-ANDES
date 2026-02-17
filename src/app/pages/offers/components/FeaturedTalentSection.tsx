"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const featuredTalent = [
  {
    id: 1,
    name: "Julian Grisales",
    position: "Software Engineer",
    client: "Tech Corp",
    country: "Colombia",
    image: "/images/placeholder-profile.jpg",
  },
  {
    id: 2,
    name: "Marcy Pelaez",
    position: "UX Designer",
    client: "Design Studio",
    country: "Colombia",
    image: "/images/placeholder-profile.jpg",
  },
  {
    id: 3,
    name: "Camila Lesenfans",
    position: "Marketing Manager",
    client: "Market Agency",
    country: "Colombia",
    image: "/images/placeholder-profile.jpg",
  },
];

export default function FeaturedTalentSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredTalent.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= featuredTalent.length - 3 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-7xl mx-auto px-8 w-full">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[#0097b2] text-4xl md:text-5xl font-bold mb-6">
            Meet Our Featured Talent
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Discover the potential of our{" "}
            <span className="font-bold">specialized talent</span>. High-level professionals
            committed to excellence, available from{" "}
            <span className="font-bold">$2,000 USD per month</span>. Get{" "}
            <span className="font-bold">maximum performance</span> for a competitive
            investment.
          </p>
        </div>

        {/* Carousel */}
        <div className="flex items-center justify-center gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Previous profiles"
          >
            <ChevronLeft size={35} className="text-gray-600" />
          </button>

          {/* Cards */}
          <div className="flex gap-4 overflow-hidden">
            {featuredTalent.slice(currentIndex, currentIndex + 3).map((talent) => (
              <div
                key={talent.id}
                className="bg-white border border-gray-300 rounded-xl p-4 flex gap-4 min-w-[380px]"
              >
                {/* Profile Image */}
                <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={talent.image}
                    alt={talent.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{talent.name}</h3>
                    <div className="w-6 h-4 relative">
                      <Image
                        src="/images/colombia-flag.png"
                        alt={talent.country}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#0097b2] font-medium">{talent.position}</p>
                    <p className="text-gray-500 text-sm">{talent.client}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Next profiles"
          >
            <ChevronRight size={35} className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
