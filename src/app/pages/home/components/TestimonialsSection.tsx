"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FadeIn } from "../../about/components/Reveal";

const S3 =
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes";

interface Testimonial {
  id: number;
  company: string;
  tenure: string;
  content: string;
  preview: string;
  logo: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    company: "Tabak Law",
    tenure: "Client for 2+ years",
    preview:
      "Our partnership with Andes Workforce has been pivotal to our firm's recent explosive growth. Their team consistently…",
    content:
      "Our partnership with Andes Workforce has been pivotal to our firm's recent explosive growth. Their team consistently delivers accurate, timely work and approaches every task with professionalism and care. Carlos and Marco go above and beyond expectations on a daily basis and have led the Andes team to success. Their ability to take a project and run with it with minimal oversight has lifted a significant burden from my plate, allowing me to focus my time on strategic business initiatives. It's clear that they are deeply dedicated and take genuine pride in the quality of their work. We consider Andes an essential extension of the Tabak Law team and highly recommend their services.",
    logo: `${S3}/tabak-law-logo-2017.jpg`,
  },
  {
    id: 2,
    company: "Werner Hoffman Greig & Garcia",
    tenure: "Client for 2+ years",
    preview:
      "Partnering with Andes Workforce has brought measurable value to our firm. Over the past two years, their contractors…",
    content:
      "Partnering with Andes Workforce has brought measurable value to our firm. Over the past two years, their contractors have supported us across multiple roles including intake specialists, legal assistants, case managers, and even database and mail sorting. Not only have we improved operational efficiency, but we've also reduced payroll costs by over 60% compared to traditional hiring. Andes Workforce has become a trusted extension of our team!",
    logo: `${S3}/WHG.jpg`,
  },
  {
    id: 3,
    company: "The Port Law Firm",
    tenure: "Client for 2+ years",
    preview:
      "For more than a year, Andes Workforce has provided us with outstanding virtual administrative support, helping us manage…",
    content:
      "For more than a year, Andes Workforce has provided us with outstanding virtual administrative support, helping us manage the demands of our bankruptcy practice with greater efficiency. Today, we benefit from having three dedicated assistants for the cost of one U.S.-based hire without compromising on quality or professionalism. It's a smart, scalable solution that's made a real difference in our day-to-day operations!",
    logo: `${S3}/Port-Law-Firm-Logo.webp`,
  },
  {
    id: 4,
    company: "Estancia",
    tenure: "Client for 6+ months",
    preview:
      "Things are going extremely well so far. After a single training session, our first assistant completed her first contract with...",
    content:
      "Things are going extremely well so far. After a single training session, our first assistant completed her first contract with about 60% accuracy, which was better than expected. After the second training session, she completed the second contract with approximately 90% accuracy. Honestly, that's better than most people in the U.S. I've worked with in the past. I'm very impressed with her.",
    logo: "",
  },
  {
    id: 5,
    company: "Veteran Esquire Legal Solutions",
    tenure: "Client for 1+ year",
    preview:
      "I've had an outstanding experience working with your team. You've been excellent at helping me quickly find the right talent…",
    content:
      "I've had an outstanding experience working with your team. You've been excellent at helping me quickly find the right talent and meet my staffing needs efficiently. Communication with your office is top-notch. It's always prompt, clear, and responsive. What I appreciate most is how flexible and mission-focused your team is. You take the time to understand our specific goals so you can provide the right assistant and talent to support our work. You're also great at matching personalities, which makes collaboration seamless.",
    logo: `${S3}/Jelks.jpg`,
  },
  {
    id: 6,
    company: "Tabak Law",
    tenure: "Client for 2+ years",
    preview:
      "Our team has found the assistance that Andes Workforce provides to be invaluable. Since day one, it has been easy to communicate…",
    content:
      "Our team has found the assistance that Andes Workforce provides to be invaluable. Since day one, it has been easy to communicate our needs and have our concerns addressed. The agents that they employ are hardworking and dedicated to our clients. We are excited to continue working with them!",
    logo: `${S3}/tabak-law-logo-2017.jpg`,
  },
];

