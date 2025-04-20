"use client";

import { useEffect, useState } from "react";
import { getApplicants } from "../offers/actions/offers.actions";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Candidato } from "@/app/types/offers";
import ProfileModal from "../components/ProfileModal";
import { ExpandContentSkeleton } from "../components/expandContent.skeleton";

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
}

export default function PostulantsPage() {
  const APPLICANTS_PER_PAGE = 7;
  const [applicants, setApplicants] = useState<
    (CandidatoWithPostulationId & { isExpanded: boolean })[]
  >([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch applicants from API
  const fetchApplicants = async (page = 1, searchValue = "") => {
    setIsLoading(true);
    try {
      const response = await getApplicants(
        page,
        APPLICANTS_PER_PAGE,
        searchValue
      );
      console.log("\n\n\n Response from getApplicants:", response);
      if (response.success) {
        // Asegúrate de que los datos tengan postulationId y isExpanded
        // disable eslint rule for this line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response.data?.resultados || []).map((a: any) => ({
          ...a,
          postulationId: a.postulationId || a.id, // Ajusta según tu backend
          isExpanded: false,
        }));
        setApplicants(data);
        setTotalPages(response.totalPages || 1);
      } else {
        setApplicants([]);
        setTotalPages(1);
      }
    } catch {
      setApplicants([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when search/page changes
  useEffect(() => {
    fetchApplicants(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPage = (page: number) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const handleOpenProfile = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <div className="container mx-auto mt-8 flex flex-col h-screen">
        {/* Search */}
        <div className="mb-6 ml-4 flex justify-start">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          />
        </div>

        {/* View Mobile */}
        <div
          className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] flex flex-col md:hidden"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          {/* Applicants list with scroll */}
          <div
            className="flex-1 overflow-y-auto rounded-b-lg"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#0097B2 #f3f4f6",
            }}
          >
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.id} className="border-b border-[#E2E2E2]">
                  <div
                    className="px-4 py-3 flex items-center cursor-pointer"
                    onClick={() => handleOpenProfile(applicant.id)}
                  >
                    {/* Chevron indicator */}
                    <div className="mr-2">
                      {applicant.isExpanded ? (
                        <ChevronUp size={20} className="text-[#0097B2]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#0097B2]" />
                      )}
                    </div>

                    {/* Applicant name */}
                    <div className="grid grid-cols-2 w-full">
                      <p className="text-lg font-medium mb-0">Name</p>
                      <p className="text-lg font-medium">{`${applicant.nombre} ${applicant.apellido}`}</p>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isLoading ? (
                    <ExpandContentSkeleton />
                  ) : (
                    applicant.isExpanded && (
                      <div className="px-10 pb-4 space-y-4 bg-gray-50">
                        {applicant.id && (
                          <div className="grid grid-cols-2 w-full">
                            <div className="flex items-center">
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
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              <span className="text-gray-700 text-sm">
                                Profile
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenProfile(applicant.id)}
                              className="text-[#0097B2] font-medium text-sm text-start cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        )}
                        {applicant.correo && (
                          <div className="grid grid-cols-2 w-full">
                            <div className="flex items-center">
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
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                              <span className="text-gray-700 text-sm">
                                Email
                              </span>
                            </div>
                            <span className="text-gray-600 text-sm">
                              {applicant.correo}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No hay aplicantes para esta oferta.
              </div>
            )}
          </div>
        </div>

        {/* View Desktop */}
        <div className="hidden lg:block">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-7xl mx-auto max-h-[90vh] flex flex-col"
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          >
            {/* Cabecera con título y botón de cerrar */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Applicants for the service
                </h3>
              </div>
            </div>
            {/* Tabla de postulantes */}
            <div
              className="flex-1 overflow-y-auto p-6"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#0097B2 #f3f4f6",
              }}
            >
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              ) : applicants.length > 0 ? (
                <>
                  <div className="mb-4 text-gray-500 text-sm">
                    Total: {applicants.length} applicants | Showing page{" "}
                    {currentPage} of {totalPages}
                  </div>
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Profile
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant) => (
                        <tr
                          key={applicant.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-gray-700">
                            {`${applicant.nombre} ${applicant.apellido}`}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleOpenProfile(applicant.id)}
                              className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                            >
                              View profile
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-1"
                              >
                                <path
                                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="7"
                                  r="4"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </td>
                          <td className="py-4 px-4">{applicant.correo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No hay aplicantes para esta oferta.
                </div>
              )}
            </div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 p-4 flex justify-center">
                <div className="inline-flex border border-gray-300 rounded-md">
                  <button
                    className={`px-3 py-1 text-[#0097B2] border-r border-gray-300 ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="#0097B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 ${
                        currentPage === index + 1
                          ? "text-white bg-[#0097B2]"
                          : "text-[#0097B2] hover:bg-gray-50"
                      }`}
                      onClick={() => goToPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className={`px-3 py-1 text-[#0097B2] border-l border-gray-300 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="#0097B2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidateId={selectedCandidateId}
      />
    </>
  );
}
