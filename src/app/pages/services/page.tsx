import Image from "next/image";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Administrative Assistants",
    description:
      "Let us aid in the administrative concerns of your company. Take care of day-to-day tasks and increase productivity with our office coordinators.",
    image: "https://appwiseinnovations.dev/Andes/services-view-1.png",
  },
  {
    id: 2,
    title: "Customer Service Representatives",
    description:
      "Our representatives are experts in interpersonal communication and problem-solving. They handle inquiries, resolve issues, and leave your customers satisfied.",
    image: "https://appwiseinnovations.dev/Andes/services-view-2.png",
  },
  {
    id: 3,
    title: "Call Center Agents",
    description:
      "Provide efficient and professional calls to your clients. Our agents are trained to handle high call volumes and maintain quality service at all times.",
    image: "https://appwiseinnovations.dev/Andes/services-view-3.png",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Sección de título con fondo blanco */}
      <section className="w-full bg-white py-12 pt-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#08252A] mb-1 inline-block pb-1">
            Our Services
          </h1>
          <p className="text-[#08252A] mt-1">
            Find more information about the services we offer
          </p>
        </div>
      </section>

      {/* Sección de tarjetas con fondo gris */}
      <section className="w-full bg-[#E2E2E2] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl min-h-[500px] mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 min-h-[400px] flex flex-col"
              >
                {/* Imagen */}
                <div className="h-48 relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-[#08252A] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#08252A] text-sm mb-5">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href="/contact"
                      className="inline-block bg-[#0097B2] text-white py-2 px-4 rounded text-sm hover:bg-opacity-90 transition-colors"
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
    </main>
  );
}
