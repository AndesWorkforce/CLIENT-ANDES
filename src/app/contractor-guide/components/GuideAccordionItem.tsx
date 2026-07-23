import { ChevronDown, ChevronRight } from "lucide-react";
import type { GuideStep } from "../contractor-guide.data";
import GuideStepContent from "./GuideStepContent";

type GuideAccordionItemProps = {
  step: GuideStep;
  stepNumber: number;
  isOpen: boolean;
  onToggle: () => void;
};

export default function GuideAccordionItem({
  step,
  stepNumber,
  isOpen,
  onToggle,
}: GuideAccordionItemProps) {
  return (
    <div className="w-full rounded-xl border border-[#c8c8c8] bg-white transition-colors hover:border-[#0097b2]/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start gap-[10px] px-4 py-[19px] text-left"
      >
        <div
          className={`flex min-w-0 flex-1 flex-col ${
            isOpen ? "gap-[22px] pb-[3px]" : ""
          }`}
        >
          <span className="text-[16px] sm:text-[18px] font-medium text-[#343434] leading-[1.2]">
            {stepNumber}. {step.title}
          </span>
          {isOpen && <GuideStepContent blocks={step.content} />}
        </div>
        {isOpen ? (
          <ChevronDown
            className="mt-0.5 size-[21px] shrink-0 text-[#343434]"
            aria-hidden
          />
        ) : (
          <ChevronRight
            className="mt-0.5 size-[21px] shrink-0 text-[#343434]"
            aria-hidden
          />
        )}
      </button>
    </div>
  );
}
