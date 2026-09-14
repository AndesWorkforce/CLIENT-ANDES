import BlogListingSection from "./_components/BlogListingSection";

export const metadata = {
  title: "Blog",
  description:
    "Latest from Andes Workforce — interviews, company stories, and insights on hiring talent across Latin America.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <BlogListingSection />
    </main>
  );
}
