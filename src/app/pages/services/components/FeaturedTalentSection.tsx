"use client";

import { useState } from "react";
import { FadeIn } from "../../about/components/Reveal";

type TalentCard = {
  id: string;
  name: string;
  position: string;
  profesion: string;
  country: string;
  countryCode: string;
  company?: string;
  experience?: string;
  fotoPerfil: string | null;
};

/** Same CDN used in profile contact; restcountries v3.1 is deprecated. */
function flagUrl(iso2: string) {
  return `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`;
}

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
    countryCode: "CO",
    profesion: "Industrial Engineer",
    position: "Team Lead, VA Department",
    company: "US Law Firm",
    experience: "10y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Soto.webp",
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
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Lacomba.webp",
  },
  /*{
    id: "static-3",
    name: "Fernando Casamalhuapa",
    country: "El Salvador",
    countryCode: "SV",
    profesion: "International Business and Law Student",
    position: "Legal Assistant - Workers Comp",
    company: "US Law Firm",
    experience: "3y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Fernando.webp",
  },*/
  {
    id: "static-4",
    name: "Pedro Barahona",
    country: "Honduras",
    countryCode: "HN",
    profesion: "Technology engineer",
    position: "IT Assistant",
    company: "US Law Firm",
    experience: "2y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Barahona.webp",
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
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/Pabon.webp",
  },
  {
    id: "static-7",
    name: "Eddy Arias",
    country: "Colombia",
    countryCode: "CO",
    profesion: "Attorney",
    position: "VA Attorney Supervisor",
    company: "US Law Firm",
    experience: "5y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/eddy_a_madrigal.webp",
  },
  {
    id: "static-8",
    name: "Melissa González Córdoba",
    country: "Colombia",
    countryCode: "CO",
    profesion: "Corporate Attorney",
    position: "Junior Attorney",
    company: "US Law Firm",
    experience: "4y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/melissa_gonzales_cordoba.webp",
  },
  {
    id: "static-9",
    name: "Byron Galvis",
    country: "Colombia",
    countryCode: "CO",
    profesion: "Mechatronics Engineer",
    position: "Associate Manager, Projects & Support",
    company: "US Consultant Firm",
    experience: "7y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/byron_galvis.webp",
  },
  {
    id: "static-10",
    name: "Juan Felipe Aislant Díaz",
    country: "Colombia",
    countryCode: "CO",
    profesion: "Audiovisual Arts professional, AI Consultant",
    position: "Team Lead, SS Initial/Recon Department",
    company: "US Law Firm",
    experience: "5y exp",
    fotoPerfil: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Talento/felipe_aislant.webp",
  },
];

export default function FeaturedTalentSection() {
  const featuredTalent = STATIC_TALENT;

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
        <div className="flex gap-[11px] overflow-x-auto py-3 scrollbar-hide md:grid md:grid-cols-2 md:flex-none md:gap-x-[32px] md:gap-y-[36px] md:overflow-visible md:px-1">
          {featuredTalent.map((talent, idx) => (
            <FadeIn
              key={talent.id}
              delay={1 + Math.floor(idx / 2) * 0.25}
              className="flex-shrink-0 w-[355px] md:w-auto"
            >
              <div className="flex h-full gap-[18px] rounded-[24px] border border-[#C8C8C8] bg-white px-[21px] py-[22px] md:p-[29px] md:transition-shadow md:duration-300 md:ease-out md:hover:shadow-lg">
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={flagUrl(talent.countryCode)}
                      alt=""
                      className="h-[14px] w-[25px] object-cover"
                    />
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
