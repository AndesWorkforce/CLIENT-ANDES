"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import type { FaqItem } from "../faq.data";
import FaqAnswerContent from "./FaqAnswerContent";

type FaqAccordionItemProps = {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
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
            {item.question}
          </span>
          {isOpen && <FaqAnswerContent blocks={item.answer} />}
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
