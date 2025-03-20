"use client";

import { PlusCircle, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SaveOffersPage() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Especialidad de Diseño UX/UI",
      publishDate: "12 Feb, 2025",
      publishDay: "Feb 12",
      status: "active",
      applicants: 20,
    },
    {
      id: 2,
      title: "Diseño gráfico",
      publishDate: "10 Feb, 2025",
      publishDay: "Feb 12",
      status: "pending",
      applicants: 15,
    },
    {
      id: 3,
      title: "Social Media Manager",
      publishDate: "05 Feb, 2025",
      publishDay: "Feb 12",
      status: "pending",
      applicants: 30,
    },
    {
      id: 4,
      title: "Desarrollador Frontend",
      publishDate: "01 Feb, 2025",
      publishDay: "Feb 12",
      status: "pending",
      applicants: 10,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending" | "closed" | "draft"
  >("all");

  // Protección de ruta comentada para desarrollo
  // useEffect(() => {
  //   const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  //   if (!isLoggedIn) {
  //     router.push("/admin/login");
  //   }
  // }, [router]);

  // Filtrar ofertas según búsqueda y filtro de estado
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-4">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-sm border border-[#B6B4B4] overflow-hidden"
              style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium text-gray-900">
                      {offer.title}
                    </h3>
                  </div>
                </div>
                <hr className="my-2 border-[#E2E2E2]" />
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-[#0097B2]" />
                      <span>{offer.publishDay}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.75 5.5H4.58333H19.25"
                        stroke="#0097B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.33301 5.50001V3.66668C7.33301 3.18045 7.52616 2.71413 7.86998 2.37031C8.2138 2.0265 8.68011 1.83334 9.16634 1.83334H12.833C13.3192 1.83334 13.7856 2.0265 14.1294 2.37031C14.4732 2.71413 14.6663 3.18045 14.6663 3.66668V5.50001M17.4163 5.50001V18.3333C17.4163 18.8196 17.2232 19.2859 16.8794 19.6297C16.5356 19.9735 16.0692 20.1667 15.583 20.1667H6.41634C5.93011 20.1667 5.4638 19.9735 5.11998 19.6297C4.77616 19.2859 4.58301 18.8196 4.58301 18.3333V5.50001H17.4163Z"
                        stroke="#0097B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.16602 10.0833V15.5833"
                        stroke="#0097B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.834 10.0833V15.5833"
                        stroke="#0097B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_599_11221)">
                        <path
                          d="M10.083 3.66666H3.66634C3.18011 3.66666 2.7138 3.85981 2.36998 4.20363C2.02616 4.54744 1.83301 5.01376 1.83301 5.49999V18.3333C1.83301 18.8196 2.02616 19.2859 2.36998 19.6297C2.7138 19.9735 3.18011 20.1667 3.66634 20.1667H16.4997C16.9859 20.1667 17.4522 19.9735 17.796 19.6297C18.1399 19.2859 18.333 18.8196 18.333 18.3333V11.9167"
                          stroke="#0097B2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.958 2.29168C17.3227 1.92701 17.8173 1.72214 18.333 1.72214C18.8487 1.72214 19.3433 1.92701 19.708 2.29168C20.0727 2.65635 20.2776 3.15096 20.2776 3.66668C20.2776 4.18241 20.0727 4.67701 19.708 5.04168L10.9997 13.75L7.33301 14.6667L8.24967 11L16.958 2.29168Z"
                          stroke="#0097B2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_599_11221">
                          <rect width="22" height="22" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              No se encontraron ofertas
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Intente con otra búsqueda"
                : "Comience creando una nueva oferta"}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/admin/offers/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Crear nueva oferta
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
