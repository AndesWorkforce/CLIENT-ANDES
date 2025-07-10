"use client";

import { useEffect, useState } from "react";
import { getApplicants } from "../offers/actions/offers.actions";
import { Mail, Edit, Bookmark, FileText, Star } from "lucide-react";
import type { Candidato } from "@/app/types/offers";
import { Applicant } from "@/app/types/applicant";
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
  toggleFavorite,
} from "../actions/update.clasification.actions";
import CandidateActionModal from "../components/CandidateActionModal";
import SendEmailModal from "../components/SendEmailModal";
import SignContractModal from "./components/SignContractModal";
// Importar acciones para manejar aplicaciones
import { advancedStage, rejectStage } from "../actions/stage.actions";
import {
  sendAdvanceNextStep,
  sendContractJobEmail,
  sendInterviewInvitation,
  sendRejectionEmail,
} from "../actions/sendEmail.actions";

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
}

export type CandidateStatus = "ACTIVE" | "BLACKLIST" | "DISMISS";

interface ExtendedApplication {
  id: string;
  estado: string;
  titulo: string;
  fecha: string;
}

interface ExtendedCandidate extends CandidatoWithPostulationId {
  isExpanded: boolean;
  lastRelevantPostulacion?: ExtendedApplication;
  applicationStatus?: string;
  clasificacionGlobal: CandidateStatus;
  favorite?: boolean;
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
  const { addNotification } = useNotificationStore();
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [currentAction] = useState<"remove" | "activate">("remove");
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [isSignContractModalOpen, setIsSignContractModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);

