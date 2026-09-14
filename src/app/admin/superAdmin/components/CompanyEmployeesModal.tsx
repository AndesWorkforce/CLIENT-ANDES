"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search, Pencil, Trash2 } from "lucide-react";
import type { Company } from "../schemas/company.schema";
import {
  CompanyEmployee,
  deleteCompanyEmployee,
  getCompanyEmployees,
} from "../actions/company-employee.actions";
import { useNotificationStore } from "@/store/notifications.store";
import EditCompanyEmployeeModal from "./EditCompanyEmployeeModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const ROLE_LABELS: Record<string, string> = {
  EMPLEADO_EMPRESA: "Employee",
  EMPRESA: "Client Representative",
};

interface Props {
  company: Company;
  onClose: () => void;
  onEmployeesChanged?: () => void;
  refreshKey?: number;
}

export default function CompanyEmployeesModal({
  company,
  onClose,
  onEmployeesChanged,
  refreshKey = 0,
}: Props) {
  const { addNotification } = useNotificationStore();
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<CompanyEmployee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getCompanyEmployees(company.id);
      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        addNotification(
          response.message || "Error loading employees",
          "error"
        );
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      addNotification("Error loading employees", "error");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [company.id, refreshKey]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((employee) => {
      const fullName =
        `${employee.usuario.nombre} ${employee.usuario.apellido}`.toLowerCase();
      const email = employee.usuario.correo.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [employees, search]);

  const handleDelete = async () => {
    if (!selectedEmployee || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteCompanyEmployee(selectedEmployee.id);
      if (response.success) {
        addNotification(response.message, "success");
        await fetchEmployees();
        onEmployeesChanged?.();
      } else {
        addNotification(response.message || "Error deleting employee", "error");
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

  const getRoleLabel = (rol: string) => ROLE_LABELS[rol] || rol;

  const getInitials = (nombre: string, apellido: string) =>
    `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
        <div className="flex max-h-[90vh] w-full min-w-0 max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="shrink-0 border-b border-[#EFEFEF] bg-gradient-to-r from-[#F8FCFD] to-white px-6 py-5 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0097B2]">
                  Client team
                </p>
                <h2 className="truncate text-xl font-semibold text-[#17323A] sm:text-2xl">
                  Employees — {company.nombre}
                </h2>
                <span className="inline-flex items-center rounded-full bg-[#EBFFF9] px-3 py-1 text-xs font-medium text-[#0097B2]">
                  {employees.length} employee{employees.length !== 1 ? "s" : ""}{" "}
                  registered
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="shrink-0 px-6 py-5 sm:px-8">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search size={18} className="text-[#C8C8C8]" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] py-2.5 pl-11 pr-4 text-sm text-[#17323A] placeholder:text-[#9CA3AF] transition-colors focus:border-[#0097B2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]/20"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-hidden px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="flex h-full max-h-[min(56vh,520px)] min-w-0 flex-col overflow-hidden rounded-xl border border-[#EFEFEF] bg-white">
              {loading ? (
                <div className="flex flex-1 items-center justify-center py-16">
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#0097B2] border-t-transparent" />
                </div>
              ) : (
                <div className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden">
                  <table className="w-full table-fixed">
                    <thead className="sticky top-0 z-10 border-b border-[#EFEFEF] bg-[#F8FAFC]">
                      <tr>
                        <th className="w-[26%] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          Name
                        </th>
                        <th className="w-[30%] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          Email
                        </th>
                        <th className="w-[18%] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          Role
                        </th>
                        <th className="w-[14%] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          Status
                        </th>
                        <th className="w-[12%] px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="transition-colors hover:bg-[#F8FCFD]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DFFAFF] text-xs font-semibold text-[#0097B2]">
                                  {getInitials(
                                    employee.usuario.nombre,
                                    employee.usuario.apellido
                                  )}
                                </span>
                                <span className="min-w-0 break-words text-sm font-medium text-[#17323A]">
                                  {employee.usuario.nombre}{" "}
                                  {employee.usuario.apellido}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm break-words text-[#4B5563]">
                              {employee.usuario.correo}
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex max-w-full break-words rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#374151]">
                                {getRoleLabel(
                                  employee.usuario.rol || employee.rol
                                )}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                  employee.usuario.activo
                                    ? "bg-[#ECFDF3] text-[#027A48]"
                                    : "bg-[#FEE2E2] text-[#B91C1C]"
                                }`}
                              >
                                {employee.usuario.activo ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowEditModal(true);
                                  }}
                                  className="rounded-lg p-2 text-[#0097B2] transition-colors hover:bg-[#DFFAFF] cursor-pointer"
                                  title="Edit employee"
                                >
                                  <Pencil size={17} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowDeleteModal(true);
                                  }}
                                  className="rounded-lg p-2 text-[#EF4444] transition-colors hover:bg-[#FEE2E2] cursor-pointer"
                                  title="Delete employee"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-12 text-center text-sm text-[#6B7280]"
                          >
                            {search
                              ? "No employees match your search"
                              : "No employees registered for this client"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && selectedEmployee && (
        <EditCompanyEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onUpdate={() => {
            fetchEmployees();
            onEmployeesChanged?.();
          }}
        />
      )}

      {showDeleteModal && selectedEmployee && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
          }}
          onConfirm={handleDelete}
          userName={`${selectedEmployee.usuario.nombre} ${selectedEmployee.usuario.apellido}`}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
