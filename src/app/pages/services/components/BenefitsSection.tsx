"use client";

import { Tag, TrendingUp, UserRoundCheck } from "lucide-react";
import { servicesAssets } from "../services-assets";
import { SlideIn } from "../../about/components/Reveal";

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
      const reduceMotion = window.matchMedia("(max-width: 767px)").matches;
      contactSection.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <section className="flex w-full flex-col overflow-x-hidden lg:flex-row lg:items-stretch lg:justify-between">
      <div className="flex w-full items-start bg-white px-[18px] py-[44px] lg:h-[749px] lg:w-[52%] lg:shrink-0 lg:px-[80px] lg:py-[77px]">
        <div className="flex w-full max-w-[601px] flex-col gap-[38px]">
          <SlideIn from="left" offset={800}>
            <div className="flex flex-col gap-[11px]">
              <p className="text-[12px] font-semibold leading-[1.3] text-[#0097B2] lg:text-[14px]">
                WHY ANDES WORKFORCE
              </p>
              <h2 className="text-[24px] font-bold leading-[1.3] text-black lg:text-[48px]">
                Elevate your team with{" "}
                <span className="text-[#0097B2]">world-class talent</span>
              </h2>
            </div>
          </SlideIn>

          <div className="flex max-w-[500px] flex-col gap-[39px]">
            {benefits.map(({ Icon, title, description, rotateIcon }, idx) => (
              <SlideIn key={title} from="left" offset={800} delay={0.5 + idx * 0.25}>
                <div className="flex origin-center items-start gap-[11px] md:transition-transform md:duration-300 md:ease-out md:motion-safe:hover:scale-[1.03]">
                  <div className="flex size-[62px] shrink-0 items-center justify-center rounded-[12px] bg-[#DFFAFF] p-[14px] lg:size-[58px]">
                    <Icon
                      className={`h-8 w-8 text-[#0097B2] ${rotateIcon ? "rotate-90" : ""}`}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-[7px]">
                    <h3 className="text-[16px] font-bold leading-[1.3] text-[#0097B2] lg:text-[18px]">
                      {title}
                    </h3>
                    <p className="text-[14px] font-medium leading-[1.2] text-[#525252] lg:text-[18px]">
                      {description}
                    </p>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>

          <SlideIn from="left" offset={900} delay={1.43}>
            <button
              type="button"
              onClick={scrollToContact}
              className="w-fit rounded-[20px] bg-[#0097B2] px-[25px] py-[12px] text-[20px] font-semibold leading-[1.3] text-white shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors hover:bg-[#007A8F]"
            >
              Contact Us
            </button>
          </SlideIn>
        </div>
      </div>

      <div className="hidden h-[749px] w-[48%] shrink-0 lg:block">
        <img
          src={servicesAssets.benefitsOffice}
          alt="Office professional"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
