"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_ARTICLES } from "../_data/articles";

export default function BlogListingSection() {
  return (
    <section className="relative w-full bg-white py-[44px] md:py-[56px]">
      <div className="mx-auto w-full max-w-[1440px] px-[18px] md:px-[44px] lg:px-[71px]">
        <p className="mb-[11px] text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
          OUR BLOG
        </p>
        <h1 className="mb-[33px] text-[24px] font-bold leading-[1.3] text-black md:text-[32px]">
          Latest from Andes Workforce
        </h1>

        <div className="grid grid-cols-1 gap-[33px] md:grid-cols-2 lg:grid-cols-3">
          {BLOG_ARTICLES.map((article) => (
            <Link key={article.slug} href={article.href} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EFEFEF] bg-white transition-shadow duration-300 hover:shadow-lg">
                <div className="relative h-[200px] w-full overflow-hidden md:h-[257px]">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover object-[center_60%] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-[12px] px-[24px] pb-[24px] pt-[17px]">
                  <div className="inline-flex items-center justify-center self-start rounded-[24px] bg-[#F8F8F8] px-[16px] py-[5px]">
                    <span className="text-[14px] font-semibold leading-[1.3] text-[#0097B2]">
                      {article.category}
                    </span>
                  </div>

                  <h2 className="text-[20px] font-bold leading-[1.3] text-black">
                    {article.title}
                  </h2>
                  <p className="line-clamp-3 text-[16px] font-normal leading-[1.5] tracking-[0.32px] text-[#707070]">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto h-px w-full bg-[#EFEFEF]" />

                  <div className="flex items-center justify-between gap-[8px]">
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
