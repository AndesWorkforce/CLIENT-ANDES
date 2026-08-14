"use client";

import { useRef } from "react";

type Service = {
  id: number;
  category: string;
  categoryNum: string;
  title: string;
  description: string;
  features: string[];
  image: string;
};

const services: Service[] = [
  {
    id: 1,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Virtual Assistants",
    description:
      "Provide reliable remote support to streamline your daily operations. From managing emails and calendars to handling administrative tasks and coordination, they help you stay organized, productive, and focused on high-value priorities.",
    features: ["Email & Calendar", "Task Coordination", "Admin Support", "Scheduling"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Virtual+Assistants.webp",
  },
  {
    id: 2,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Data Entry Specialists",
    description:
      "Ensure accurate, efficient, and secure handling of your information. They manage data input, organization, and maintenance across systems, helping you maintain clean databases and make informed business decisions.",
    features: ["Data Input", "Database Mgmt", "Quality Control", "Reporting"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Data+Entry+Specialists.webp",
  },
  {
    id: 3,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Project Coordinators",
    description:
      "Keep initiatives on track by managing timelines, resources, and communication across teams, ensuring every project moves forward smoothly and is delivered on time.",
    features: ["Timeline Mgmt", "Resource Planning", "Team Communication", "Reporting"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Project+Coordinators.webp",
  },
  {
    id: 4,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Billing & Collections Specialists",
    description:
      "Ensure timely invoicing and follow-up on outstanding payments with professionalism, improving cash flow and reducing aging receivables.",
    features: ["Invoicing", "Payment Follow-Up", "Accounts Receivable", "Reconciliation"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Billing+%26+Collections+Specialists.webp",
  },
  {
    id: 5,
    category: "CUSTOMER-FACING ROLES",
    categoryNum: "02 · A voice your customers trust",
    title: "Appointment Setters",
    description:
      "Help grow your pipeline by connecting you with qualified prospects. They handle outbound and inbound scheduling, confirm meetings, and maintain organized calendars to ensure your team maximizes every opportunity.",
    features: ["Outbound Scheduling", "Meeting Confirmation", "CRM", "Pipeline Mgmt"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Appointment+Setters.webp",
  },
  {
    id: 6,
    category: "CUSTOMER-FACING ROLES",
    categoryNum: "02 · A voice your customers trust",
    title: "Client Success Representatives",
    description:
      "Focus on building strong, lasting relationships with your customers. They provide proactive support, ensure client satisfaction, and help drive retention and loyalty through consistent, high-quality communication.",
    features: ["Relationship Mgmt", "Satisfaction Tracking", "Retention", "Follow-up"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Client+Succes+Representatives.webp",
  },
  {
    id: 7,
    category: "SPECIALIZED SUPPORT",
    categoryNum: "03 · Expert support, built for your industry",
    title: "Legal Assistants",
    description:
      "Support your firm with essential administrative and case-related tasks — from document preparation and file management to client communication, keeping your legal team efficient and confidential.",
    features: ["Document Prep", "File Mgmt", "Scheduling", "Client Communication"],
    image: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Puestos+de+trabajo/Legal+Assistants.webp",
  },
];

export default function WhatWeOfferSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 435;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white py-[44px] md:py-[101px] px-[18px] md:px-[75px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-[22px] md:mb-[41px]">
          <p className="text-[#0097B2] font-semibold text-[12px] md:text-[14px] leading-[1.3] mb-[11px]">
            WHAT WE OFFER
          </p>
          <h2 className="text-[#343434] font-bold text-[24px] md:text-[52px] leading-[1.3] md:leading-[1.2] mb-[11px]">
            Specialized talent for the <span className="text-[#0097B2]">roles you need most</span>
          </h2>
          <p className="text-[#343434] md:text-[#525252] font-medium text-[14px] md:text-[22px] leading-[1.2]">
            Seven core service lines - each backed by carefully vetted, English-fluent professionals from across Latin America.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0097B2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-[24px] overflow-x-auto scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service) => (
              <div
                key={service.id}
              className="flex-shrink-0 w-[330px] md:w-[411px] bg-white border border-[#EFEFEF] rounded-[24px] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-[257px] rounded-tl-[24px] rounded-tr-[24px]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-[12px] left-[15px]">
                  <div className="bg-[#F8F8F8] px-[16px] py-[5px] rounded-[24px]">
                    <p className="text-[#343434] font-semibold text-[12px] md:text-[14px] leading-[1.3]">
                      {service.category}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-[24px] py-[20px] md:py-[41px] flex flex-col gap-[12px]">
                <p className="text-black text-[10px] md:text-[12px] font-normal">
                  {service.categoryNum}
                </p>
                <h3 className="text-black font-bold text-[18px] md:text-[22px] leading-[1.3]">
                  {service.title}
                </h3>
                <p className="text-[#707070] text-[12px] md:text-[16px] leading-[1.5] tracking-[0.24px] md:tracking-[0.32px]">
                  {service.description}
                </p>
                <div className="mt-[12px] p-[10px]">
                  <div className="flex flex-col gap-[11px]">
                    <div className="flex gap-[22px] flex-wrap">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex gap-[6px] items-center">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M11.6667 3.5L5.25 9.91667L2.33333 7"
                              stroke="#0097B2"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-black font-medium text-[12px] md:text-[14px] leading-[1.2]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-[22px] flex-wrap">
                      {service.features.slice(2).map((feature, idx) => (
                        <div key={idx} className="flex gap-[6px] items-center">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M11.6667 3.5L5.25 9.91667L2.33333 7"
                              stroke="#0097B2"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-black font-medium text-[12px] md:text-[14px] leading-[1.2]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0097B2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
