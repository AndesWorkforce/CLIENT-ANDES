"use client";

import { Tag, TrendingUp, UserRoundCheck } from "lucide-react";
import { servicesAssets } from "../services-assets";

const benefits = [
  {
    Icon: UserRoundCheck,
    title: "Vetted Elite Talent",
    description:
      "Access a pool of highly skilled professionals dedicated to excellence",
  },
  {
    Icon: TrendingUp,
    title: "High-Impact Performance",
    description:
      "Every role is filled with experts committed to delivering results",
  },
  {
    Icon: Tag,
    title: "Exceptional Value",
    description:
      "Positions start at $2,000/month with zero compromise on quality",
    rotateIcon: true,
  },
];

export default function BenefitsSection() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="flex w-full flex-col lg:flex-row lg:items-stretch lg:justify-between">
      <div className="order-2 flex w-full items-start bg-white px-6 py-12 lg:order-1 lg:h-[749px] lg:w-[52%] lg:shrink-0 lg:px-[80px] lg:py-[77px]">
        <div className="flex max-w-[601px] flex-col gap-[38px]">
          <div className="flex flex-col gap-[11px]">
            <p className="text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
              WHY ANDES WORKFORCE
            </p>
            <h2 className="text-[32px] font-bold leading-[1.3] text-black md:text-[48px]">
              Elevate your team with{" "}
              <span className="text-[#0097B2]">world-class talent</span>
            </h2>
          </div>

          <div className="flex max-w-[500px] flex-col gap-[39px]">
            {benefits.map(({ Icon, title, description, rotateIcon }) => (
              <div key={title} className="flex items-start gap-[11px]">
                <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[12px] bg-[#DFFAFF] p-[14px]">
                  <Icon
                    className={`h-8 w-8 text-[#0097B2] ${rotateIcon ? "rotate-90" : ""}`}
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col gap-[7px]">
                  <h3 className="text-[18px] font-bold leading-[1.3] text-[#0097B2]">
                    {title}
                  </h3>
                  <p className="text-[18px] font-medium leading-[1.2] text-[#525252]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToContact}
            className="w-fit rounded-[20px] bg-[#0097B2] px-[25px] py-[12px] text-[20px] font-semibold leading-[1.3] text-white shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors hover:bg-[#007A8F]"
          >
            Contact Us
          </button>
        </div>
      </div>

      <div className="order-1 h-[350px] w-full lg:order-2 lg:h-[749px] lg:w-[48%] lg:shrink-0">
        <img
          src={servicesAssets.benefitsOffice}
          alt="Office professional"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
