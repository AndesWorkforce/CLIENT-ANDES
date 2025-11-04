"use client";

import Image from "next/image";
import { teamMembers } from "../team/team.data";
import { useState } from "react";
import type { TeamMember } from "../team/team.data";

export default function AboutPage() {
  // Filter out pets - show all other team members
  const allMembers = teamMembers.filter((m) => m.group !== "Pet Family");
  const petMembers = teamMembers.filter((m) => m.group === "Pet Family");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <main className="min-h-screen">
      {/* Hero Section - Solo imagen con "About Us" centrado */}
      <section className="relative w-full h-[550px] bg-[#08252A]">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#08252A]/10 to-[#08252A]/10 z-10" />
          <div className="relative h-full w-full">
            <Image
              src="/portada.png"
              alt="About Us"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Título centrado */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-7xl font-bold">
            About Us
          </h1>
        </div>

        {/* Flecha hacia abajo */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <div className="animate-bounce">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 10.417V39.5837"
                stroke="#0097B2"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M39.5827 25L24.9993 39.5833L10.416 25"
                stroke="#0097B2"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* About Content Section - Todo el texto aquí */}
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097B2] mb-6">
            Andes Workforce
          </h2>

          <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-6">
            At Andes Workforce, we connect U.S. businesses with skilled,
            professional contractors across Latin America. Our mission is to
            deliver exceptional talent while improving the lives of our team
            members through stable income and personal growth. We care deeply
            about people, not just as professionals, but as individuals. By
            building strong, supportive teams, we ensure outstanding service and
            long-term success for both our clients and our workforce. Our team
            members bring the administrative and customer service skills you are
            looking for, skills that will help you expand your business while
            growing your client base.
          </p>

          <blockquote className="text-lg md:text-xl text-gray-700 italic border-l-4 border-[#0097B2] pl-4 my-8">
            &quot;Become the owner of your time, it is a currency that cannot be
            replaced&quot; Miguel Rendon
          </blockquote>

          {/* Información de contacto */}
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center">
              <div className="bg-[#0097B2] rounded-full p-2 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-gray-800 text-base md:text-lg">
                info@andes-workforce.com
              </span>
            </div>
            <div className="flex items-center">
              <div className="bg-[#0097B2] rounded-full p-2 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span className="text-gray-800 text-base md:text-lg">
                +1 7572373612
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#08252A] mb-3">
              Meet the talented individuals behind
            </h2>
          </div>

          {/* Team Members Grid - Professional style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
            {allMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                {/* Professional Photo */}
                <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Name and Role */}
                <div className="p-4 text-center bg-white">
                  <h3 className="text-lg md:text-xl font-bold text-[#08252A] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pet Family Section */}
          {petMembers.length > 0 && (
            <div className="mt-14 md:mt-20">
              <h2 className="text-2xl md:text-3xl font-bold text-[#08252A] mb-6 text-center">
                🐾 Pet Family
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                {petMembers.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* Pet Photo */}
                    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
                      {pet.image ? (
                        <Image
                          src={pet.image}
                          alt={pet.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Name and Role */}
                    <div className="p-4 text-center bg-white">
                      <h3 className="text-lg md:text-xl font-bold text-[#08252A] mb-1">
                        {pet.name}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        {pet.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Creating a Link for Success Section */}
      <section className="w-full bg-white py-16"></section>

      {/* Modal for Member Details */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-scaleIn overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 z-20"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Left Side: Image (mobile: top, desktop: left) */}
            <div className="w-full md:w-2/5 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="relative w-full h-64 md:h-full">
                {selectedMember.image ? (
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Info (mobile: bottom, desktop: right) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header Info */}
              <div className="flex-shrink-0 text-center px-6 py-6 border-b border-gray-100">
                <h3 className="text-2xl md:text-3xl font-bold text-[#08252A] mb-2">
                  {selectedMember.name}
                </h3>
                <p className="text-base md:text-lg text-[#0097B2] font-semibold mb-2">
                  {selectedMember.role}
                </p>
                {selectedMember.summary && (
                  <p className="text-sm text-gray-600 italic mb-2">
                    {selectedMember.summary}
                  </p>
                )}
                {selectedMember.group && (
                  <span className="inline-block mt-2 px-4 py-1 bg-[#e6f6f9] text-[#007c92] rounded-full text-xs md:text-sm font-medium">
                    {selectedMember.group}
                  </span>
                )}
              </div>

              {/* Bullets Section with scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {selectedMember.bullets &&
                  selectedMember.bullets.length > 0 && (
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-[#08252A] mb-4">
                        About
                      </h4>
                      <ul className="space-y-3">
                        {selectedMember.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-[#0097B2] mt-1 flex-shrink-0 text-base">
                              •
                            </span>
                            <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <style jsx global>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out;
            }

            .animate-scaleIn {
              animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
