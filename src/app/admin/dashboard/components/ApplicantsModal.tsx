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
} from "../actions/sendEmail.actions";
// import { toggleOfferStatus } from "../actions/offers.actions";
import CandidateProfileModal from "./CandidateProfileModal";
import { CandidateProfileProvider } from "../context/CandidateProfileContext";
import ApplicantsTableSkeleton from "./ApplicantsTableSkeleton";
import { ApplicantsMobileCardSkeleton } from "./ApplicantsTableSkeleton";
import { useRouter } from "next/navigation";

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
    setIsLoading(true);
    try {
      const response = await advancedStage(
        postulationId,
        candidateId,
        currentStage,
        action
      );

      if (response && response.success && response.nextStage) {
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
            serviceTitle
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
          addNotification("Candidate advanced to next stage", "success");
        }

        // Revalida el path principal para actualizar la lista
        router.refresh();
        onUpdate?.();
      }
    } catch (error) {
      console.error("Error selecting candidate:", error);
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
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Applicants for service:
            </h3>
            <p className="text-[#0097B2] font-medium">{serviceTitle}</p>
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
                    <div className="grid grid-cols-2 w-full mb-4">
                      <p className="text-gray-700 text-sm">Name</p>
                      <p className="text-gray-900 text-sm font-medium">{`${applicant.nombre} ${applicant.apellido}`}</p>
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
                              <>
                                <button
                                  className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#0097B2]/80 transition-colors cursor-pointer"
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
                                  className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#0097B2]/80 transition-colors cursor-pointer"
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
                              </>
                            )}
                            {applicant.estadoPostulacion !== "FINALISTA" && (
                              <div className="text-gray-400 text-xs">
                                Waiting for evaluation
                              </div>
                            )}
                          </>
                        ) : (
                          /* For admin users: original logic */
                          <>
                            {applicant.estadoPostulacion !== "ACEPTADA" &&
                              applicant.estadoPostulacion !== "RECHAZADA" && (
                                <>
                                  {applicant.estadoPostulacion !==
                                    "FINALISTA" && (
                                    <button
                                      className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleSelectCandidate(
                                          applicant.postulationId,
                                          applicant.id,
                                          `${applicant.nombre} ${applicant.apellido}`,
                                          applicant.correo,
                                          applicant.estadoPostulacion ||
                                            "PENDIENTE",
                                          "NEXT"
                                        )
                                      }
                                    >
                                      Next Stage
                                    </button>
                                  )}
                                  <button
                                    className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#0097B2]/80 transition-colors cursor-pointer"
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
                                  {(applicant.estadoPostulacion ===
                                    "FINALISTA" ||
                                    applicant.estadoPostulacion ===
                                      "EN_EVALUACION") && (
                                    <button
                                      className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#0097B2]/80 transition-colors cursor-pointer"
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
                                  )}
                                </>
                              )}
                            {(applicant.estadoPostulacion === "ACEPTADA" ||
                              applicant.estadoPostulacion === "RECHAZADA") && (
                              <div className="text-gray-400 text-xs">
                                No actions available
                              </div>
                            )}
                          </>
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
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
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
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Hired
                        </th>
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
    </>
  );
}
