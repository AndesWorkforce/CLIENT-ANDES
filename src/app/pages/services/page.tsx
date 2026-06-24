"use client";

import { useRef } from "react";
import FeaturedTalentSection from "@/app/pages/offers/components/FeaturedTalentSection";
import ContactFormSection from "@/app/pages/offers/components/ContactFormSection";

const services = [
  {
    id: 1,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Virtual Assistants",
    description:
      "Provide reliable remote support to streamline your daily operations. From managing emails and calendars to handling administrative tasks and coordination, they help you stay organized, productive, and focused on high-value priorities.",
    features: ["Email & Calendar", "Task Coordination", "Admin Support", "Scheduling"],
    image: "https://appwiseinnovations.dev/Andes/services-view-1.png",
  },
  {
    id: 2,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Data Entry Specialists",
    description:
      "Ensure accurate, efficient, and secure handling of your information. They manage data input, organization, and maintenance across systems, helping you maintain clean databases and make informed business decisions.",
    features: ["Data Input", "Database Mgmt", "Quality Control", "Reporting"],
    image: "https://appwiseinnovations.dev/Andes/services-view-1.png",
  },
  {
    id: 3,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Project Coordinators",
    description:
      "Keep initiatives on track by managing timelines, resources, and communication across teams, ensuring every project moves forward smoothly and is delivered on time.",
    features: ["Timeline Mgmt", "Resource Planning", "Team Communication", "Reporting"],
    image: "https://appwiseinnovations.dev/Andes/services-view-1.png",
  },
  {
    id: 4,
    category: "BACK-OFFICE SUPPORT",
    categoryNum: "01 · Operations that run themselves",
    title: "Billing & Collections Specialists",
    description:
      "Ensure timely invoicing and follow-up on outstanding payments with professionalism, improving cash flow and reducing aging receivables.",
    features: ["Invoicing", "Payment Follow-Up", "Accounts Receivable", "Reconciliation"],
    image: "https://appwiseinnovations.dev/Andes/services-view-1.png",
  },
  {
    id: 5,
    category: "CUSTOMER-FACING ROLES",
    categoryNum: "02 · A voice your customers trust",
    title: "Appointment Setters",
    description:
      "Help grow your pipeline by connecting you with qualified prospects. They handle outbound and inbound scheduling, confirm meetings, and maintain organized calendars to ensure your team maximizes every opportunity.",
    features: ["Outbound Scheduling", "Meeting Confirmation", "CRM", "Pipeline Mgmt"],
    image: "https://appwiseinnovations.dev/Andes/services-view-2.png",
  },
  {
    id: 6,
    category: "CUSTOMER-FACING ROLES",
    categoryNum: "02 · A voice your customers trust",
    title: "Client Success Representatives",
    description:
      "Focus on building strong, lasting relationships with your customers. They provide proactive support, ensure client satisfaction, and help drive retention and loyalty through consistent, high-quality communication.",
    features: ["Relationship Mgmt", "Satisfaction Tracking", "Retention", "Follow-up"],
    image: "https://appwiseinnovations.dev/Andes/services-view-2.png",
  },
  {
    id: 7,
    category: "SPECIALIZED SUPPORT",
    categoryNum: "03 · Expert support, built for your industry",
    title: "Legal Assistants",
    description:
      "Support your firm with essential administrative and case-related tasks — from document preparation and file management to client communication, keeping your legal team efficient and confidential.",
    features: ["Document Prep", "File Mgmt", "Scheduling", "Client Communication"],
    image: "https://appwiseinnovations.dev/Andes/services-view-3.png",
  },
];

