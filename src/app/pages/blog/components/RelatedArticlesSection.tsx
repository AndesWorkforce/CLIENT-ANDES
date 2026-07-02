"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
}

export default function RelatedArticlesSection() {
  const relatedArticles: RelatedArticle[] = [
    {
      id: "1",
      title:
        "How Andes Workforce is Transforming Remote Work Across Latin America",
      category: "SUCCESS STORY",
      author: "Andes Workforce Team",
      date: "May 28, 2025",
      imageUrl:
        "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/blog/related-1.jpg",
      slug: "transforming-remote-work",
    },
    {
      id: "2",
      title:
        "The Future of Hiring: Why Companies Are Turning to Latin American Talent",
      category: "HIRING TRENDS",
      author: "Andes Workforce Team",
      date: "May 28, 2025",
      imageUrl:
        "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/blog/related-2.jpg",
      slug: "future-of-hiring",
    },
    {
      id: "3",
      title:
        "A conversation with Miguel Rendon, founder of Andes Workforce",
      category: "INTERVIEW",
      author: "Andes Workforce Team",
      date: "May 28, 2025",
      imageUrl:
        "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/blog/related-3.jpg",
      slug: "interview-miguel-rendon",
    },
  ];

  return (
    <section className="relative w-full bg-[#F6FBFC] py-[44px] md:py-[88px]">
      <div className="max-w-[1284px] mx-auto px-[18px] md:px-[44px]">
        {/* Section Header */}
        <div className="text-center mb-[44px] md:mb-[66px]">
          <p className="text-[#0097B2] font-semibold text-[12px] md:text-[14px] leading-[1.3] mb-[11px]">
            KEEP READING
          </p>
          <h2 className="text-[#343434] font-bold text-[24px] md:text-[32px] leading-[1.3]">
            Related Articles
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {relatedArticles.map((article) => (
            <Link
              key={article.id}
              href={`/pages/blog/${article.slug}`}
              className="group"
            >
              <article className="bg-white border border-[#EFEFEF] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                {/* Article Image */}
                <div className="relative w-full h-[200px] md:h-[257px] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Article Content */}
                <div className="p-[24px] flex flex-col gap-[12px] flex-1">
                  {/* Category Badge */}
                  <div className="inline-flex items-center justify-center px-[16px] py-[5px] bg-[#F8F8F8] rounded-[24px] self-start">
                    <span className="font-semibold text-[14px] text-[#0097B2] leading-[1.3]">
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[16px] leading-[1.3] text-black line-clamp-3 min-h-[60px]">
                    {article.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[#EFEFEF]" />

                  {/* Meta Info and CTA */}
                  <div className="flex items-center justify-between gap-[8px] mt-auto">
                    <div className="flex flex-col gap-[2px]">
                      <span className="font-semibold text-[14px] text-[#343434] leading-[1.3]">
                        {article.author}
                      </span>
                      <span className="font-medium text-[14px] text-[#525252] leading-[1.2]">
                        {article.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-[4px] flex-shrink-0">
                      <span className="font-semibold text-[14px] text-[#0097B2] leading-[1.3] whitespace-nowrap">
                        Read more
                      </span>
                      <ArrowRight className="w-[16px] h-[16px] text-[#0097B2] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
