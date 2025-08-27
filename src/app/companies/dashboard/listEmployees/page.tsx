"use client";

import { useEffect, useState } from "react";
import { Employee, getCompanyEmployees } from "../actions/employee.actions";
import { Search, Loader2 } from "lucide-react";
import EmployeesTable from "../components/EmployeesTable";
import TableSkeleton from "../components/TableSkeleton";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";

export default function ListEmployees() {
  const EMPLOYEES_PER_PAGE = 7;
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchEmployees = async (searchValue = "") => {
    if (!user?.empresaId) {
      addNotification("Company ID not found", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await getCompanyEmployees(user.empresaId);

      if (response.success && Array.isArray(response.data.data)) {
        // Filter employees by search term if provided
        let filteredEmployees = response.data.data;
        if (searchValue) {
          const searchLower = searchValue.toLowerCase();
          filteredEmployees = response.data.data.filter(
            (employee: Employee) => {
              const fullName =
                `${employee.usuario.nombre} ${employee.usuario.apellido}`.toLowerCase();
              const email = employee.usuario.correo.toLowerCase();
              return (
                fullName.includes(searchLower) || email.includes(searchLower)
              );
            }
          );
        }

        setEmployees(filteredEmployees);
        setTotalPages(Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE));
      } else {
        console.error(
          "[EMPLOYEES] Error fetching employees:",
          response.message
        );
        addNotification("Error fetching employees", "error");
        setEmployees([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("[EMPLOYEES] Error fetching employees:", error);
      addNotification("Error fetching employees", "error");
      setEmployees([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, user?.empresaId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setIsSearching(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsSearching(true);
      fetchEmployees(search);
    }
  };

  // Paginate employees
  const paginatedEmployees = Array.isArray(employees)
    ? employees.slice(
        (currentPage - 1) * EMPLOYEES_PER_PAGE,
        currentPage * EMPLOYEES_PER_PAGE
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold text-[#17323A]">Employees</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2] sm:text-sm"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : isSearching ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
          <EmployeesTable
            employees={paginatedEmployees}
            onRefresh={() => fetchEmployees(search)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {!loading && employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No employees found
          </div>
        )}
      </div>
    </div>
  );
}
