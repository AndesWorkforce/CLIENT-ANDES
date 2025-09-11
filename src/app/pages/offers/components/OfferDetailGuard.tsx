"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccessControl } from "./OffersAccessGuard";

interface OfferDetailGuardProps {
  children: React.ReactNode;
}

const OfferDetailGuard: React.FC<OfferDetailGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAccessControl();
  const router = useRouter();

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-md w-full animate-pulse"></div>
      </div>
    );
  }

  // Si no está autenticado, mostrar blur con overlay de autenticación
  if (!isAuthenticated) {
    return (
      <div className="relative w-full h-full min-h-[800px]">
        {/* Contenido borroso de fondo */}
        <div className="absolute inset-0 filter blur-lg pointer-events-none select-none opacity-20">
          {children}
        </div>

        {/* Overlay principal que cubre toda la pantalla */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-white/90 to-cyan-50/95 backdrop-blur-md flex items-center justify-center z-50">
          <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 max-w-md w-full mx-4 text-center">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0097B2]/5 to-cyan-500/5 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Simple Icon */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-[#0097B2] to-cyan-500 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Simple Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Authentication Required
              </h3>

              {/* Subtitle */}
              <p className="text-gray-600 mb-6 text-base">
                Register to view complete job details and apply instantly.
              </p>

              {/* Simple Benefits */}
              <div className="mb-8 space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Access to exclusive job opportunities</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>One-click application process</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Connect with leading companies</span>
                </div>
              </div>

              {/* Simple Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="w-full bg-gradient-to-r from-[#0097B2] to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-[#007A8F] hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Already have an account? Sign In
                </button>
              </div>

              {/* Simple Bottom message */}
              <div className="mt-6 text-xs text-gray-400 text-center">
                <span>Free registration • No spam • Secure & private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado, mostrar contenido normal
  return <>{children}</>;
};

export default OfferDetailGuard;
