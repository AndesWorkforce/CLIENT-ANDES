import HeroSection from "./components/HeroSection";
import WhatWeOfferSection from "./components/WhatWeOfferSection";
import ProcessSection from "./components/ProcessSection";
import FeaturedTalentSection from "./components/FeaturedTalentSection";
import ContactFormSection from "./components/ContactFormSection";
import BenefitsSection from "./components/BenefitsSection";

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhatWeOfferSection />
      <ProcessSection />
      <FeaturedTalentSection />
      <ContactFormSection />
      <BenefitsSection />
    </main>
  );
}
