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
  countryCode?: string;
  company?: string;
  experience?: string;
  fotoPerfil: string | null;
  paisImagen: string | null;
};

/** Renders a profile photo or initials — never loops on 404 */
function ProfileAvatar({
  src,
  name,
  sizeClass = "w-[119px] h-[173px]",
}: {
  src: string | null;
  name: string;
  sizeClass?: string;
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
        className={`flex items-center justify-center rounded-[12px] bg-[#0097B2] text-white font-semibold text-4xl ${sizeClass}`}
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
      className={`rounded-[12px] object-cover ${sizeClass}`}
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
    countryCode: "CO",
    profesion: "Industrial Engineer",
    position: "Team Lead, VA Department",
    company: "US Law Firm",
    experience: "10y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/6f38c54b-7094-4963-88db-22d87b721ee4.png",
    paisImagen: null,
  },
  {
    id: "static-2",
    name: "Celeste Lacomba",
    country: "Mexico",
    countryCode: "MX",
    profesion: "Graphic Designer with a Master's in International Business Administration",
    position: "Case Manager, Social Security-Hearing Level",
    company: "US Law Firm",
    experience: "5y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/2d076613-4a69-4d63-b086-0a94270b8e3e.png",
    paisImagen: null,
  },
  {
    id: "static-3",
    name: "Fernando Casamalhuapa",
    country: "El Salvador",
    countryCode: "SV",
    profesion: "International Business and Law Student",
    position: "Legal Assistant - Workers Comp",
    company: "US Law Firm",
    experience: "3y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/671a4892-a0b8-453a-ab36-bdb592297e18.png",
    paisImagen: null,
  },
  {
    id: "static-4",
    name: "Pedro Barahona",
    country: "Honduras",
    countryCode: "HN",
    profesion: "Technology engineer",
    position: "IT Assistant",
    company: "US Law Firm",
    experience: "2y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/4573c7a0-b5ad-4b55-8f27-97f1e5614066.png",
    paisImagen: null,
  },
  {
    id: "static-5",
    name: "Marco Pabon",
    country: "Colombia",
    countryCode: "CO",
    profesion: "Bachelor's Degree in English Language Teaching",
    position: "Team Lead - VA and SSA",
    company: "US Law Firm",
    experience: "8y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/profile/cf1a2786-31e0-4d52-8080-85864835ef12.png",
    paisImagen: null,
  }
];

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

  if (loading || featuredTalent.length === 0) return null;

  return (
    <section className="relative w-full bg-[#F6FBFC] py-[55px] px-[75px]">
      <div className="max-w-[1284px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[33px]">
          <p className="text-[#0097B2] font-semibold text-[14px] leading-[1.3] mb-[11px]">
            MEET OUR TALENT
          </p>
          <h2 className="text-[#343434] font-bold text-[52px] leading-[1.3] mb-[22px]">
            Meet Our Featured Talent
          </h2>
          <p className="text-[#525252] font-medium text-[22px] leading-[1.2] max-w-[1026px] mx-auto">
            Discover the potential of our specialized talent. High-level professionals
            committed to excellence, available from $2,000 USD per month. Get maximum
            performance for a competitive investment.
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {featuredTalent.map((talent) => (
            <div
              key={talent.id}
              className="bg-white border border-[#C8C8C8] rounded-[24px] p-[29px] flex gap-[18px]"
            >
              {/* Left side - Photo and Experience */}
              <div className="flex flex-col gap-[13px] items-center">
                <ProfileAvatar
                  src={talent.fotoPerfil}
                  name={talent.name}
                  sizeClass="w-[119px] h-[173px]"
                />
                {talent.experience && (
                  <div className="bg-black px-[11px] py-[5px] rounded-[12px] flex items-center gap-[6px]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 4v4l2 2" />
                    </svg>
                    <span className="text-white font-semibold text-[14px] leading-[1.3]">
                      {talent.experience}
                    </span>
                  </div>
                )}
              </div>

              {/* Right side - Info */}
              <div className="flex-1 flex flex-col gap-[8px]">
                {/* Name and Country */}
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-black font-bold text-[20px] leading-[1.3]">
                    {talent.name}
                  </h3>
                  <div className="flex items-center gap-[5px]">
                    <span className="text-black font-semibold text-[14px] leading-[1.3]">
                      {talent.countryCode || talent.country.substring(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[#343434] font-medium text-[14px] leading-[1.2]">
                      {talent.country}
                    </span>
                  </div>
                  <p className="text-[#343434] font-medium text-[14px] leading-[1.2]">
                    {talent.profesion}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#EFEFEF]" />

                {/* Current Role */}
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[#0097B2] font-semibold text-[14px] leading-[1.3]">
                    CURRENT ROLE
                  </p>
                  <p className="text-[#343434] font-semibold text-[16px] leading-[1.3]">
                    {talent.position}
                  </p>
                  {talent.company && (
                    <p className="text-[#343434] font-medium text-[14px] leading-[1.2]">
                      at {talent.company}
                    </p>
                  )}
                </div>

                {/* Stars */}
                <div className="flex gap-[4px] mt-[10px]">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="#FFD700"
                    >
                      <path d="M10 1L12.9389 7.0491L19.5106 8.0451L14.7553 12.7009L15.8779 19.4549L10 16.4L4.12215 19.4549L5.24472 12.7009L0.489435 8.0451L7.06107 7.0491L10 1Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
