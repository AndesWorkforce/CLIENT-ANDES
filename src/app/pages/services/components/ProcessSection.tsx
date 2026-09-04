"use client";

import { FadeIn } from "../../about/components/Reveal";

const steps = [
  {
    num: "01",
    title: "Tell us your needs",
    description:
      "Share the role, hours, and the exact skills you're looking for",
  },
  {
    num: "02",
    title: "Get matched in 48h",
    description: "We hand-pick 3 vetted candidates from our 300+ talent pool",
  },
  {
    num: "03",
    title: "Select your candidates",
    description: "You interview, we handle contracts, payroll, and compliance.",
  },
  {
    num: "04",
    title: "Scale with confidence",
    description: "Ongoing support and a dedicated success manager.",
  },
];

export default function ProcessSection() {
  return (
    <section className="w-full overflow-x-hidden bg-white py-[44px] md:py-[117px] px-[18px] md:px-[80px]">
      <div className="max-w-[1440px] mx-auto">
        <FadeIn className="text-center mb-[22px] md:mb-[30px]">
          <p className="mb-[11px] text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
            HOW IT WORKS
          </p>
          <h2 className="mb-[11px] text-[24px] font-bold leading-[1.3] text-[#343434] md:mb-[22px] md:text-[52px] md:leading-[1.2] md:text-black">
            From <span className="text-[#0097B2]">request</span> to ready in days,
            <br className="hidden md:block" /> not weeks
          </h2>
          <p className="text-[14px] font-medium leading-[1.2] text-[#343434] md:text-[22px] md:text-[#525252]">
            A simple, transparent process designed to remove friction from your
            hiring
          </p>
        </FadeIn>

        <div className="flex flex-col md:flex-row justify-center gap-[44px]">
          {steps.map((step, idx) => (
            <FadeIn
              key={step.num}
              delay={0.5 + idx * 0.25}
              className="w-full origin-center md:w-[287px]"
            >
              <div className="flex origin-center flex-col gap-[18px] md:transition-transform md:duration-300 md:ease-out md:motion-safe:hover:scale-[1.03]">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[12px] bg-[#DFFAFF]">
                  <p className="text-[22px] font-bold leading-[1.3] text-[#0097B2]">
                    {step.num}
                  </p>
                </div>
                <h3 className="text-[22px] font-bold leading-[1.3] text-black">
                  {step.title}
                </h3>
                <p className="text-[18px] font-medium leading-[1.5] text-[#525252]">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
