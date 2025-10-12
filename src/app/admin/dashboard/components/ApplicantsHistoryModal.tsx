"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { getApplicantsHistory } from "@/app/admin/dashboard/offers/actions/offers.actions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  serviceTitle?: string;
};

type Application = {
  id: string;
  estadoPostulacion: string;
  fechaPostulacion?: string;
  fechaActualizacion?: string;
  candidato: {
    id: string;
    nombre?: string | null;
    apellido?: string | null;
    correo?: string | null;
  };
};

export default function ApplicantsHistoryModal({
  isOpen,
  onClose,
  offerId,
  serviceTitle,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "all" | "selected" | "discarded" | "pending"
  >("all");

  const estadoForFilter = useMemo(() => {
    if (status === "selected") return "ACEPTADA";
    if (status === "discarded") return "RECHAZADA";
    if (status === "pending") return "PENDIENTE";
    return undefined;
  }, [status]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await getApplicantsHistory(offerId, {
          includeAll: true,
          limit: 300,
          estadoPostulacion: estadoForFilter,
        });
        if (cancelled) return;
        if (!resp.success) {
          setError(resp.message || "Error loading history");
          return;
        }
        const arr = Array.isArray(resp.data) ? resp.data : [];
        setRows(arr as Application[]);
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error loading history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, offerId, estadoForFilter]);

  const filtered = useMemo(() => {
    const safeRows = Array.isArray(rows) ? rows : [];
    const q = search.trim().toLowerCase();
    if (!q) return safeRows;
    return safeRows.filter((r) => {
      const name = `${r.candidato?.nombre || ""} ${
        r.candidato?.apellido || ""
      }`.toLowerCase();
      const email = (r.candidato?.correo || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [rows, search]);

  if (!isOpen) return null;

  // Map backend status (Spanish) to English label and color classes
  const formatStatus = (s?: string) => {
    const k = (s || "").toUpperCase();
    const map: Record<string, { label: string; cls: string }> = {
      ACEPTADA: {
        label: "ACCEPTED",
        cls: "bg-green-100 text-green-800 border-green-200",
      },
      RECHAZADA: {
        label: "REJECTED",
        cls: "bg-red-100 text-red-800 border-red-200",
      },
      PENDIENTE: {
        label: "PENDING",
        cls: "bg-amber-100 text-amber-800 border-amber-200",
      },
      EN_EVALUACION: {
        label: "IN REVIEW",
        cls: "bg-blue-100 text-blue-800 border-blue-200",
      },
      EN_EVALUACION_CLIENTE: {
        label: "CLIENT REVIEW",
        cls: "bg-blue-100 text-blue-800 border-blue-200",
      },
      FINALISTA: {
        label: "FINALIST",
        cls: "bg-purple-100 text-purple-800 border-purple-200",
      },
      PRIMERA_ENTREVISTA_REALIZADA: {
        label: "1ST INTERVIEW DONE",
        cls: "bg-sky-100 text-sky-800 border-sky-200",
      },
      SEGUNDA_ENTREVISTA_REALIZADA: {
        label: "2ND INTERVIEW DONE",
        cls: "bg-sky-100 text-sky-800 border-sky-200",
      },
    };
    return (
      map[k] || {
        label: k || "UNKNOWN",
        cls: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center items-stretch bg-black/40">
      <div className="bg-white w-full md:max-w-4xl h-full md:h-auto md:max-h-[80vh] rounded-none md:rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-lg font-semibold text-[#08252A]">
              Applicants history
            </h2>
            {serviceTitle && (
              <p className="text-xs text-gray-500 mt-0.5">{serviceTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#0097B2] focus:ring-[#0097B2]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              value={status}
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setStatus(e.target.value as any)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="selected">Selected</option>
              <option value="discarded">Discarded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Scrollable table area */}
        <div className="px-4 pb-4 flex-1 overflow-hidden">
          <div className="overflow-x-auto border border-gray-200 rounded-md h-full md:max-h-[60vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`sk-${i}`} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-40" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm">
                      No results
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-gray-900">
                          {`${row.candidato?.nombre || ""} ${
                            row.candidato?.apellido || ""
                          }`.trim() || "Unnamed"}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {row.candidato?.correo || "-"}
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {(() => {
                          const { label, cls } = formatStatus(
                            row.estadoPostulacion
                          );
                          return (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 border ${cls}`}
                            >
                              {label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(
                          row.fechaActualizacion || row.fechaPostulacion || ""
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
