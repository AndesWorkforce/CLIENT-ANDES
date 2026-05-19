"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { TeamMember } from "../../team/team.data";

interface PetFamilyCarouselProps {
  petMembers: TeamMember[];
}

export default function PetFamilyCarousel({ petMembers }: PetFamilyCarouselProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [trackIndex, setTrackIndex] = useState(5);
  const [transitionOn, setTransitionOn] = useState(true);
  const petIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visibleCountRef = useRef(5);
  const trackIndexRef = useRef(5);

  const total = petMembers.length;
  const extendedPets = [
    ...petMembers.slice(-visibleCount),
    ...petMembers,
    ...petMembers.slice(0, visibleCount),
  ];
  const realIndex = ((trackIndex - visibleCount) % total + total) % total;

  const handleTransitionEnd = () => {
    const ti = trackIndexRef.current;
    const vc = visibleCountRef.current;
    if (ti >= vc + total) {
      const newTi = vc + (ti - vc - total);
      trackIndexRef.current = newTi;
      setTransitionOn(false);
      setTrackIndex(newTi);
    } else if (ti < vc) {
      const newTi = vc + total - (vc - ti);
      trackIndexRef.current = newTi;
      setTransitionOn(false);
      setTrackIndex(newTi);
    }
  };

  useEffect(() => {
    if (!transitionOn) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionOn(true));
      });
    }
  }, [transitionOn]);

  const nav = (dir: 1 | -1) => {
    setTransitionOn(true);
    setTrackIndex((t) => {
      const newT = t + dir;
      trackIndexRef.current = newT;
      return newT;
    });
  };

  const startPetAutoPlay = () => {
    if (petIntervalRef.current) clearInterval(petIntervalRef.current);
    petIntervalRef.current = setInterval(() => nav(1), 3500);
  };

  useEffect(() => {
    const update = () => {
      const count =
        window.innerWidth >= 1024 ? 5 : window.innerWidth >= 640 ? 3 : 2;
      const diff = count - visibleCountRef.current;
      visibleCountRef.current = count;
      setTransitionOn(false);
      setTrackIndex((t) => {
        const newT = t + diff;
        trackIndexRef.current = newT;
        return newT;
      });
      setVisibleCount(count);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (petMembers.length > 1) startPetAutoPlay();
    return () => {
      if (petIntervalRef.current) clearInterval(petIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (petMembers.length === 0) return null;

  return (
    <div className="mt-14 md:mt-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-[#0097b2] text-4xl md:text-[52px] font-bold leading-[1.3]">
          Our Pet Family
        </h2>
        <p className="mt-3 text-[#525252] text-lg md:text-[22px] font-medium leading-[1.2]">
          The furry co-workers who make everyday a little brighter
        </p>
      </div>

      {/* Carousel Wrapper */}
      <div
        className="py-10 px-4 md:px-8"
        onMouseEnter={() => {
          if (petIntervalRef.current) {
            clearInterval(petIntervalRef.current);
            petIntervalRef.current = null;
          }
        }}
        onMouseLeave={startPetAutoPlay}
      >
        {/* Track container */}
        <div className="relative overflow-hidden">
          {/* Extended sliding track with clones for infinite loop */}
          <div
            className={`flex ${
              transitionOn
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${trackIndex * (100 / visibleCount)}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedPets.map((pet, idx) => (
              <div
                key={`${pet.id}-${idx}`}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="flex flex-col rounded-[15px] overflow-hidden bg-white shadow-sm h-full">
                  {/* Rectangular Image */}
                  <div className="relative h-[204px] w-full flex-shrink-0">
                    {pet.image ? (
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fill
                        sizes="25vw"
                        className={pet.imageClass || "object-cover"}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0097B2] flex items-center justify-center text-4xl">
                        🐾
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-white px-6 py-5 text-center flex-1 flex flex-col justify-center h-[110px] overflow-hidden">
                    <h3 className="text-[18px] font-bold text-black leading-[1.3]">
                      {pet.name}
                    </h3>
                    <p className="text-[14px] font-medium text-black leading-[1.2] mt-0.5">
                      {pet.role}
                    </p>
                    {pet.bullets.length > 0 && (
                      <p className="text-[12px] font-normal text-black tracking-[0.24px] leading-[1.3] mt-1 line-clamp-2">
                        {pet.bullets[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev Button */}
          <button
            onClick={() => {
              nav(-1);
              startPetAutoPlay();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0097B2] transition-all group z-10"
            aria-label="Previous pets"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={() => {
              nav(1);
              startPetAutoPlay();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0097B2] transition-all group z-10"
            aria-label="Next pets"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots - one per real pet */}
        <div className="flex justify-center gap-2 mt-6">
          {petMembers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newTi = visibleCountRef.current + idx;
                trackIndexRef.current = newTi;
                setTransitionOn(true);
                setTrackIndex(newTi);
                startPetAutoPlay();
              }}
              aria-label={`Go to pet ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === realIndex
                  ? "w-6 h-3 bg-[#0097B2]"
                  : "w-3 h-3 bg-[#0097B2]/30 hover:bg-[#0097B2]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
