"use client";

import { teamMembers } from "../team/team.data";
import { useState } from "react";
import type { TeamMember } from "../team/team.data";
import HeroSection from "./components/HeroSection";
import ImpactSection from "./components/ImpactSection";
import FutureSection from "./components/FutureSection";
import ValuesSection from "./components/ValuesSection";
import TeamMembersGrid from "./components/TeamMembersGrid";
import PetFamilyCarousel from "./components/PetFamilyCarousel";
import OurStorySection from "./components/OurStorySection";
import StatsSection from "./components/StatsSection";
import WhatSetsUsApart from "./components/WhatSetsUsApart";
import CtaSection from "./components/CtaSection";
import MemberModal from "./components/MemberModal";

export default function AboutPage() {
  const allMembers = teamMembers.filter((m) => m.group !== "Pet Family");
  const petMembers = teamMembers.filter((m) => m.group === "Pet Family");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImpactSection />
      <FutureSection />
      <ValuesSection />
      <TeamMembersGrid members={allMembers} onMemberClick={setSelectedMember} />
      {petMembers.length > 0 && (
        <section className="w-full bg-white py-16">
          <div className="max-w-[1480px] mx-auto px-10 md:px-20">
            <PetFamilyCarousel petMembers={petMembers} />
          </div>
        </section>
      )}
      <OurStorySection />
      <StatsSection />
      <WhatSetsUsApart />
      <CtaSection />
      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </main>
  );
}
