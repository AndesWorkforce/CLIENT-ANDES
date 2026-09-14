"use client";

import { StaticOnMobile } from "../about/components/Reveal";
import HeroSection from "./components/HeroSection";
import WhatWeOfferSection from "./components/WhatWeOfferSection";
import ProcessSection from "./components/ProcessSection";
import FeaturedTalentSection from "./components/FeaturedTalentSection";
import ContactFormSection from "./components/ContactFormSection";
import BenefitsSection from "./components/BenefitsSection";

export default function ServicesPage() {
  return (
    <StaticOnMobile>
      <main className="min-h-screen overflow-x-hidden">
        <HeroSection />
        <WhatWeOfferSection />
        <ProcessSection />
        <FeaturedTalentSection />
        <ContactFormSection />
        <BenefitsSection />
      </main>
    </StaticOnMobile>
  );
}
