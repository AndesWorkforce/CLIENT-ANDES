"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_ARTICLES } from "../_data/articles";

export default function RelatedArticlesSection({
  currentSlug,
}: {
  currentSlug?: string;
}) {
  const relatedArticles = BLOG_ARTICLES.filter(
    (article) => article.slug !== currentSlug,
  );

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-[#F6FBFC] py-[44px] md:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-[18px] md:px-[44px]">
        <div className="mb-[44px] text-center md:mb-[66px]">
          <p className="mb-[11px] text-[12px] font-semibold leading-[1.3] text-[#0097B2] md:text-[14px]">
            KEEP READING
          </p>
          <h2 className="text-[24px] font-bold leading-[1.3] text-[#343434] md:text-[32px]">
            Related Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((article) => (
            <Link key={article.slug} href={article.href} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EFEFEF] bg-white transition-all duration-300 hover:shadow-lg">
                <div className="relative h-[200px] w-full overflow-hidden md:h-[257px]">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover object-[center_60%] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-[12px] p-[24px]">
                  <div className="inline-flex items-center justify-center self-start rounded-[24px] bg-[#F8F8F8] px-[16px] py-[5px]">
                    <span className="text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="min-h-[60px] text-[16px] font-bold leading-[1.3] text-black line-clamp-3">
                    {article.title}
                  </h3>

                  <div className="h-px w-full bg-[#EFEFEF]" />

                  <div className="mt-auto flex items-center justify-between gap-[8px]">
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[14px] font-semibold leading-[1.3] text-[#343434]">
                        {article.author}
                      </span>
                      <span className="text-[14px] font-medium leading-[1.2] text-[#525252]">
                        {article.date}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-[4px]">
                      <span className="whitespace-nowrap text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
                        Read more
                      </span>
                      <ArrowRight className="h-[16px] w-[16px] text-[#0097B2] transition-transform duration-300 group-hover:translate-x-1" />
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
