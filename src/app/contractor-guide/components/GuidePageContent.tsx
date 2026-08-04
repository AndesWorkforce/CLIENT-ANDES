"use client";

import { useState } from "react";
import type { PaymentChecklistState } from "../actions/payment-checklist.actions";
import { GUIDE_STEPS } from "../contractor-guide.data";
import GuideAccordionItem from "./GuideAccordionItem";
import GuidePaymentChecklist from "./GuidePaymentChecklist";
import GuideSupportSection from "./GuideSupportSection";
import GuideWelcomeBanner from "./GuideWelcomeBanner";

type GuidePageContentProps = {
  checklistState: PaymentChecklistState;
};

export default function GuidePageContent({
  checklistState,
}: GuidePageContentProps) {
  const [openStepId, setOpenStepId] = useState<string | null>(null);

  const handleToggle = (stepId: string) => {
    setOpenStepId((current) => (current === stepId ? null : stepId));
  };

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto w-full max-w-[1440px] px-[18px] sm:px-[80px] pt-10 sm:pt-14">
        <GuideWelcomeBanner />

        <div className="mt-10 sm:mt-14 flex flex-col gap-6 sm:gap-[22px]">
          <section aria-labelledby="getting-started-heading">
            <h2
              id="getting-started-heading"
              className="text-[24px] sm:text-[32px] font-bold leading-[1.3] text-[#343434]"
            >
              Getting Started
            </h2>

            <div className="mt-6 sm:mt-[22px] flex flex-col gap-3">
              {GUIDE_STEPS.map((step, index) => (
                <GuideAccordionItem
                  key={step.id}
                  step={step}
                  stepNumber={index + 1}
                  isOpen={openStepId === step.id}
                  onToggle={() => handleToggle(step.id)}
                />
              ))}
            </div>
          </section>

          <GuidePaymentChecklist state={checklistState} />
        </div>

        <div className="mt-12 sm:mt-16">
          <GuideSupportSection />
        </div>
      </div>
    </div>
  );
}
