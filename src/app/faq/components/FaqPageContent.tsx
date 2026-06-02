"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FAQ_SECTIONS, type FaqSection } from "../faq.data";
import FaqAccordionItem from "./FaqAccordionItem";

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function filterSections(query: string): FaqSection[] {
  const normalized = normalizeSearch(query);
  if (!normalized) return FAQ_SECTIONS;

  return FAQ_SECTIONS.map((section) => {
    const sectionMatches = section.title.toLowerCase().includes(normalized);
    const filteredItems = section.items.filter((item) => {
      const questionMatch = item.question.toLowerCase().includes(normalized);
      const answerMatch = item.answer.some((block) => {
        if (block.type === "list") {
          return block.items.some((entry) =>
            entry.toLowerCase().includes(normalized)
          );
        }
        return block.text.toLowerCase().includes(normalized);
      });
      return questionMatch || answerMatch || sectionMatches;
    });

    if (filteredItems.length === 0) return null;
    return { ...section, items: filteredItems };
  }).filter((section): section is FaqSection => section !== null);
}

export default function FaqPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const filteredSections = useMemo(
    () => filterSections(searchQuery),
    [searchQuery]
  );

  const handleToggle = (itemId: string) => {
    setOpenItemId((current) => (current === itemId ? null : itemId));
  };

  return (
    <div className="bg-white pb-16">
      <div className="mx-auto w-full max-w-[1280px] px-[18px] sm:px-[80px] pt-10 sm:pt-[102px]">
        <label htmlFor="faq-search" className="sr-only">
          Search help topics
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-[#c8c8c8]"
            aria-hidden
          />
          <input
            id="faq-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search help topics…"
            className="h-[59px] w-full rounded-xl border border-[#c8c8c8] bg-white py-4 pl-[51px] pr-4 text-lg text-[#343434] placeholder:text-[#c8c8c8] outline-none focus:border-[#0097b2] focus:ring-1 focus:ring-[#0097b2]"
          />
        </div>

        <div className="mt-10 sm:mt-[102px] flex flex-col gap-11">
          {filteredSections.length === 0 ? (
            <p className="text-center text-lg text-[#343434]/70 py-12">
              No help topics match your search. Try different keywords.
            </p>
          ) : (
            filteredSections.map((section) => (
              <section key={section.id} aria-labelledby={`faq-${section.id}`}>
                <h2
                  id={`faq-${section.id}`}
                  className="text-[24px] sm:text-[32px] font-bold text-[#343434] leading-[1.3] mb-6 sm:mb-8"
                >
                  {section.title}
                </h2>
                <div className="flex flex-col gap-[22px]">
                  {section.items.map((item) => (
                    <FaqAccordionItem
                      key={item.id}
                      item={item}
                      isOpen={openItemId === item.id}
                      onToggle={() => handleToggle(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
