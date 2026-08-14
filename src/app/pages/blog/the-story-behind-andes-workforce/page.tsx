import StoryHeroSection from "../components/StoryHeroSection";
import StoryContentSection from "../components/StoryContentSection";
import StoryEngagementSection from "../components/StoryEngagementSection";
import RelatedArticlesSection from "../components/RelatedArticlesSection";

export const metadata = {
  title: "The Story Behind Andes Workforce | Andes Workforce Blog",
  description:
    "From shipmates in the Navy to business partners — how trust built a company that connects talent and opportunity across borders.",
};

export default function StoryBehindAndesPage() {
  return (
    <main className="min-h-screen bg-white">
      <StoryHeroSection />
      <StoryContentSection />
      {/* <StoryEngagementSection /> */}
      <RelatedArticlesSection />
    </main>
  );
}
