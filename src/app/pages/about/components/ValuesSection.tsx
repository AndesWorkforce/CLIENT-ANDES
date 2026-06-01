import Image from "next/image";

const values = [
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Honesty+-+Values.gif",
    title: "Honesty",
    description: "We act with integrity and transparency in every interaction.",
  },
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Diversity+-+Values.gif",
    title: "Diversity",
    description:
      "We value different perspectives and believe they make our teams stronger.",
  },
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Accountability.gif",
    title: "Accountability",
    description:
      "We take ownership of our work and follow through on every commitment.",
  },
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Comunnication+-+Values.gif",
    title: "Communication",
    description:
      "We communicate clearly, openly, and with purpose in everything we do.",
  },
  {
    icon: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Respect+-+Values.gif",
    title: "Respect",
    description:
      "We treat everyone with consideration, empathy, and professionalism.",
  },
];

export default function ValuesSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-24">
      <div className="max-w-[1480px] mx-auto px-[18px] sm:px-10 md:px-20">
        {/* Header */}
        <div className="text-center mb-[22px] sm:mb-10">
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            What <span className="text-[#0097b2]">guides</span> us
          </h2>
          <p className="mt-3 text-[14px] sm:text-lg md:text-[22px] font-medium text-[#525252] leading-[1.2]">
            The principles that shape how we work, collaborate, and grow
            together.
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto gap-[22px] pb-2 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible md:gap-8 md:pb-0">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-[12px] shadow-[0px_4px_2px_rgba(167,162,162,0.25)] flex-shrink-0 w-[157px] px-[22px] py-[33px] md:flex-shrink md:w-auto md:px-6 md:py-8 flex flex-col gap-3"
            >
              <div className="relative w-[50px] h-[50px] md:w-[89px] md:h-[89px]">
                <Image
                  src={value.icon}
                  alt={value.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-[#0097b2] text-[20px] md:text-[22px] font-bold leading-[1.3]">
                {value.title}
              </h3>
              <p className="text-black text-[12px] font-normal leading-[1.3] tracking-[0.24px]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
