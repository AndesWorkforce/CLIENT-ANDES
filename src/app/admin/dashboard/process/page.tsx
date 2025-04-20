"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPublishedOffers } from "../actions/offers.actions";
import { Offer } from "@/app/types/offers";

export default function ProcessPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [offers, setOffers] = useState<(Offer & { isExpanded: boolean })[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 7;

  const fetchPublishedOffers = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const response = await getPublishedOffers(page, itemsPerPage);
      const offersWithExpanded = response.data.data.map((offer: Offer) => ({
        ...offer,
        isExpanded: false,
      }));

      setOffers(offersWithExpanded);

      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || page);
    } catch (error) {
      console.error("[Dashboard] Error getting published offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOffer = (id: string) => {
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, isExpanded: !offer.isExpanded } : offer
      )
    );
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchPublishedOffers(newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchPublishedOffers(newPage);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchPublishedOffers(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    fetchPublishedOffers(1);
  }, []);

  const renderPagination = () => (
    <div className="container mx-auto flex justify-center mt-6 pb-6">
      <div className="flex items-center border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 cursor-pointer ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#0097B2] hover:bg-gray-50"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && goToPage(page)}
            className={`px-3 py-1 min-w-[36px] cursor-pointer ${
              page === currentPage
                ? "bg-[#0097B2] text-white font-medium"
                : typeof page === "number"
                ? "text-gray-700 hover:bg-gray-50"
                : "text-gray-400 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 cursor-pointer ${
            currentPage === totalPages || totalPages === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#0097B2] hover:bg-gray-50"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="hidden md:block">
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-pulse">
        <div className="min-w-full">
          <div className="bg-gray-100 px-6 py-3">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="bg-white divide-y divide-gray-200">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="grid grid-cols-6 gap-4">
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-5 bg-gray-200 rounded flex justify-center">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded flex justify-center">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded flex justify-center">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded flex justify-center">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded flex justify-center">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-6 pb-6">
        <div className="flex items-center border border-gray-200 rounded-md shadow-sm overflow-hidden">
          <div className="px-2 py-1 text-gray-400">
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`px-3 py-1 min-w-[36px] flex justify-center ${
                index === 0 ? "bg-gray-300" : ""
              }`}
            >
              <div className="w-4 h-5 bg-gray-200 rounded" />
            </div>
          ))}
          <div className="px-2 py-1 text-gray-400">
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const DropdownSkeleton = () => (
    <div className="block md:hidden">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm animate-pulse">
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`${
                index === 0 ? "border-t-[2px] " : ""
              }border-b-[2px] border-[#E2E2E2]`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-300 rounded" />
                  <div className="w-16 h-4 bg-gray-300 rounded" />
                </div>
                <div className="w-32 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center mt-6 pb-6">
        <div className="flex items-center border border-gray-200 rounded-md shadow-sm overflow-hidden">
          <div className="px-2 py-1 text-gray-400">
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`px-3 py-1 min-w-[36px] flex justify-center ${
                index === 0 ? "bg-gray-300" : ""
              }`}
            >
              <div className="w-4 h-5 bg-gray-200 rounded" />
            </div>
          ))}
          <div className="px-2 py-1 text-gray-400">
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto min-h-screen bg-white flex flex-col">
      <main className="flex-1 w-full py-6 px-4 md:px-6">
        {isLoading ? (
          <>
            <TableSkeleton />
            <DropdownSkeleton />
          </>
        ) : (
          <>
            <div className="hidden md:block">
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Offers
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applicants
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interview
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Test
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rejected
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hired
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {offers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {offer.titulo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {offer.postulaciones?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "EN_EVALUACION"
                            )?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "FINALISTA"
                            )?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "RECHAZADA"
                            )?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {offer.postulaciones?.filter(
                              (postulacion) =>
                                String(postulacion.estadoPostulacion) ===
                                "ACEPTADA"
                            )?.length || 0}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && renderPagination()}
            </div>

            <div className="block md:hidden">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div className="divide-y divide-gray-200">
                  {offers.map((offer, index) => (
                    <div
                      key={offer.id}
                      className={`${
                        index === 0 ? "border-t-[2px] " : ""
                      }border-b-[2px] border-[#E2E2E2] `}
                    >
                      <div
                        className={`p-4 flex items-center justify-between cursor-pointer ${
                          offer.isExpanded ? "bg-gray-50" : ""
                        }`}
                        onClick={() => toggleOffer(offer.id || "")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {offer.isExpanded ? (
                            <ChevronUp size={20} className="text-[#0097B2]" />
                          ) : (
                            <ChevronDown size={20} className="text-[#0097B2]" />
                          )}
                          <span className="text-start font-medium text-sm">
                            Offers
                          </span>
                        </div>
                        <div className="text-[#6D6D6D] text-start text-sm">
                          {offer.titulo}
                        </div>
                      </div>

                      {offer.isExpanded && (
                        <div className="bg-white pl-10 pb-2">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2">
                              <div className="flex items-center text-[#6D6D6D]">
                                <Users
                                  size={16}
                                  className="text-[#0097B2] mr-2"
                                />
                                <span>Applicants</span>
                              </div>
                              <div className="text-[#6D6D6D] font-medium">
                                {offer.postulaciones?.length || 0}
                              </div>
                            </div>

                            <div className="grid grid-cols-2">
                              <div className="flex items-center text-[#6D6D6D]">
                                <Clock
                                  size={16}
                                  className="text-[#0097B2] mr-2"
                                />
                                <span>Interview</span>
                              </div>
                              <div className="text-[#6D6D6D] font-medium">
                                {offer.postulaciones?.filter(
                                  (postulacion) =>
                                    String(postulacion.estadoPostulacion) ===
                                    "EN_EVALUACION"
                                )?.length || 0}
                              </div>
                            </div>

                            <div className="grid grid-cols-2">
                              <div className="flex items-center text-[#6D6D6D]">
                                <CheckCircle
                                  size={16}
                                  className="text-[#0097B2] mr-2"
                                />
                                <span>Test</span>
                              </div>
                              <div className="text-[#6D6D6D] font-medium">
                                {offer.postulaciones?.filter(
                                  (postulacion) =>
                                    String(postulacion.estadoPostulacion) ===
                                    "FINALISTA"
                                )?.length || 0}
                              </div>
                            </div>

                            <div className="grid grid-cols-2">
                              <div className="flex items-center text-[#6D6D6D]">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="15" y1="9" x2="9" y2="15"></line>
                                  <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <span>Rejected</span>
                              </div>
                              <div className="text-[#6D6D6D] font-medium">
                                {offer.postulaciones?.filter(
                                  (postulacion) =>
                                    String(postulacion.estadoPostulacion) ===
                                    "RECHAZADA"
                                )?.length || 0}
                              </div>
                            </div>

                            <div className="grid grid-cols-2">
                              <div className="flex items-center text-[#6D6D6D]">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2"
                                >
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="8.5" cy="7" r="4"></circle>
                                  <polyline points="17 11 19 13 23 9"></polyline>
                                </svg>
                                <span>Hired</span>
                              </div>
                              <div className="text-[#6D6D6D] font-medium">
                                {offer.postulaciones?.filter(
                                  (postulacion) =>
                                    String(postulacion.estadoPostulacion) ===
                                    "ACEPTADA"
                                )?.length || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {totalPages > 1 && renderPagination()}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
