"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getAllOffersWithAcceptedGlobal } from "../actions/offers-with-accepted.actions";
import CandidateProfileModal from "@/app/admin/dashboard/components/CandidateProfileModal";
import { CandidateProfileProvider } from "@/app/admin/dashboard/context/CandidateProfileContext";

const columns = [
  { key: "fullName", label: "Full Name" },
  { key: "profile", label: "View profile" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "country", label: "Country of Residence" },
  { key: "contractDate", label: "Contract Date" },
  { key: "contractStatus", label: "Contract Status" },
  { key: "position", label: "Position" },
  { key: "firm", label: "Firm" },
];

export default function TeamMembersPage() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [orderBy, setOrderBy] = useState("fullName");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  type EmpresaOferta = {
    id: string;
    nombre: string;
  };
  type Candidato = {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string;
    pais?: string;
    residencia?: string;
    empresa?: EmpresaOferta | null;
  };
  type Postulacion = {
    id: string;
    candidato: Candidato;
    fechaPostulacion?: string;
    estadoPostulacion?: string;
  };
  type OfferWithAccepted = {
    id: string;
    titulo: string;
    descripcion: string;
    postulaciones: Postulacion[];
    empresaOferta?: EmpresaOferta | null;
  };
  interface Member {
    id: string; // id de la postulación para key única
    candidateId: string; // id del candidato
    fullName: string;
    email: string;
    phone?: string;
    country?: string;
    position: string;
    profileUrl: string;
    contractDate?: string;
    contractStatus?: string;
    firm?: string; // nombre de la empresa asociada a la oferta
  }
  const [members, setMembers] = useState<Member[]>([]);

  // Permitir sort en todas las columnas relevantes
  const sortKeys = ["fullName", "email", "phone", "firm", "position"];

  // Filtro por cliente (firm)
  const [firmFilter, setFirmFilter] = useState<string>("");
  const uniqueFirms = Array.from(
    new Set(members.map((m) => m.firm).filter(Boolean))
  );

  // Filtro combinado: por nombre y por cliente
  const filteredMembers = members.filter((m) => {
    const matchesName = search
      ? m.fullName.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesFirm = firmFilter ? m.firm === firmFilter : true;
    return matchesName && matchesFirm;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (!sortKeys.includes(orderBy)) return 0;
    const aVal = (a[orderBy as keyof Member] || "") as string;
    const bVal = (b[orderBy as keyof Member] || "") as string;
    if (aVal < bVal) return orderDir === "asc" ? -1 : 1;
    if (aVal > bVal) return orderDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleExportExcel = () => {
    // Export all filtered + sorted rows (not just current page)
    const exportRows = sortedMembers.map((m) => ({
      "Full Name": m.fullName,
      "View profile": "View", // text only, without link
      Email: m.email || "",
      "Phone Number": m.phone || "",
      "Country of Residence": m.country || "",
      "Contract Date": m.contractDate || "",
      "Contract Status": m.contractStatus || "",
      Position: m.position || "",
      Firm: m.firm || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows, { skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Team Members");
    XLSX.writeFile(wb, "team-members.xlsx");
  };

  // Paginación solo para desktop
  const totalRows = sortedMembers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedMembers = sortedMembers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSort = (col: string) => {
    if (orderBy === col) {
      setOrderDir(orderDir === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(col);
      setOrderDir("asc");
    }
  };

  const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleOpenProfile = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsProfileModalOpen(true);
  };

  async function getOffersWithAcceptedGlobal() {
    try {
      const response = await getAllOffersWithAcceptedGlobal();

      if (response.success && Array.isArray(response.data)) {
        // Aplanar postulaciones aceptadas de todas las ofertas
        const allMembers: Member[] = response.data.flatMap(
          (offer: OfferWithAccepted) =>
            offer.postulaciones.map((p: Postulacion) => {
              let formattedDate = "";
              if (p.fechaPostulacion) {
                const d = new Date(p.fechaPostulacion);
                formattedDate = d.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });
              }
              return {
                id: p.id, // id de la postulación para key única
                candidateId: p.candidato.id,
                fullName: `${p.candidato.nombre} ${p.candidato.apellido}`,
                email: p.candidato.correo,
                phone: p.candidato.telefono,
                country: p.candidato.pais,
                position: offer.titulo,
                profileUrl: `/profile/${p.candidato.id}`,
                contractDate: formattedDate,
                contractStatus: p.estadoPostulacion,
                firm: offer.empresaOferta?.nombre || "",
              };
            })
        );
        setMembers(allMembers);
      } else {
        setMembers([]);
        if (!response.success) {
          console.error(
            "[TeamMembers] Error fetching offers:",
            response.message
          );
        }
      }
    } catch {
      setMembers([]);
    }
  }

  useEffect(() => {
    getOffersWithAcceptedGlobal();
  }, []);

  return (
    <CandidateProfileProvider>
      <div className="container mx-auto min-h-screen bg-gray-100 p-2 md:p-4">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-left text-[#0097B2]">
          Team Members
        </h1>

        {/* Top actions: Export + filters (desktop) */}
        <div className="hidden md:flex mb-2 gap-4 items-center">
          <button
            onClick={handleExportExcel}
            className="bg-[#0097B2] hover:bg-[#007a8e] text-white px-3 py-2 rounded text-xs md:text-sm"
          >
            Export to Excel
          </button>
          <input
            type="text"
            placeholder="Search by name..."
            className="border rounded px-2 py-1 text-xs md:text-sm w-48 md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-2 py-1 text-xs md:text-sm"
            value={firmFilter}
            onChange={(e) => setFirmFilter(e.target.value)}
          >
            <option value="">All Clients</option>
            {uniqueFirms.map((firm) => (
              <option key={firm} value={firm}>
                {firm}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile: Export + filters */}
        <div className="md:hidden mb-4 flex flex-col gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-[#0097B2] hover:bg-[#007a8e] text-white px-3 py-2 rounded text-sm"
          >
            Export to Excel
          </button>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full border rounded px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={firmFilter}
            onChange={(e) => setFirmFilter(e.target.value)}
          >
            <option value="">All Clients</option>
            {uniqueFirms.map((firm) => (
              <option key={firm} value={firm}>
                {firm}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla solo en desktop */}
        <div className="overflow-x-auto bg-white rounded-lg shadow custom-scrollbar hidden md:block">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-white border-b">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-[#17323A] uppercase cursor-pointer select-none"
                    onClick={() => col.key !== "profile" && handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {orderBy === col.key && (
                        <svg
                          className="w-3 h-3 inline"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {orderDir === "asc" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.fullName}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenProfile(member.candidateId)}
                      className="text-[#0097B2] hover:underline font-medium"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.email}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.phone}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.country}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.contractDate}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.contractStatus === "Active"
                          ? "bg-[#EBFFF9] text-[#0097B2]"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.contractStatus}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.position}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-[#17323A]">
                    {member.firm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Desktop: paginador y cantidad abajo */}
          <div className="flex flex-row items-center justify-between mt-2 md:mt-4 gap-2 p-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Show</span>
              <select
                className="border rounded px-1 md:px-2 py-1"
                value={rowsPerPage}
                onChange={handleRowsPerPage}
              >
                {[15, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">per page</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 md:px-3 py-1 text-[#0097B2] border border-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-2 md:px-3 py-1 text-[#0097B2] border border-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Cards solo en mobile */}
        <div className="block md:hidden mt-6 space-y-4">
          {sortedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#17323A]">
                  {member.fullName}
                </span>
                <button
                  onClick={() => handleOpenProfile(member.candidateId)}
                  className="text-[#0097B2] hover:underline font-medium text-sm"
                >
                  View profile
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {member.position} | {member.country}
              </div>
              <div className="text-xs text-gray-500">Email: {member.email}</div>
              <div className="text-xs text-gray-500">Phone: {member.phone}</div>
              <div className="text-xs text-gray-500">Firm: {member.firm}</div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.contractStatus === "Active"
                      ? "bg-[#EBFFF9] text-[#0097B2]"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {member.contractStatus}
                </span>
                <span className="text-xs text-gray-500">
                  {member.contractDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CandidateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidateId={selectedCandidateId}
      />
    </CandidateProfileProvider>
  );
}
