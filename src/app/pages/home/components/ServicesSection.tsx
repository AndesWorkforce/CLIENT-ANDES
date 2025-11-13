import { Zap, DollarSign, Shield, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

const whyChooseUs = [
  {
    icon: Zap,
    title: "Fast Hiring",
    description: "Get matched with pre-vetted talent in as little as 48 hours.",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: DollarSign,
    title: "Cost Effective",
    description:
      "Save up to 60% on staffing costs without compromising quality.",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Rigorous vetting process ensures only top 3% of candidates.",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Clock,
    title: "Time Zone Aligned",
    description:
      "Work with talent in compatible time zones for seamless collaboration.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity and Data Protection",
    description:
      "We safeguard sensitive legal information with top-tier cybersecurity and strict confidentiality protocols.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Tell Us Your Needs",
    description:
      "Share your requirements, timeline, and budget. We'll understand exactly what you're looking for.",
  },
  {
    step: 2,
    title: "Meet Your Matches",
    description:
      "We present 3-5 carefully selected candidates that match your specific criteria and company culture.",
  },
  {
    step: 3,
    title: "Start Working",
    description:
      "Choose your ideal candidate and we'll handle all the onboarding, contracts, and ongoing support.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Why Choose Andes Workforce Section */}
        <div className="mb-20">
          {/* Header */}
          <div className="text-center mb-12 bg-gradient-to-r from-[#0097B2] to-[#4A90E2] rounded-lg py-8 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Andes Workforce?
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              We make offshore staffing simple, reliable, and results-driven.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Features List */}
            <div className="space-y-6 lg:space-y-8">
              {whyChooseUs.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start  gap-4">
                    {/* Icon Circle */}
                    <div
                      className={`w-14 h-14 ${feature.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent
                        className={`w-7 h-7 ${feature.iconColor}`}
                      />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:flex justify-center items-center">
              <img
                src="/ideas-2.png"
                alt="Why Choose Us Illustration"
                className="w-full h-auto object-cover rounded-lg"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </div>
          <section className="container mx-auto py-12 mt-12 ">
            <div className="container mx-auto px-4 ">
              <div className="max-w-lg mx-auto text-center">
                <p className="text-lg text-gray-700 mb-8">
                  We handle regulatory requirements, ensuring compliant hiring
                  for all parties involved. Would you like to hear more about
                  our services? Please
                </p>

                <Link
                  href="/pages/contact"
                  className="inline-flex items-center justify-center bg-[#0097B2] hover:bg-[#00778E] text-white font-medium py-3 px-8 rounded-md transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Simple 3-Step Process Section */}
        <div>
          {/* Header */}
          <div className="text-center mb-12 bg-gradient-to-r from-[#0097B2] to-[#4A90E2] rounded-lg py-8 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              From consultation to onboarding, we make it effortless.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Process Steps */}
            <div className="space-y-8 lg:space-y-10">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Step Number Circle */}
                  <div className="w-16 h-16 bg-[#0097B2] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
                    {step.step}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:flex justify-center items-center">
              <img
                src="/ideas-3.png"
                alt="3-Step Process Illustration"
                className="w-full h-auto object-cover rounded-lg"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
