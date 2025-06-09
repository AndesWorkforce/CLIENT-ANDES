"use client";

import { useState } from "react";
import type { Company } from "../schemas/company.schema";
import { toggleCompanyStatus, deleteCompany } from "../actions/company.actions";
import CreateCompanyForm from "./CreateCompanyForm";
import ConfirmStatusModal from "./ConfirmStatusModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useNotificationStore } from "@/store/notifications.store";
// import { formatDate } from "@/utils/dates";

interface Props {
  companies: Company[];
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CompaniesTable({
  companies,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const { addNotification } = useNotificationStore();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleStatusChange = async () => {
    if (!selectedCompany || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const response = await toggleCompanyStatus(
        selectedCompany.id,
        !selectedCompany.activo
      );
      if (response.success) {
        addNotification(response.message, "success");
        onRefresh();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      addNotification("Error al cambiar el estado de la empresa", "error");
    } finally {
      setIsUpdatingStatus(false);
      setShowStatusModal(false);
      setSelectedCompany(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteCompany(selectedCompany.id);
      if (response.success) {
        addNotification(response.message, "success");
        onRefresh();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
      addNotification("Error al eliminar la empresa", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedCompany(null);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const goToPage = (page: number) => {
    if (page !== currentPage) onPageChange(page);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg custom-scrollbar">
        <div className="p-6">
          <div className="mb-4 text-gray-500 text-sm">
            Total: {companies.length} companies | Page {currentPage} of{" "}
            {totalPages}
          </div>
          <table className="min-w-full">
            <thead className="bg-white border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                  Representative
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#17323A]">
                        {company.nombre}
                        {company.descripcion && (
                          <p className="text-xs text-gray-500 mt-1">
                            {company.descripcion}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#17323A]">
                        {company.usuarioResponsable.nombre}{" "}
                        {company.usuarioResponsable.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#17323A]">
                        {company.usuarioResponsable.correo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#17323A]">
                        {company._count?.empleados || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowStatusModal(true);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                          company.activo
                            ? "bg-[#EBFFF9] text-[#0097B2] hover:bg-[#D7F5EE]"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {company.activo ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowEditModal(true);
                          }}
                          className="text-[#0097B2] hover:text-[#007B8E] cursor-pointer"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.084 3.66666H3.66732C3.18109 3.66666 2.71477 3.85981 2.37096 4.20363C2.02714 4.54744 1.83398 5.01376 1.83398 5.49999V18.3333C1.83398 18.8196 2.02714 19.2859 2.37096 19.6297C2.71477 19.9735 3.18109 20.1667 3.66732 20.1667H16.5007C16.9869 20.1667 17.4532 19.9735 17.797 19.6297C18.1408 19.2859 18.334 18.8196 18.334 18.3333V11.9167"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.959 2.29168C17.3237 1.92701 17.8183 1.72214 18.334 1.72214C18.8497 1.72214 19.3443 1.92701 19.709 2.29168C20.0737 2.65635 20.2785 3.15096 20.2785 3.66668C20.2785 4.18241 20.0737 4.67701 19.709 5.04168L11.0007 13.75L7.33398 14.6667L8.25065 11L16.959 2.29168Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowDeleteModal(true);
                          }}
                          className="text-[#0097B2] hover:text-[#007B8E] cursor-pointer"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.75 5.5H4.58333H19.25"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.33398 5.50001V3.66668C7.33398 3.18045 7.52714 2.71413 7.87096 2.37031C8.21477 2.0265 8.68109 1.83334 9.16732 1.83334H12.834C13.3202 1.83334 13.7865 2.0265 14.1303 2.37031C14.4742 2.71413 14.6673 3.18045 14.6673 3.66668V5.50001M17.4173 5.50001V18.3333C17.4173 18.8196 17.2242 19.2859 16.8803 19.6297C16.5365 19.9735 16.0702 20.1667 15.584 20.1667H6.41732C5.93109 20.1667 5.46477 19.9735 5.12096 19.6297C4.77714 19.2859 4.58398 18.8196 4.58398 18.3333V5.50001H17.4173Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-[#17323A]"
                  >
                    No companies registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <CreateCompanyForm
            initialData={{
              name: selectedCompany.nombre,
              description: selectedCompany.descripcion || "",
              email: selectedCompany.usuarioResponsable.correo,
              representativeName:
                selectedCompany.usuarioResponsable.nombre || "",
              representativeLastName:
                selectedCompany.usuarioResponsable.apellido || "",
            }}
            companyId={selectedCompany.id}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCompany(null);
              onRefresh();
            }}
          />
        </div>
      )}

      {showStatusModal && selectedCompany && (
        <ConfirmStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedCompany(null);
          }}
          onConfirm={handleStatusChange}
          userName={selectedCompany.nombre}
          currentStatus={selectedCompany.activo}
        />
      )}

      {showDeleteModal && selectedCompany && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCompany(null);
          }}
          onConfirm={handleDelete}
          userName={selectedCompany.nombre}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
