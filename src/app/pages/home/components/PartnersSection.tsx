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
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Port-Law.jpg",
      width: 80,
      height: 40,
    },
    {
      name: "Tabak",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Tabak.jpg",
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
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/WHG.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Schomburg Insurance",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Schomburg_Insurance.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Veteran Esquire",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Veteran_Esquire.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Jelks Veteran Services",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Jelks.jpg",
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

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#00224d]">Why Choose Us?</h2>
            <p className="text-base text-[#676565] mt-2">
              We make offshore staffing simple, reliable, and results-driven
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { stat: "48h", title: "Fast Hiring", desc: "Pre-evaluated expert talent ready to join your team today" },
              { stat: "60%", title: "Cost Effective", desc: "Reduce your payroll costs by hiring elite professionals" },
              { stat: "3%", title: "Quality Assured", desc: "Our rigorous process selects only the best" },
              { stat: "0", title: "Hour Difference", desc: "Fluid collaboration working in your same time zone" },
              { stat: "100%", title: "Cybersecurity", desc: "Full protection under international protocols" },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-2"
              >
                <span className="text-4xl font-bold text-[#0097b2]">{item.stat}</span>
                <h3 className="text-lg font-bold text-[#00224d]">{item.title}</h3>
                <p className="text-base text-[#676565] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
