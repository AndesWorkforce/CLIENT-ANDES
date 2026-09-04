"use client";

import Image from "next/image";

export default function PartnersSection() {

  const partners = [
    // {
    //   name: "Ardon Health Group",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/bernheim-kelley-battista-injury-lawyers-logo-home.png",
    //   width: 80,
    //   height: 40,
    // },
    {
      name: "Port Law",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/Port-Law-Firm-Logo.webp",
      width: 80,
      height: 40,
    },
    {
      name: "Tabak",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/tabak-law-logo-2017.jpg",
      width: 80,
      height: 40,
    },
    // {
    //   name: "Vels",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/VELS-Main-Logo.png",
    //   width: 110,
    //   height: 40,
    // },
    // {
    //   name: "VetLaw",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/VetLaw.jpg",
    //   width: 110,
    //   height: 40,
    // },
    {
      name: "WHG",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/443713131_293370327175156_2158509847576955820_n.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Schomburg Insurance",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/Schomburg_Insurance.webp",
      width: 110,
      height: 40,
    },
    {
      name: "Veteran Esquire",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/logo.webp",
      width: 110,
      height: 40,
    },
    {
      name: "Jelks Veteran Services",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/Jelks.webp",
      width: 110,
      height: 40,
    },
    // {
    //   name: "CaseScribe",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/casescribe.png",
    //   width: 110,
    //   height: 40,
    // },
  ];

  return (
    <>
      <section className="py-10 bg-white">
        <div className="container mx-auto px-5">
          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#00224d]">
              Trusted By
            </h2>
            <p className="text-base text-[#676565] mt-1">
              Backed by world-class companies
            </p>
          </div>

          {/* Carrusel infinito auto-scroll */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-infinite">
              {partners.map((partner, index) => (
                <div
                  key={`original-${index}`}
                  className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.width * 1.5}
                    height={partner.height * 1.5}
                    className="object-contain"
                  />
                </div>
              ))}
              {partners.map((partner, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.width * 1.5}
                    height={partner.height * 1.5}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
