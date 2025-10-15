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
  sendPreliminaryInterviewInvitation,
} from "../actions/update.clasification.actions";
import CandidateActionModal from "../components/CandidateActionModal";
import SendEmailModal from "../components/SendEmailModal";
import SignContractModal from "./components/SignContractModal";
import { sendInterviewInvitation } from "../actions/sendEmail.actions";
import UpdateStatusModal from "../components/UpdateStatusModal";
import { EstadoPostulacion } from "../types/application-status.types";

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
  estadoPostulacion?: string; // ✅ AGREGADO: Campo estadoPostulacion directamente
}

export type CandidateStatus = "ACTIVE" | "BLACKLIST" | "DISMISS" | "INACTIVE";

export type StageStatus =
  | "PROFILE_INCOMPLETE"
  | "AVAILABLE"
  | "FIRST_INTERVIEW_PENDING"
  | "FIRST_INTERVIEW_COMPLETED"
  | "SECOND_INTERVIEW_PENDING"
  | "SECOND_INTERVIEW_COMPLETED"
  | "FINALIST"
  | "HIRED"
  | "TERMINATED"
  | "BLACKLIST";

export type ApplicantStatus = "ACTIVE" | "INACTIVE";

interface ExtendedApplication {
  id: string;
  estado: string;
  titulo: string;
  fecha: string;
}

interface ExtendedCandidate extends CandidatoWithPostulationId {
  isExpanded: boolean;
  lastRelevantPostulacion?: ExtendedApplication;
  puestoTrabajo?: string;
  applicationStatus?: string;
  clasificacionGlobal: CandidateStatus;
  favorite?: boolean;
  activo?: boolean;
  perfilCompleto?: string; // ✅ AGREGADO: Campo del estado del perfil desde backend
  entrevistaPreliminar?: boolean; // ✅ AGREGADO: Campo de entrevista preliminar
  fechaEntrevistaPreliminar?: string; // ✅ AGREGADO: Fecha de entrevista preliminar
  logs: {
    date: string;
    action: string;
    description: string;
  }[];
}

