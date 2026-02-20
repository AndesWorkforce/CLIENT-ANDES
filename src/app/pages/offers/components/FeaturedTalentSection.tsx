"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getFeaturedProfiles,
  FeaturedProfile,
} from "@/app/admin/dashboard/actions/featured-profiles.actions";

type TalentCard = {
  id: string;
  name: string;
  position: string;
  client: string;
  country: string;
  fotoPerfil: string | null;
  paisImagen: string | null;
};

/** Renders a profile photo or initials — never loops on 404 */
function ProfileAvatar({
  src,
  name,
  size = 150,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || errored) {
    return (
      <div
        className="flex items-center justify-center rounded-[5px] bg-[#0097B2] text-white font-semibold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.28 }}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className="rounded-[5px] object-cover flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

function mapProfileToCard(profile: FeaturedProfile): TalentCard {
  return {
    id: profile.id,
    name: `${profile.nombre ?? ""} ${profile.apellido ?? ""}`.trim(),
    position: profile.position ?? "",
    client: profile.client ?? "",
    country: profile.pais ?? "",
    fotoPerfil: profile.fotoPerfil ?? null,
    paisImagen: profile.paisImagen ?? null,
  };
}

export default function FeaturedTalentSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredTalent, setFeaturedTalent] = useState<TalentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getFeaturedProfiles();
      if (!res.success || res.data.length === 0) {
        setLoading(false);
        return;
      }

      const cards = res.data.map(mapProfileToCard);

      // Collect unique country names that are missing a flag URL
      const missing = [...new Set(
        cards.filter((c) => c.country && !c.paisImagen).map((c) => c.country)
      )];

      if (missing.length > 0) {
        try {
          const flagRes = await fetch(
            `https://restcountries.com/v3.1/all?fields=name,flags`
          );
          if (flagRes.ok) {
            const all: { name: { common: string }; flags: { png: string } }[] =
              await flagRes.json();
            const flagMap = new Map(all.map((c) => [c.name.common, c.flags.png]));
            for (const card of cards) {
              if (card.country && !card.paisImagen) {
                card.paisImagen = flagMap.get(card.country) ?? null;
              }
            }
          }
        } catch {
          // fallback: show country text instead
        }
      }

      setFeaturedTalent(cards);
      setLoading(false);
    }
    load();
  }, []);

  const visibleCount = Math.min(3, featuredTalent.length);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, featuredTalent.length - visibleCount) : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= featuredTalent.length - visibleCount ? 0 : prev + 1
    );
  };

  // Don't render the section while loading or if no featured profiles exist
  if (loading || featuredTalent.length === 0) return null;

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="mx-auto px-[80px] w-full">
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
          <div className="flex gap-4 flex-1 min-w-0">
            {featuredTalent.slice(currentIndex, currentIndex + visibleCount).map((talent) => (
              <div
                key={talent.id}
                className="bg-white border border-[#d2d2d2] rounded-[10px] p-[15px] flex gap-[15px] flex-1 min-w-[400px] overflow-hidden"
              >
                {/* Profile Image — 150×150 rounded-[5px] */}
                <ProfileAvatar
                  src={talent.fotoPerfil}
                  name={talent.name}
                  size={150}
                />

                {/* Info */}
                <div className="flex flex-col gap-[12px] py-[5px] self-start min-w-0 flex-1">
                  {/* Name + flag */}
                  <div className="flex items-center gap-[10px]">
                    <h3 className="font-bold text-[16px] text-black break-words">
                      {talent.name}
                    </h3>
                    {talent.paisImagen && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={talent.paisImagen}
                        alt={talent.country}
                        className="w-[23px] h-[20px] object-contain flex-shrink-0"
                      />
                    )}
                  </div>
                  {/* Position + client */}
                  <div className="flex flex-col gap-[5px]">
                    <p className="font-medium text-[14px] text-[#0097b2] break-words">
                      {talent.position}
                    </p>
                    <p className="font-medium text-[14px] text-[#676565] break-words">
                      {talent.client}
                    </p>
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
