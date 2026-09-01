import Image from "next/image";

const items = [
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Gif/What+sets+us+apart/Support.webp",
    heading: ["Who we ", "support"],
    description:
      "Andes supports small and growing U.S.-based businesses that need reliable operational support without the cost and rigidity of traditional hiring.",
  },
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Gif/What+sets+us+apart/Value.webp",
    heading: ["What our clients ", "value"],
    description:
      "Our clients value efficiency, transparency, and long-term partnerships, and they come to us to build flexible remote teams that help them scale sustainably.",
  },
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Gif/What+sets+us+apart/Different.webp",
    heading: ["What makes us ", "different"],
    description:
      "What sets Andes apart is our people-first approach: we combine carefully selected, highly professional Latin American talent with strong structure, accountability, and hands-on support, delivering cost savings without compromising quality, trust, or performance.",
  },
];

export default function WhatSetsUsApart() {
  return (
    <section className="w-full bg-white py-8 sm:py-24">
      <div className="max-w-[1092px] mx-auto px-[21px] sm:px-6">
        {/* Header */}
        <div className="text-center mb-[22px] sm:mb-14">
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-black leading-[1.3]">
            What sets us apart
          </h2>
          <p className="mt-3 text-[14px] sm:text-lg md:text-[22px] font-medium text-[#525252] leading-[1.2]">
            Combining exceptional talent, operational support, and long-term
            partnership.
          </p>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-[22px] sm:gap-7">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-[rgba(4,78,92,0.06)] rounded-[12px] px-[22px] py-[44px] sm:px-6 sm:py-11 flex flex-col gap-[11px] sm:gap-3"
            >
              {/* Title row */}
              <div className="flex items-center gap-2">
                <div className="relative w-[45px] h-[45px] shrink-0 mix-blend-darken">
                  <Image
                    src={item.icon}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover mix-blend-darken"
                    aria-hidden
                  />
                </div>
                <h3 className="text-[22px] sm:text-[24px] md:text-[28px] font-semibold text-black leading-[1.3]">
                  {item.heading[0]}
                  <span className="text-[#0097b2]">{item.heading[1]}</span>
                </h3>
              </div>

              {/* Description */}
              <p className="text-[14px] sm:text-lg md:text-[20px] font-normal text-black leading-[1.5] tracking-[0.28px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
