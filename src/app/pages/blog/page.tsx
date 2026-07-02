import ArticleHeroSection from "./components/ArticleHeroSection";
import ArticleContentSection from "./components/ArticleContentSection";
import RelatedArticlesSection from "./components/RelatedArticlesSection";

export const metadata = {
  title: "Meet Miguel Rendon | Andes Workforce Blog",
  description:
    "Meet Miguel Rendon: From the idea to building careers across Latin America. An exclusive interview with the founder of Andes Workforce.",
};

export default function BlogArticlePage() {
  return (
    <main className="min-h-screen bg-white">
      <ArticleHeroSection />
      <ArticleContentSection />
    </main>
  );
}
