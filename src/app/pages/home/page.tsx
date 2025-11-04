import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PartnersSection from "./components/PartnersSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactCTA from "./components/ContactCTA";
import PersonnelTypes from "./components/PersonnelTypes";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Personnel Types Section */}
      <PersonnelTypes />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact CTA Section */}
      <ContactCTA />

      {/* About Section */}
      <AboutSection />
    </>
  );
}
