"use client";

import Link from "next/link";
import { Check, Globe, Shield, UserPlus } from "lucide-react";
import { SlideIn } from "../../about/components/Reveal";

const services = [
  {
    title: "Legal & Administrative",
    description:
      "Full compliance management, contracts, and documentation across Latin American jurisdictions — so your firm can build an offshore legal team without the legal risk.",
    icon: Shield,
    features: [
      "Employment contracts",
      "Tax compliance",
      "Social security",
      "Work permits",
    ],
    delay: 1.37,
  },
  {
    title: "Talent Acquisition",
    description:
      "A curated, pre-vetted network of top Latin American professionals — screened for technical skill, English fluency, and cultural fit before they ever meet your team.",
    icon: UserPlus,
    features: [
      "Tech professionals",
      "Creative talent",
      "Operations experts",
      "Executive search",
    ],
    delay: 0.96,
  },
  {
    title: "Global Opportunities",
    description:
      "We connect nearshore talent with U.S. and global companies building distributed teams — same time zones, seamless collaboration.",
    icon: Globe,
    features: [
      "Remote placements",
      "Cross-border teams",
      "Global benefits",
      "Relocation support",
    ],
    delay: 0.58,
  },
];

export default function ServicesSection() {
  return (
    <section className="overflow-x-hidden bg-[#f7f9fb] px-6 py-14 sm:py-[55px]">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 max-w-[672px] sm:mb-16">
          <SlideIn from="left" offset={400}>
            <p className="mb-3 text-[14px] font-semibold uppercase leading-[1.3] tracking-[1.4px] text-[#0097b2]">
              OUR SERVICES
            </p>
          </SlideIn>
          <SlideIn from="left" offset={860} delay={0.19}>
            <h2 className="mb-4 text-[32px] font-bold leading-[1.3] text-[#0a1628] md:text-[48px]">
              One partner for every stage of offshore hiring
            </h2>
          </SlideIn>
          <SlideIn from="left" offset={900} delay={0.4}>
            <p className="text-[18px] font-normal leading-[1.6] text-[#5a6a7a]">
              From sourcing to compliance, we manage the complexity of nearshore
              staffing so you can focus on growing your team.
            </p>
          </SlideIn>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <SlideIn
                key={service.title}
                from="left"
                offset={800}
                delay={service.delay}
                duration={0.8}
              >
                <div className="flex h-full origin-center flex-col rounded-[16px] bg-white p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out motion-safe:hover:scale-[1.03] hover:shadow-lg">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-[16px] bg-[rgba(11,200,233,0.12)]">
                    <Icon className="size-5 text-[#0097b2]" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 text-[20px] font-bold leading-[28px] text-black">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-[14px] font-normal leading-[1.5] text-[#707070]">
                    {service.description}
                  </p>
                  <ul className="mb-8 flex flex-col gap-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check
                          className="size-[14px] shrink-0 text-[#0097b2]"
                          strokeWidth={2.5}
                        />
                        <span className="text-[14px] leading-5 text-[#707070]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pages/services"
                    className="mt-auto flex items-center gap-1 text-[14px] font-semibold leading-5 text-[#0bc8e9] transition-all hover:gap-2"
                  >
                    Learn more
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </SlideIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
