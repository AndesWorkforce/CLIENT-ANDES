export type BlogArticle = {
  slug: string;
  href: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "meet-miguel-rendon",
    href: "/pages/blog/meet-miguel-rendon",
    category: "INTERVIEW",
    title:
      "A conversation with Miguel Rendon, founder of Andes Workforce",
    excerpt:
      "Miguel shares the story behind Andes Workforce- from the first hire to building a cross-border team that redefines how US companies hire in Latin America.",
    author: "Andes Workforce Team",
    date: "Jun 25, 2026",
    imageUrl:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/1.+Meet+Miguel/01+-+Miguel+fondo+gris.webp",
  },
  {
    slug: "the-story-behind-andes-workforce",
    href: "/pages/blog/the-story-behind-andes-workforce",
    category: "COMPANY STORY",
    title: "The Story Behind Andes Workforce: Built on Trust Across Borders",
    excerpt:
      "From shipmates in the Navy to business partners — how trust built a company that connects talent and opportunity across borders.",
    author: "Andes Workforce Team",
    date: "Jun 25, 2026",
    imageUrl:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/2.+The+Story+Behind+Andes+Workforce/Tabak+Law+SSA.webp",
  },
];
