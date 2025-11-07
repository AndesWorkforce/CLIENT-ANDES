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
    // {
    //   name: "Ardon Health Group",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/bernheim-kelley-battista-injury-lawyers-logo-home.png",
    //   width: 80,
    //   height: 40,
    // },
    {
      name: "Port Law",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Port-Law.jpg",
      width: 80,
      height: 40,
    },
    {
      name: "Tabak",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Tabak.jpg",
      width: 80,
      height: 40,
    },
    // {
    //   name: "Vels",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/VELS-Main-Logo.png",
    //   width: 110,
    //   height: 40,
    // },
    // {
    //   name: "VetLaw",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/VetLaw.jpg",
    //   width: 110,
    //   height: 40,
    // },
    {
      name: "WHG",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/WHG.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Schomburg Insurance",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Schomburg_Insurance.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Veteran Esquire",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Veteran_Esquire.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Jelks Veteran Services",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Jelks.jpg",
      width: 110,
      height: 40,
    },
    // {
    //   name: "CaseScribe",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/casescribe.png",
    //   width: 110,
    //   height: 40,
    // },
  ];

  return (
    <section className="py-8 bg-[#FCFEFF]">
      <div className="container mx-auto px-5">
        {/* Título */}
        <h2 className="text-xl font-bold text-center text-[#17323A] mb-6">
          Trusted By
        </h2>

        {/* Carrusel infinito auto-scroll */}
        <div className="relative overflow-hidden">
          {/* Contenedor con animación */}
          <div className="flex animate-scroll-infinite">
            {/* Primera copia de los logos */}
            {partners.map((partner, index) => (
              <div
                key={`original-${index}`}
                className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width * 1.2}
                  height={partner.height * 1.2}
                  className="object-contain"
                />
              </div>
            ))}
            {/* Segunda copia para efecto infinito */}
            {partners.map((partner, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width * 1.2}
                  height={partner.height * 1.2}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
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
