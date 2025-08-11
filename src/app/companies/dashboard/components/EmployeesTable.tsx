"use client";

import { useState } from "react";
import { Employee, deleteEmployee } from "../actions/employee.actions";
import { useNotificationStore } from "@/store/notifications.store";
import EditEmployeeModal from "./EditEmployeeModal";

interface Props {
  employees: Employee[];
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EmployeesTable({
  employees,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const { addNotification } = useNotificationStore();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  console.log(showStatusModal);

  const handleDelete = async () => {
    if (!selectedEmployee || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteEmployee(selectedEmployee.id);
      if (response.success) {
        addNotification(response.message, "success");
        onRefresh();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      addNotification("Error deleting employee", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg custom-scrollbar">
      <div className="p-6">
        <div className="mb-4 text-gray-500 text-sm">
          Total: {employees.length} employees | Page {currentPage} of{" "}
          {totalPages}
        </div>
        <table className="min-w-full">
          <thead className="bg-white border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Role
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
            {employees && employees.length > 0 ? (
              employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {employee.usuario.nombre} {employee.usuario.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {employee.usuario.correo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {employee.usuario.telefono || "Not specified"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">{employee.rol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowStatusModal(true);
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                        employee.activo
                          ? "bg-[#EBFFF9] text-[#0097B2] hover:bg-[#D7F5EE]"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {employee.activo ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
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
                          setSelectedEmployee(employee);
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
                  No employees registered
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
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 ${
                  currentPage === index + 1
                    ? "text-white bg-[#0097B2]"
                    : "text-[#0097B2] hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(index + 1)}
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
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onUpdate={() => {
            onRefresh();
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Delete employee
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEmployee(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
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
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete employee"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEmployee(null);
                }}
                className="w-full text-gray-600 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
