"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FCFEFF] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-[#0097B2] mb-2">404</h1>
          <div className="w-24 h-1 bg-[#0097B2] mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-[#08252A] mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-4">
            Serás redirigido al inicio en{" "}
            <span className="font-semibold text-[#0097B2]">{countdown}</span>{" "}
            segundos
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#0097B2] h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0097B2] text-white font-medium rounded-lg hover:bg-[#007a94] transition-colors duration-200"
          >
            <Home size={20} className="mr-2" />
            Ir al inicio
          </button>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0097B2] text-[#0097B2] font-medium rounded-lg hover:bg-[#0097B2] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver atrás
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            ¿Necesitas ayuda? Puedes ir a:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/pages/home" className="text-[#0097B2] hover:underline">
              Inicio
            </Link>
            <Link
              href="/pages/offers"
              className="text-[#0097B2] hover:underline"
            >
              Ofertas
            </Link>
            <Link
              href="/pages/contact"
              className="text-[#0097B2] hover:underline"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
