"use client";

import Image from "next/image";
import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      title: "Legal & Administrative",
      description: "Full compliance management, contracts, and documentation across Latin American jurisdictions — so you can hire without legal risk.",
      icon: "/icons/shield-check.svg",
      gradient: "linear-gradient(135deg, rgba(0, 187, 167, 0.2) 0%, rgba(0, 150, 137, 0.05) 100%)",
      features: [
        "Employment contracts",
        "Tax compliance",
        "Social security",
        "Work permits"
      ]
    },
    {
      title: "Talent Acquisition",
      description: "A curated pool of top-tier professionals screened for technical skills, English fluency, and cultural fit with your team.",
      icon: "/icons/users.svg",
      gradient: "linear-gradient(135deg, rgba(0, 184, 219, 0.2) 0%, rgba(0, 146, 184, 0.05) 100%)",
      features: [
        "Tech professionals",
        "Creative talent",
        "Operations experts",
        "Executive search"
      ]
    },
    {
      title: "Global Opportunities",
      description: "Bridge the gap between Latin American talent and international companies seeking world-class remote expertise.",
      icon: "/icons/globe.svg",
      gradient: "linear-gradient(135deg, rgba(0, 188, 125, 0.2) 0%, rgba(0, 153, 102, 0.05) 100%)",
      features: [
        "Remote placements",
        "Cross-border teams",
        "Global benefits",
        "Relocation support"
      ]
    }
  ];

  return (
    <section className="bg-[#f7f9fb] py-14 px-6">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="max-w-[672px] mb-16">
          <p className="text-[#0c9b8e] text-[14px] font-semibold leading-[1.3] mb-3">
            OUR SERVICES
          </p>
          <h2 className="text-[#0a1628] text-[32px] md:text-[48px] font-bold leading-[1.3] mb-4">
            Everything you need to hire
            <br />
            across borders
          </h2>
          <p className="text-[#5a6a7a] text-[18px] font-normal leading-[1.6]">
            From sourcing to compliance — we handle the complexity so you can focus on building great teams.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-[rgba(0,0,0,0.05)] rounded-[16px] p-8 flex flex-col"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-6"
                style={{ backgroundImage: service.gradient }}
              >
                <div className="w-5 h-5 text-[#0c9b8e]">
                  {/* Icon placeholder - using emoji for now */}
                  {index === 0 && <span className="text-xl">🛡️</span>}
                  {index === 1 && <span className="text-xl">👥</span>}
                  {index === 2 && <span className="text-xl">🌍</span>}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[#0a1628] text-[20px] font-bold leading-[28px] mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[#5a6a7a] text-[14px] font-normal leading-[1.5] mb-6">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="flex flex-col gap-2 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                      <circle cx="7" cy="7" r="6" stroke="#0c9b8e" strokeWidth="2"/>
                      <path d="M4 7l2 2 4-4" stroke="#0c9b8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[rgba(10,22,40,0.7)] text-[14px] font-normal leading-[20px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <Link
                href="/pages/services"
                className="flex items-center gap-1 text-[#0c9b8e] text-[14px] font-semibold leading-[20px] mt-auto hover:gap-2 transition-all"
              >
                <span>Learn more</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
