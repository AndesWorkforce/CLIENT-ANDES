"use client";

import { useEffect, useState } from "react";
import { Company } from "../schemas/company.schema";
import { PlusIcon, Search, Loader2 } from "lucide-react";
import { getCompaniesAdmin } from "../actions/company.actions";
import CompaniesTable from "../components/CompaniesTable";
import CreateCompanyForm from "../components/CreateCompanyForm";
import TableSkeleton from "../../dashboard/components/TableSkeleton";

export default function CompaniesPage() {
  const COMPANIES_PER_PAGE = 7;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateCompanyModal, setShowCreateCompanyModal] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchCompanies = async (page = 1, searchValue = "") => {
    setLoading(true);
    try {
      const response = await getCompaniesAdmin(
        page,
        COMPANIES_PER_PAGE,
        searchValue
      );
      if (response.success) {
        setCompanies(response.data?.companies || []);
        setTotalPages(
          Math.ceil((response.data?.total || 0) / COMPANIES_PER_PAGE)
        );
      } else {
        console.error(
          "[COMPANIES ADMIN] Error al obtener empresas:",
          response.message
        );
        setCompanies([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("[COMPANIES ADMIN] Error al obtener empresas:", error);
      setCompanies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCompanies(currentPage, search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setIsSearching(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsSearching(true);
      fetchCompanies(1, search);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold text-[#17323A]">Companies</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2] sm:text-sm"
              />
            </div>
            <button
              onClick={() => setShowCreateCompanyModal(true)}
              className="bg-[#0097B2] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#007B8E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <PlusIcon size={18} />
              <span>Create Company</span>
            </button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <CompaniesTable
            companies={companies}
            onRefresh={() => fetchCompanies(currentPage, search)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {showCreateCompanyModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <CreateCompanyForm
            onClose={() => {
              setShowCreateCompanyModal(false);
              fetchCompanies(currentPage, search);
            }}
          />
        </div>
      )}
    </div>
  );
}
