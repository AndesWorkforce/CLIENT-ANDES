"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const S3 = "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  content: string;
  logo: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Kristin Dow",
    position: "Director of Project Management & VA Operations, Tabak Law",
    content:
      "Our partnership with Andes Workforce has been pivotal to our firm's recent explosive growth. Their team consistently delivers accurate, timely work and approaches every task with professionalism and care. Carlos and Marco go above and beyond expectations on a daily basis and have led the Andes team to success. Their ability to take a project and run with it with minimal oversight has lifted a significant burden from my plate, allowing me to focus my time on strategic business initiatives. It's clear that they are deeply dedicated and take genuine pride in the quality of their work. We consider Andes an essential extension of the Tabak Law team and highly recommend their services.",
    logo: `${S3}/Tabak.jpg`,
  },
  {
    id: 2,
    name: "Jonathan H. Davis, Esq.",
    position: "Founder and Managing Member, Veteran Esquire Legal Solutions",
    content:
      "I've had an outstanding experience working with your team. You've been excellent at helping me quickly find the right talent and meet my staffing needs efficiently. Communication with your office is top-notch. It's always prompt, clear, and responsive. What I appreciate most is how flexible and mission-focused your team is. You take the time to understand our specific goals so you can provide the right assistant and talent to support our work. You're also great at matching personalities, which makes collaboration seamless.",
    logo: `${S3}/Veteran_Esquire.jpg`,
  },
  {
    id: 3,
    name: "Werner Hoffman Greig & Garcia",
    position: "",
    content:
      "Partnering with Andes Workforce has brought measurable value to our firm. Over the past two years, their contractors have supported us across multiple roles including intake specialists, legal assistants, case managers, and even database and mail sorting. Not only have we improved operational efficiency, but we've also reduced payroll costs by over 60% compared to traditional hiring. Andes Workforce has become a trusted extension of our team!",
    logo: `${S3}/WHG.jpg`,
  },
  {
    id: 4,
    name: "The Port Law Firm",
    position: "",
    content:
      "For more than a year, Andes Workforce has provided us with outstanding virtual administrative support, helping us manage the demands of our bankruptcy practice with greater efficiency. Today, we benefit from having three dedicated assistants for the cost of one U.S.-based hire without compromising on quality or professionalism. It's a smart, scalable solution that's made a real difference in our day-to-day operations!",
    logo: `${S3}/Port-Law.jpg`,
  },
  {
    id: 5,
    name: "Maya Guadagni",
    position: "Tabak Law",
    content:
      "Our team has found the assistance that Andes Workforce provides to be invaluable. Since day one, it has been easy to communicate our needs and have our concerns addressed. The agents that they employ are hardworking and dedicated to our clients. We are excited to continue working with them!",
    logo: `${S3}/Tabak.jpg`,
  },
  {
    id: 6,
    name: "Jeff Baughman",
    position: "Owner, Estancia Advisory, PLLC",
    content:
      "Things are going extremely well so far. After a single training session, our first assistant completed her first contract with about 60% accuracy, which was better than expected. After the second training session, she completed the second contract with approximately 90% accuracy. Honestly, that's better than most people in the U.S. I've worked with in the past. I'm very impressed with her.",
    logo: "",
  },
];

const ITEMS_PER_SLIDE = 3;
const totalSlides = Math.ceil(testimonials.length / ITEMS_PER_SLIDE);

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setCurrent((p) => (p === 0 ? totalSlides - 1 : p - 1));
  const next = () => setCurrent((p) => (p + 1) % totalSlides);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#00224d] mb-2">
            What Our Clients Say
          </h2>
          <p className="text-sm text-[#676565]">
            Real results from companies that scaled with Andes Workforce
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrow left */}
          <button
            onClick={prev}
            className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:shadow-md transition-shadow cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-[#00224d]" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div key={slideIdx} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {testimonials
                      .slice(
                        slideIdx * ITEMS_PER_SLIDE,
                        (slideIdx + 1) * ITEMS_PER_SLIDE
                      )
                      .map((t) => (
                        <div
                          key={t.id}
                          className="group bg-white border border-[#d2d2d2] rounded-[15px] px-6 py-7 flex flex-col gap-3 transition-all duration-500 ease-in-out"
                          onMouseEnter={() => setPaused(true)}
                          onMouseLeave={() => setPaused(false)}
                        >
                          {/* Logo */}
                          <div className="h-[50px] flex items-center">
                            {t.logo ? (
                              <img
                                src={t.logo}
                                alt={t.name}
                                className="max-h-[50px] w-auto max-w-[180px] object-contain object-left"
                              />
                            ) : (
                              <div className="h-[50px]" />
                            )}
                          </div>

                          {/* Quote */}
                          <p className="text-[12px] text-black leading-[1.8] overflow-hidden max-h-[108px] group-hover:max-h-[600px] transition-[max-height] duration-500 ease-in-out">
                            &ldquo;{t.content}&rdquo;
                          </p>

                          {/* Author */}
                          <div className="mt-1">
                            <p className="text-[12px] font-semibold text-black leading-snug">
                              {t.name}
                            </p>
                            {t.position && (
                              <p className="text-[10px] text-[#676565] leading-snug mt-0.5">
                                {t.position}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow right */}
          <button
            onClick={next}
            className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:shadow-md transition-shadow cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-[#00224d]" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "bg-[#0097b2] w-5" : "bg-gray-300"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}