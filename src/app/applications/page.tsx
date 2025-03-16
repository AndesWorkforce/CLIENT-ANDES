"use client";

import { useState } from "react";
import { ChevronLeft, FileText, Clock } from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

// Tipo para representar una postulación
interface Application {
  id: number;
  title: string;
  company: string;
  publicationDate: string;
  applicationDate: string;
  stage: string;
  status: "pending" | "in_process" | "rejected";
}

export default function ApplicationsPage() {
  // Lista de postulaciones de ejemplo
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      title: "Asistente administrativo",
      company: "Mercado Libre",
      publicationDate: "14/02/2025",
      applicationDate: "16/02/2025",
      stage: "-",
      status: "pending",
    },
    {
      id: 2,
      title: "Asistente administrativo",
      company: "Mercado Libre",
      publicationDate: "14/02/2025",
      applicationDate: "16/02/2025",
      stage: "stage 1 of 3",
      status: "in_process",
    },
    {
      id: 3,
      title: "Asistente administrativo",
      company: "Mercado Libre",
      publicationDate: "14/02/2025",
      applicationDate: "16/02/2025",
      stage: "stage 2 of 3",
      status: "in_process",
    },
    {
      id: 4,
      title: "Asistente administrativo",
      company: "Mercado Libre",
      publicationDate: "14/02/2025",
      applicationDate: "16/02/2025",
      stage: "rejected",
      status: "rejected",
    },
  ]);

  return (
    <div className="container mx-auto min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-medium">Mis Postulaciones</h1>
          </div>
          <div>
            <Logo />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="divide-y divide-gray-200">
          {applications.map((app) => (
            <div key={app.id} className="py-4">
              <div className="mb-1">
                <h2 className="text-lg font-medium text-[#0097B2]">
                  {app.title}
                </h2>
                <p className="text-gray-600 text-sm">{app.company}</p>
              </div>

              <div className="space-y-1.5 mt-3">
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                    <FileText size={12} className="text-white" />
                  </div>
                  <span>Fecha de publicación: {app.publicationDate}</span>
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                    <FileText size={12} className="text-white" />
                  </div>
                  <span>Fecha de postulación: {app.applicationDate}</span>
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                    <Clock size={12} className="text-white" />
                  </div>
                  <span>
                    Etapa del proceso:{" "}
                    {app.status === "pending" ? (
                      <span className="text-yellow-500 font-medium">•</span>
                    ) : app.status === "in_process" ? (
                      <span className="text-blue-500 font-medium">
                        {app.stage}
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        {app.stage}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
