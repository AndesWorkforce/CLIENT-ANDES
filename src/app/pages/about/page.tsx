import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[550px] bg-[#08252A]">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          {/* Overlay azul-gris en lugar de negro */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#08252A]/70 to-[#08252A]/80 z-10" />
          <div className="relative h-full w-full">
            <Image
              src="https://appwiseinnovations.dev/Andes/about-1.png"
              alt="Andes Workforce"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Contenido del Hero - Posicionado más hacia arriba y a la izquierda */}
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col">
          <div className="pt-24 md:pt-20 md:max-w-2xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
              Andes Workforce
            </h1>
            <p className="text-white text-base mb-3">
              Personnel Services Company
            </p>
            <p className="text-white text-lg max-w-xl mt-6 mb-6">
              Andes Workforce takes its name from the Andes Mountains in South
              America. This is a region that is rapidly growing to become a
              crucial source of virtual employees for businesses worldwide.
            </p>

            {/* Información de contacto */}
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#0097B2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-white">info@andes-workforce.com</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#0097B2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-white">+1 7572373612</span>
              </div>
            </div>
          </div>

          {/* Flecha hacia abajo en el centro inferior */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="animate-bounce">
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 10.417V39.5837"
                  stroke="#0097B2"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M39.5827 25L24.9993 39.5833L10.416 25"
                  stroke="#0097B2"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Creating a Link for Success Section - Nueva versión que sigue el diseño de la imagen */}
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Primera fila: Título y texto con imagen */}
          <div className="flex flex-col md:flex-row mb-4">
            {/* Columna izquierda con título y texto */}
            <div className="w-full md:w-1/2 relative pr-0 md:pr-10 flex items-center">
              {/* Barra vertical azul */}
              <div className="absolute left-0 top-0 w-3 h-full bg-[#0097B2]"></div>

              <div className="pl-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#08252A] mb-8">
                  Creating a Link for Success
                </h2>
                <p className="text-[#08252A] text-lg mb-6">
                  The Andes are the world&apos;s longest continental mountain
                  range. They are a continuous chain of Highland along the
                  western coast of South America that crosses through seven
                  countries in the continent.
                </p>
              </div>
            </div>

            {/* Columna derecha con imagen */}
            <div className="w-full md:w-1/2 h-[320px] relative mt-8 md:mt-0">
              <div className="absolute inset-0 bg-black opacity-30 z-10 rounded"></div>
              <Image
                src="https://appwiseinnovations.dev/Andes/about-2.png"
                alt="Montañas de los Andes"
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
              />
            </div>
          </div>

          {/* Segunda fila */}
          <div className="flex flex-col md:flex-row mb-12 md:mb-16">
            {/* Columna izquierda con imagen */}
            <div className="w-full md:w-1/2 h-[320px] relative mb-6 md:mb-0 md:pr-10">
              <div className="absolute inset-0 bg-black opacity-30 z-10 rounded"></div>
              <Image
                src="https://appwiseinnovations.dev/Andes/about-3.png"
                alt="Personas sonriendo"
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
              />
            </div>

            {/* Columna derecha con texto */}
            <div className="w-full md:w-1/2 flex items-center">
              <p className="text-[#08252A] text-lg px-4 md:px-6">
                This region of the continent has a high education standard where
                young adults are expected to earn a college degree and speak
                English by the age of 30.
              </p>
            </div>
          </div>

          {/* Tercera fila */}
          <div className="flex flex-col md:flex-row">
            {/* Columna izquierda con texto */}
            <div className="w-full md:w-1/2 md:pr-10 mb-6 md:mb-0">
              <p className="text-[#08252A] text-lg mb-6 px-4 md:px-0">
                However, unemployment rates are also high in those countries,
                leaving a significant amount of motivated, qualified personnel
                looking for job opportunities elsewhere.
              </p>
              <p className="text-[#08252A] text-lg px-4 md:px-0">
                Andes Workforce serves as the link between those personnel and
                hiring businesses worldwide.
              </p>
            </div>

            {/* Columna derecha con imagen */}
            <div className="w-full md:w-1/2 h-[320px] relative">
              <div className="absolute inset-0 bg-black opacity-30 z-10 rounded"></div>
              <Image
                src="https://appwiseinnovations.dev/Andes/about-4.png"
                alt="Personas trabajando"
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
