import type { ReactNode } from "react";
import type { FaqAnswerBlock } from "../faq.data";

const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

const answerTextClass =
  "text-[16px] font-normal text-[#525252] leading-[1.3]";
const answerParagraphClass = `${answerTextClass} mb-2 last:mb-0`;
const answerLinkClass =
  "underline decoration-solid underline-offset-2 cursor-pointer";

function renderTextWithLinks(text: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const matches: { index: number; length: number; href: string; label: string }[] =
    [];

  for (const match of text.matchAll(EMAIL_REGEX)) {
    if (match.index !== undefined) {
      matches.push({
        index: match.index,
        length: match[0].length,
        href: `mailto:${match[0]}`,
        label: match[0],
      });
    }
  }

  for (const match of text.matchAll(URL_REGEX)) {
    if (match.index !== undefined) {
      const href = match[0].startsWith("http")
        ? match[0]
        : `https://${match[0]}`;
      matches.push({
        index: match.index,
        length: match[0].length,
        href,
        label: match[0],
      });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  for (const match of matches) {
    if (match.index < lastIndex) continue;
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={`${match.index}-${match.label}`}
        href={match.href}
        className={answerLinkClass}
        target={match.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={match.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      >
        {match.label}
      </a>
    );
    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

type FaqAnswerContentProps = {
  blocks: FaqAnswerBlock[];
};

export default function FaqAnswerContent({ blocks }: FaqAnswerContentProps) {
  return (
    <div className={`flex w-full flex-col ${answerTextClass}`}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          const lines = block.text.split("\n").filter((line) => line.trim() !== "");

          if (lines.length > 1) {
            return (
              <div key={index} className="mb-2 last:mb-0">
                {lines.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className={
                      lineIndex < lines.length - 1
                        ? answerParagraphClass
                        : answerTextClass
                    }
                  >
                    {renderTextWithLinks(line)}
                  </p>
                ))}
              </div>
            );
          }

          return (
            <p key={index} className={answerParagraphClass}>
              {renderTextWithLinks(block.text)}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <div key={index} className="flex flex-col">
              {block.items.map((item, itemIndex) => (
                <p
                  key={itemIndex}
                  className={
                    itemIndex < block.items.length - 1
                      ? answerParagraphClass
                      : answerTextClass
                  }
                >
                  {renderTextWithLinks(item)}
                </p>
              ))}
            </div>
          );
        }

        return (
          <p
            key={index}
            className={`${answerTextClass} mt-2 mb-0`}
          >
            {renderTextWithLinks(block.text)}
          </p>
        );
      })}
    </div>
  );
}
