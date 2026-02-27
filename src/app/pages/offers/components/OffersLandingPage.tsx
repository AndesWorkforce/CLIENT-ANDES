"use client";

import HeroSection from "./HeroSection";
import FeaturedTalentSection from "./FeaturedTalentSection";
import ContactFormSection from "./ContactFormSection";
import BenefitsSection from "./BenefitsSection";
import Footer from "@/app/components/Footer";

export default function OffersLandingPage() {
  // Smooth scroll to contact form
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-var(--navbar-height))] overflow-y-scroll overscroll-y-contain snap-y snap-mandatory scroll-smooth">
      {/* Hero Section */}
      <div className="snap-start snap-always">
        <HeroSection onContactClick={scrollToContact} />
      </div>

      {/* Featured Talent Section */}
      <div className="snap-start snap-always">
        <FeaturedTalentSection />
      </div>

      {/* Contact Form Section */}
      <div className="snap-start snap-always">
        <ContactFormSection />
      </div>

      {/* Benefits Section */}
      <div className="snap-start snap-always">
        <BenefitsSection onContactClick={scrollToContact} />
      </div>

      {/* Footer inside snap container */}
      <div className="snap-start">
        <Footer forceRender />
      </div>
    </div>
  );
}
