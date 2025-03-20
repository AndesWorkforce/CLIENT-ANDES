"use client";

import { useState, useEffect, useRef } from "react";
import { PlusCircle, Search, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import ApplicantsModal from "./components/ApplicantsModal";

// Tipo para representar una oferta
interface JobOffer {
  id: number;
  title: string;
  publishDate: string;
  publishDay: string;
  status: "active" | "pending" | "closed" | "draft";
  applicants: number;
}

// Tipo para representar un postulante
interface Applicant {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  hasProfile?: boolean;
  hasVideo?: boolean;
}

export default function AdminDashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  console.log("showLeftShadow", showLeftShadow);
  console.log("showRightShadow", showRightShadow);
  // Función para controlar cuándo mostrar las sombras de desplazamiento
  const checkScrollShadows = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Comprobar sombras al cargar y al cambiar tamaño de ventana
  useEffect(() => {
    checkScrollShadows();
    window.addEventListener("resize", checkScrollShadows);
    return () => window.removeEventListener("resize", checkScrollShadows);
  }, []);

  const [offers] = useState<JobOffer[]>([
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

  // Obtener el indicador de estado para la tarjeta
  // const getStatusIndicator = (status: string) => {
  //   switch (status) {
  //     case "active":
  //       return (
  //         <div className="flex items-center">
  //           <div className="w-2 h-2 bg-yellow-500 rounded-full mx-1"></div>
  //           <div className="w-2 h-2 bg-red-500 rounded-full mx-1"></div>
  //           <div className="w-2 h-2 bg-green-500 rounded-full mx-1"></div>
  //         </div>
  //       );
  //     case "pending":
  //       return (
  //         <div className="flex items-center">
  //           <div className="w-2 h-2 bg-red-500 rounded-full mx-1"></div>
  //         </div>
  //       );
  //     case "closed":
  //       return (
  //         <div className="flex items-center">
  //           <div className="w-2 h-2 bg-gray-500 rounded-full mx-1"></div>
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  // Manejar logout
  // const handleLogout = () => {
  //   localStorage.removeItem("adminLoggedIn");
  //   router.push("/admin/login");
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [applicantsData] = useState<Applicant[]>([
    {
      id: 1,
      name: "Juan Perez",
      email: "juan.perez@gmail.com",
      phone: "11 4545 4545",
      hasProfile: true,
      hasVideo: false,
    },
    {
      id: 2,
      name: "Mariana López",
      email: "marianalopez@gmail.com",
      phone: "11 4545 4545",
      hasProfile: true,
      hasVideo: true,
    },
    {
      id: 3,
      name: "Juan Perez",
      email: "juan.perez2@gmail.com",
      phone: "11 5555 5555",
    },
    {
      id: 4,
      name: "Juan Perez",
      email: "juan.perez3@gmail.com",
      phone: "11 6666 6666",
    },
    {
      id: 5,
      name: "Mariana Gonzalez",
      email: "mariana.gonzalez@gmail.com",
      phone: "11 7777 7777",
      hasProfile: true,
    },
    {
      id: 6,
      name: "Juan Gomez",
      email: "juan.gomez@gmail.com",
      phone: "11 8888 8888",
    },
    {
      id: 7,
      name: "Mariana Gonzalez",
      email: "mariana.gonzalez2@gmail.com",
      phone: "11 9999 9999",
    },
  ]);

  const openModal = (offer: JobOffer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Actions and filters - Mantenerlos para la funcionalidad pero no visibles en el diseño actual */}
        <div className="hidden mb-8 flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/admin/offers/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0097B2] hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2]"
            >
              <PlusCircle size={16} className="mr-2" />
              Nueva oferta
            </Link>

            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-[#0097B2] focus:border-[#0097B2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Filtrar:</span>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "active"
                    | "pending"
                    | "closed"
                    | "draft"
                )
              }
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#0097B2] focus:border-[#0097B2] sm:text-sm rounded-md"
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="pending">Pendientes</option>
              <option value="closed">Cerradas</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
        </div>

        {/* Offers list - Estilo actualizado según imagen */}
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
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/offers/${offer.id}/edit`}
                        className="text-gray-400 hover:text-[#0097B2]"
                      >
                        <ChevronRight size={24} className="text-[#0097B2]" />
                      </Link>
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
                    <div
                      className="flex items-center text-xs text-gray-500 gap-1 cursor-pointer"
                      onClick={() => openModal(offer)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-[#0097B2]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.33301 12.25V11.0833C9.33301 10.4645 9.08717 9.871 8.64959 9.43342C8.21201 8.99583 7.61851 8.75 6.99967 8.75H2.91634C2.2975 8.75 1.70401 8.99583 1.26643 9.43342C0.82884 9.871 0.583008 10.4645 0.583008 11.0833V12.25"
                          stroke="#0097B2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.95833 6.41667C6.247 6.41667 7.29167 5.372 7.29167 4.08333C7.29167 2.79467 6.247 1.75 4.95833 1.75C3.66967 1.75 2.625 2.79467 2.625 4.08333C2.625 5.372 3.66967 6.41667 4.95833 6.41667Z"
                          stroke="#0097B2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.91699 6.41667L11.0837 7.58333L13.417 5.25"
                          stroke="#0097B2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{offer.applicants} postulantes</span>
                      <ChevronRight size={24} className="text-[#6D6D6D]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_612_11307)">
                          <path
                            d="M10.9997 20.1667C16.0623 20.1667 20.1663 16.0626 20.1663 11C20.1663 5.9374 16.0623 1.83334 10.9997 1.83334C5.93706 1.83334 1.83301 5.9374 1.83301 11C1.83301 16.0626 5.93706 20.1667 10.9997 20.1667Z"
                            stroke="#FF0004"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.16699 13.75V8.25"
                            stroke="#FF0004"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.833 13.75V8.25"
                            stroke="#FF0004"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_612_11307">
                            <rect width="22" height="22" fill="white" />
                          </clipPath>
                        </defs>
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
      </main>

      {/* Usar el componente ApplicantsModal */}
      <ApplicantsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        serviceTitle={selectedOffer?.title || ""}
        applicants={applicantsData}
      />
    </div>
  );
}
