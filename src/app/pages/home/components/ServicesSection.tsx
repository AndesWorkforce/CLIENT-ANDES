import { Zap, DollarSign, Shield, Clock } from "lucide-react";

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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Andes Workforce?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make offshore staffing simple, reliable, and results-driven.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  {/* Icon Circle */}
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simple 3-Step Process Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From consultation to onboarding, we make it effortless.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                {/* Step Number Circle */}
                <div className="w-16 h-16 bg-[#0097B2] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  {step.step}
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
