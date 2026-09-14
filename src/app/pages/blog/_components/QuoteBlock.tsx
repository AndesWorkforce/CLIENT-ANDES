import { Quote } from "lucide-react";

interface QuoteBlockProps {
  text: string;
  author?: string;
  centered?: boolean;
}

export default function QuoteBlock({
  text,
  author,
  centered = false,
}: QuoteBlockProps) {
  return (
    <div className="relative flex flex-col items-start bg-[#F0F5FA] md:bg-[#F8F8F8] border-l-4 md:border-l-[3.2px] border-[#1A3A5C] rounded-tr-[16px] rounded-br-[16px] md:rounded-[14px] pl-[24px] md:pl-[35px] pr-[20px] md:pr-[32px] py-[24px] md:py-[32px] my-[22px] md:my-[44px]">
      <Quote
        className="w-[28px] h-[28px] md:absolute md:left-[24px] md:top-[24px] md:w-[32px] md:h-[32px] text-[#1A3A5C]/20 md:text-[#707070]/25 pointer-events-none shrink-0"
        strokeWidth={1.5}
      />
      <div className={`w-full pt-[12px] md:pt-0 md:pl-[16px] ${centered ? "text-center" : ""}`}>
        <p
          className={`font-semibold leading-[24.75px] md:leading-[33px] text-[#1A3A5C] md:text-[#00224D] break-words ${
            centered
              ? "text-[20px] md:text-[30px]"
              : "text-[18px] md:text-[24px]"
          }`}
        >
          {`"${text}"`}
        </p>
        {author && (
          <p className="font-medium text-[12px] md:text-[14px] text-[#6A7282] md:text-[#707070] leading-[16px] md:leading-[20px] pt-[12px] md:pt-[16px]">
            <span className="md:hidden">— {author}</span>
            <span className="hidden md:inline">
              <span>—</span>
              <span className="font-bold">{author}</span>
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
