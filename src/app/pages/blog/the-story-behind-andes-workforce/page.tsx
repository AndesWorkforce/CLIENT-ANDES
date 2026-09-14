import HeroSection from "./_components/HeroSection";
import ContentSection from "./_components/ContentSection";
import RelatedArticlesSection from "../_components/RelatedArticlesSection";

export const metadata = {
  title: "The Story Behind Andes Workforce",
  description:
    "From shipmates in the Navy to business partners — how trust built a company that connects talent and opportunity across borders.",
};

export default function StoryBehindAndesPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ContentSection />
      <RelatedArticlesSection currentSlug="the-story-behind-andes-workforce" />
    </main>
  );
}
