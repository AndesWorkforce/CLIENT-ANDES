"use client";

import { useEffect, useState } from "react";
import { getApplicants } from "../offers/actions/offers.actions";
import { getProposal } from "../actions/offers.actions";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Edit,
  AlertCircle,
  Trash2,
  Bookmark,
  FileText,
  UserPlus,
} from "lucide-react";
import type { Candidato } from "@/app/types/offers";
import CandidateProfileModal from "../components/CandidateProfileModal";
import { CandidateProfileProvider } from "../context/CandidateProfileContext";
import CreateApplicantModal from "../components/CreateApplicantModal";
import AssignApplicationModal from "../components/AssignApplicationModal";
import TableSkeleton from "../components/TableSkeleton";
import ActivityLogModal from "../components/ActivityLogModal";
import { useNotificationStore } from "@/store/notifications.store";
import StatusChangeModal from "../components/StatusChangeModal";
import {
  updateCandidateStatus,
  removeCandidate,
  activateCandidate,
} from "../actions/update.clasification.actions";
import CandidateActionModal from "../components/CandidateActionModal";

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
}

export type CandidateStatus = "ACTIVE" | "BLACKLIST" | "DISMISS" | "FAVORITE";

interface ExtendedApplication {
  id: string;
  propuestaId?: string;
  title: string;
  date: string;
}

interface ExtendedCandidate extends CandidatoWithPostulationId {
  isExpanded: boolean;
  lastApplication?: ExtendedApplication;
  applicationStatus?: string;
  clasificacionGlobal: CandidateStatus;
  activo?: boolean;
  logs: {
    date: string;
    action: string;
    description: string;
  }[];
}

