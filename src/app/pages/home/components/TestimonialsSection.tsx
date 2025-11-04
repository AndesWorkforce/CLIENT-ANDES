"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  position: string;
  content: string;
  avatarColor: string;
  logo?: string;
  // Optional per-logo sizing (in px)
  logoMaxHeight?: number; // mobile and default
  logoMaxHeightMd?: number; // md and up
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maya Guadagni",
    company: "Tabak Law",
    position: "",
    content:
      "Our team has found the assistance that Andes Workforce provides to be invaluable. Since day one, it has been easy to communicate our needs and have our concerns addressed. The agents that they employ are hardworking and dedicated to our clients. We are excited to continue working with them!",
    avatarColor: "bg-teal-500",
    logo: "", // Add logo path
    logoMaxHeight: 20,
    logoMaxHeightMd: 60,
  },
  {
    id: 2,
    name: "Werner Hoffman Greig & Garcia",
    company: "",
    position: "",
    content:
      "Partnering with Andes Workforce has brought measurable value to our firm. Over the past two years, their contractors have supported us across multiple roles including intake specialists, legal assistants, case managers, and even database and mail sorting. Not only have we improved operational efficiency, but we've also reduced payroll costs by over 60% compared to traditional hiring. Andes Workforce has become a trusted extension of our team!",
    avatarColor: "bg-blue-600",
    logo: "",
    logoMaxHeight: 20,
    logoMaxHeightMd: 60,
  },
  {
    id: 3,
    name: "The Port Law Firm",
    company: "",
    position: "",
    content:
      "For more than a year, Andes Workforce has provided us with outstanding virtual administrative support, helping us manage the demands of our bankruptcy practice with greater efficiency. Today, we benefit from having three dedicated assistants for the cost of one U.S.-based hire without compromising on quality or professionalism. It's a smart, scalable solution that's made a real difference in our day-to-day operations!",
    avatarColor: "bg-purple-600",
    logo: "",
    logoMaxHeight: 20,
    logoMaxHeightMd: 60,
  },
  {
    id: 4,
    name: "Kristin Dow",
    company: "Tabak Law",
    position: "Director of Project Management & VA Operations",
    content:
      "Our partnership with Andes Workforce has been pivotal to our firm's recent explosive growth. Their team consistently delivers accurate, timely work and approaches every task with professionalism and care. Carlos and Marco go above and beyond expectations on a daily basis and have led the Andes team to success.  Their ability to take a project and run with it with minimal oversight has lifted a significant burden from my plate, allowing me to focus my time on strategic business initiatives. It's clear that they are deeply dedicated and take genuine pride in the quality of their work. We consider Andes an essential extension of the Tabak Law team and highly recommend their services.  Kudos to Miguel and Nicole for paving the way, I look forward to our continued partnership!",
    avatarColor: "bg-indigo-600",
    logo: "",
    logoMaxHeight: 20,
    logoMaxHeightMd: 60,
  },
  {
    id: 5,
    name: "Jonathan H. Davis, Esq.",
    company: "Veteran Esquire Legal Solutions, PLLC",
    position: "Founder and Managing Member",
    content:
      "I've had an outstanding experience working with your team. You've been excellent at helping me quickly find the right talent and meet my staffing needs efficiently. Communication with your office is top-notch. It's always prompt, clear, and responsive. What I appreciate most is how flexible and mission-focused your team is. You take the time to understand our specific goals so you can provide the right assistant and talent to support our work. You're also great at matching personalities, which makes collaboration seamless. This is something that not every staffing company gets right. From onboarding to cybersecurity and ongoing support, everything has been handled with professionalism and speed. I couldn't be happier with the partnership",
    avatarColor: "bg-indigo-600",
    logo: "",
    logoMaxHeight: 20,
    logoMaxHeightMd: 60,
  },
  {
    id: 6,
    name: "Jeff Baughman",
    company: "Estancia Advisory, PLLC",
    position: "Owner",
    content:
      "Things are going extremely well so far. After a single training session, our first assistant completed her first contract with about 60% accuracy, which was better than expected given our experience with the same role in the US. After the second training session, she completed the second contract with approximately 90% accuracy. Honestly, that’s better than most people in the U.S. I’ve worked with in the past. I’m very impressed with her.",
    avatarColor: "bg-indigo-600",
    logo: "",
    logoMaxHeight: 20,
    logoMaxHeightMd: 60,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(true);

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, totalSlides]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-18">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from companies that scaled with Andes Workforce
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {testimonials
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((testimonial) => (
                      <div key={testimonial.id} className="px-2">
                        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                          {/* Logo at top */}
                          <div
                            className="mb-6 flex items-center justify-center h-[var(--logo-wrap)] md:h-[var(--logo-wrap-md)]"
                            style={{
                              ["--logo-wrap" as any]: `${
                                (testimonial.logoMaxHeight ?? 64) as number
                              }px`,
                              ["--logo-wrap-md" as any]: `${
                                (testimonial.logoMaxHeightMd ??
                                  testimonial.logoMaxHeight ??
                                  80) as number
                              }px`,
                            }}
                          >
                            {testimonial.logo?.trim() ? (
                              <img
                                src={testimonial.logo}
                                alt={`${
                                  testimonial.company || testimonial.name
                                } logo`}
                                className="w-auto h-auto object-contain max-h-full"
                                style={{ maxWidth: "100%" }}
                              />
                            ) : null}
                          </div>

                          {/* Quote in center */}
                          <blockquote className="text-gray-700 text-[14px] leading-6 mb-6 italic min-h-[120px] flex items-center justify-center">
                            <div>&quot;{testimonial.content}&quot;</div>
                          </blockquote>

                          {/* Person info at bottom */}
                          <div className="text-center">
                            <h3 className="text-[14px] font-semibold text-gray-900 mb-1">
                              {testimonial.name}
                            </h3>
                            <p className="text-gray-500 text-[12px]">
                              {testimonial.position && testimonial.company
                                ? `${testimonial.position}, ${testimonial.company}`
                                : testimonial.position || testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 cursor-pointer z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 cursor-pointer z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
