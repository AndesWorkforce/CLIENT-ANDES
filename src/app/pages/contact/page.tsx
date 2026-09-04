import HeroSection from "./components/HeroSection";
import ContactForm from "./components/ContactForm";
import CtaSection from "../about/components/CtaSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <ContactForm />
      <CtaSection
        findTalentEvent="ads_click_ContactPage_FindTalent"
        joinUsEvent="ads_click_ContactPage_JoinTeam"
      />
    </main>
  );
}
