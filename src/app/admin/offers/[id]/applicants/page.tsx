"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Search, Eye, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

// Tipo para representar un postulante
interface Applicant {
  id: number;
  name: string;
  hasVideo: boolean;
  hasProfile: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
}

// Tipo para representar una oferta
interface Offer {
  id: number;
  title: string;
  service: string;
}

// Datos de ejemplo
const mockOffers = {
  1: {
    id: 1,
    title: "Especialidad de Diseño UX/UI",
    service: "Diseño gráfico",
  },
  2: {
    id: 2,
    title: "Diseño gráfico",
    service: "Diseño gráfico",
  },
};

// Datos de ejemplo de postulantes
const mockApplicants = {
  1: [
    {
      id: 1,
      name: "Juan Perez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 2,
      name: "Mariana Lopez",
      hasVideo: true,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 3,
      name: "Juan Perez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: false,
      hasPhone: true,
    },
    {
      id: 4,
      name: "Juan Perez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 5,
      name: "Juan Perez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 6,
      name: "Juan Perez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 7,
      name: "Mariana Gonzalez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
  ],
  2: [
    {
      id: 8,
      name: "Juan Gomez",
      hasVideo: true,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 9,
      name: "Juan Rodriguez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 10,
      name: "Mariana Gonzalez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 11,
      name: "Mariana Gonzalez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
    {
      id: 12,
      name: "Mariana Gonzalez",
      hasVideo: false,
      hasProfile: true,
      hasEmail: true,
      hasPhone: true,
    },
  ],
};

export default function ApplicantsPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [offer, setOffer] = useState<Offer | null>(null);

  // Cargar datos del backend (simulado)
  useEffect(() => {
    // Protección de ruta comentada para desarrollo
    // const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    // if (!isLoggedIn) {
    //   router.push("/admin/login");
    //   return;
    // }

    // Cargar oferta y postulantes
    const offerData = mockOffers[Number(offerId) as keyof typeof mockOffers];
    const applicantsData =
      mockApplicants[Number(offerId) as keyof typeof mockApplicants] || [];

    if (!offerData) {
      router.push("/admin/dashboard");
      return;
    }

    setOffer(offerData);
    setApplicants(applicantsData);
  }, [offerId, router]);

  // Ordenar y filtrar postulantes
  const filteredApplicants = applicants
    .filter((applicant) =>
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField as keyof Applicant];
      const bValue = b[sortField as keyof Applicant];

      if (typeof aValue === "string") {
        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue as string);
        } else {
          return (bValue as string).localeCompare(aValue);
        }
      }

      if (sortDirection === "asc") {
        return (aValue as number) - (bValue as number);
      } else {
        return (bValue as number) - (aValue as number);
      }
    });

  // Manejar clic en cabecera para ordenar
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (!offer) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Link href="/admin/dashboard" className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-medium">
              Postulantes para servicio de:{" "}
            </h1>
          </div>
          <div className="mt-2 flex items-center">
            <div className="bg-[#0097B2]/10 px-4 py-2 rounded-md">
              <h2 className="text-[#0097B2] font-medium">{offer.service}</h2>
            </div>
            <button
              onClick={() => router.push(`/admin/offers/${offerId}`)}
              className="ml-2 text-[#0097B2] hover:underline text-sm"
            >
              Ver detalles de la oferta
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-6">
        {/* Filtros y búsqueda */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative rounded-md shadow-sm w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar postulantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-[#0097B2] focus:border-[#0097B2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="text-sm text-gray-600">
            {filteredApplicants.length}{" "}
            {filteredApplicants.length === 1 ? "postulante" : "postulantes"}
          </div>
        </div>

        {/* Tabla de postulantes */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Nombre
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Perfil
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Video
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Teléfono
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {applicant.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {applicant.hasProfile ? (
                      <span className="text-[#0097B2] underline cursor-pointer">
                        Ver
                      </span>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {applicant.hasVideo ? (
                      <span className="text-[#0097B2] underline cursor-pointer">
                        Ver
                      </span>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {applicant.hasEmail ? (
                      <span className="text-gray-600">
                        marianalopez@gmail.com
                      </span>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {applicant.hasPhone ? (
                      <span className="text-gray-600">11 4545 4545</span>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/applicants/${applicant.id}`}
                      className="text-[#0097B2] hover:text-[#007A8F]"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado vacío */}
        {filteredApplicants.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No se encontraron postulantes
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Intente con otra búsqueda"
                : "Aún no hay postulantes para esta oferta"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
