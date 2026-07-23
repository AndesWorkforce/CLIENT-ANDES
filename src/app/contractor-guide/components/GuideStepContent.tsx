import type { GuideContentBlock } from "../contractor-guide.data";

const textClass = "text-[16px] font-normal text-[#525252] leading-[1.3]";
const headingClass = "text-[16px] font-medium text-[#343434] leading-[1.3]";

type GuideStepContentProps = {
  blocks: GuideContentBlock[];
};

export default function GuideStepContent({ blocks }: GuideStepContentProps) {
  return (
    <div className={`flex w-full flex-col gap-2 ${textClass}`}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index} className={textClass}>
              {block.text}
            </p>
          );
        }

        if (block.type === "heading") {
          return (
            <p key={index} className={`${headingClass} mt-1 first:mt-0`}>
              {block.text}
            </p>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol
              key={index}
              className="list-decimal pl-6 flex flex-col gap-1"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className={textClass}>
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "unordered-list") {
          return (
            <ul key={index} className="list-disc pl-6 flex flex-col gap-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className={textClass}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className={`${textClass} mt-1`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
