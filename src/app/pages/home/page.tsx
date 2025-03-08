import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PartnersSection from "./components/PartnersSection";
import ServicesSection from "./components/ServicesSection";
import ContactCTA from "./components/ContactCTA";
import PersonnelTypes from "./components/PersonnelTypes";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Contact CTA Section */}
      <ContactCTA />

      {/* Personnel Types Section */}
      <PersonnelTypes />

      {/* About Section */}
      <AboutSection />
    </>
  );
}