export default function PostulantsPage() {
  const [applicantsPerPage, setApplicantsPerPage] = useState<number>(15);
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
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [applicantStatusFilter, setApplicantStatusFilter] =
    useState<string>("all");
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

  // Estados para el modal de actualización de estado
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedStatusUpdate, setSelectedStatusUpdate] = useState<{
    postulacionId: string;
    candidatoId: string;
    currentStatus: EstadoPostulacion;
    candidatoName: string;
  } | null>(null);

  const fetchApplicants = async (page = 1, searchValue = "") => {
    setIsLoading(true);
    try {
      const response = await getApplicants(
        page,
        applicantsPerPage,
        searchValue,
        stageFilter,
        applicantStatusFilter
      );

      if (response.success) {
        setApplicants(response.data?.resultados || []);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error("Error in getApplicants:", response.message);
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
  }, [
    currentPage,
    search,
    applicantsPerPage,
    stageFilter,
    applicantStatusFilter,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setApplicantsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStageFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleApplicantStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setApplicantStatusFilter(e.target.value);
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
  ): Promise<{ success: boolean; message?: string }> => {
    const candidate = applicants.find((c) => c.id === candidateId);

    if (!candidate) {
      addNotification("Error: Candidate not found", "error");
      return { success: false, message: "Candidate not found" };
    }

    const candidateName = candidate.nombre || "Candidate";

    try {
      // Actualización optimista del estado local
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === candidateId
            ? { ...applicant, clasificacionGlobal: status }
            : applicant
        )
      );

      setRecentlyUpdated(candidateId);
      setTimeout(() => {
        setRecentlyUpdated("");
      }, 2000);

      const response = await updateCandidateStatus(candidateId, status, notes);

      if (response.success) {
        addNotification(
          `Status of ${candidateName} updated to ${status}`,
          "success"
        );
        return { success: true };
      } else {
        // Revertir cambio optimista si hay error
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === candidateId
              ? {
                  ...applicant,
                  clasificacionGlobal: candidate.clasificacionGlobal,
                }
              : applicant
          )
        );
        addNotification(response.message || "Error updating status", "error");
        return {
          success: false,
          message: response.message || "Error updating status",
        };
      }
    } catch (error) {
      console.error("❌ Error al actualizar estado del candidato:", error);
      // Revertir cambio optimista si hay error
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === candidateId
            ? {
                ...applicant,
                clasificacionGlobal: candidate.clasificacionGlobal,
              }
            : applicant
        )
      );
      addNotification("Error updating candidate status", "error");
      return { success: false, message: "Error updating candidate status" };
    }
  };

  // Nueva función para renderizar Stage Status
  const renderStageStatus = (applicant: ExtendedCandidate): StageStatus => {
    // 1. Primero verificar si el usuario está en blacklist (prioridad máxima)
    if (applicant.clasificacionGlobal === "BLACKLIST") {
      return "BLACKLIST";
    }

    // 2. Verificar el estado del perfil
    const perfilCompleto = applicant.perfilCompleto;
    if (
      perfilCompleto === "INCOMPLETO" ||
      perfilCompleto === "PENDIENTE_VALIDACION"
    ) {
      return "PROFILE_INCOMPLETE";
    }

    // 3. Si el perfil está completo pero no tiene aplicación activa = AVAILABLE
    if (!hasActiveApplication(applicant)) {
      return "AVAILABLE";
    }

    // 4. Si tiene aplicación activa, basarse en el estado de la aplicación
    // ✅ PRIORIDAD: Usar estadoPostulacion directamente, fallback a lastRelevantPostulacion.estado
    const estado =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (applicant as any).estadoPostulacion ||
      applicant.lastRelevantPostulacion?.estado;

    // ✅ CONTRATOS FINALIZADOS: Si estadoPostulacion es null, significa que el contrato terminó
    if (estado === null || estado === undefined) {
      return "AVAILABLE"; // Disponible para nuevas postulaciones
    }

    switch (estado) {
      case "PENDIENTE":
        return "AVAILABLE";
      case "EN_EVALUACION":
        return "FIRST_INTERVIEW_PENDING";
      case "PRIMERA_ENTREVISTA_REALIZADA":
        return "FIRST_INTERVIEW_COMPLETED";
      case "EN_EVALUACION_CLIENTE":
        return "SECOND_INTERVIEW_PENDING";
      case "SEGUNDA_ENTREVISTA_REALIZADA":
        return "SECOND_INTERVIEW_COMPLETED";
      case "FINALISTA":
        return "FINALIST";
      case "ACEPTADA":
        return "HIRED";
      case "RECHAZADA":
        return "TERMINATED";
      default:
        return "AVAILABLE";
    }
  };

  const renderStageStatusBadge = (stage: StageStatus) => {
    switch (stage) {
      case "PROFILE_INCOMPLETE":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Profile Incomplete
          </span>
        );
      case "AVAILABLE":
        return (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full cursor-pointer">
            Available
          </span>
        );
      case "FIRST_INTERVIEW_PENDING":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer">
            First Interview
          </span>
        );
      case "FIRST_INTERVIEW_COMPLETED":
        return (
          <span className="px-2 py-1 bg-blue-200 text-blue-900 text-xs rounded-full cursor-pointer">
            First Interview Completed
          </span>
        );
      case "SECOND_INTERVIEW_PENDING":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full cursor-pointer">
            Second Interview
          </span>
        );
      case "SECOND_INTERVIEW_COMPLETED":
        return (
          <span className="px-2 py-1 bg-purple-200 text-purple-900 text-xs rounded-full cursor-pointer">
            Second Interview Completed
          </span>
        );
      case "FINALIST":
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full cursor-pointer">
            Finalist
          </span>
        );
      case "HIRED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full cursor-pointer">
            Hired
          </span>
        );
      case "TERMINATED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full cursor-pointer">
            Terminated
          </span>
        );
      case "BLACKLIST":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Blacklist
          </span>
        );
      default:
        return <span></span>;
    }
  };

  const renderClickableStageStatusBadge = (
    stage: StageStatus,
    applicant: ExtendedCandidate
  ) => {
    const canUpdate =
      hasActiveApplication(applicant) &&
      stage !== "PROFILE_INCOMPLETE" &&
      stage !== "BLACKLIST";

    const badgeElement = renderStageStatusBadge(stage);

    if (canUpdate) {
      return (
        <button
          onClick={() => handleOpenUpdateStatusModal(applicant)}
          className="transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          {badgeElement}
        </button>
      );
    }

    return badgeElement;
  };

  // Nueva función para renderizar Applicant Status
  const renderApplicantStatus = (
    applicant: ExtendedCandidate
  ): ApplicantStatus => {
    // Usar clasificacionGlobal - tanto INACTIVE como BLACKLIST se consideran INACTIVE
    return applicant.clasificacionGlobal === "INACTIVE" ||
      applicant.clasificacionGlobal === "BLACKLIST"
      ? "INACTIVE"
      : "ACTIVE";
  };

  const renderApplicantStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Active
          </span>
        );
      case "INACTIVE":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Inactive
          </span>
        );
      default:
        return <span></span>;
    }
  };

  // Nueva función para renderizar el estado de Entrevista Preliminar
  const renderPreliminaryInterviewStatus = (applicant: ExtendedCandidate) => {
    if (applicant.entrevistaPreliminar) {
      return (
        <div className="flex flex-col items-center">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-1">
            ✓ Sent
          </span>
          {applicant.fechaEntrevistaPreliminar && (
            <span className="text-xs text-gray-500">
              {new Date(
                applicant.fechaEntrevistaPreliminar
              ).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    } else {
      return (
        <button
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          onClick={() =>
            handlePreliminaryInterview(
              applicant.id,
              `${applicant.nombre} ${applicant.apellido}`,
              applicant.correo
            )
          }
        >
          Send Invitation
        </button>
      );
    }
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

  const handleToggleFavorite = async (candidateId: string) => {
    const candidate = applicants.find((c) => c.id === candidateId);
    if (!candidate) return;

    // Evitar múltiples clics mientras está cargando
    if (favoriteLoading === candidateId) return;

    setFavoriteLoading(candidateId);

    try {
      // Actualización optimista del estado local
      const newFavoriteStatus = !candidate.favorite;
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === candidateId
            ? { ...applicant, favorite: newFavoriteStatus }
            : applicant
        )
      );

      const response = await toggleFavorite(candidateId);

      if (response.success) {
        // Actualizar con el estado real del servidor
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === candidateId
              ? { ...applicant, favorite: response.data.favorite }
              : applicant
          )
        );

        addNotification(
          response.message ?? "Estado favorito actualizado exitosamente",
          "success"
        );
      } else {
        // Revertir cambio optimista si hay error
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === candidateId
              ? { ...applicant, favorite: candidate.favorite }
              : applicant
          )
        );
        addNotification(
          response.message || "Error al actualizar estado favorito",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al alternar favorito:", error);
      // Revertir cambio optimista si hay error
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === candidateId
            ? { ...applicant, favorite: candidate.favorite }
            : applicant
        )
      );
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
    setSelectedApplicant(applicant);
    setIsSignContractModalOpen(true);
  };

  const handleOpenUpdateStatusModal = (applicant: ExtendedCandidate) => {
    // Verificar que el candidato tenga una postulación activa
    if (
      !applicant.lastRelevantPostulacion ||
      applicant.lastRelevantPostulacion.titulo === "No applications"
    ) {
      addNotification(
        "This candidate doesn't have an active application",
        "error"
      );
      return;
    }

    setSelectedStatusUpdate({
      postulacionId: applicant.lastRelevantPostulacion.id,
      candidatoId: applicant.id,
      currentStatus: applicant.lastRelevantPostulacion
        .estado as EstadoPostulacion,
      candidatoName: applicant.nombre || "Candidate",
    });
    setIsUpdateStatusModalOpen(true);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalOpen(false);
    setSelectedStatusUpdate(null);
  };

  // Función para manejar actualización de status y envío de correo según el stage
  // Puedes ajustar los tipos según tu modelo de datos
  const handleStatusUpdateWithEmail = async () => {
    // Refrescar la lista de applicants después de actualizar
    fetchApplicants(currentPage, search);
    addNotification("Application status updated successfully", "success");
  };

  const hasActiveApplication = (applicant: ExtendedCandidate) => {
    return (
      applicant.lastRelevantPostulacion &&
      applicant.lastRelevantPostulacion.titulo !== "No applications"
    );
  };

  // Nueva función para manejar entrevista preliminar
  const handlePreliminaryInterview = async (
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => {
    try {
      // Actualización optimista del estado local
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === candidateId
            ? {
                ...applicant,
                entrevistaPreliminar: true,
                fechaEntrevistaPreliminar: new Date().toISOString(),
              }
            : applicant
        )
      );

      // Primero marcar en base de datos que se envió la invitación
      const dbResponse = await sendPreliminaryInterviewInvitation(candidateId);

      if (dbResponse.success) {
        // Si se marcó exitosamente en DB, enviar el email
        const emailResponse = await sendInterviewInvitation(
          candidateName,
          candidateEmail
        );

        if (emailResponse && emailResponse.success) {
          addNotification(
            "Preliminary interview invitation sent successfully",
            "success"
          );
        } else {
          addNotification(
            "Database updated but error sending email invitation",
            "warning"
          );
        }
      } else {
        // Revertir cambio optimista si hay error
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === candidateId
              ? {
                  ...applicant,
                  entrevistaPreliminar: false,
                  fechaEntrevistaPreliminar: undefined,
                }
              : applicant
          )
        );
        addNotification(
          dbResponse.message || "Error updating preliminary interview status",
          "error"
        );
      }
    } catch (error) {
      console.error("Error sending preliminary interview:", error);
      // Revertir cambio optimista si hay error
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === candidateId
            ? {
                ...applicant,
                entrevistaPreliminar: false,
                fechaEntrevistaPreliminar: undefined,
              }
            : applicant
        )
      );
      addNotification(
        "Error sending preliminary interview invitation",
        "error"
      );
    }
  };

  return (
    <CandidateProfileProvider>
      <div className="container mx-auto px-2 md:px-4 mt-6 flex flex-col min-h-screen">
        {/* Search and Create Button */}
        <div className="mb-6 px-4 flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            />

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={handleStageFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            >
              <option value="all">All Stages</option>
              <option value="favorites">Favorites</option>
              <option value="PROFILE_INCOMPLETE">Profile Incomplete</option>
              <option value="FIRST_INTERVIEW_PENDING">
                First Interview Pending
              </option>
              <option value="FIRST_INTERVIEW_COMPLETED">
                First Interview Completed
              </option>
              <option value="SECOND_INTERVIEW_PENDING">
                Second Interview Pending
              </option>
              <option value="SECOND_INTERVIEW_COMPLETED">
                Second Interview Completed
              </option>
              <option value="FINALIST">Finalist</option>
              <option value="HIRED">Hired</option>
              <option value="AVAILABLE">Available</option>
              <option value="TERMINATED">Terminated</option>
              <option value="BLACKLIST">Blacklist</option>
            </select>

            {/* Applicant Status Filter */}
            <select
              value={applicantStatusFilter}
              onChange={handleApplicantStatusFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            >
              <option value="all">All Applicant Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
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
                  {Array.isArray(applicants) &&
                    applicants.length > 0 &&
                    `Total: ${applicants.length}`}
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
                      key={`skeleton-mobile-${index}`}
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
              ) : Array.isArray(applicants) && applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className={`border-b border-[#E2E2E2] ${
                      recentlyUpdated === applicant.id
                        ? "bg-green-50 transition-colors"
                        : ""
                    }`}
                  >
                    {/* Header con nombre y favorito */}
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

                    {/* Información principal - Email */}
                    <div className="px-4 py-2 bg-gray-50">
                      <div className="text-sm">
                        <span className="text-gray-500">Email:</span>
                        <div className="text-gray-700 truncate">
                          {applicant.correo}
                        </div>
                      </div>
                    </div>

                    {/* Current Application */}
                    <div className="px-4 py-2">
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">
                          Current Application:
                        </span>
                        <div className="mt-1">
                          {applicant.lastRelevantPostulacion?.titulo ? (
                            <span className="text-gray-700 text-sm truncate">
                              {applicant.lastRelevantPostulacion.titulo}
                            </span>
                          ) : applicant.puestoTrabajo ? (
                            <span className="text-gray-700 text-sm truncate">
                              {applicant.puestoTrabajo}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              No active application
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preliminary Interview */}
                    <div className="px-4 py-2">
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">
                          Preliminary Interview:
                        </span>
                        <div className="mt-1">
                          {renderPreliminaryInterviewStatus(applicant)}
                        </div>
                      </div>
                    </div>

                    {/* Stage Status */}
                    <div className="px-4 py-2">
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">Stage:</span>
                        <div className="mt-1">
                          {renderClickableStageStatusBadge(
                            renderStageStatus(applicant),
                            applicant
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Applicant Status */}
                    <div className="px-4 py-2">
                      <div className="text-sm mb-2">
                        <span className="text-gray-500">Applicant Status:</span>
                        <div className="mt-1">
                          {renderApplicantStatusBadge(
                            renderApplicantStatus(applicant)
                          )}
                        </div>
                      </div>
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

                    {/* Logs y cambio de status */}
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

            {/* Pagination and selector for mobile */}
            {Array.isArray(applicants) && applicants.length > 0 && (
              <div className="border-t border-gray-200 p-3">
                {totalPages > 1 && (
                  <div className="flex justify-center mb-2">
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
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                              key={`mobile-pagination-${pageNumber}`}
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
                        }
                      )}
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
                <div className="flex justify-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">Show:</span>
                    <select
                      value={applicantsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Desktop */}
        <div className="hidden md:block">
          <div
            className="bg-white mb-10 rounded-lg shadow-lg w-full"
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          >
            {/* Header with title and close button */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Applicants Dashboard
                </h3>
              </div>
            </div>

            {/* Container of the table with relative position for the sticky header */}
            <div className="relative p-4 md:p-6">
              {isLoading ? (
                <div className="p-6">
                  <TableSkeleton />
                </div>
              ) : Array.isArray(applicants) && applicants.length > 0 ? (
                <>
                  <div className="mb-4 text-gray-500 text-sm">
                    Total: {applicants.length} applicants | Showing page{" "}
                    {currentPage} of {totalPages}
                  </div>

                  {/* Container of the table with overflow */}
                  <div
                    className="overflow-x-auto w-full max-w-full scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-b border-gray-200 pr-3 md:pr-6"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    <table className="w-full min-w-[1000px] md:min-w-[1100px] border-collapse bg-white">
                      <thead className="sticky top-0 bg-white z-20 shadow-sm">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[200px]">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[180px]">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[200px]">
                            Current Application
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[140px]">
                            Preliminary Interview
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[150px]">
                            Stage
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[110px]">
                            Applicant Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[70px]">
                            Logs
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[100px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants.map((applicant) => (
                          <tr
                            key={applicant.id}
                            className={`border-b border-gray-200 hover:bg-gray-50 ${
                              recentlyUpdated === applicant.id
                                ? "bg-green-50 transition-colors"
                                : ""
                            }`}
                          >
                            {/* Name */}
                            <td className="py-4 px-4 text-gray-700 text-center align-middle">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate max-w-[200px] inline-block">
                                  {`${applicant.nombre} ${applicant.apellido}`}
                                </span>
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
                                >
                                  <Star
                                    size={16}
                                    className={`${
                                      applicant.favorite
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  />
                                </button>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-4 px-4 text-gray-700 text-center align-middle">
                              <div className="truncate max-w-[200px] inline-block">
                                {applicant.correo}
                              </div>
                            </td>

                            {/* Current Application */}
                            <td className="py-4 px-4 text-gray-700 text-center align-middle">
                              <div className="truncate max-w-[200px] inline-block">
                                {applicant.lastRelevantPostulacion?.titulo
                                  ? applicant.lastRelevantPostulacion.titulo
                                  : applicant.puestoTrabajo
                                  ? applicant.puestoTrabajo
                                  : "Sin aplicación"}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center align-middle">
                              {applicant.entrevistaPreliminar ? (
                                <div className="flex flex-col items-center">
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-1">
                                    ✓ Sent
                                  </span>
                                  {applicant.fechaEntrevistaPreliminar && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        applicant.fechaEntrevistaPreliminar
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <button
                                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handlePreliminaryInterview(
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo
                                    )
                                  }
                                >
                                  Send Invitation
                                </button>
                              )}
                            </td>

                            {/* Stage */}
                            <td className="py-4 px-4 text-center align-middle">
                              {renderClickableStageStatusBadge(
                                renderStageStatus(applicant),
                                applicant
                              )}
                            </td>

                            {/* Applicant Status */}
                            <td className="py-4 px-4 text-center align-middle">
                              <div className="flex items-center gap-2">
                                {renderApplicantStatusBadge(
                                  renderApplicantStatus(applicant)
                                )}
                                <button
                                  onClick={() =>
                                    handleOpenStatusModal(applicant.id)
                                  }
                                  className="text-[#0097B2] hover:underline text-xs"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>

                            {/* Logs */}
                            <td className="py-4 px-4 text-center align-middle">
                              <button
                                onClick={() => handleViewLogs(applicant.id)}
                                className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                              >
                                <FileText size={16} className="mr-1" />
                                View
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-center align-middle">
                              <div className="flex space-x-2">
                                <div className="relative group">
                                  <button
                                    className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10 cursor-pointer"
                                    title="View profile"
                                    onClick={() =>
                                      handleOpenProfile(applicant.id)
                                    }
                                  >
                                    <Edit size={18} />
                                  </button>
                                </div>

                                <div className="relative group">
                                  <button
                                    className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10 cursor-pointer"
                                    title="Send email"
                                    onClick={() =>
                                      handleOpenSendEmailModal(applicant)
                                    }
                                  >
                                    <Mail size={18} />
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
                                    <Bookmark size={18} />
                                  </button>
                                </div>

                                {/* Send contract button - only if hired */}
                                {applicant.lastRelevantPostulacion &&
                                  applicant.lastRelevantPostulacion.estado ===
                                    "ACEPTADA" && (
                                    <div className="relative group">
                                      <button
                                        className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10 cursor-pointer"
                                        title="Send contract"
                                        onClick={() =>
                                          handleOpenSignContractModal(applicant)
                                        }
                                      >
                                        <FileText size={18} />
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
            {/* Pagination and items per page selector */}
            {Array.isArray(applicants) && applicants.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">Show:</span>
                    <select
                      value={applicantsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="ml-2">items per page</span>
                  </div>
                  {totalPages > 1 && (
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
                          key={`desktop-pagination-${index + 1}`}
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
                  )}
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
      {isUpdateStatusModalOpen && selectedStatusUpdate && (
        <UpdateStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={handleCloseUpdateStatusModal}
          postulacionId={selectedStatusUpdate.postulacionId}
          candidatoId={selectedStatusUpdate.candidatoId}
          currentStatus={selectedStatusUpdate.currentStatus}
          candidatoName={selectedStatusUpdate.candidatoName}
          applicant={applicants.find(
            (a) => a.id === selectedStatusUpdate.candidatoId
          )}
          onUpdate={handleStatusUpdateWithEmail}
        />
      )}
    </CandidateProfileProvider>
  );
}
