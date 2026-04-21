"use client";

import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/app/pages/offers/components/HeroSection";
import FeaturedTalentSection from "@/app/pages/offers/components/FeaturedTalentSection";
import BenefitsSection from "@/app/pages/offers/components/BenefitsSection";
import ContactFormSection from "@/app/pages/offers/components/ContactFormSection";

const services = [
  {
    id: 1,
    title: "Administrative Assistants",
    description:
      "Carry out office duties such as answering phone calls, scheduling appointments, writing and distributing mail, correspondence, faxes, etc.",
    image: "https://appwiseinnovations.dev/Andes/services-view-1.png",
  },
  {
    id: 2,
    title: "Customer Service",
    description:
      "Interact with customers to answer questions and assist them with their needs. Answer phone calls and emails in a timely manner to resolve any emerging problem.",
    image: "https://appwiseinnovations.dev/Andes/services-view-2.png",
  },
  {
    id: 3,
    title: "Call Center",
    description:
      "Handle inbound and outbound calls to and from customers making sure that everyone quickly receives the help they need.",
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

  return (
    <main className="min-h-screen">
      {/* Hero: Hire Top-Tier Talent */}
      <HeroSection onContactClick={scrollToContact} />

      {/* Service categories */}
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold text-[#08252A] mb-3">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Specialized talent across the roles your business needs most
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col hover:shadow-lg transition-shadow min-h-[420px]"
              >
                <div className="h-56 relative flex-shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-[#08252A] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#08252A] text-sm mb-5">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href="/pages/contact"
                      className="inline-block bg-[#0097B2] text-white py-2 px-4 rounded text-sm hover:bg-[#007A8F] transition-colors"
                    >
                      Message Us
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talent Carousel */}
      <FeaturedTalentSection />

      {/* Contact Form */}
      <ContactFormSection />

      {/* Benefits for clients */}
      <BenefitsSection onContactClick={scrollToContact} />
    </main>
  );
}
