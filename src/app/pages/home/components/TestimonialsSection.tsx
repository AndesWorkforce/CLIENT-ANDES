"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  position: string;
  content: string;
  avatarColor: string;
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
  },
  {
    id: 2,
    name: "Werner Hoffman Greig & Garcia",
    company: "",
    position: "",
    content:
      "Partnering with Andes Workforce has brought measurable value to our firm. Over the past two years, their contractors have supported us across multiple roles including intake specialists, legal assistants, case managers, and even database and mail sorting. Not only have we improved operational efficiency, but we’ve also reduced payroll costs by over 60% compared to traditional hiring. Andes Workforce has become a trusted extension of our team!",
    avatarColor: "bg-blue-600",
  },
  {
    id: 3,
    name: "The Port Law Firm",
    company: "",
    position: "",
    content:
      "For more than a year, Andes Workforce has provided us with outstanding virtual administrative support, helping us manage the demands of our bankruptcy practice with greater efficiency. Today, we benefit from having three dedicated assistants for the cost of one U.S.-based hire without compromising on quality or professionalism. It’s a smart, scalable solution that’s made a real difference in our day-to-day operations!",
    avatarColor: "bg-purple-600",
  },
  {
    id: 4,
    name: "Kristin Dow",
    company: "Tabak Law",
    position: "Director of Project Management & VA Operations",
    content:
      "Our partnership with Andes Workforce has been pivotal to our firm’s recent explosive growth. Their team consistently delivers accurate, timely work and approaches every task with professionalism and care. Carlos and Marco go above and beyond expectations on a daily basis and have led the Andes team to success.  Their ability to take a project and run with it with minimal oversight has lifted a significant burden from my plate, allowing me to focus my time on strategic business initiatives. It’s clear that they are deeply dedicated and take genuine pride in the quality of their work. We consider Andes an essential extension of the Tabak Law team and highly recommend their services.  Kudos to Miguel and Nicole for paving the way, I look forward to our continued partnership!",
    avatarColor: "bg-indigo-600",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Real results from companies that scaled with Andes Workforce
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="text-center px-8">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div
                className={`w-20 h-20 ${testimonials[currentIndex].avatarColor} rounded-full flex items-center justify-center transition-all duration-500`}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-8 min-h-[120px] flex items-center justify-center">
              <div>"{testimonials[currentIndex].content}"</div>
            </blockquote>

            {/* Name and Company */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {testimonials[currentIndex].name}
              </h3>
              <p className="text-gray-500">
                {testimonials[currentIndex].position &&
                testimonials[currentIndex].company
                  ? `${testimonials[currentIndex].position}, ${testimonials[currentIndex].company}`
                  : testimonials[currentIndex].position ||
                    testimonials[currentIndex].company}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center mt-12 space-x-6">
          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                  index === currentIndex
                    ? "bg-[#0097B2] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-10 h-10 bg-[#0097B2] hover:bg-[#007B8A] text-white rounded-full transition-all duration-200 cursor-pointer"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
