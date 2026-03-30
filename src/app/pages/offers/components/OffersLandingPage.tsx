"use client";

import HeroSection from "./HeroSection";
import FeaturedTalentSection from "./FeaturedTalentSection";
import ContactFormSection from "./ContactFormSection";
import BenefitsSection from "./BenefitsSection";

export default function OffersLandingPage() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection onContactClick={scrollToContact} />

      {/* Featured Talent Section */}
      <FeaturedTalentSection />

      {/* Contact Form Section */}
      <ContactFormSection />

      {/* Benefits Section */}
      <BenefitsSection onContactClick={scrollToContact} />
    </div>
  );
}
