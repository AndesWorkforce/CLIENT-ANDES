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
    <section className="w-full bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            What <span className="text-[#0097b2]">guides</span> us
          </h2>
          <p className="mt-3 text-lg md:text-[22px] font-medium text-[#525252] leading-[1.2]">
            The principles that shape how we work, collaborate, and grow
            together.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-[12px] shadow-[0px_4px_2px_rgba(167,162,162,0.25)] px-6 py-8 flex flex-col gap-3"
            >
              <div className="relative w-[89px] h-[89px]">
                <Image
                  src={value.icon}
                  alt={value.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-[#0097b2] text-[22px] font-bold leading-[1.3]">
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
