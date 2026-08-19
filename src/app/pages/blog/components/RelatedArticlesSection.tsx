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
  href: string;
}

export default function RelatedArticlesSection() {
  const relatedArticles: RelatedArticle[] = [
    {
      id: "1",
      title:
        "Meet Miguel Rendon: From the seas to building careers across Latin America",
      category: "INTERVIEW",
      author: "Andes Workforce Team",
      date: "Jun 25, 2026",
      imageUrl:
        "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/1.+Meet+Miguel/01+-+Miguel+fondo+gris.webp",
      href: "/pages/blog",
    },
    {
      id: "2",
      title:
        "The Story Behind Andes Workforce: Built on Trust Across Borders",
      category: "COMPANY STORY",
      author: "Andes Workforce Team",
      date: "Jun 25, 2026",
      imageUrl:
        "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/2.+The+Story+Behind+Andes+Workforce/Tabak+Law+SSA.webp",
      href: "/pages/blog/the-story-behind-andes-workforce",
    }
  ];

  return (
    <section className="relative w-full bg-[#F6FBFC] py-[44px] md:py-[88px]">
      <div className="max-w-[1440px] mx-auto px-[18px] md:px-[44px]">
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
              href={article.href}
              className="group"
            >
              <article className="bg-white border border-[#EFEFEF] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                {/* Article Image */}
                <div className="relative w-full h-[200px] md:h-[257px] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 object-[center_60%]"
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
