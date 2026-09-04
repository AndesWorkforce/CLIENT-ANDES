"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "../../about/components/Reveal";

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
    <div className={`overflow-hidden rounded-[12px] ${sizeClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        onError={() => setErrored(true)}
        className="size-full object-cover object-top scale-[1.28]"
      />
    </div>
  );
}

// Manually curated talent cards — fill in fotoPerfil URLs as needed
const STATIC_TALENT: TalentCard[] = [
  {
    id: "static-1",
    name: "Carlos Soto",
    country: "Colombia",
    countryCode: "🇨🇴",
    profesion: "Industrial Engineer",
    position: "Team Lead, VA Department",
    company: "US Law Firm",
    experience: "10y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Soto.webp",
    paisImagen: null,
  },
  {
    id: "static-2",
    name: "Celeste Lacomba",
    country: "Mexico",
    countryCode: "🇲🇽",
    profesion: "Graphic Designer with a Master's in International Business Administration",
    position: "Case Manager, Social Security-Hearing Level",
    company: "US Law Firm",
    experience: "5y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Lacomba.webp",
    paisImagen: null,
  },
  {
    id: "static-3",
    name: "Fernando Casamalhuapa",
    country: "El Salvador",
    countryCode: "🇸🇻",
    profesion: "International Business and Law Student",
    position: "Legal Assistant - Workers Comp",
    company: "US Law Firm",
    experience: "3y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Fernando.webp",
    paisImagen: null,
  },
  {
    id: "static-4",
    name: "Pedro Barahona",
    country: "Honduras",
    countryCode: "🇭🇳",
    profesion: "Technology engineer",
    position: "IT Assistant",
    company: "US Law Firm",
    experience: "2y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Barahona.webp",
    paisImagen: null,
  },
  {
    id: "static-5",
    name: "Marco Pabon",
    country: "Colombia",
    countryCode: "🇨🇴",
    profesion: "Bachelor's Degree in English Language Teaching",
    position: "Team Lead - VA and SSA",
    company: "US Law Firm",
    experience: "8y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Pabon.webp",
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
    <section className="relative w-full overflow-x-hidden bg-white py-[44px] md:bg-[#F6FBFC] md:py-[55px]">
      <div className="container px-[20px] md:px-[40px]">
        {/* Header */}
        <div className="mb-[22px] text-center md:mb-[33px]">
          <FadeIn>
            <p className="text-[#0097B2] font-semibold text-[12px] md:text-[14px] leading-[1.3] mb-[11px]">
              MEET OUR TALENT
            </p>
            <h2 className="mb-[11px] text-[24px] font-bold leading-[1.3] text-[#343434] md:mb-[22px] md:text-[52px]">
              Meet Our{" "}
              <span className="md:text-[#0097B2]">Featured Talent</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="text-[#343434] md:text-[#525252] font-medium text-[14px] md:text-[22px] leading-[1.2] max-w-[1026px] mx-auto">
              Discover the potential of our specialized talent. High-level
              professionals committed to excellence, available from $2,000 USD
              per month. Get maximum performance for a competitive investment.
            </p>
          </FadeIn>
        </div>

        {/* Grid de tarjetas - Desktop | Scroll horizontal - Mobile */}
        <div className="flex gap-[11px] overflow-x-auto py-3 scrollbar-hide md:grid md:grid-cols-2 md:flex-none md:gap-[24px]">
          {featuredTalent.map((talent, idx) => (
            <FadeIn
              key={talent.id}
              delay={1 + Math.floor(idx / 2) * 0.25}
              className="flex-shrink-0 w-[355px] md:w-auto origin-center"
            >
              <div className="flex h-full origin-center gap-[18px] rounded-[24px] border border-[#C8C8C8] bg-white px-[21px] py-[22px] md:p-[29px] md:transition-transform md:duration-300 md:ease-out md:motion-safe:hover:scale-[1.03] md:hover:shadow-lg">
              <div className="relative flex shrink-0 flex-col items-center md:gap-[13px]">
                <ProfileAvatar
                  src={talent.fotoPerfil}
                  name={talent.name}
                  sizeClass="w-[119px] h-[167px]"
                />
                {talent.experience && (
                  <div className="absolute bottom-[6px] left-[15px] z-10 flex items-center gap-[6px] rounded-[12px] bg-[rgba(4,78,92,0.8)] px-[11px] py-[5px] md:static md:bg-black">
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
                    <span className="text-[14px] font-semibold leading-[1.3] text-white">
                      {talent.experience}
                    </span>
                  </div>
                )}
              </div>

              {/* Right side - Info */}
              <div className="flex-1 flex flex-col gap-[8px]">
                {/* Name and Country */}
                <div className="flex flex-col gap-[7px]">
                  <h3 className="text-black font-bold text-[18px] md:text-[20px] leading-[1.3]">
                    {talent.name}
                  </h3>
                  <div className="flex items-center gap-[5px]">
                    {talent.paisImagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={talent.paisImagen}
                        alt=""
                        className="h-[14px] w-[25px] object-cover"
                      />
                    ) : (
                      <span className="text-[12px] font-semibold leading-[1.3] text-black md:text-[14px]">
                        {talent.countryCode ||
                          talent.country.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="text-[12px] font-medium leading-[1.2] text-[#343434] md:text-[14px]">
                      {talent.country}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[12px] font-medium leading-[1.2] text-[#343434] md:text-[14px]">
                    {talent.profesion}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#EFEFEF]" />

                {/* Current Role */}
                <div className="flex flex-col gap-[7px]">
                  <p className="text-[#0097B2] font-semibold text-[12px] md:text-[14px] leading-[1.3]">
                    CURRENT ROLE
                  </p>
                  <p className="text-[#343434] font-semibold text-[12px] md:text-[16px] leading-[1.3]">
                    {talent.position}
                  </p>
                  {talent.company && (
                    <p className="text-[#343434] font-medium text-[12px] md:text-[14px] leading-[1.2]">
                      at {talent.company}
                    </p>
                  )}
                </div>

                {/* Stars */}
                <div className="flex gap-[4px] mt-0 md:mt-[10px]">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="md:w-[20px] md:h-[20px]"
                      fill="#FFD700"
                    >
                      <path d="M8 0.8L10.3511 5.6393L15.6085 6.436L11.8043 10.1607L12.7023 15.564L8 13.12L3.29772 15.564L4.19575 10.1607L0.391548 6.436L5.64886 5.6393L8 0.8Z" />
                    </svg>
                  ))}
                </div>
              </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