const ITEMS_PER_SLIDE = 3;
const totalSlides = Math.ceil(testimonials.length / ITEMS_PER_SLIDE);

const expandEase = [0.16, 1, 0.3, 1] as const;

function TestimonialCard({
  testimonial,
  expanded,
  onToggle,
}: {
  testimonial: Testimonial;
  expanded: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      layout
      onClick={onToggle}
      aria-expanded={expanded}
      className="flex h-full w-full cursor-pointer flex-col items-start rounded-[16px] bg-white p-8 text-left shadow-[0px_4px_20px_rgba(0,0,0,0.06)]"
      transition={{ layout: { duration: reduce ? 0 : 0.5, ease: expandEase } }}
    >
      <div className="mb-5 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="size-4 fill-[#0097b2] text-[#0097b2]"
            aria-hidden
          />
        ))}
      </div>

      <motion.p
        layout
        className="mb-8 text-[16px] font-normal leading-[1.6] text-[#707070]"
        transition={{ layout: { duration: reduce ? 0 : 0.5, ease: expandEase } }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={expanded ? "full" : "preview"}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="block"
          >
            &ldquo;{expanded ? testimonial.content : testimonial.preview}&rdquo;
          </motion.span>
        </AnimatePresence>
      </motion.p>

      <div className="mt-auto flex items-center gap-3 border-t border-transparent pt-6">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-[#efefef] bg-white">
          {testimonial.logo ? (
            <img
              src={testimonial.logo}
              alt=""
              className="size-full object-contain p-1"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-[1.3] text-[#343434]">
            {testimonial.company}
          </p>
          <p className="text-[12px] font-normal leading-[1.3] tracking-[0.24px] text-[#707070]">
            {testimonial.tenure}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (paused || expandedId !== null) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, expandedId]);

  const goTo = (slide: number) => {
    setExpandedId(null);
    setCurrent(slide);
  };

  const prev = () => goTo(current === 0 ? totalSlides - 1 : current - 1);
  const next = () => goTo((current + 1) % totalSlides);

  return (
    <section className="bg-[#f7f9fb] px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 text-center sm:mb-16">
          <FadeIn>
            <p className="mb-3 text-[14px] font-semibold uppercase leading-[1.3] tracking-[1.4px] text-[#0097b2]">
              CLIENT STORIES
            </p>
          </FadeIn>
          <FadeIn delay={0.22}>
            <h2 className="text-[32px] font-bold leading-[1.3] text-black md:text-[48px]">
              What our <span className="text-[#0097b2]">clients</span> say
            </h2>
          </FadeIn>
        </div>

        <div
          className="relative flex items-start gap-2.5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={prev}
            className="mt-[120px] hidden size-9 shrink-0 items-center justify-center text-[#343434] md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="size-9" />
          </button>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div key={slideIdx} className="w-full shrink-0 px-1">
                  <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
                    {testimonials
                      .slice(
                        slideIdx * ITEMS_PER_SLIDE,
                        (slideIdx + 1) * ITEMS_PER_SLIDE
                      )
                      .map((t, cardIndex) => (
                        <FadeIn key={t.id} delay={0.5 + cardIndex * 0.22}>
                          <TestimonialCard
                            testimonial={t}
                            expanded={expandedId === t.id}
                            onToggle={() =>
                              setExpandedId((id) => (id === t.id ? null : t.id))
                            }
                          />
                        </FadeIn>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-[120px] hidden size-9 shrink-0 items-center justify-center text-[#343434] md:flex"
            aria-label="Next"
          >
            <ChevronRight className="size-9" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={prev}
            className="flex size-9 items-center justify-center text-[#343434]"
            aria-label="Previous"
          >
            <ChevronLeft className="size-8" />
          </button>
          <button
            type="button"
            onClick={next}
            className="flex size-9 items-center justify-center text-[#343434]"
            aria-label="Next"
          >
            <ChevronRight className="size-8" />
          </button>
        </div>
      </div>
    </section>
  );
}
