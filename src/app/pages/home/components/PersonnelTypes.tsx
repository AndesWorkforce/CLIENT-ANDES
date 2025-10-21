import { Scale, BarChart, Building2 } from "lucide-react";

const serviceCategories = [
  {
    title: "Legal & Compliance",
    icon: Scale,
    color: "border-t-teal-500",
    iconColor: "text-teal-500",
    services: [
      "Legal assistants",
      "Case managers",
      "Intake specialists",
      "Document processing",
    ],
  },
  {
    title: "Data & Administration",
    icon: BarChart,
    color: "border-t-blue-500",
    iconColor: "text-blue-500",
    services: [
      "Database administrators",
      "Mail sorting specialists",
      "Data entry and processing",
      "Records management",
    ],
  },
  {
    title: "Business Operations",
    icon: Building2,
    color: "border-t-purple-500",
    iconColor: "text-purple-500",
    services: [
      "Virtual assistants",
      "Customer support",
      "Data analysts",
      "Project management",
    ],
  },
];

export default function PersonnelTypes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#0097B2] to-[#4A90E2] rounded-lg text-center mb-12 py-8 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-100 max-w-3xl mx-auto">
            Comprehensive workforce solutions tailored to your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden border-t-4 ${category.color}`}
              >
                {/* Card Header */}
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent
                      className={`w-8 h-8 ${category.iconColor}`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                </div>

                {/* Services List */}
                <div className="px-6 pb-6">
                  <ul className="space-y-2">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="text-gray-700 text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-12 max-w-4xl mx-auto">
          <p className="text-gray-700 text-lg">
            🔍{" "}
            <span className="font-semibold">
              Looking for something specific?
            </span>{" "}
            We can find talent for any special requirement you have!{" "}
            <span className="font-semibold text-[#0097B2]">
              Just let us know what you need.
            </span>{" "}
            ✨
          </p>
        </div>
      </div>
    </section>
  );
}
