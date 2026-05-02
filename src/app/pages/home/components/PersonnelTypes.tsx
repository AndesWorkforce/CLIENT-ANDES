import Image from "next/image";
import Link from "next/link";

const S3 = "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/";

const BG_IMAGE = `${S3}modern-equipped-computer-lab+(1)a.jpg`;

const icons = {
  legal: `${S3}b3d671d7a9f7c7b5e3e1f8370ac01f43ac7afd57.gif`,
  data: `${S3}evolution.gif`,
  business: `${S3}corporate-culture.gif`,
};

type ServiceCard = {
  title: string;
  icon: string;
  alt: string;
  items: string[];
};

const services: ServiceCard[] = [
  {
    title: "Legal & Compliance",
    icon: icons.legal,
    alt: "Legal & Compliance icon",
    items: [
      "Legal assistants",
      "Case managers",
      "Intake specialists",
      "Document processing",
    ],
  },
  {
    title: "Data & Administration",
    icon: icons.data,
    alt: "Data & Administration icon",
    items: [
      "Database administrators",
      "Mail sorting specialists",
      "Data entry and processing",
      "Records management",
    ],
  },
  {
    title: "Business Operations",
    icon: icons.business,
    alt: "Business Operations icon",
    items: [
      "Virtual assistants",
      "Customer support",
      "Data analysts",
      "Project management",
    ],
  },
];

export default function PersonnelTypes() {
  return (
    <section className="relative overflow-hidden py-[123px]">
      {/* Background image */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        priority={false}
        className="object-cover object-center -z-20"
      />
      {/* Cyan / dark teal overlay to match Figma */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,80,100,0.55) 0%, rgba(0,151,178,0.55) 100%)",
        }}
      />

      <div className="relative max-w-[1000px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-white font-bold text-[32px] leading-[1.3] mb-[10px]">
            Our Services
          </h2>
          <p className="text-white font-medium text-[20px] leading-[1.2] max-w-[560px] mx-auto">
            Comprehensive workforce solutions tailored to your business needs
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[50px] mb-[58px]">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-[20px] p-[30px] h-[300px] flex flex-col gap-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:scale-[1.03] cursor-default"
            >
              <img
                src={service.icon}
                alt={service.alt}
                className="w-[40px] h-[40px] object-contain"
              />
              <h3 className="text-[#0097b2] font-bold text-[20px] leading-[1.3]">
                {service.title}
              </h3>
              <ul className="flex flex-col gap-[8px]">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-[8px] text-[14px] text-[#343434] leading-[1.3]"
                  >
                    <span className="text-[#0097b2]">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center gap-[25px] max-w-[375px] mx-auto text-center">
          <p className="text-white font-medium text-[16px] leading-[1.5]">
            Looking for something specific? We can find talent for any special
            requirement you have!
          </p>
          <Link
            href="/pages/services"
            className="inline-flex items-center justify-center bg-white text-[#0097b2] font-semibold text-[20px] leading-[1.3] px-[25px] py-[12px] rounded-[20px] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] transition-colors hover:bg-gray-200"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}