export default function PostulantsPage() {
  const APPLICANTS_PER_PAGE = 7;
  const [applicants, setApplicants] = useState<ExtendedCandidate[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [recentlyUpdated, setRecentlyUpdated] = useState<string>("");
  const [proposalTitles, setProposalTitles] = useState<Record<string, string>>(
    {}
  );
  const { addNotification } = useNotificationStore();
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<"remove" | "activate">(
    "remove"
  );

  useEffect(() => {
    const fetchProposalTitles = async () => {
      if (applicants.length === 0) return;

      const propuestasToFetch: string[] = [];

      // Identificar solo las propuestas que necesitamos cargar
      applicants.forEach((applicant) => {
        if (
          applicant.lastApplication?.propuestaId &&
          !proposalTitles[applicant.lastApplication.propuestaId]
        ) {
          propuestasToFetch.push(applicant.lastApplication.propuestaId);
        }
      });

      // Si no hay propuestas para cargar, salimos
      if (propuestasToFetch.length === 0) return;

      // Limitar la cantidad de peticiones simultáneas para no sobrecargar el servidor
      // Procesar máximo 5 propuestas a la vez
      const batchSize = 5;
      for (let i = 0; i < propuestasToFetch.length; i += batchSize) {
        const batch = propuestasToFetch.slice(i, i + batchSize);

        // Procesar este lote de propuestas
        const promises = batch.map(async (propuestaId) => {
          try {
            const response = await getProposal(propuestaId);
            if (response.success && response.data) {
              return {
                propuestaId,
                title:
                  response.data.titulo ||
                  `Propuesta ${propuestaId.substring(0, 8)}`,
              };
            }
            return {
              propuestaId,
              title: `Propuesta ${propuestaId.substring(0, 8)}`,
            };
          } catch (error) {
            console.error(`Error fetching propuesta ${propuestaId}:`, error);
            return {
              propuestaId,
              title: `Propuesta ${propuestaId.substring(0, 8)}`,
            };
          }
        });

        const results = await Promise.all(promises);

        // Actualizar títulos sin causar renderizaciones excesivas
        setProposalTitles((prev) => {
          const newTitles = { ...prev };
          results.forEach(({ propuestaId, title }) => {
            newTitles[propuestaId] = title;
          });
          return newTitles;
        });

        // Pequeña pausa entre lotes para no saturar el servidor
        if (i + batchSize < propuestasToFetch.length) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    };

    fetchProposalTitles();
  }, [applicants]);

  const fetchApplicants = async (page = 1, searchValue = "") => {
    setIsLoading(true);
    try {
      const response = await getApplicants(
        page,
        APPLICANTS_PER_PAGE,
        searchValue
      );

      if (response.success) {
        // Limpiar el cache de títulos cuando se realiza una nueva búsqueda
        if (searchValue && searchValue !== search) {
          setProposalTitles({});
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response.data?.resultados || []).map((candidato: any) => {
          // Obtener la última postulación del candidato (ordenar por fecha de postulación descendente)
          const postulaciones = candidato.postulaciones || [];

          // Si no hay postulaciones, manejar este caso
          if (postulaciones.length === 0) {
            return {
              ...candidato,
              postulationId: candidato.postulationId || candidato.id,
              isExpanded: false,
              lastApplication: {
                id: "no-app",
                propuestaId: undefined,
                title: "No applications",
                date: "-",
              },
              applicationStatus: "PENDIENTE",
              clasificacionGlobal: candidato.clasificacionGlobal || "ACTIVE",
              activo: candidato.activo,
              logs: candidato.logs || [],
            };
          }

          // Ordenar postulaciones por fecha, de más reciente a más antigua
          const sortedPostulaciones = [...postulaciones].sort(
            (a, b) =>
              new Date(b.fechaPostulacion).getTime() -
              new Date(a.fechaPostulacion).getTime()
          );

          // Encontrar la última postulación con estado diferente a PENDIENTE
          const lastNonPendingApplication = sortedPostulaciones.find(
            (p) => p.estadoPostulacion !== "PENDIENTE"
          );

          // Si hay una postulación con estado diferente a PENDIENTE, usar esa
          // Si no, usar la última postulación (independientemente de su estado)
          const relevantApplication =
            lastNonPendingApplication || sortedPostulaciones[0];

          // Identificar el propuestaId
          const propuestaId = relevantApplication?.propuestaId;

          // Determinar el título de forma segura
          let title = "Loading data...";
          if (!propuestaId) {
            title = "Unknown offer";
          } else if (proposalTitles[propuestaId]) {
            title = proposalTitles[propuestaId];
          }

          const lastApplication: ExtendedApplication = {
            id: relevantApplication.id,
            propuestaId: propuestaId,
            title: title,
            date: new Date(relevantApplication.fechaPostulacion)
              .toISOString()
              .split("T")[0],
          };

          // Obtener el estado de la aplicación relevante
          const applicationStatus =
            relevantApplication?.estadoPostulacion || "PENDIENTE";

          return {
            ...candidato,
            postulationId: candidato.postulationId || candidato.id,
            isExpanded: false,
            lastApplication: lastApplication,
            applicationStatus: applicationStatus,
            clasificacionGlobal: candidato.clasificacionGlobal || "ACTIVE",
            activo: candidato.activo,
            logs: candidato.logs || [],
          };
        });

        setApplicants(data);
        setTotalPages(response.totalPages || 1);
      } else {
        setApplicants([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setApplicants([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  console.log("[PostulantsPage] applicants", applicants);

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

  const handleOpenProfile = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsProfileModalOpen(true);
  };

  const handleApplicantCreated = () => {
    setIsCreateModalOpen(false);
    fetchApplicants(currentPage, search);
  };

  const handleAssignApplicant = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsAssignModalOpen(true);
  };

  const handleViewLogs = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsLogModalOpen(true);
  };

  const handleSendPasswordReset = (email: string) => {
    // Implementar lógica para enviar correo de restablecimiento de contraseña
    console.log("Sending password reset to:", email);
    alert(`Password reset email would be sent to ${email}`);
  };

  const handleOpenStatusModal = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsStatusModalOpen(true);
  };

  const handleChangeCompanyStatus = async (
    candidateId: string,
    status: CandidateStatus,
    notes?: string
  ) => {
    const candidate = applicants.find((c) => c.id === candidateId);

    if (!candidate) {
      console.error("No se encontró el candidato con ID:", candidateId);
      addNotification("Error: No se encontró el candidato", "error");
      return;
    }

    const candidateName = candidate.nombre || "Candidate";
    const previousStatus = candidate.clasificacionGlobal || "ACTIVE";

    // Informar para diagnóstico
    console.log(
      `Iniciando actualización de estado para ${candidateName} (${candidateId})`
    );
    console.log(`Estado actual: ${previousStatus}, Nuevo estado: ${status}`);
    console.log(`Notas: ${notes || "No se proporcionaron notas"}`);

    try {
      // Hacer la llamada a la API primero
      console.log("Realizando llamada a updateCandidateStatus...");
      const response = await updateCandidateStatus(candidateId, status, notes);
      console.log("Respuesta de updateCandidateStatus:", response);

      if (response.success) {
        // Actualizar el estado local DESPUÉS de que la API responda exitosamente
        setApplicants((prev) =>
          prev.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, clasificacionGlobal: status }
              : candidate
          )
        );

        // Mostrar efecto visual de actualización
        setRecentlyUpdated(candidateId);
        setTimeout(() => {
          setRecentlyUpdated("");
        }, 2000);

        // Mostrar notificación de actualización exitosa
        addNotification(
          `Estado de ${candidateName} actualizado a ${status}`,
          "success"
        );
      } else {
        // Error en la respuesta de la API
        console.error(
          "Error en la respuesta de updateCandidateStatus:",
          response
        );
        addNotification(
          response.message || "Error al actualizar el estado",
          "error"
        );

        // Mostrar información adicional para diagnóstico
        console.error("Detalles del error:", {
          candidateId,
          status,
          response,
        });
      }
    } catch (error) {
      console.error("Error al actualizar estado del candidato:", error);
      addNotification("Error al actualizar el estado del candidato", "error");
    }
  };

  const toggleExpandApplicant = (id: string) => {
    setApplicants((prev) =>
      prev.map((app) => ({
        ...app,
        isExpanded: app.id === id ? !app.isExpanded : false,
      }))
    );
  };

  const renderCompanyStatus = (status: CandidateStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Active
          </span>
        );
      case "BLACKLIST":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Blacklist
          </span>
        );
      case "DISMISS":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Dismiss
          </span>
        );
      case "FAVORITE":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Favorite
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Unknown
          </span>
        );
    }
  };

  const renderApplicationStatus = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Pending
          </span>
        );
      case "EN_EVALUACION":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            In Evaluation
          </span>
        );
      case "FINALISTA":
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            Finalist
          </span>
        );
      case "ACEPTADA":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Accepted
          </span>
        );
      case "RECHAZADA":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Unknown
          </span>
        );
    }
  };

  const handleRemoveCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setCurrentAction("remove");
    setIsActionModalOpen(true);
  };

  const handleActivateCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setCurrentAction("activate");
    setIsActionModalOpen(true);
  };

  const handleCandidateAction = async () => {
    if (!selectedCandidateId) return;

    const candidate = applicants.find((c) => c.id === selectedCandidateId);
    if (!candidate) return;

    const candidateName = `${candidate.nombre} ${candidate.apellido}`;

    try {
      let response;
      if (currentAction === "remove") {
        // La acción es eliminar (desactivar) un candidato activo
        response = await removeCandidate(selectedCandidateId);

        if (response.success) {
          // Actualizar el estado del candidato a inactivo
          setApplicants((prev) =>
            prev.map((a) =>
              a.id === selectedCandidateId ? { ...a, activo: false } : a
            )
          );
          addNotification(
            `Candidato ${candidateName} eliminado exitosamente`,
            "success"
          );
        } else {
          addNotification(
            response.message || "Error al eliminar el candidato",
            "error"
          );
        }
      } else {
        // La acción es activar un candidato inactivo
        response = await activateCandidate(selectedCandidateId);

        if (response.success) {
          // Actualizar el estado del candidato a activo
          setApplicants((prev) =>
            prev.map((a) =>
              a.id === selectedCandidateId ? { ...a, activo: true } : a
            )
          );
          addNotification(
            `Candidato ${candidateName} activado exitosamente`,
            "success"
          );
        } else {
          addNotification(
            response.message || "Error al activar el candidato",
            "error"
          );
        }
      }
    } catch (error) {
      console.error(`Error en acción de candidato (${currentAction}):`, error);
      addNotification("Ocurrió un error inesperado", "error");
    }
  };

  const handleDeleteCandidate = (candidateId: string) => {
    const candidate = applicants.find((c) => c.id === candidateId);
    if (!candidate) return;

    // Verificar si el candidato está activo o no basado en el campo activo
    const isActive = candidate.activo === true;

    if (!isActive) {
      // Si no está activo, ofrecemos activarlo
      handleActivateCandidate(candidateId);
    } else {
      // Si está activo, ofrecemos eliminarlo
      handleRemoveCandidate(candidateId);
    }
  };

  console.log("[PostulantsPage] applicants", applicants);

  return (
    <CandidateProfileProvider>
      <div className="w-full max-w-7xl mx-auto mt-8 flex flex-col h-screen">
        {/* Search and Create Button */}
        <div className="mb-6 px-4 flex flex-col md:flex-row gap-3 md:px-0 md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            >
              <option value="all">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLACKLIST">Blacklist</option>
              <option value="DISMISS">Dismiss</option>
              <option value="FAVORITE">Favorite</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#0097B2] text-white px-4 py-2 rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer w-full md:w-auto"
          >
            Create Applicant
          </button>
        </div>

        {/* View Mobile */}
        <div
          className="relative bg-white rounded-lg shadow-lg w-full mx-auto max-h-[90vh] flex flex-col md:hidden"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          {/* Title */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                {isLoading ? "Loading applicants..." : "Applicants"}
              </h3>
              <div className="text-sm text-gray-500">
                {applicants.length > 0 && `Total: ${applicants.length}`}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>

          {/* Applicants list with scroll */}
          <div
            className="flex-1 overflow-y-auto rounded-b-lg"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#0097B2 #f3f4f6",
            }}
          >
            {isLoading ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 animate-pulse"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full mr-2" />
                      <div className="grid grid-cols-2 w-full">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-5 bg-gray-200 rounded w-4/5" />
                      </div>
                    </div>
                    <div className="mt-3 pl-10 space-y-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`border-b border-[#E2E2E2] ${
                    recentlyUpdated === applicant.id
                      ? "bg-green-50 transition-colors"
                      : ""
                  }`}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpandApplicant(applicant.id)}
                  >
                    <div className="flex items-center">
                      {/* Chevron indicator */}
                      {applicant.isExpanded ? (
                        <ChevronUp size={20} className="text-[#0097B2] mr-2" />
                      ) : (
                        <ChevronDown
                          size={20}
                          className="text-[#0097B2] mr-2"
                        />
                      )}

                      {/* Applicant name */}
                      <span className="text-lg font-medium">
                        {`${applicant.nombre} ${applicant.apellido}`}
                      </span>
                    </div>

                    {/* Status badge */}
                    {/* <div>
                      {renderCompanyStatus(applicant.clasificacionGlobal)}
                    </div> */}
                  </div>

                  {/* Expanded content */}
                  {applicant.isExpanded && (
                    <div className="px-4 pb-4 space-y-3 bg-gray-50">
                      {/* Profile action */}
                      <div className="flex items-center py-2  border-gray-200">
                        <div className="text-[#0097B2] mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-gray-700 cursor-default">
                            Profile
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenProfile(applicant.id);
                            }}
                            className="text-[#0097B2] font-medium hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {/* Candidate Status */}
                      <div className="flex items-center py-2  border-gray-200">
                        <div className="text-[#0097B2] mr-2">
                          <AlertCircle size={22} />
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-gray-700 cursor-default">
                            Candidate Status
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenStatusModal(applicant.id);
                            }}
                            className="cursor-pointer"
                          >
                            {renderCompanyStatus(applicant.clasificacionGlobal)}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center py-2 border-gray-200">
                        <div className="text-[#0097B2] mr-2">
                          <FileText size={22} />
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-gray-700 cursor-default">
                            Logs
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewLogs(applicant.id);
                            }}
                            className="text-[#0097B2] font-medium hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {/* Application status */}
                      <div className="flex items-center py-2 border-gray-200">
                        <div className="text-[#0097B2] mr-2">
                          <FileText size={22} />
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-gray-700">
                            Application Status
                          </span>
                          <div>
                            {renderApplicationStatus(
                              applicant.applicationStatus || "PENDIENTE"
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional actions */}
                      <div className="flex flex-wrap justify-between gap-2 pt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignApplicant(applicant.id);
                          }}
                          className="flex items-center justify-between text-white bg-[#0097B2] hover:bg-[#007a8f] px-3 py-2 rounded-md transition-colors"
                          title="Assign"
                        >
                          <Bookmark size={18} className="text-white mr-2" />
                          <span>Assign</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendPasswordReset(applicant.correo);
                          }}
                          className="flex items-center justify-between text-white bg-[#0097B2] hover:bg-[#007a8f] px-3 py-2 rounded-md transition-colors"
                          title="Reset Password"
                        >
                          <Mail size={18} className="text-white mr-2" />
                          <span>Reset</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCandidate(applicant.id);
                          }}
                          className={`flex items-center justify-between text-white px-3 py-2 rounded-md transition-colors
                            ${
                              applicant.activo === true
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          title={
                            applicant.activo === true ? "Delete" : "Activate"
                          }
                        >
                          {applicant.activo === true ? (
                            <>
                              <Trash2 size={18} className="text-white mr-2" />
                              <span>Delete</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={18} className="text-white mr-2" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No applicants for this offer.
              </div>
            )}
          </div>

          {/* Pagination for mobile */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 p-3 flex justify-center">
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Si hay más de 5 páginas, mostrar inteligentemente cuáles números mostrar
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      className={`px-3 py-1 ${
                        currentPage === pageNumber
                          ? "text-white bg-[#0097B2]"
                          : "text-[#0097B2] hover:bg-gray-50"
                      }`}
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
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

        {/* View Desktop */}
        <div className="hidden lg:block">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-7xl mx-auto max-h-[90vh] flex flex-col"
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          >
            {/* Header with title and close button */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Applicants for the service
                </h3>
              </div>
            </div>

            {/* Container of the table with relative position for the sticky header */}
            <div className="flex-1 overflow-hidden relative p-6">
              {isLoading ? (
                <div className="p-6">
                  <TableSkeleton rows={APPLICANTS_PER_PAGE} />
                </div>
              ) : applicants.length > 0 ? (
                <>
                  <div className="mb-4 text-gray-500 text-sm">
                    Total: {applicants.length} applicants | Showing page{" "}
                    {currentPage} of {totalPages}
                  </div>

                  {/* Container of the table with overflow */}
                  <div
                    className="overflow-y-auto max-h-[calc(90vh-13rem)]"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#0097B2 #f3f4f6",
                    }}
                  >
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-white z-20 shadow-sm">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Last Application
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Application Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Candidate Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Logs
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/5">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants
                          .filter(
                            (applicant) =>
                              statusFilter === "all" ||
                              applicant.clasificacionGlobal.toUpperCase() ===
                                statusFilter.toUpperCase()
                          )
                          .map((applicant) => (
                            <tr
                              key={applicant.id}
                              className={`border-b border-gray-200 hover:bg-gray-50 ${
                                recentlyUpdated === applicant.id
                                  ? "bg-green-50 transition-colors"
                                  : ""
                              }`}
                            >
                              <td className="py-4 px-4 text-gray-700">
                                {`${applicant.nombre} ${applicant.apellido}`}
                              </td>
                              <td className="py-4 px-4">{applicant.correo}</td>
                              <td className="py-4 px-4">
                                {applicant.lastApplication ? (
                                  <div className="flex flex-col">
                                    <span className="text-gray-700 text-sm font-medium">
                                      {applicant.lastApplication.title ===
                                      "No applications"
                                        ? "No applications"
                                        : applicant.lastApplication.title}
                                    </span>
                                    {applicant.lastApplication.title !==
                                      "No applications" && (
                                      <span className="text-gray-500 text-xs">
                                        {applicant.lastApplication.date}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    No applications
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                {applicant.applicationStatus ? (
                                  renderApplicationStatus(
                                    applicant.applicationStatus
                                  )
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    N/A
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() =>
                                    handleOpenStatusModal(applicant.id)
                                  }
                                  className="cursor-pointer hover:opacity-80"
                                >
                                  {renderCompanyStatus(
                                    applicant.clasificacionGlobal
                                  )}
                                </button>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => handleViewLogs(applicant.id)}
                                  className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                                >
                                  <FileText size={20} className="mr-1" />
                                  View
                                </button>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <div className="relative group">
                                    <button
                                      className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10 cursor-pointer"
                                      title="View profile"
                                      onClick={() =>
                                        handleOpenProfile(applicant.id)
                                      }
                                    >
                                      <Edit size={20} />
                                    </button>
                                    {/* <span className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs px-2 py-1 rounded bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                                      Edit/View Profile
                                    </span> */}
                                  </div>

                                  <div className="relative group">
                                    <button
                                      className="p-1 text-[#0097B2] rounded 
                                    hover:bg-[#0097B2]/10 
                                      cursor-not-allowed"
                                      disabled
                                      title="Send password reset"
                                      onClick={() =>
                                        handleSendPasswordReset(
                                          applicant.correo
                                        )
                                      }
                                    >
                                      <Mail size={20} />
                                    </button>
                                    {/* <span className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs px-2 py-1 rounded bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                                      Send Password Reset
                                    </span> */}
                                  </div>

                                  <div className="relative group">
                                    <button
                                      className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10 cursor-pointer"
                                      title="Assign to job"
                                      onClick={() =>
                                        handleAssignApplicant(applicant.id)
                                      }
                                    >
                                      <Bookmark size={20} />
                                    </button>
                                    {/* <span className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs px-2 py-1 rounded bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                                      Assign to Job
                                    </span> */}
                                  </div>
                                  <div className="relative group">
                                    <button
                                      onClick={() =>
                                        handleDeleteCandidate(applicant.id)
                                      }
                                      className={`p-1 rounded hover:bg-opacity-10 cursor-pointer ${
                                        applicant.activo === true
                                          ? "text-red-500 hover:bg-red-50"
                                          : "text-green-500 hover:bg-green-100"
                                      }`}
                                      title={
                                        applicant.activo === true
                                          ? "Delete candidate"
                                          : "Activate candidate"
                                      }
                                    >
                                      {applicant.activo === true ? (
                                        <Trash2 size={20} />
                                      ) : (
                                        <UserPlus size={20} />
                                      )}
                                    </button>
                                    {/* <span className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs px-2 py-1 rounded bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                                      {applicant.activo === true
                                        ? "Eliminar Candidato"
                                        : "Activar Candidato"}
                                    </span> */}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No applicants for this offer.
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
      </div>

      {/* Modals */}
      <CandidateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidateId={selectedCandidateId}
      />
      <CreateApplicantModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onApplicantCreated={handleApplicantCreated}
      />
      {/* New modals */}
      {isAssignModalOpen && (
        <AssignApplicationModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          candidateId={selectedCandidateId}
        />
      )}
      {isLogModalOpen && (
        <ActivityLogModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          candidateId={selectedCandidateId}
        />
      )}
      {isStatusModalOpen && (
        <StatusChangeModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          candidateId={selectedCandidateId}
          currentStatus={
            applicants.find((a) => a.id === selectedCandidateId)
              ?.clasificacionGlobal
          }
          candidateName={
            applicants.find((a) => a.id === selectedCandidateId)?.nombre
          }
          onStatusChange={handleChangeCompanyStatus}
        />
      )}
      {isActionModalOpen && (
        <CandidateActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onConfirm={handleCandidateAction}
          candidateName={`${
            applicants.find((a) => a.id === selectedCandidateId)?.nombre || ""
          } ${
            applicants.find((a) => a.id === selectedCandidateId)?.apellido || ""
          }`}
          action={currentAction}
        />
      )}
    </CandidateProfileProvider>
  );
}
