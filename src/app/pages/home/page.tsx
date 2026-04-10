import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PartnersSection from "./components/PartnersSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PersonnelTypes from "./components/PersonnelTypes";
import CTASection from "./components/CTASection";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Personnel Types Section */}
      <PersonnelTypes />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* About Section */}
      <AboutSection />

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
