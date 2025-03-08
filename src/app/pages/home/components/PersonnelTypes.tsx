import Image from "next/image";

const personnelTypes = [
  {
    title: "Administrative Assistants",
    color: "#FFC857", // Color amarillo para el ícono de carpeta
    src: "https://appwiseinnovations.dev/Andes/types-1.png",
  },
  {
    title: "Customer Service Representatives",
    color: "#8A7FEF", // Color morado para el ícono de micrófono
    src: "https://appwiseinnovations.dev/Andes/types-2.png",
  },
  {
    title: "Call Center Agents",
    color: "#333333", // Color negro para el ícono de auriculares
    src: "https://appwiseinnovations.dev/Andes/types-3.png",
  },
];

export default function PersonnelTypes() {
  return (
    <section className="py-16 bg-[#FCFEFF]">
      {/* Contenido */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#17323A] mb-8">
          Our Personnel
        </h2>

        {/* Contenedor de tarjetas con fondo de gradiente */}
        <div className="relative">
          {/* Fondo con gradiente radial para ambas versiones */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0"></div>
          </div>

          {/* Versión Móvil - Scroll Horizontal */}
          <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide relative z-10">
            <div className="flex space-x-4 min-w-max px-2 pb-2">
              {personnelTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-[#FCFEFF] rounded-lg border border-[#B6B4B4] p-6 w-[175px]"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <div className="w-12 h-12 mb-4 flex items-center justify-center">
                    <div className="rounded-md p-2">
                      <Image
                        src={type.src}
                        alt={type.title}
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {type.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Versión Desktop - Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
            {personnelTypes.map((type, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-[#FCFEFF] rounded-lg border border-[#B6B4B4] p-8"
                style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <div className="rounded-md p-3">
                    <Image
                      src={type.src}
                      alt={type.title}
                      width={48}
                      height={48}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  {type.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
