import { X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Candidato } from "@/app/types/offers";
import VideoModal from "./VideoModal";
import { useNotificationStore } from "@/store/notifications.store";
import {
  advancedStage,
  currentStageStatus,
  rejectStage,
} from "../actions/stage.actions";
import { useAuthStore } from "@/store/auth.store";
import {
  sendContractJobEmail,
  sendInterviewInvitation,
  sendRejectionEmail,
  sendAdvanceNextStep,
} from "../actions/sendEmail.actions";
// import { toggleOfferStatus } from "../actions/offers.actions";
import CandidateProfileModal from "./CandidateProfileModal";
import { CandidateProfileProvider } from "../context/CandidateProfileContext";
import ApplicantsTableSkeleton from "./ApplicantsTableSkeleton";
import { ApplicantsMobileCardSkeleton } from "./ApplicantsTableSkeleton";
import { useRouter } from "next/navigation";
import { removeMultipleApplications } from "../actions/applicants.actions";

export type EstadoPostulacion =
  | "PENDIENTE"
  | "EN_EVALUACION"
  | "EN_EVALUACION_CLIENTE"
  | "FINALISTA"
  | "ACEPTADA"
  | "RECHAZADA";

const STATUS_TRANSLATIONS: Record<EstadoPostulacion, string> = {
  PENDIENTE: "Pending Review",
  EN_EVALUACION: "First Interview Pending",
  EN_EVALUACION_CLIENTE: "Second Interview Pending",
  FINALISTA: "Finalist",
  ACEPTADA: "Hired",
  RECHAZADA: "Rejected",
};

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
  estadoPostulacion: EstadoPostulacion;
  serviceTitle: string;
}

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  applicants: CandidatoWithPostulationId[];
  onUpdate?: () => void;
}

