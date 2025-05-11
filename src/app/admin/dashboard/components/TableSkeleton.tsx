import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 7,
  columns = 7,
}: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex w-full border-b border-gray-200 py-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={`header-${colIndex}`}
            className={`px-4 ${
              colIndex === 0
                ? "w-1/5"
                : colIndex === columns - 1
                ? "w-1/6"
                : "w-1/6"
            }`}
          >
            <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Rows skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex w-full border-b border-gray-200 py-4 hover:bg-gray-50"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={`px-4 ${
                colIndex === 0
                  ? "w-1/5"
                  : colIndex === columns - 1
                  ? "w-1/6"
                  : "w-1/6"
              }`}
            >
              {colIndex === 0 ? (
                // Nombre del postulante
                <div className="h-5 bg-gray-200 rounded-md w-4/5"></div>
              ) : colIndex === 1 ? (
                // Email
                <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
              ) : colIndex === 2 ? (
                // Última aplicación con subtexto para la fecha
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                </div>
              ) : colIndex === 3 || colIndex === 4 ? (
                // Estado con badge
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              ) : colIndex === 5 ? (
                // Enlace a logs
                <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
              ) : (
                // Acciones
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
