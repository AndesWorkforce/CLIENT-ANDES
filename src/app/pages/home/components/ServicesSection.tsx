import Image from "next/image";

const services = [
  {
    icon: "https://appwiseinnovations.dev/Andes/service-1.png",
    title: "Administrative Support",
    description:
      "Our team members bring the administrative and customer service skills you are looking for, skills that will help you expand your business while growing your client base.",
  },
  {
    icon: "https://appwiseinnovations.dev/Andes/service-2.png",
    title: "Cost Efficient",
    description:
      "Eliminate hiring headaches and save thousands of dollars on payroll and administrative costs",
  },
  {
    icon: "https://appwiseinnovations.dev/Andes/service-3.png",
    title: "HR Solutions",
    description:
      "We find and hire personnel for you, reducing your HR workload.",
  },
  {
    icon: "https://appwiseinnovations.dev/Andes/service-4.png",
    title: "Compliance",
    description:
      "We handle regulatory requirements, ensuring compliant hiring for all parties involved.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-[#FCFEFF]">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#17323A] mb-10">
          How It Works?
        </h2>

        {/* Versión Mobile: Servicios en columna */}
        <div className="md:hidden">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center mb-12 last:mb-0"
            >
              <Image
                src={service.icon}
                alt={service.title}
                width={100}
                height={100}
              />
              <p className="text-gray-700 max-w-xs mt-8">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Versión Desktop: Servicios en fila con divisores verticales */}
        <div className="hidden md:block relative">
          {/* Contenedor de líneas divisorias */}
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-px bg-gray-200 mx-auto"
                style={{
                  position: "absolute",
                  left: `${25 + i * 25}%`,
                }}
              ></div>
            ))}
          </div>

          {/* Servicios */}
          <div className="flex items-start justify-between relative z-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center w-1/4 px-4"
              >
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={100}
                  height={100}
                />
                <p className="text-gray-700 px-2 mt-8">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
