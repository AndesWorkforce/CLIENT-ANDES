"use client";

import { useRef } from "react";
import HeroSection from "./HeroSection";
import FeaturedTalentSection from "./FeaturedTalentSection";
import ContactFormSection from "./ContactFormSection";
import BenefitsSection from "./BenefitsSection";
import Footer from "@/app/components/Footer";

export default function OffersLandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll within the snap container only (avoids scrolling the window and losing the navbar)
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    const container = scrollContainerRef.current;
    if (contactSection && container) {
      container.scrollTo({ top: contactSection.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div ref={scrollContainerRef} className="relative w-full h-[calc(100vh-var(--navbar-height))] overflow-y-scroll overscroll-y-contain snap-y snap-mandatory scroll-smooth">
      {/* Hero Section */}
      <div className="snap-start snap-always min-h-[60vh] md:h-[70vh] overflow-hidden">
        <HeroSection onContactClick={scrollToContact} />
      </div>

      {/* Featured Talent Section */}
      <div className="snap-start snap-always min-h-[60vh] md:h-[70vh] overflow-hidden">
        <FeaturedTalentSection />
      </div>

      {/* Contact Form Section */}
      <div className="snap-start snap-always min-h-[60vh] md:h-[70vh] overflow-hidden">
        <ContactFormSection />
      </div>

      {/* Benefits Section */}
      <div className="snap-start snap-always min-h-[60vh] md:h-[70vh] overflow-hidden">
        <BenefitsSection onContactClick={scrollToContact} />
      </div>

      {/* Footer inside snap container */}
      <div className="snap-start">
        <Footer forceRender />
      </div>
    </div>
  );
}
