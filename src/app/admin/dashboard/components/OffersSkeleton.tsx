import React from "react";

const OffersSkeleton = () => {
  return (
    <div className="flex w-full h-full animate-pulse">
      {/* Panel izquierdo - Lista de ofertas */}
      <div className="w-1/3 border-r border-gray-200 p-4">
        {/* Repetir 3 veces para simular múltiples ofertas */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-200 rounded-lg"
          >
            {/* Título de oferta */}
            <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>

            {/* Fecha */}
            <div className="flex items-center mt-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Panel derecho - Detalle de oferta */}
      <div className="w-2/3 p-6">
        {/* Encabezado */}
        <div className="h-8 bg-gray-200 rounded-md w-1/2 mb-4"></div>

        {/* Fecha */}
        <div className="flex items-center mb-6">
          <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-5 bg-gray-200 rounded-md w-32"></div>
        </div>

        {/* Título "About the job" */}
        <div className="h-6 bg-gray-200 rounded-md w-40 mb-4"></div>

        {/* Descripción - párrafos */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
        </div>

        {/* Espacio para más contenido */}
        <div className="mt-8 space-y-3">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default OffersSkeleton;
