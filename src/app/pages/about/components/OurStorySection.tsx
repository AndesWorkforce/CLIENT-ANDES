import Image from "next/image";

type StoryBlock = {
  id: string;
  title: string;
  body: string | string[];
  image: string;
  imageAlt: string;
  imageLeft: boolean;
  imageClass?: string;
};

const storyBlocks: StoryBlock[] = [
  {
    id: "started",
    title: "Where it all started",
    body: "Andes was built on service and a simple belief: talent exists everywhere, opportunity should not be limited by geography, and meaningful work can create lasting impact.",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Our+Story+-+foto+01.webp",
    imageAlt: "Where it all started",
    imageLeft: true,
  },
  {
    id: "began",
    title: "Where it all began",
    body: "Our founder, Miguel, was born in Chicago, Illinois, and moved at a very young age to his parents' homeland, Colombia, where he grew up immersed in the culture and developed a deep appreciation for the education, professionalism, and work ethic of Latin American talent.",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Our+Story+-+foto+02.webp",
    imageAlt: "Where it all began",
    imageLeft: false,
  },
  {
    id: "service",
    title: "A path defined by service",
    body: [
      "He later returned to the U.S. to serve 22 years in the Navy, where discipline, trust, and service became the values that still define Andes today.",
      "After his service, Miguel continued supporting fellow sailors, working with veteran-focused law firms led by former Navy members now practicing law. Andes was born to give these teams reliable remote administrative support, so they can focus on their mission.",
    ],
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Our+Story+-+foto+03.webp",
    imageAlt: "A path defined by service",
    imageLeft: true,
    imageClass: "object-cover object-top",
  },
  {
    id: "expanding",
    title: "Expanding with purpose",
    body: [
      "What began as a purpose-driven initiative grew into a trusted partner for organizations seeking dependable, skilled remote teams. Today, Andes connects exceptional Latin American talent with U.S. law firms, insurance companies, and consulting firms.",
      "Rooted in service and driven by people, Andes grows with integrity — proving that when purpose meets opportunity, everyone thrives.",
    ],
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Our+Story+-+foto+04.webp",
    imageAlt: "Expanding with purpose",
    imageLeft: false,
  },
];

export default function OurStorySection() {
  return (
    <section className="w-full bg-white py-8 sm:py-24">
      <div className="max-w-[1092px] mx-auto px-[18px] sm:px-6">
        <div className="text-center mb-8 sm:mb-[53px]">
          <h2 className="text-[#0097b2] text-[32px] sm:text-4xl md:text-[52px] font-bold leading-[1.3]">
            Our Story
          </h2>
          <p className="mt-[11px] text-[#525252] text-[14px] sm:text-lg md:text-[22px] font-medium leading-[1.2]">
            Built on service, shaped by experience, and driven by people.
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:gap-[88px]">
          {storyBlocks.map((block) => (
            <div
              key={block.id}
              className={`flex flex-col gap-[22px] lg:gap-[44px] items-center ${
                block.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <div className="relative w-full aspect-[528/364] lg:w-[528px] lg:h-[364px] lg:aspect-auto shrink-0 overflow-hidden rounded-[16px]">
                <Image
                  src={block.image}
                  alt={block.imageAlt}
                  fill
                  className={`rounded-[16px] ${block.imageClass ?? "object-cover object-center"}`}
                />
              </div>

              <div className="flex-1 w-full min-w-0">
                <h3 className="text-[24px] sm:text-3xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
                  {block.title}
                </h3>
                <div className="mt-[22px] sm:mt-[33px] text-[14px] sm:text-[18px] text-black leading-[1.6] flex flex-col gap-4">
                  {Array.isArray(block.body) ? (
                    block.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{block.body}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
