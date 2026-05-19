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
  },
  {
    id: "began",
    title: "Where it all began",
    body: "Our founder, Miguel, was born in Chicago, Illinois, and moved at a very young age to his parents' homeland, Colombia, where he grew up immersed in the culture and developed a deep appreciation for the education, professionalism, and work ethic of Latin American talent.",
    image:
      "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Where+it+all+began+-+Our+Story.png",
    imageAlt: "Where it all began",
    imageLeft: true,
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
  },
];

export default function OurStorySection() {
  return (
    <section className="w-full bg-white py-24">
        <div className="max-w-[1480px] mx-auto px-10 md:px-20">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-[#0097b2] text-4xl md:text-[52px] font-bold leading-[1.3]">
            Our Story
          </h2>
          <p className="mt-3 text-[#525252] text-lg md:text-[22px] font-medium leading-[1.2]">
            Built on service, shaped by experience, and driven by people.
          </p>
        </div>

        {/* Story blocks */}
        <div className="flex flex-col gap-16">
          {storyBlocks.map((block) => (
            <div
              key={block.id}
              className={`flex flex-col gap-12 items-center ${
                block.imageLeft ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-[611px] shrink-0">
                <Image
                  src={block.image}
                  alt={block.imageAlt}
                  width={611}
                  height={480}
                  className="w-full h-auto"
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-3xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
                  {block.title}
                </h3>
                <div className="mt-8 text-[18px] text-black leading-[1.6] flex flex-col gap-4">
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
