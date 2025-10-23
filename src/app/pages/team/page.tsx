"use client";

import Image from "next/image";
import { teamMembers } from "./team.data";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "?";
  const last = parts[parts.length - 1]?.[0] || "";
  return (first + last).toUpperCase();
}

export default function TeamPage() {
  // Split pets from the rest; we'll show pets in their own section,
  // and all other members together with a small group badge in each card
  const petMembers = teamMembers.filter((m) => m.group === "Pet Family");
  const coreMembers = teamMembers.filter((m) => m.group !== "Pet Family");

  return (
    <main className="min-h-screen bg-[#FCFEFF]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2d5a87] to-[#4a90a4] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet the Team
            </h1>
            <p className="text-lg opacity-90">
              Meet the talented individuals behind our success, a team of
              professionals whose experience, education, and passions drive
              everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid (All except pets) */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coreMembers.map((m) => (
            <article
              key={m.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              {/* Avatar */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 -mt-14 md:-mt-16 mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full ring-4 ring-white shadow-md bg-gradient-to-tr from-[#2d5a87] to-[#4a90a4] flex items-center justify-center text-white text-2xl font-bold">
                    {initialsOf(m.name)}
                  </div>
                )}
              </div>

              {/* Group badge */}
              <span className="mb-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f6f9] text-[#007c92] border border-[#bfe7ee]">
                {m.group}
              </span>

              {/* Name & Role */}
              <h3 className="text-xl font-semibold text-[#08252A]">{m.name}</h3>
              <p className="text-[#0097B2] font-medium mb-2">{m.role}</p>
              {m.summary && (
                <p className="text-sm text-gray-600 mb-4">{m.summary}</p>
              )}

              {/* Bullets */}
              <ul className="text-left text-sm text-[#17323A] space-y-2 list-disc list-inside">
                {m.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Pets section */}
        {petMembers.length > 0 && (
          <div className="mt-14 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#08252A] mb-2 md:mb-3">
              🐾 Pet Family
            </h2>
            <p className="text-[#17323A] mb-6 md:mb-8 max-w-3xl">
              These furry friends bring joy, comfort, and a whole lot of
              personality to our days. Their presence is felt in every corner of
              our work; and yes, they’ve earned their spots on the team!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {petMembers.map((m) => (
                <article
                  key={m.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  {/* Avatar */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 -mt-12 md:-mt-14 mb-3 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full ring-4 ring-white shadow-md bg-gradient-to-tr from-[#2d5a87] to-[#4a90a4] flex items-center justify-center text-white text-xl font-bold">
                        {initialsOf(m.name)}
                      </div>
                    )}
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-lg font-semibold text-[#08252A]">
                    {m.name}
                  </h3>
                  <p className="text-[#0097B2] font-medium mb-2 text-sm">
                    {m.role}
                  </p>

                  {/* Bullets */}
                  {m.bullets?.length > 0 && (
                    <ul className="text-left text-sm text-[#17323A] space-y-2 list-disc list-inside">
                      {m.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 md:mt-12 bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#08252A]">
                Want to join Andes Workforce?
              </h3>
              <p className="text-[#17323A]">
                Create your account and become part of our growing network.
              </p>
            </div>
            <a
              href="/auth/register"
              className="inline-flex items-center justify-center bg-[#0097B2] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#007c92] transition-colors"
            >
              Join Network
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
