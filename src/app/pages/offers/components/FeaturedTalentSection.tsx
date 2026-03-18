"use client";

import { useState, useEffect } from "react";
import {
  getFeaturedProfiles,
  FeaturedProfile,
} from "@/app/admin/dashboard/actions/featured-profiles.actions";

type TalentCard = {
  id: string;
  name: string;
  position: string;
  profesion: string;
  country: string;
  company?: string;
  fotoPerfil: string | null;
  paisImagen: string | null;
};

/** Renders a profile photo or initials — never loops on 404 */
function ProfileAvatar({
  src,
  name,
  sizeClass = "w-20 h-20",
  textClass = "text-xl",
}: {
  src: string | null;
  name: string;
  sizeClass?: string;
  textClass?: string;
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
        className={`flex items-center justify-center rounded-[5px] bg-[#0097B2] text-white font-semibold flex-shrink-0 self-center ${sizeClass} ${textClass}`}
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
      className={`rounded-[5px] object-cover flex-shrink-0 self-center ${sizeClass}`}
    />
  );
}

function mapProfileToCard(profile: FeaturedProfile): TalentCard {
  return {
    id: profile.id,
    name: `${profile.nombre ?? ""} ${profile.apellido ?? ""}`.trim(),
    position: profile.position ?? "",
    profesion: profile.profesion ?? "",
    country: profile.pais ?? "",
    company: "",
    fotoPerfil: profile.fotoPerfil ?? null,
    paisImagen: profile.paisImagen ?? null,
  };
}

// Manually curated talent cards — fill in fotoPerfil URLs as needed
const STATIC_TALENT: TalentCard[] = [
  {
    id: "static-1",
    name: "Carlos Soto",
    country: "Colombia",
    profesion: "Industrial Engineer",
    position: "Team Lead, VA Department",
    company: "US Law Firm",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/6f38c54b-7094-4963-88db-22d87b721ee4.png",
    paisImagen: null,
  },
  {
    id: "static-2",
    name: "Celeste Lacomba",
    country: "Mexico",
    profesion: "Graphic Designer with a Master's in International Business Administration",
    position: "Case Manager, Social Security-Hearing Level",
    company: "US Law Firm",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/2d076613-4a69-4d63-b086-0a94270b8e3e.png",
    paisImagen: null,
  },
  {
    id: "static-3",
    name: "Fernando Casamalhuapa",
    country: "El Salvador",
    profesion: "International Business and Law Student",
    position: "Legal Assistant - Workers Comp",
    company: "US Law Firm",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/671a4892-a0b8-453a-ab36-bdb592297e18.png",
    paisImagen: null,
  },
  {
    id: "static-4",
    name: "Pedro Barahona",
    country: "Honduras",
    profesion: "Bachelor's Degree in Computer Science",
    position: "IT Assistant",
    company: "US Law Firm",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/4573c7a0-b5ad-4b55-8f27-97f1e5614066.png",
    paisImagen: null,
  },
  {
    id: "static-5",
    name: "Julian Grisales",
    country: "France",
    profesion: "Publicist",
    position: "Marketing & Communications Specialist",
    company: "Andes Workforce Staff",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/d15eaf20-8251-4829-a2c4-e1e8d664933d.png",
    paisImagen: null,
  },
  {
    id: "static-6",
    name: "Marco Pabon",
    country: "Colombia",
    profesion: "Bachelor's Degree in English Language Teaching",
    position: "Team Lead - VA and SSA",
    company: "US Law Firm",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/cf1a2786-31e0-4d52-8080-85864835ef12.png",
    paisImagen: null,
  },
];

// Cards cloned on each side to enable seamless looping (must equal max visibleCount)
export default function FeaturedTalentSection() {
  const [featuredTalent, setFeaturedTalent] = useState<TalentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cards = [...STATIC_TALENT];

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

  const [visibleCount, setVisibleCount] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const max = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      setVisibleCount(Math.min(max, featuredTalent.length || 1));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [featuredTalent.length]);

  if (loading || featuredTalent.length === 0) return null;

  // Double the list so the marquee loops seamlessly
  const doubled = [...featuredTalent, ...featuredTalent];
  // translateX target = one full original set width relative to the track
  const shiftPct = (featuredTalent.length * 100) / visibleCount;
  // ~6 s per card, minimum 18 s total
  const duration = Math.max(18, featuredTalent.length * 6);

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center bg-white py-12 md:py-16 lg:py-20">
      {/* Scoped keyframes for the marquee */}
      <style>{`
        @keyframes talent-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-${shiftPct}%); }
        }
      `}</style>

      <div className="mx-auto px-4 sm:px-8 lg:px-[80px] w-full">
        {/* Header */}
          <div className="text-center mb-8 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-[#0097b2] text-2xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
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

        {/* Marquee */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex"
            style={{
              animation: `talent-marquee ${duration}s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {doubled.map((talent, idx) => (
              <div
                key={`${talent.id}-${idx}`}
                className="flex-shrink-0 pr-3 sm:pr-4 box-border"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="bg-white border border-[#d2d2d2] rounded-[10px] p-[15px] flex flex-col sm:flex-row gap-[12px] sm:gap-[15px] overflow-hidden h-full">
                  {/* Profile Image */}
                  <div className="flex justify-center sm:justify-start">
                    <ProfileAvatar
                      src={talent.fotoPerfil}
                      name={talent.name}
                      sizeClass="w-[150px] h-[150px] sm:w-[190px] sm:h-[190px]"
                      textClass="text-3xl sm:text-4xl"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-[10px] sm:gap-[12px] sm:py-[5px] min-w-0 flex-1">
                    {/* Name + Country grouped tightly */}
                    <div>
                      <h3 className="font-bold text-[16px] text-black break-words">
                        {talent.name}
                      </h3>
                      {talent.country && (
                        <div className="flex items-center gap-[6px] mt-1">
                          {talent.paisImagen && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={talent.paisImagen}
                              alt={talent.country}
                              className="w-[23px] h-[20px] object-contain flex-shrink-0"
                            />
                          )}
                          <p className="font-medium text-[14px] text-black break-words">
                            {talent.country}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Profession / Degree */}
                    {talent.profesion && (
                      <p className="font-medium text-[14px] text-[#676565] break-words">
                        {talent.profesion}
                      </p>
                    )}

                    {/* Role + Company */}
                    <div className="flex flex-col gap-[4px]">
                      {talent.position && (
                        <p className="font-medium text-[14px] text-[#0097b2] break-words">
                          {talent.position}
                        </p>
                      )}
                      {talent.company && (
                        <p className="font-medium text-[14px] text-[#676565] break-words">
                          {talent.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