export default function ServicesPage() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-start">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://www.figma.com/api/mcp/asset/4a201399-774d-4f8d-aef9-d62f0b689f75')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(4,78,92,0.8) 20.19%, rgba(5,100,117,0.76) 53.99%, rgba(8,166,194,0.24) 71.95%)",
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-[82px] w-full">
          <div className="max-w-[1063px]">
            <h1 className="text-white font-bold text-[64px] leading-[1.3] mb-[10px]">
              Hire Top-Tier Talent Tailored to Your Needs
            </h1>
            <p className="text-white font-semibold text-[28px] leading-[1.3] max-w-[831px]">
              Browse expert profiles and hire securely with dedicated support from Andes Workforce
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="w-full bg-white py-[101px] px-[75px]">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center mb-[41px]">
            <p className="text-[#0097B2] font-semibold text-[14px] leading-[1.3] mb-[11px]">
              WHAT WE OFFER
            </p>
            <h2 className="text-[#343434] font-bold text-[52px] leading-[1.3] mb-[11px]">
              What We Offer
            </h2>
            <p className="text-[#525252] font-medium text-[22px] leading-[1.2]">
              Specialized talent across the roles your business need most
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
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
                  className="flex-shrink-0 w-[411px] bg-white border border-[#EFEFEF] rounded-[24px] overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-[257px] rounded-tl-[24px] rounded-tr-[24px]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-[12px] left-[15px]">
                      <div className="bg-[#F8F8F8] px-[16px] py-[5px] rounded-[24px]">
                        <p className="text-[#343434] font-semibold text-[14px] leading-[1.3]">
                          {service.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-[24px] py-[41px] flex flex-col gap-[12px]">
                    <p className="text-black text-[12px] font-normal">
                      {service.categoryNum}
                    </p>
                    <h3 className="text-black font-bold text-[22px] leading-[1.3]">
                      {service.title}
                    </h3>
                    <p className="text-[#707070] text-[16px] leading-[1.5] tracking-[0.32px]">
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
                              <span className="text-black font-medium text-[14px] leading-[1.2]">
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
                              <span className="text-black font-medium text-[14px] leading-[1.2]">
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
              className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
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
      </section>

      {/* Process Section */}
      <section className="w-full bg-white py-[117px] px-[80px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-[30px]">
            <p className="text-[#0097B2] font-semibold text-[14px] leading-[1.3] mb-[11px]">
              MEET OUR TALENT
            </p>
            <h2 className="text-black font-bold text-[52px] leading-[1.2] mb-[22px]">
              From request to ready in days, not weeks
            </h2>
            <p className="text-[#525252] font-medium text-[22px] leading-[1.2]">
              A simple, transparent process designer to remove friction from your hiring
            </p>
          </div>

          <div className="flex justify-center gap-[44px]">
            <div className="flex flex-col gap-[18px] w-[287px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
                <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">01</p>
              </div>
              <h3 className="text-black font-bold text-[22px] leading-[1.3]">
                Tell us your needs
              </h3>
              <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
                Share the role, hours, and the exact skills you're looking for
              </p>
            </div>

            <div className="flex flex-col gap-[18px] w-[287px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
                <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">02</p>
              </div>
              <h3 className="text-black font-bold text-[22px] leading-[1.3]">
                Get matched in 48h
              </h3>
              <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
                We hand-pick 3 vetted candidates from our 300+ talent pool
              </p>
            </div>

            <div className="flex flex-col gap-[18px] w-[287px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
                <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">03</p>
              </div>
              <h3 className="text-black font-bold text-[22px] leading-[1.3]">
                Interview & hire
              </h3>
              <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
                You interview, we handle contracts, payroll, and compliance.
              </p>
            </div>

            <div className="flex flex-col gap-[18px] w-[287px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
                <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">04</p>
              </div>
              <h3 className="text-black font-bold text-[22px] leading-[1.3]">
                Scale with confidence
              </h3>
              <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
                Ongoing support and a dedicated success manager.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Talent Section */}
      <FeaturedTalentSection />

      {/* Contact Form Section */}
      <ContactFormSection />

      {/* Benefits Section */}
      <section className="w-full flex">
        <div className="w-1/2 bg-white py-[77px] px-[80px]">
          <div className="max-w-[601px]">
            <div className="mb-[38px]">
              <p className="text-[#0097B2] font-semibold text-[14px] leading-[1.3] mb-[11px]">
                WHY ANDES WORKFORCE
              </p>
              <h2 className="text-black font-bold text-[48px] leading-[1.3]">
                Elevate your team with{" "}
                <span className="text-[#0097B2]">world-class talent</span>
              </h2>
            </div>

            <div className="flex flex-col gap-[39px] mb-[38px]">
              <div className="flex gap-[11px]">
                <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#0097B2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" />
                    <path d="M26 27v-2c0-2.2-1.8-4-4-4h-12c-2.2 0-4 1.8-4 4v2" />
                    <path d="M21 7l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#0097B2] font-bold text-[18px] leading-[1.3] mb-[7px]">
                    Vetted Elite Talent
                  </h3>
                  <p className="text-[#525252] font-medium text-[18px] leading-[1.2]">
                    Access a pool of highly skilled professionals dedicated to excellence
                  </p>
                </div>
              </div>

              <div className="flex gap-[11px]">
                <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 31 31"
                    fill="none"
                    stroke="#0097B2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 6l-9.5 9.5-5-5L2 17" />
                    <path d="M17 6h6v6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#0097B2] font-bold text-[18px] leading-[1.3] mb-[7px]">
                    High-Impact Performance
                  </h3>
                  <p className="text-[#525252] font-medium text-[18px] leading-[1.2]">
                    Every role is filled with experts committed to delivering results
                  </p>
                </div>
              </div>

              <div className="flex gap-[11px]">
                <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#0097B2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 13l-5 5-5-5" />
                    <path d="M18 3v15" />
                    <path d="M9 8H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#0097B2] font-bold text-[18px] leading-[1.3] mb-[7px]">
                    Exceptional Value
                  </h3>
                  <p className="text-[#525252] font-medium text-[18px] leading-[1.2]">
                    Positions start at $2,000/month with zero compromise on quality
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={scrollToContact}
              className="bg-[#0097B2] text-white font-semibold text-[20px] leading-[1.3] px-[25px] py-[12px] rounded-[20px] hover:bg-[#007A8F] transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="w-1/2 h-[749px] relative">
          <img
            src="https://www.figma.com/api/mcp/asset/340be97d-b5f5-432a-937e-1770cac188d8"
            alt="Office professional"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
