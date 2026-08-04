import Image from "next/image";

const storyBlocks = [
  {
    id: "started",
    title: "Where it all started",
    body: "Andes was built on service and a simple belief: talent exists everywhere, opportunity should not be limited by geography, and meaningful work can create lasting impact.",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Where+it+all+started+-+Our+Story.jpg",
    imageAlt: "Where it all started",
    imageLeft: false,
    imageMaxWidth: 480,
  },
  {
    id: "began",
    title: "Where it all began",
    body: "Our founder, Miguel, was born in Chicago, Illinois, and moved at a very young age to his parents' homeland, Colombia, where he grew up immersed in the culture and developed a deep appreciation for the education, professionalism, and work ethic of Latin American talent.",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Where+it+all+began+-+Our+Story.png",
    imageAlt: "Where it all began",
    imageLeft: true,
    imageMaxWidth: 480,
  },
  {
    id: "service",
    title: "A path defined by service",
    body: [
      "He later returned to the United States to serve 22 years in the U.S. Navy, where discipline, trust, and service became core values that still define Andes today.",
      "After his military service, Miguel sought to continue supporting his fellow sailors. He began working with veteran-focused law firms, alongside former Navy service members who are now attorneys dedicated to helping veterans secure the benefits they deserve. Andes was created to provide these teams with high-quality, reliable remote administrative support, allowing them to focus on their mission.",
    ],
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/A+path+defined+by+service+-+Our+Story.png",
    imageAlt: "A path defined by service",
    imageLeft: false,
    // Native aspect is taller — keep it smaller so it matches the others visually
    imageMaxWidth: 440,
  },
  {
    id: "expanding",
    title: "Expanding with purpose",
    body: [
      "What began as a purpose-driven initiative quickly grew into a trusted partner for organizations seeking dependable, skilled remote teams. Today, Andes supports law firms, insurance companies, consulting firms, and other professional services, connecting exceptional talent in Latin America with companies across the U.S.",
      "Rooted in service and driven by people, Andes continues to grow with integrity, proving that when purpose meets opportunity, everyone thrives.",
    ],
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Expanding+with+purpose+-+Our+Story.JPG",
    imageAlt: "Expanding with purpose",
    imageLeft: true,
    imageMaxWidth: 380,
  },
];

export default function OurStorySection() {
  return (
    <section className="w-full bg-white py-8 sm:py-24">
      <div className="max-w-[1440px] mx-auto px-[18px] sm:px-10 md:px-20">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-[#0097b2] text-[32px] sm:text-4xl md:text-[52px] font-bold leading-[1.3]">
            Our Story
          </h2>
          <p className="mt-3 text-[#525252] text-[14px] sm:text-lg md:text-[22px] font-medium leading-[1.2]">
            Built on service, shaped by experience, and driven by people.
          </p>
        </div>

        {/* Story blocks */}
        <div className="flex flex-col gap-8 sm:gap-16">
          {storyBlocks.map((block) => (
            <div
              key={block.id}
              className={`flex flex-col gap-[22px] sm:gap-12 items-center ${
                block.imageLeft ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Text — keeps the same column space */}
              <div className="flex-1 w-full min-w-0">
                <h3 className="text-[24px] sm:text-3xl md:text-[48px] font-bold text-[#343434] leading-[1.3] text-center lg:text-left">
                  {block.title}
                </h3>
                <div className="mt-[22px] sm:mt-8 text-[14px] sm:text-[18px] text-black leading-[1.6] flex flex-col gap-4">
                  {Array.isArray(block.body) ? (
                    block.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{block.body}</p>
                  )}
                </div>
              </div>

              {/* Image column keeps original desktop width so text width stays the same */}
              <div className="w-full shrink-0 flex justify-center lg:w-[611px]">
                <div
                  className="w-full flex justify-center"
                  style={{ maxWidth: block.imageMaxWidth }}
                >
                  <Image
                    src={block.image}
                    alt={block.imageAlt}
                    width={block.imageMaxWidth}
                    height={Math.round(block.imageMaxWidth * 0.75)}
                    className="w-full h-auto object-contain rounded-[15px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
