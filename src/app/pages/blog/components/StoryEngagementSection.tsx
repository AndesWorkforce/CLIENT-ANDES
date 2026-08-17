"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

const comments = [
  {
    id: "1",
    name: "Laura Martínez",
    date: "July 12, 2026",
    initials: "LM",
    text: "This really resonates. So many companies talk about 'culture' but this shows what it actually looks like when trust is built over years, not written in a mission statement. Great story!",
  },
  {
    id: "2",
    name: "Carlos Pérez",
    date: "July 12, 2026",
    initials: "CP",
    text: "Love seeing the human side behind the business. It's easy to think of remote staffing as just transactional, but this shows the real relationships behind it. Looking forward to more stories like this!",
  },
];

export default function StoryEngagementSection() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(47);
  const [draft, setDraft] = useState("");

  const toggleLike = () => {
    setLiked((prev) => {
      setLikeCount((count) => count + (prev ? -1 : 1));
      return !prev;
    });
  };

  return (
    <section className="relative w-full bg-white">
      <div className="max-w-[850px] mx-auto px-[18px] md:px-[44px]">
        <div className="border-t border-black/10 pt-[33px] pb-[24px] flex items-center gap-[6px]">
          <div className="flex items-center">
            {["AF", "LM", "CP"].map((initials, i) => (
              <div
                key={initials}
                className={`flex items-center justify-center size-10 rounded-full bg-[#DFFAFF] text-[#0097B2] text-[12px] font-semibold ${
                  i > 0 ? "-ml-3" : ""
                }`}
              >
                {initials}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center gap-[4px] px-[13px] py-[12px] rounded-[20px] border border-[#707070] transition-colors ${
              liked ? "bg-[#0097B2]/10" : "bg-transparent"
            }`}
          >
            <Heart
              className={`w-[18px] h-[18px] ${
                liked ? "fill-[#0097B2] text-[#0097B2]" : "text-[#707070]"
              }`}
            />
            <span className="font-medium text-[16px] text-[#707070] leading-[1.2]">
              Like
            </span>
            <span className="font-semibold text-[16px] text-[#707070] leading-[1.3]">
              {likeCount}
            </span>
          </button>
        </div>

        <div className="border-t border-black/10 pt-[33px] pb-[48px] flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[8px]">
              <MessageCircle className="w-5 h-5 text-[#343434]" />
              <h3 className="font-semibold text-[18px] text-[#343434] leading-[1.3]">
                Comments{" "}
                <span className="font-normal text-[16px] text-[#717182]">
                  ({comments.length})
                </span>
              </h3>
            </div>
            <div className="relative">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share your opinions..."
                rows={4}
                className="w-full resize-none rounded-[16px] border border-[#EFEFEF] bg-[#F8F8F8] px-4 py-3 pr-24 text-[14px] text-[#343434] placeholder:text-[#858585] outline-none focus:border-[#0097B2]"
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 px-4 py-1.5 rounded-[20px] bg-[#0097B2] text-white text-[14px] font-medium"
              >
                Post
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-[16px] items-start">
                <div className="flex items-center justify-center size-10 rounded-full bg-[#DFFAFF] text-[#0097B2] text-[12px] font-semibold shrink-0">
                  {comment.initials}
                </div>
                <div className="flex-1 min-w-0 bg-[rgba(233,235,239,0.3)] rounded-tl-[6px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[14px] text-[#0A0A0A] leading-[1.3]">
                      {comment.name}
                    </p>
                    <p className="font-normal text-[12px] text-[#717182] leading-4 whitespace-nowrap">
                      {comment.date}
                    </p>
                  </div>
                  <p className="pt-1 font-normal text-[14px] text-[rgba(10,10,10,0.8)] leading-[1.5] tracking-[0.28px]">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
