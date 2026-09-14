import HeroSection from "./_components/HeroSection";
import ContentSection from "./_components/ContentSection";
import RelatedArticlesSection from "../_components/RelatedArticlesSection";

export const metadata = {
  title: "Meet Miguel Rendon",
  description:
    "Meet Miguel Rendon: From the idea to building careers across Latin America. An exclusive interview with the founder of Andes Workforce.",
};

export default function MeetMiguelArticlePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ContentSection />
      <RelatedArticlesSection currentSlug="meet-miguel-rendon" />
    </main>
  );
}
