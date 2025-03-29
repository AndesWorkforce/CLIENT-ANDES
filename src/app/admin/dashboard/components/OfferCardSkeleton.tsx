"use client";

export default function OfferCardSkeleton() {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-[#B6B4B4] overflow-hidden animate-pulse"
      style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Título */}
            <div className="h-5 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Icono */}
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <hr className="my-2 border-[#E2E2E2]" />
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Fecha */}
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Postulantes */}
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            {/* Botones de acción */}
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
