import type { Metadata } from "next";
import FaqHeroSection from "./components/FaqHeroSection";
import FaqPageContent from "./components/FaqPageContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Helpful information about your account, payments, requests, and daily processes at Andes Workforce.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <FaqHeroSection />
      <FaqPageContent />
    </div>
  );
}
