import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PartnersSection from "./components/PartnersSection";
import ServicesSection from "./components/ServicesSection";
import StatsSection from "./components/StatsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <PartnersSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <AboutSection />
      <CTASection />
    </div>
  );
}
