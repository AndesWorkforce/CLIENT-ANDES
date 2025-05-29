"use client";

import { useEffect, useState } from "react";
import { getCompaniesAdmin } from "../../superAdmin/actions/company.actions";
import { Mail, Edit, Trash2, UserPlus } from "lucide-react";
import TableSkeleton, {
  MobileTableSkeleton,
} from "../components/TableSkeleton";

interface Client {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: string;
  usuarioResponsable: {
    id: string;
    nombre?: string;
    apellido?: string;
    correo: string;
  };
  _count: {
    empleados: number;
  };
}

export default function ClientsPage() {
  const CLIENTS_PER_PAGE = 7;
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const fetchClients = async (page = 1, searchValue = "") => {
    setIsLoading(true);
    try {
      const response = await getCompaniesAdmin(
        page,
        CLIENTS_PER_PAGE,
        searchValue
      );
      if (response.success) {
        setClients(response.data?.companies || []);
        setTotalPages(
          Math.ceil((response.data?.total || 0) / CLIENTS_PER_PAGE)
        );
      } else {
        setClients([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClients(currentPage, search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page: number) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const renderClientStatus = (active: boolean) => {
    if (active) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
        Inactive
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 flex flex-col h-screen">
      {/* Search Bar */}
      <div className="mb-6 px-4 flex flex-col md:flex-row gap-3 md:px-0 md:justify-between md:items-center">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by company name or email"
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-7xl mx-auto max-h-[90vh] flex flex-col"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Clients</h3>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-hidden relative p-6">
            {isLoading ? (
              <TableSkeleton />
            ) : clients.length > 0 ? (
              <>
                <div className="mb-4 text-gray-500 text-sm">
                  Total: {clients.length} clients | Page {currentPage} of{" "}
                  {totalPages}
                </div>

                {/* Table */}
                <div className="overflow-y-auto max-h-[calc(90vh-13rem)]">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-20 shadow-sm">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Company Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Representative
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Employees
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        {/* <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr
                          key={client.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="text-gray-900 font-medium">
                              {client.nombre}
                            </div>
                            {client.descripcion && (
                              <div className="text-gray-500 text-sm">
                                {client.descripcion}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {client.usuarioResponsable.nombre}{" "}
                            {client.usuarioResponsable.apellido}
                          </td>
                          <td className="py-4 px-4">
                            {client.usuarioResponsable.correo}
                          </td>
                          <td className="py-4 px-4">
                            {client._count.empleados}
                          </td>
                          <td className="py-4 px-4">
                            {renderClientStatus(client.activo)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              {/* <button
                                className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10"
                                title="Edit client"
                              >
                                <Edit size={20} />
                              </button> */}
                              {/* <button
                                className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10"
                                title="Send email"
                              >
                                <Mail size={20} />
                              </button> */}
                              {/* <button
                                className={`p-1 rounded hover:bg-opacity-10 ${
                                  client.activo
                                    ? "text-red-500 hover:bg-red-50"
                                    : "text-green-500 hover:bg-green-100"
                                }`}
                                title={
                                  client.activo
                                    ? "Deactivate client"
                                    : "Activate client"
                                }
                              >
                                {client.activo ? (
                                  <Trash2 size={20} />
                                ) : (
                                  <UserPlus size={20} />
                                )}
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No clients found
              </div>
            )}
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
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Clients</h3>
            {totalPages > 1 && (
              <div className="mt-2 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <MobileTableSkeleton />
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <div key={client.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {client.nombre}
                      </h4>
                      {client.descripcion && (
                        <p className="text-sm text-gray-500 mt-1">
                          {client.descripcion}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        {client.usuarioResponsable.nombre}{" "}
                        {client.usuarioResponsable.apellido}
                      </p>
                      <p className="text-sm text-gray-600">
                        {client.usuarioResponsable.correo}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Employees: {client._count.empleados}
                      </p>
                      <div className="mt-2">
                        {renderClientStatus(client.activo)}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10"
                        title="Edit client"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10"
                        title="Send email"
                      >
                        <Mail size={20} />
                      </button>
                      <button
                        className={`p-1 rounded hover:bg-opacity-10 ${
                          client.activo
                            ? "text-red-500 hover:bg-red-50"
                            : "text-green-500 hover:bg-green-100"
                        }`}
                        title={
                          client.activo
                            ? "Deactivate client"
                            : "Activate client"
                        }
                      >
                        {client.activo ? (
                          <Trash2 size={20} />
                        ) : (
                          <UserPlus size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No clients found
              </div>
            )}
          </div>

          {/* Mobile Pagination */}
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
  );
}
