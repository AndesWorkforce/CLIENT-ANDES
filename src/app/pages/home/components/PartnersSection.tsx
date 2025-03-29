"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function PartnersSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Efecto para manejar la carga del video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("error", () => {
        setVideoError(true);
      });
    }
  }, []);

  const partners = [
    {
      name: "Ardon Health Group",
      logo: "https://appwiseinnovations.dev/Andes/partner-1.png",
      width: 80,
      height: 40,
    },
    {
      name: "Tarak Law",
      logo: "https://appwiseinnovations.dev/Andes/partner-2.png",
      width: 80,
      height: 40,
    },
    {
      name: "Vetlaw",
      logo: "https://appwiseinnovations.dev/Andes/partner-3.png",
      width: 80,
      height: 40,
    },
    {
      name: "Davidson Isacsson",
      logo: "https://appwiseinnovations.dev/Andes/partner-4.png",
      width: 110,
      height: 40,
    },
    {
      name: "Port",
      logo: "https://appwiseinnovations.dev/Andes/partner-5.png",
      width: 110,
      height: 40,
    },
  ];

  return (
    <section className="py-8 bg-[#FCFEFF]">
      <div className="container mx-auto px-5">
        {/* Título */}
        <h2 className="text-xl font-bold text-center text-[#17323A] mb-6">
          Trusted By
        </h2>

        {/* Versión móvil: 3 arriba, 2 abajo */}
        <div className="md:hidden">
          {/* Primera fila: 3 primeros logos */}
          <div className="flex justify-center gap-2 mb-6">
            {partners.slice(0, 3).map((partner, index) => (
              <div key={index} className="flex justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Segunda fila: 2 últimos logos */}
          <div className="flex justify-center gap-4">
            {partners.slice(3, 5).map((partner, index) => (
              <div key={index} className="flex justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Versión desktop: todos los logos en una fila */}
        <div className="hidden md:flex justify-center items-center gap-10 flex-wrap">
          {partners.map((partner, index) => (
            <div key={index} className="relative">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.width * 1.5}
                height={partner.height * 1.5}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Video de presentación */}
        <div className="mt-12 max-w-4xl mx-auto">
          {!videoError ? (
            <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://appwiseinnovations.dev/Andes/video-poster.jpg"
                playsInline
                autoPlay
                muted
              >
                <source
                  src="https://appwiseinnovations.dev/Andes/andes-video.mp4"
                  type="video/mp4"
                />
                Tu navegador no soporta videos HTML5.
              </video>
            </div>
          ) : (
            <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden shadow-md flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-lg font-medium text-gray-800 mb-2">
                  El video no está disponible en este momento
                </p>
                <a
                  href="https://appwiseinnovations.dev/Andes/andes-video.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0097B2] underline hover:text-[#00404C]"
                >
                  Ver video directamente
                </a>
              </div>
            </div>
          )}
          {/* <p className="text-sm text-center text-gray-500 mt-2">
            © 2023 Andes Workforce - Todos los derechos reservados
          </p> */}
        </div>
      </div>
    </section>
  );
}