export default function ApplicantsModal({
  isOpen,
  onClose,
  serviceTitle,
  applicants: initialApplicants,
  onUpdate,
}: ApplicantsModalProps) {
  console.log("\n\n\n [ApplicantsModal] onUpdate", onUpdate, "\n\n\n");
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  const isCompanyUser =
    user?.rol === "EMPRESA" || user?.rol === "EMPLEADO_EMPRESA";
  const [applicants, setApplicants] = useState<
    (CandidatoWithPostulationId & { isExpanded: boolean })[]
  >(
    initialApplicants.map((applicant) => ({
      ...applicant,
      isExpanded: false,
    }))
  );

  // Estado para manejar las selecciones de candidatos
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );

  // Estado para el modal de confirmación de eliminación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [selectedApplicant, setSelectedApplicant] =
    useState<CandidatoWithPostulationId | null>(null);
  const [isCandidateProfileModalOpen, setIsCandidateProfileModalOpen] =
    useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");

  // States for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paginatedApplicants, setPaginatedApplicants] = useState<
    (CandidatoWithPostulationId & { isExpanded: boolean })[]
  >([]);
  const APPLICANTS_PER_PAGE = 7;

  console.log(selectedApplicant, paginatedApplicants);

  // Function to paginate applicants
  const paginateApplicants = (
    applicants: (CandidatoWithPostulationId & { isExpanded: boolean })[],
    page: number
  ) => {
    const startIndex = (page - 1) * APPLICANTS_PER_PAGE;
    const endIndex = startIndex + APPLICANTS_PER_PAGE;
    return applicants.slice(startIndex, endIndex);
  };

  // Update pagination when applicants or page changes
  useEffect(() => {
    const totalPages = Math.ceil(applicants.length / APPLICANTS_PER_PAGE);
    setTotalPages(totalPages || 1);
    setPaginatedApplicants(paginateApplicants(applicants, currentPage));
  }, [applicants, currentPage]);

  useEffect(() => {
    // Load application status for each candidate
    const loadStages = async () => {
      const updatedApplicants = await Promise.all(
        applicants.map(async (applicant) => {
          try {
            const response = await currentStageStatus(
              applicant.postulationId,
              applicant.id
            );
            if (response.success && response.data?.estadoPostulacion) {
              return {
                ...applicant,
                estadoPostulacion: response.data
                  .estadoPostulacion as EstadoPostulacion,
              };
            }
            return applicant;
          } catch (error) {
            console.error("Error loading stage for applicant:", error);
            return applicant;
          }
        })
      );
      setApplicants(updatedApplicants);
    };

    if (isOpen) {
      loadStages();
    }
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSelectCandidate = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStage: EstadoPostulacion,
    action: "NEXT" | "CONTRACT" = "NEXT"
  ) => {
    console.log("🚀 [handleSelectCandidate] Iniciando proceso:", {
      postulationId,
      candidateId,
      candidateName,
      candidateEmail,
      currentStage,
      action,
      serviceTitle,
    });

    setIsLoading(true);
    try {
      console.log("📞 [handleSelectCandidate] Llamando a advancedStage...");
      const response = await advancedStage(
        postulationId,
        candidateId,
        currentStage,
        action
      );

      console.log(
        "📋 [handleSelectCandidate] Respuesta de advancedStage:",
        response
      );

      if (response && response.success && response.nextStage) {
        console.log(
          "✅ [handleSelectCandidate] advancedStage exitoso, actualizando estado local..."
        );
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === candidateId
              ? {
                  ...app,
                  estadoPostulacion: response.nextStage as EstadoPostulacion,
                }
              : app
          )
        );

        if (currentStage === "PENDIENTE") {
          console.log(
            "📧 [handleSelectCandidate] Enviando email de entrevista..."
          );
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
          console.log(
            "📧 [handleSelectCandidate] Enviando email de contratación..."
          );
          const emailResponse = await sendContractJobEmail(
            candidateName,
            candidateEmail,
            serviceTitle
          );

          console.log(
            "📧 [handleSelectCandidate] Respuesta del email de contratación:",
            emailResponse
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
          console.log(
            "📧 [handleSelectCandidate] Enviando email de avance a siguiente etapa..."
          );
          const emailResponse = await sendAdvanceNextStep(
            candidateName,
            candidateEmail
          );

          console.log(
            "📧 [handleSelectCandidate] Respuesta del email de avance:",
            emailResponse
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

        // Revalida el path principal para actualizar la lista
        console.log("🔄 [handleSelectCandidate] Revalidando paths...");
        router.refresh();
        onUpdate?.();
      } else {
        console.error(
          "❌ [handleSelectCandidate] advancedStage falló:",
          response
        );

        // Manejar errores específicos
        let errorMessage = response?.message || "Error selecting candidate";

        if (response?.message?.includes("posiciones disponibles")) {
          errorMessage =
            "No hay posiciones disponibles para contratar más candidatos en esta oferta";
        } else if (response?.message?.includes("ya está contratado")) {
          errorMessage = "Este candidato ya está contratado para esta posición";
        } else if (response?.message?.includes("ya está en estado")) {
          errorMessage = "El candidato ya está en el estado solicitado";
        }

        addNotification(errorMessage, "error");
      }
    } catch (error) {
      console.error("💥 [handleSelectCandidate] Error en el proceso:", error);
      addNotification("Error selecting candidate", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectCandidate = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => {
    setIsLoading(true);
    try {
      const response = await rejectStage(postulationId, candidateId);

      if (response && response.success) {
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === candidateId
              ? { ...app, estadoPostulacion: "RECHAZADA" }
              : app
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

        // Revalida el path principal para actualizar la lista
        router.refresh();
        onUpdate?.();
      }
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      addNotification("Error rejecting candidate", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVideo = (applicant: CandidatoWithPostulationId) => {
    if (!applicant.videoPresentacion) {
      addNotification(
        "This candidate does not have a presentation video",
        "info"
      );
      return;
    }
    setSelectedApplicant(applicant);
    setSelectedVideo(applicant.videoPresentacion);
    setIsVideoModalOpen(true);
  };

  // Funciones para manejar la selección de candidatos
  const handleCandidateSelection = (
    candidateId: string,
    isSelected: boolean
  ) => {
    const newSelected = new Set(selectedCandidates);
    if (isSelected) {
      newSelected.add(candidateId);
    } else {
      newSelected.delete(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(applicants.map((app) => app.id));
      setSelectedCandidates(allIds);
    } else {
      setSelectedCandidates(new Set());
    }
  };

  const handleRemoveSelectedCandidates = async () => {
    if (selectedCandidates.size === 0) return;

    setIsLoading(true);
    try {
      // Obtener los IDs de postulación de los candidatos seleccionados
      const postulationIds = applicants
        .filter((app) => selectedCandidates.has(app.id))
        .map((app) => app.postulationId);

      const response = await removeMultipleApplications(postulationIds);

      if (response && response.success) {
        // Remover los candidatos eliminados de la lista
        setApplicants((prevApplicants) =>
          prevApplicants.filter((app) => !selectedCandidates.has(app.id))
        );
        setSelectedCandidates(new Set());

        // Mostrar mensaje detallado si está disponible
        if (response.data && response.data.removed > 0) {
          addNotification(
            `Successfully removed ${response.data.removed} of ${response.data.total} applications`,
            "success"
          );

          // Mostrar errores si los hay
          if (response.data.errors && response.data.errors.length > 0) {
            response.data.errors.forEach((error: string) => {
              addNotification(error, "warning");
            });
          }
        } else {
          addNotification("Applications removed successfully", "success");
        }

        router.refresh();
        onUpdate?.();
      } else {
        addNotification(
          response.error || "Error removing applications",
          "error"
        );
      }
    } catch (error) {
      console.error("Error removing applications:", error);
      addNotification("Error removing applications", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        {/* View Mobile */}
        <div
          className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] flex flex-col md:hidden"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          {/* Close button in the top right corner */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          {/* Header with title */}
          <div className="p-4 border-b border-[#E2E2E2] text-start rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Applicants for service:
                </h3>
                <p className="text-[#0097B2] font-medium">{serviceTitle}</p>
                {selectedCandidates.size > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCandidates.size} candidate(s) selected
                  </p>
                )}
                {/* Botón Select All para vista móvil - solo para admins */}
                {!isCompanyUser && applicants.length > 0 && (
                  <button
                    onClick={() =>
                      handleSelectAll(
                        selectedCandidates.size !== applicants.length
                      )
                    }
                    className="text-xs text-[#0097B2] hover:underline mt-1"
                  >
                    {selectedCandidates.size === applicants.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                )}
              </div>
              {/* Botón de eliminación para vista móvil - solo para admins */}
              {!isCompanyUser && selectedCandidates.size > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-3 py-2 mt-5 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Remove ({selectedCandidates.size})
                </button>
              )}
            </div>
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
              <ApplicantsMobileCardSkeleton />
            ) : applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.id} className="border-b border-[#E2E2E2]">
                  <div className="px-4 py-3">
                    {/* Checkbox y nombre */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Checkbox para seleccionar - solo para admins */}
                        {!isCompanyUser && (
                          <input
                            type="checkbox"
                            checked={selectedCandidates.has(applicant.id)}
                            onChange={(e) =>
                              handleCandidateSelection(
                                applicant.id,
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                          />
                        )}
                        <div>
                          <p className="text-gray-900 text-sm font-medium">{`${applicant.nombre} ${applicant.apellido}`}</p>
                          <p className="text-xs text-gray-500">
                            {STATUS_TRANSLATIONS[applicant.estadoPostulacion]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isCompanyUser && (
                      <>
                        <div className="grid grid-cols-2 w-full mb-4">
                          <p className="text-gray-700 text-sm">Profile</p>
                          <button
                            onClick={() => {
                              setSelectedCandidateId(applicant.id);
                              setIsCandidateProfileModalOpen(true);
                            }}
                            className="text-[#0097B2] text-start font-medium text-sm cursor-pointer flex items-center"
                          >
                            View profile
                            <User size={16} className="ml-1" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 w-full mb-4">
                          <p className="text-gray-700 text-sm">Video</p>
                          <button
                            onClick={() => handleViewVideo(applicant)}
                            className="text-[#0097B2] text-start font-medium text-sm cursor-pointer flex items-center"
                          >
                            View video
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1"
                            >
                              <polygon
                                points="23 7 16 12 23 17 23 7"
                                stroke="#0097B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <rect
                                x="1"
                                y="5"
                                width="15"
                                height="14"
                                rx="2"
                                ry="2"
                                stroke="#0097B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 w-full mb-4">
                          <p className="text-gray-700 text-sm">Email</p>
                          <p className="text-gray-900 text-sm">
                            {applicant.correo}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 w-full mb-4">
                          <p className="text-gray-700 text-sm">Phone</p>
                          <p className="text-gray-900 text-sm">
                            {applicant.telefono}
                          </p>
                        </div>
                      </>
                    )}

                    {isCompanyUser && (
                      <div className="grid grid-cols-2 w-full mb-4">
                        <p className="text-gray-700 text-sm">Profile</p>
                        <button
                          onClick={() => {
                            setSelectedCandidateId(applicant.id);
                            setIsCandidateProfileModalOpen(true);
                          }}
                          className="text-[#0097B2] text-start font-medium text-sm cursor-pointer flex items-center"
                        >
                          View profile
                          <User size={16} className="ml-1" />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 w-full">
                      <p className="text-gray-700 text-sm">Actions</p>
                      <div className="flex flex-col space-y-2">
                        {/* For company users: only show actions if FINALIST */}
                        {isCompanyUser ? (
                          <>
                            {applicant.estadoPostulacion === "FINALISTA" && (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      applicant.estadoPostulacion,
                                      "CONTRACT"
                                    )
                                  }
                                >
                                  Contract
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleRejectCandidate(
                                      applicant.postulationId,
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
                            {applicant.estadoPostulacion !== "FINALISTA" && (
                              <div className="text-gray-400 text-xs">
                                Waiting for evaluation
                              </div>
                            )}
                          </>
                        ) : (
                          /* For admin users: all interview stages and actions */
                          <div className="space-y-2">
                            {/* Primera Entrevista */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                First Interview:
                              </span>
                              {applicant.estadoPostulacion === "PENDIENTE" ? (
                                <button
                                  className="px-2 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      "PENDIENTE",
                                      "NEXT"
                                    )
                                  }
                                >
                                  Send
                                </button>
                              ) : applicant.estadoPostulacion ===
                                  "EN_EVALUACION" ||
                                applicant.estadoPostulacion ===
                                  "EN_EVALUACION_CLIENTE" ||
                                applicant.estadoPostulacion === "FINALISTA" ||
                                applicant.estadoPostulacion === "ACEPTADA" ? (
                                <div className="text-green-600 text-xs font-medium">
                                  ✓ Done
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">N/A</div>
                              )}
                            </div>

                            {/* Segunda Entrevista */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                Second Interview:
                              </span>
                              {applicant.estadoPostulacion ===
                              "EN_EVALUACION" ? (
                                <button
                                  className="px-2 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      "EN_EVALUACION",
                                      "NEXT"
                                    )
                                  }
                                >
                                  Schedule
                                </button>
                              ) : applicant.estadoPostulacion ===
                                "EN_EVALUACION_CLIENTE" ? (
                                <button
                                  className="px-2 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      "EN_EVALUACION_CLIENTE",
                                      "NEXT"
                                    )
                                  }
                                >
                                  Advance
                                </button>
                              ) : applicant.estadoPostulacion === "FINALISTA" ||
                                applicant.estadoPostulacion === "ACEPTADA" ? (
                                <div className="text-green-600 text-xs font-medium">
                                  ✓ Done
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">N/A</div>
                              )}
                            </div>

                            {/* Contratación */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                Hiring:
                              </span>
                              {applicant.estadoPostulacion === "FINALISTA" ? (
                                <button
                                  className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
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
                              ) : applicant.estadoPostulacion !== "ACEPTADA" &&
                                applicant.estadoPostulacion !== "RECHAZADA" ? (
                                <button
                                  className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
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
                              ) : applicant.estadoPostulacion === "ACEPTADA" ? (
                                <div className="text-green-600 text-xs font-medium">
                                  ✓ Hired
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">N/A</div>
                              )}
                            </div>

                            {/* Rechazo - siempre disponible si no está rechazado o aceptado */}
                            {applicant.estadoPostulacion !== "ACEPTADA" &&
                              applicant.estadoPostulacion !== "RECHAZADA" && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">
                                    Rejection:
                                  </span>
                                  <button
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                    onClick={() =>
                                      handleRejectCandidate(
                                        applicant.postulationId,
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

                            {/* Estado final para rechazados */}
                            {applicant.estadoPostulacion === "RECHAZADA" && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Status:
                                </span>
                                <div className="text-red-600 text-xs font-medium">
                                  ✗ Rejected
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                There are no applicants for this offer.
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
            {/* Cabecera con título y botón de cerrar */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Applicants for the service of:{" "}
                  <span className="text-[#0097B2]">{serviceTitle}</span>
                </h3>
                {selectedCandidates.size > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCandidates.size} candidate(s) selected
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Botón de eliminación - solo visible para admins */}
                {!isCompanyUser && selectedCandidates.size > 0 && (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Remove ({selectedCandidates.size})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tabla de postulantes */}
            <div
              className="flex-1 overflow-y-auto p-6"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#0097B2 #f3f4f6",
              }}
            >
              {isLoading ? (
                <ApplicantsTableSkeleton />
              ) : applicants.length > 0 ? (
                <>
                  <div className="mb-4 text-gray-500 text-sm">
                    Total: {applicants.length} applicants | Showing page{" "}
                    {currentPage} of {totalPages}
                  </div>
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-200">
                        {/* Checkbox para seleccionar todos - solo para admins */}
                        {!isCompanyUser && (
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            <input
                              type="checkbox"
                              checked={
                                selectedCandidates.size === applicants.length &&
                                applicants.length > 0
                              }
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                              className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                            />
                          </th>
                        )}
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Name
                        </th>
                        {isCompanyUser && (
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Profile
                          </th>
                        )}
                        {!isCompanyUser && (
                          <>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Video
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Phone
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Profile
                            </th>
                          </>
                        )}
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          First Interview
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Second Interview
                        </th>
                        {!isCompanyUser && (
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Hired
                          </th>
                        )}
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Rejected
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant) => (
                        <tr
                          key={applicant.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          {/* Checkbox para seleccionar candidato - solo para admins */}
                          {!isCompanyUser && (
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.has(applicant.id)}
                                onChange={(e) =>
                                  handleCandidateSelection(
                                    applicant.id,
                                    e.target.checked
                                  )
                                }
                                className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                              />
                            </td>
                          )}
                          <td className="py-4 px-4 text-gray-700">
                            {`${applicant.nombre} ${applicant.apellido}`}
                          </td>

                          {!isCompanyUser && (
                            <>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => {
                                    setSelectedCandidateId(applicant.id);
                                    setIsCandidateProfileModalOpen(true);
                                  }}
                                  className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                                >
                                  View profile
                                  <User size={16} className="ml-1" />
                                </button>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => handleViewVideo(applicant)}
                                  className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                                >
                                  View video
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ml-1"
                                  >
                                    <polygon
                                      points="23 7 16 12 23 17 23 7"
                                      stroke="#0097B2"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <rect
                                      x="1"
                                      y="5"
                                      width="15"
                                      height="14"
                                      rx="2"
                                      ry="2"
                                      stroke="#0097B2"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </td>
                              <td className="py-4 px-4 text-gray-700">
                                {applicant.correo}
                              </td>
                              <td className="py-4 px-4 text-gray-700">
                                {applicant.telefono}
                              </td>
                            </>
                          )}

                          {isCompanyUser && (
                            <td className="py-4 px-4">
                              <button
                                onClick={() => {
                                  setSelectedCandidateId(applicant.id);
                                  setIsCandidateProfileModalOpen(true);
                                }}
                                className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                              >
                                View profile
                                <User size={16} className="ml-1" />
                              </button>
                            </td>
                          )}

                          <td className="py-4 px-4 text-gray-700">
                            <div className="flex flex-col">
                              <span
                                className={`text-sm ${
                                  applicant.estadoPostulacion === "ACEPTADA"
                                    ? "text-green-600"
                                    : applicant.estadoPostulacion ===
                                      "RECHAZADA"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {
                                  STATUS_TRANSLATIONS[
                                    applicant.estadoPostulacion
                                  ]
                                }
                              </span>
                            </div>
                          </td>

                          {/* Primera Entrevista */}
                          <td className="py-4 px-4">
                            {isCompanyUser ? (
                              <div className="text-gray-400 text-xs">N/A</div>
                            ) : applicant.estadoPostulacion === "PENDIENTE" ? (
                              <button
                                className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                onClick={() =>
                                  handleSelectCandidate(
                                    applicant.postulationId,
                                    applicant.id,
                                    `${applicant.nombre} ${applicant.apellido}`,
                                    applicant.correo,
                                    "PENDIENTE",
                                    "NEXT"
                                  )
                                }
                              >
                                Send
                              </button>
                            ) : applicant.estadoPostulacion ===
                                "EN_EVALUACION" ||
                              applicant.estadoPostulacion ===
                                "EN_EVALUACION_CLIENTE" ||
                              applicant.estadoPostulacion === "FINALISTA" ||
                              applicant.estadoPostulacion === "ACEPTADA" ? (
                              <div className="text-green-600 text-xs font-medium">
                                ✓ Done
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs">N/A</div>
                            )}
                          </td>

                          {/* Segunda Entrevista */}
                          <td className="py-4 px-4">
                            {isCompanyUser ? (
                              <div className="text-gray-400 text-xs">N/A</div>
                            ) : applicant.estadoPostulacion ===
                              "EN_EVALUACION" ? (
                              <button
                                className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                onClick={() =>
                                  handleSelectCandidate(
                                    applicant.postulationId,
                                    applicant.id,
                                    `${applicant.nombre} ${applicant.apellido}`,
                                    applicant.correo,
                                    "EN_EVALUACION",
                                    "NEXT"
                                  )
                                }
                              >
                                Schedule
                              </button>
                            ) : applicant.estadoPostulacion ===
                              "EN_EVALUACION_CLIENTE" ? (
                              <button
                                className="px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
                                onClick={() =>
                                  handleSelectCandidate(
                                    applicant.postulationId,
                                    applicant.id,
                                    `${applicant.nombre} ${applicant.apellido}`,
                                    applicant.correo,
                                    "EN_EVALUACION_CLIENTE",
                                    "NEXT"
                                  )
                                }
                              >
                                Advance
                              </button>
                            ) : applicant.estadoPostulacion === "FINALISTA" ||
                              applicant.estadoPostulacion === "ACEPTADA" ? (
                              <div className="text-green-600 text-xs font-medium">
                                ✓ Done
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs">N/A</div>
                            )}
                          </td>

                          {/* Contratación */}
                          {!isCompanyUser && (
                            <td className="py-4 px-4">
                              {applicant.estadoPostulacion === "FINALISTA" ? (
                                <button
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
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
                              ) : applicant.estadoPostulacion !== "ACEPTADA" &&
                                applicant.estadoPostulacion !== "RECHAZADA" ? (
                                <button
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleSelectCandidate(
                                      applicant.postulationId,
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
                              ) : applicant.estadoPostulacion === "ACEPTADA" ? (
                                <div className="text-green-600 text-xs font-medium">
                                  ✓ Hired
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">N/A</div>
                              )}
                            </td>
                          )}

                          {/* Rechazo */}
                          <td className="py-4 px-4">
                            {isCompanyUser ? (
                              applicant.estadoPostulacion === "FINALISTA" ? (
                                <button
                                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    handleRejectCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              ) : applicant.estadoPostulacion ===
                                "RECHAZADA" ? (
                                <div className="text-red-600 text-xs font-medium">
                                  ✗ Rejected
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">N/A</div>
                              )
                            ) : applicant.estadoPostulacion !== "ACEPTADA" &&
                              applicant.estadoPostulacion !== "RECHAZADA" ? (
                              <button
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                                onClick={() =>
                                  handleRejectCandidate(
                                    applicant.postulationId,
                                    applicant.id,
                                    `${applicant.nombre} ${applicant.apellido}`,
                                    applicant.correo
                                  )
                                }
                              >
                                Reject
                              </button>
                            ) : applicant.estadoPostulacion === "RECHAZADA" ? (
                              <div className="text-red-600 text-xs font-medium">
                                ✗ Rejected
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs">N/A</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  There are no applicants for this offer.
                </div>
              )}
            </div>

            {/* Pagination - only show if there are applicants */}
            {applicants.length > 0 && (
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

      {!isCompanyUser && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={selectedVideo}
        />
      )}

      <CandidateProfileProvider>
        <CandidateProfileModal
          isOpen={isCandidateProfileModalOpen}
          onClose={() => setIsCandidateProfileModalOpen(false)}
          candidateId={selectedCandidateId}
        />
      </CandidateProfileProvider>

      {/* Modal de confirmación para eliminación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Removal
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove {selectedCandidates.size}{" "}
                selected candidate(s) from this position? This action cannot be
                undone, but the candidates will be able to apply to other
                positions.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleRemoveSelectedCandidates();
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Removing...
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Remove {selectedCandidates.size} Candidate(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
