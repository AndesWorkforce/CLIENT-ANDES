"use client";

import React, { useRef } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { Job } from "../data/mockData";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  useOutsideClick(modalRef, onClose, isOpen);

  if (!isOpen || !job) return null;

  const handleApply = () => {
    if (!user) {
      // Si el usuario no está logeado, redirigir al login
      router.push("/auth/login");
    } else {
      // Aquí iría la lógica para aplicar al trabajo
      console.log("Aplicando al trabajo:", job.title);
      // Posiblemente mostrar algún mensaje de éxito o redirigir a otra página
    }
  };

  return (
    <div className="fixed inset-0 bg-[#08252A33] z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-11/12 max-w-md max-h-[90vh] overflow-y-auto shadow-md relative"
      >
        {/* Botón de cierre (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-4">
          {/* Encabezado */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#08252A]">
              {job.title}
            </h2>
            <p className="text-gray-500">{job.company}</p>
            <div className="flex items-center mt-2 text-xs text-[#0097B2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="mr-4">
                {new Date(job.postDate).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <span className="flex items-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </span>

              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {job.modality}
              </span>
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
              {job.department}
            </span>
            <span className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
              {job.seniority}
            </span>
            <span className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
              {job.salary}
            </span>
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-[#08252A] mb-2">
              Descripción
            </h3>
            <p className="text-sm text-gray-700">{job.description}</p>
          </div>

          {/* Responsabilidades */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-[#08252A] mb-2">
              Responsabilidades
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {job.responsibilities?.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>

          {/* Requisitos */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-[#08252A] mb-2">
              Requisitos
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {job.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Habilidades */}
          <div className="mb-4">
            <h3 className="text-md font-semibold text-[#08252A] mb-2">
              Habilidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Botón de aplicar */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleApply}
            className="w-full bg-[#0097B2] text-white py-2 px-4 rounded-md cursor-pointer"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