  const fetchApplicants = async (page = 1, searchValue = "") => {
    setIsLoading(true);
    try {
      const response = await getApplicants(
        page,
        APPLICANTS_PER_PAGE,
        searchValue
      );

      if (response.success) {
        setApplicants(response.data?.resultados);
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
      addNotification("Error: Candidate not found", "error");
      return;
    }

    const candidateName = candidate.nombre || "Candidate";

    try {
      const response = await updateCandidateStatus(candidateId, status, notes);

      if (response.success) {
        setApplicants((prev) =>
          prev.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, clasificacionGlobal: status }
              : candidate
          )
        );

        setRecentlyUpdated(candidateId);
        setTimeout(() => {
          setRecentlyUpdated("");
        }, 2000);

        addNotification(
          `Status of ${candidateName} updated to ${status}`,
          "success"
        );
      } else {
        addNotification(response.message || "Error updating status", "error");
      }
    } catch (error) {
      console.error("Error al actualizar estado del candidato:", error);
      addNotification("Error updating candidate status", "error");
    }
  };

  // const toggleExpandApplicant = (id: string) => {
  //   setApplicants((prev) =>
  //     prev.map((app) => ({
  //       ...app,
  //       isExpanded: app.id === id ? !app.isExpanded : false,
  //     }))
  //   );
  // };

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

      default:
        return <span></span>;
    }
  };

  const renderApplicationStatus = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Pending Review
          </span>
        );
      case "EN_EVALUACION":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full ">
            First Interview Pending
          </span>
        );
      case "EN_EVALUACION_CLIENTE":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full ">
            Second Interview Pending
          </span>
        );
      case "FINALISTA":
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full ">
            Finalist
          </span>
        );
      case "ACEPTADA":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full ">
            Hired
          </span>
        );
      case "RECHAZADA":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full ">
            Rejected
          </span>
        );
      default:
        return <span></span>;
    }
  };

  // const handleRemoveCandidate = (candidateId: string) => {
  //   setSelectedCandidateId(candidateId);
  //   setCurrentAction("remove");
  //   setIsActionModalOpen(true);
  // };

  // const handleActivateCandidate = (candidateId: string) => {
  //   setSelectedCandidateId(candidateId);
  //   setCurrentAction("activate");
  //   setIsActionModalOpen(true);
  // };

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
          addNotification(`Candidate ${candidateName} successfully`, "success");
        } else {
          addNotification(
            response.message || "Error deleting candidate",
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
            `Candidate ${candidateName} successfully activated`,
            "success"
          );
        } else {
          addNotification(
            response.message || "Error activating candidate",
            "error"
          );
        }
      }
    } catch (error) {
      console.error(`Error en acción de candidato (${currentAction}):`, error);
      addNotification("An unexpected error occurred", "error");
    }
  };

  // const handleDeleteCandidate = (candidateId: string) => {
  //   const candidate = applicants.find((c) => c.id === candidateId);
  //   if (!candidate) return;

  //   // Verificar si el candidato está activo o no basado en el campo activo
  //   const isActive = candidate.activo === true;

  //   if (!isActive) {
  //     // Si no está activo, ofrecemos activarlo
  //     handleActivateCandidate(candidateId);
  //   } else {
  //     // Si está activo, ofrecemos eliminarlo
  //     handleRemoveCandidate(candidateId);
  //   }
  // };

  const handleToggleFavorite = async (candidateId: string) => {
    const candidate = applicants.find((c) => c.id === candidateId);
    if (!candidate) return;

    // Evitar múltiples clics mientras está cargando
    if (favoriteLoading === candidateId) return;

    setFavoriteLoading(candidateId);

    try {
      const response = await toggleFavorite(candidateId);

      if (response.success) {
        // Actualizar el estado local del candidato
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === candidateId
              ? { ...applicant, favorite: response.data.favorite }
              : applicant
          )
        );

        // Refrescar los datos desde el servidor para asegurar sincronización
        await fetchApplicants(currentPage, search);

        addNotification(
          response.message ?? "Estado favorito actualizado exitosamente",
          "success"
        );
      } else {
        addNotification(
          response.message || "Error al actualizar estado favorito",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al alternar favorito:", error);
      addNotification("Error al actualizar estado favorito", "error");
    } finally {
      setFavoriteLoading(null);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenSendEmailModal = (applicant: any) => {
    setSelectedApplicant(applicant);
    setIsSendEmailModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenSignContractModal = (applicant: any) => {
    console.log(
      "\n\n [handleOpenSignContractModal] applicant",
      applicant,
      "\n\n"
    );
    setSelectedApplicant(applicant);
    setIsSignContractModalOpen(true);
  };

  // Mapeo de tipos de estado de postulación
  const mapEstadoPostulacion = (
    estado: string
  ):
    | "PENDIENTE"
    | "EN_EVALUACION"
    | "EN_EVALUACION_CLIENTE"
    | "FINALISTA"
    | "ACEPTADA"
    | "RECHAZADA" => {
    switch (estado) {
      case "PENDIENTE":
        return "PENDIENTE";
      case "EN_EVALUACION":
        return "EN_EVALUACION";
      case "EN_EVALUACION_CLIENTE":
        return "EN_EVALUACION_CLIENTE";
      case "FINALISTA":
        return "FINALISTA";
      case "ACEPTADA":
        return "ACEPTADA";
      case "RECHAZADA":
        return "RECHAZADA";
      case "ACEPTADO":
        return "ACEPTADA";
      case "RECHAZADO":
        return "RECHAZADA";
      case "EN_PROCESO":
        return "FINALISTA";
      default:
        return "PENDIENTE";
    }
  };

  // Funciones para manejar acciones de aplicación
  const handleSelectCandidate = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStage: string,
    action: "NEXT" | "CONTRACT" = "NEXT",
    serviceTitle?: string
  ) => {
    try {
      const response = await advancedStage(
        postulationId,
        candidateId,
        mapEstadoPostulacion(currentStage),
        action
      );

      if (response && response.success && response.nextStage) {
        // Actualizar el estado de la aplicación en la lista
        setApplicants((prevApplicants) =>
          prevApplicants.map((applicant) =>
            applicant.id === candidateId
              ? {
                  ...applicant,
                  lastRelevantPostulacion: applicant.lastRelevantPostulacion
                    ? {
                        ...applicant.lastRelevantPostulacion,
                        estado: response.nextStage,
                      }
                    : undefined,
                }
              : applicant
          )
        );

        if (currentStage === "PENDIENTE") {
          const emailResponse = await sendInterviewInvitation(
            candidateName,
            candidateEmail
          );

          if (emailResponse && emailResponse.success) {
            addNotification(
              "Candidate selected and email sent successfully",
              "success"
            );
          } else {
            addNotification(
              "Candidate selected but there was an error sending the email",
              "warning"
            );
          }
        } else if (action === "CONTRACT") {
          const emailResponse = await sendContractJobEmail(
            candidateName,
            candidateEmail,
            serviceTitle || ""
          );

          if (emailResponse && emailResponse.success) {
            addNotification(
              "Candidate contracted and email sent successfully",
              "success"
            );
          } else {
            addNotification(
              "Candidate contracted but there was an error sending the email",
              "warning"
            );
          }
        } else {
          const emailResponse = await sendAdvanceNextStep(
            candidateName,
            candidateEmail
          );

          if (emailResponse && emailResponse.success) {
            addNotification(
              "Candidate advanced and email sent successfully",
              "success"
            );
          } else {
            addNotification(
              "Candidate advanced but there was an error sending the email",
              "warning"
            );
          }
        }
      } else {
        const errorMessage = response?.message || "Error selecting candidate";
        addNotification(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error selecting candidate", error);
      addNotification("Error selecting candidate", "error");
    }
  };

  const handleRejectCandidate = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => {
    try {
      const response = await rejectStage(postulationId, candidateId);

      if (response && response.success) {
        // Actualizar el estado en la lista
        setApplicants((prevApplicants) =>
          prevApplicants.map((applicant) =>
            applicant.id === candidateId
              ? {
                  ...applicant,
                  lastRelevantPostulacion: applicant.lastRelevantPostulacion
                    ? {
                        ...applicant.lastRelevantPostulacion,
                        estado: "RECHAZADA",
                      }
                    : undefined,
                }
              : applicant
          )
        );

        const emailResponse = await sendRejectionEmail(
          candidateName,
          candidateEmail
        );

        if (emailResponse && emailResponse.success) {
          addNotification(
            "Candidate rejected and email sent successfully",
            "success"
          );
        } else {
          addNotification(
            "Candidate rejected but there was an error sending the email",
            "warning"
          );
        }
      } else {
        const errorMessage = response?.message || "Error rejecting candidate";
        addNotification(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error rejecting candidate", error);
      addNotification("Error rejecting candidate", "error");
    }
  };

  console.log(applicants);

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
        <div className="md:hidden">
          <div
            className="bg-white rounded-lg shadow-lg w-full mx-auto max-h-[90vh] flex flex-col"
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
                    {/* Header con nombre y estado */}
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium">
                          {`${applicant.nombre} ${applicant.apellido}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(applicant.id)}
                        className={`cursor-pointer transition-transform ${
                          favoriteLoading === applicant.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-110"
                        }`}
                        disabled={favoriteLoading === applicant.id}
                      >
                        <Star
                          size={20}
                          className={`${
                            applicant.favorite
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Información principal */}
                    <div className="px-4 py-2 bg-gray-50">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Email:</span>
                          <div className="text-gray-700 truncate">
                            {applicant.correo}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Status:</span>
                          <div>
                            {renderCompanyStatus(applicant.clasificacionGlobal)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estado de la aplicación */}
                    <div className="px-4 py-2">
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">
                          Application Status:
                        </span>
                        <div className="mt-1">
                          {applicant.lastRelevantPostulacion?.estado ? (
                            renderApplicationStatus(
                              applicant.lastRelevantPostulacion.estado
                            )
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lista de acciones del proceso */}
                    <div className="px-4 py-2 space-y-3">
                      {/* Primera Entrevista */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          First Interview:
                        </div>
                        <div>
                          {applicant.lastRelevantPostulacion?.estado ===
                          "PENDIENTE" ? (
                            <button
                              className="px-3 py-1 bg-[#0097B2] text-white text-sm rounded-md hover:bg-[#007a8f] transition-colors"
                              onClick={() =>
                                handleSelectCandidate(
                                  applicant.lastRelevantPostulacion?.id || "",
                                  applicant.id,
                                  `${applicant.nombre} ${applicant.apellido}`,
                                  applicant.correo,
                                  "PENDIENTE"
                                )
                              }
                            >
                              Send
                            </button>
                          ) : applicant.lastRelevantPostulacion?.estado ===
                              "EN_EVALUACION" ||
                            applicant.lastRelevantPostulacion?.estado ===
                              "EN_EVALUACION_CLIENTE" ||
                            applicant.lastRelevantPostulacion?.estado ===
                              "FINALISTA" ||
                            applicant.lastRelevantPostulacion?.estado ===
                              "ACEPTADA" ? (
                            <div className="text-green-600 text-sm">✓ Done</div>
                          ) : (
                            <div className="text-gray-400 text-sm">N/A</div>
                          )}
                        </div>
                      </div>

                      {/* Segunda Entrevista */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Second Interview:
                        </div>
                        <div>
                          {applicant.lastRelevantPostulacion?.estado ===
                          "EN_EVALUACION" ? (
                            <button
                              className="px-3 py-1 bg-[#0097B2] text-white text-sm rounded-md hover:bg-[#007a8f] transition-colors"
                              onClick={() =>
                                handleSelectCandidate(
                                  applicant.lastRelevantPostulacion?.id || "",
                                  applicant.id,
                                  `${applicant.nombre} ${applicant.apellido}`,
                                  applicant.correo,
                                  "EN_EVALUACION"
                                )
                              }
                            >
                              Schedule
                            </button>
                          ) : applicant.lastRelevantPostulacion?.estado ===
                            "EN_EVALUACION_CLIENTE" ? (
                            <button
                              className="px-3 py-1 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 transition-colors"
                              onClick={() =>
                                handleSelectCandidate(
                                  applicant.lastRelevantPostulacion?.id || "",
                                  applicant.id,
                                  `${applicant.nombre} ${applicant.apellido}`,
                                  applicant.correo,
                                  "EN_EVALUACION_CLIENTE"
                                )
                              }
                            >
                              Advance
                            </button>
                          ) : applicant.lastRelevantPostulacion?.estado ===
                              "FINALISTA" ||
                            applicant.lastRelevantPostulacion?.estado ===
                              "ACEPTADA" ? (
                            <div className="text-green-600 text-sm">✓ Done</div>
                          ) : (
                            <div className="text-gray-400 text-sm">N/A</div>
                          )}
                        </div>
                      </div>

                      {/* Contratación */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">Hiring:</div>
                        <div>
                          {applicant.lastRelevantPostulacion?.estado ===
                          "FINALISTA" ? (
                            <button
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                              onClick={() =>
                                handleSelectCandidate(
                                  applicant.lastRelevantPostulacion?.id || "",
                                  applicant.id,
                                  `${applicant.nombre} ${applicant.apellido}`,
                                  applicant.correo,
                                  "FINALISTA",
                                  "CONTRACT"
                                )
                              }
                            >
                              Hire
                            </button>
                          ) : applicant.lastRelevantPostulacion?.estado ===
                            "ACEPTADA" ? (
                            <div className="text-green-600 text-sm">
                              ✓ Hired
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">N/A</div>
                          )}
                        </div>
                      </div>

                      {/* Rechazo - solo mostrar si no está contratado o rechazado */}
                      {applicant.lastRelevantPostulacion?.estado !==
                        "ACEPTADA" &&
                        applicant.lastRelevantPostulacion?.estado !==
                          "RECHAZADA" && (
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Rejection:
                            </div>
                            <button
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                              onClick={() =>
                                handleRejectCandidate(
                                  applicant.lastRelevantPostulacion?.id || "",
                                  applicant.id,
                                  `${applicant.nombre} ${applicant.apellido}`,
                                  applicant.correo
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        )}
                    </div>

                    {/* Acciones principales en grid */}
                    <div className="px-4 py-3 grid grid-cols-3 gap-2 border-t border-gray-200">
                      {/* Profile */}
                      <button
                        onClick={() => handleOpenProfile(applicant.id)}
                        className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <Edit size={20} className="text-[#0097B2] mb-1" />
                        <span className="text-xs text-gray-600">Profile</span>
                      </button>

                      {/* Email */}
                      <button
                        onClick={() => handleOpenSendEmailModal(applicant)}
                        className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <Mail size={20} className="text-[#0097B2] mb-1" />
                        <span className="text-xs text-gray-600">Email</span>
                      </button>

                      {/* Assign */}
                      <button
                        onClick={() => handleAssignApplicant(applicant.id)}
                        className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <Bookmark size={20} className="text-[#0097B2] mb-1" />
                        <span className="text-xs text-gray-600">Assign</span>
                      </button>
                    </div>

                    {/* Logs y acciones adicionales */}
                    <div className="px-4 py-4 flex justify-between items-center border-t border-gray-200">
                      <button
                        onClick={() => handleViewLogs(applicant.id)}
                        className="flex items-center text-[#0097B2] hover:underline"
                      >
                        <FileText size={16} className="mr-1" />
                        <span className="text-sm">View Logs</span>
                      </button>

                      <button
                        onClick={() => handleOpenStatusModal(applicant.id)}
                        className="text-sm text-[#0097B2] hover:underline"
                      >
                        Change Status
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No applicants found.
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
                  <TableSkeleton />
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
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Current Application
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            First Interview
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Second Interview
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Hired
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Rejected
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Candidate Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Logs
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/8">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants
                          .filter((applicant) => {
                            if (statusFilter === "all") return true;
                            if (statusFilter === "FAVORITE")
                              return applicant.favorite === true;
                            return (
                              applicant.clasificacionGlobal.toUpperCase() ===
                              statusFilter.toUpperCase()
                            );
                          })
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
                                {applicant.lastRelevantPostulacion ? (
                                  <div className="flex flex-col">
                                    <span className="text-gray-700 text-sm font-medium">
                                      {applicant.lastRelevantPostulacion
                                        .titulo === "No applications"
                                        ? "No applications"
                                        : applicant.lastRelevantPostulacion
                                            .titulo}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    No applications
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                {applicant.lastRelevantPostulacion &&
                                applicant.lastRelevantPostulacion.estado ? (
                                  renderApplicationStatus(
                                    applicant.lastRelevantPostulacion.estado
                                  )
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    N/A
                                  </span>
                                )}
                              </td>
                              {/* Primera Entrevista */}
                              <td className="py-4 px-4">
                                {applicant.lastRelevantPostulacion?.estado ===
                                "PENDIENTE" ? (
                                  <button
                                    className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleSelectCandidate(
                                        applicant.lastRelevantPostulacion?.id ||
                                          "",
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo,
                                        "PENDIENTE"
                                      )
                                    }
                                  >
                                    Send
                                  </button>
                                ) : applicant.lastRelevantPostulacion
                                    ?.estado === "EN_EVALUACION" ||
                                  applicant.lastRelevantPostulacion?.estado ===
                                    "EN_EVALUACION_CLIENTE" ||
                                  applicant.lastRelevantPostulacion?.estado ===
                                    "FINALISTA" ||
                                  applicant.lastRelevantPostulacion?.estado ===
                                    "ACEPTADA" ? (
                                  <div className="text-green-600 text-xs font-medium">
                                    ✓ Done
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-xs">
                                    N/A
                                  </div>
                                )}
                              </td>
                              {/* Segunda Entrevista */}
                              <td className="py-4 px-4">
                                {applicant.lastRelevantPostulacion?.estado ===
                                "EN_EVALUACION" ? (
                                  <button
                                    className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleSelectCandidate(
                                        applicant.lastRelevantPostulacion?.id ||
                                          "",
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo,
                                        "EN_EVALUACION"
                                      )
                                    }
                                  >
                                    Schedule
                                  </button>
                                ) : applicant.lastRelevantPostulacion
                                    ?.estado === "EN_EVALUACION_CLIENTE" ? (
                                  <button
                                    className="px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleSelectCandidate(
                                        applicant.lastRelevantPostulacion?.id ||
                                          "",
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo,
                                        "EN_EVALUACION_CLIENTE"
                                      )
                                    }
                                  >
                                    Advance
                                  </button>
                                ) : applicant.lastRelevantPostulacion
                                    ?.estado === "FINALISTA" ||
                                  applicant.lastRelevantPostulacion?.estado ===
                                    "ACEPTADA" ? (
                                  <div className="text-green-600 text-xs font-medium">
                                    ✓ Done
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-xs">
                                    N/A
                                  </div>
                                )}
                              </td>
                              {/* Contratación */}
                              <td className="py-4 px-4">
                                {applicant.lastRelevantPostulacion?.estado ===
                                "FINALISTA" ? (
                                  <button
                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleSelectCandidate(
                                        applicant.lastRelevantPostulacion?.id ||
                                          "",
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo,
                                        "FINALISTA",
                                        "CONTRACT"
                                      )
                                    }
                                  >
                                    Hire
                                  </button>
                                ) : applicant.lastRelevantPostulacion
                                    ?.estado !== "ACEPTADA" &&
                                  applicant.lastRelevantPostulacion?.estado !==
                                    "RECHAZADA" ? (
                                  <button
                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleSelectCandidate(
                                        applicant.lastRelevantPostulacion?.id ||
                                          "",
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo,
                                        "FINALISTA",
                                        "CONTRACT"
                                      )
                                    }
                                  >
                                    Hire
                                  </button>
                                ) : applicant.lastRelevantPostulacion
                                    ?.estado === "ACEPTADA" ? (
                                  <div className="text-green-600 text-xs font-medium">
                                    ✓ Hired
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-xs">
                                    N/A
                                  </div>
                                )}
                              </td>
                              {/* Rechazo */}
                              <td className="py-4 px-4">
                                {applicant.lastRelevantPostulacion?.estado !==
                                  "ACEPTADA" &&
                                applicant.lastRelevantPostulacion?.estado !==
                                  "RECHAZADA" ? (
                                  <button
                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleRejectCandidate(
                                        applicant.lastRelevantPostulacion?.id ||
                                          "",
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo
                                      )
                                    }
                                  >
                                    Reject
                                  </button>
                                ) : applicant.lastRelevantPostulacion
                                    ?.estado === "RECHAZADA" ? (
                                  <div className="text-red-600 text-xs font-medium">
                                    ✗ Rejected
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-xs">
                                    N/A
                                  </div>
                                )}
                              </td>
                              {/* Candidate Status */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleToggleFavorite(applicant.id)
                                    }
                                    className={`cursor-pointer transition-transform ${
                                      favoriteLoading === applicant.id
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:scale-110"
                                    }`}
                                    disabled={favoriteLoading === applicant.id}
                                    title={
                                      favoriteLoading === applicant.id
                                        ? "Updating..."
                                        : applicant.favorite
                                        ? "Remove from favorites"
                                        : "Add to favorites"
                                    }
                                  >
                                    {favoriteLoading === applicant.id ? (
                                      <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-[#0097B2] rounded-full"></div>
                                    ) : (
                                      <Star
                                        size={20}
                                        className={`${
                                          applicant.favorite
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-gray-400"
                                        }`}
                                      />
                                    )}
                                  </button>
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
                                </div>
                              </td>
                              {/* Logs */}
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => handleViewLogs(applicant.id)}
                                  className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                                >
                                  <FileText size={20} className="mr-1" />
                                  View
                                </button>
                              </td>
                              {/* Actions */}
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
                                  </div>

                                  <div className="relative group">
                                    <button
                                      className="p-1 text-[#0097B2] rounded 
                                    hover:bg-[#0097B2]/10 
                                      cursor-pointer"
                                      title="Send email"
                                      onClick={() =>
                                        handleOpenSendEmailModal(applicant)
                                      }
                                    >
                                      <Mail size={20} />
                                    </button>
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
                                  </div>

                                  {/* Send contract button */}
                                  {applicant.lastRelevantPostulacion &&
                                    applicant.lastRelevantPostulacion.estado ===
                                      "ACEPTADA" && (
                                      <div className="relative group">
                                        <button
                                          className="p-1 text-[#0097B2] rounded 
                                    hover:bg-[#0097B2]/10 
                                      cursor-pointer"
                                          title="Send contract"
                                          onClick={() =>
                                            handleOpenSignContractModal(
                                              applicant
                                            )
                                          }
                                        >
                                          <FileText
                                            size={20}
                                            className="mr-1"
                                          />
                                        </button>
                                      </div>
                                    )}
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
            applicants.find((a) => a.id === selectedCandidateId)?.nombre || ""
          }
          candidateEmail={
            applicants.find((a) => a.id === selectedCandidateId)?.correo || ""
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
      {isSendEmailModalOpen && selectedApplicant && (
        <SendEmailModal
          isOpen={isSendEmailModalOpen}
          onClose={() => setIsSendEmailModalOpen(false)}
          applicant={selectedApplicant as Applicant}
        />
      )}
      {isSignContractModalOpen && selectedApplicant && (
        <SignContractModal
          isOpen={isSignContractModalOpen}
          onClose={() => setIsSignContractModalOpen(false)}
          applicant={selectedApplicant as Applicant}
        />
      )}
    </CandidateProfileProvider>
  );
}
