import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Candidato } from "@/app/types/offers";
import VideoModal from "./VideoModal";
import ProfileModal from "./ProfileModal";
import { useNotificationStore } from "@/store/notifications.store";
import {
  advancedStage,
  currentStageStatus,
  rejectStage,
} from "../actions/stage.actions";
import { ExpandContentSkeleton } from "./expandContent.skeleton";
import {
  sendAdvanceNextStep,
  sendContractJobEmail,
  sendInterviewInvitation,
  sendRejectionEmail,
} from "../actions/sendEmail.actions";
import { toggleOfferStatus } from "../actions/offers.actions";

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
}

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  applicants: CandidatoWithPostulationId[];
  offerId: string;
}

export default function ApplicantsModal({
  isOpen,
  onClose,
  serviceTitle,
  applicants: initialApplicants,
  offerId,
}: ApplicantsModalProps) {
  const { addNotification } = useNotificationStore();
  const [applicants, setApplicants] = useState<
    (CandidatoWithPostulationId & { isExpanded: boolean })[]
  >(
    initialApplicants.map((applicant) => ({ ...applicant, isExpanded: false }))
  );
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<string>("");

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paginatedApplicants, setPaginatedApplicants] = useState<
    (CandidatoWithPostulationId & { isExpanded: boolean })[]
  >([]);
  const APPLICANTS_PER_PAGE = 7;

  // Función para paginar aplicantes
  const paginateApplicants = (
    applicants: (CandidatoWithPostulationId & { isExpanded: boolean })[],
    page: number
  ) => {
    const startIndex = (page - 1) * APPLICANTS_PER_PAGE;
    const endIndex = startIndex + APPLICANTS_PER_PAGE;
    return applicants.slice(startIndex, endIndex);
  };

  // Actualizar paginación cuando cambian los aplicantes o la página
  useEffect(() => {
    const totalPages = Math.ceil(applicants.length / APPLICANTS_PER_PAGE);
    setTotalPages(totalPages || 1);
    setPaginatedApplicants(paginateApplicants(applicants, currentPage));
  }, [applicants, currentPage]);

  // Funciones para controlar la paginación
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

  const handleCurrentStageStatus = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await currentStageStatus(offerId, userId);

      if (response.success) {
        setCurrentStage(response.data?.postulacion?.estadoPostulacion);
        setIsLoading(false);
      } else {
        addNotification(response.message, "error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener el estado de la etapa", error);
      addNotification("Error al obtener el estado de la etapa", "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCandidateId) {
      handleCurrentStageStatus(selectedCandidateId);
    }
  }, [selectedCandidateId]);

  if (!isOpen) return null;

  const toggleApplicant = (id: string) => {
    setSelectedCandidateId(id);
    setApplicants(
      applicants.map((applicant) =>
        applicant.id === id
          ? { ...applicant, isExpanded: !applicant.isExpanded }
          : applicant
      )
    );
  };

  const handleOpenVideo = (videoUrl: string | null) => {
    if (videoUrl) {
      setSelectedVideo(videoUrl);
      setIsVideoModalOpen(true);
    }
  };

  const handleOpenProfile = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsProfileModalOpen(true);
  };

  const confirmTogglePause = async () => {
    const newStatus = "pausado";

    try {
      const response = await toggleOfferStatus(offerId, newStatus);
      if (response.success) {
        addNotification(response.message, "success");
        onClose();
      } else {
        addNotification(`Error: ${response.message}`, "error");
      }
    } catch (error) {
      console.error("Error al cambiar estado de la oferta:", error);
      addNotification("Error al cambiar estado de la oferta", "error");
    }
  };

  const handleSelectCandidate = async (
    postulationId: string,
    candidateName: string,
    candidateEmail: string,
    action: "NEXT" | "CONTRACT" = "NEXT"
  ) => {
    try {
      const response = await advancedStage(postulationId, currentStage, action);

      if (response.success) {
        if (currentStage === "PENDIENTE") {
          const emailResponse = await sendInterviewInvitation(
            candidateName,
            candidateEmail
          );

          if (emailResponse.success) {
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
            candidateEmail
          );

          if (emailResponse.success) {
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
          confirmTogglePause();
        } else {
          const emailResponse = await sendAdvanceNextStep(
            candidateName,
            candidateEmail
          );

          if (emailResponse.success) {
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

        onClose();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error selecting candidate", error);
      addNotification("Error selecting candidate", "error");
    }
  };

  const handleRejectCandidate = async (
    postulationId: string,
    candidateName: string,
    candidateEmail: string
  ) => {
    try {
      const response = await rejectStage(postulationId);

      if (response.success) {
        const emailResponse = await sendRejectionEmail(
          candidateName,
          candidateEmail
        );

        if (emailResponse.success) {
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

        onClose();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error selecting candidate", error);
      addNotification("Error selecting candidate", "error");
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
            {paginatedApplicants.length > 0 ? (
              paginatedApplicants.map((applicant) => (
                <div key={applicant.id} className="border-b border-[#E2E2E2]">
                  <div
                    className="px-4 py-3 flex items-center cursor-pointer"
                    onClick={() => toggleApplicant(applicant.id)}
                  >
                    {/* Chevron indicator */}
                    <div className="mr-2">
                      {applicant.isExpanded ? (
                        <ChevronUp size={20} className="text-[#0097B2]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#0097B2]" />
                      )}
                    </div>

                    {/* Applicant name */}
                    <div className="grid grid-cols-2 w-full">
                      <p className="text-lg font-medium mb-0">Name</p>
                      <p className="text-lg font-medium">{`${applicant.nombre} ${applicant.apellido}`}</p>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isLoading ? (
                    <ExpandContentSkeleton />
                  ) : (
                    applicant.isExpanded &&
                    currentStage && (
                      <div className="px-10 pb-4 space-y-4 bg-gray-50">
                        {applicant.id && (
                          <div className="grid grid-cols-2 w-full">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0097B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              <span className="text-gray-700 text-sm">
                                Profile
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenProfile(applicant.id)}
                              className="text-[#0097B2] font-medium text-sm text-start cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        )}
                        {applicant.videoPresentacion && (
                          <div className="grid grid-cols-2 w-full">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0097B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect
                                  x="1"
                                  y="5"
                                  width="15"
                                  height="14"
                                  rx="2"
                                  ry="2"
                                ></rect>
                              </svg>
                              <span className="text-gray-700 text-sm">
                                Video
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleOpenVideo(applicant.videoPresentacion)
                              }
                              className="text-[#0097B2] text-start font-medium text-sm cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        )}
                        {applicant.correo && (
                          <div className="grid grid-cols-2 w-full">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0097B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                              <span className="text-gray-700 text-sm">
                                Email
                              </span>
                            </div>
                            <span className="text-gray-600 text-sm">
                              {applicant.correo}
                            </span>
                          </div>
                        )}
                        {applicant.telefono && (
                          <div className="grid grid-cols-2 w-full">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0097B2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              <span className="text-gray-700 text-sm">
                                Phone
                              </span>
                            </div>
                            <span className="text-gray-600 text-sm">
                              {applicant.telefono}
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-2 w-full">
                          <div className="flex items-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0097B2"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span className="text-gray-700 text-sm font-medium">
                              Status
                            </span>
                          </div>
                          {currentStage === "PENDIENTE" && (
                            <div className="py-1 font-semibold  text-[#0097B2] text-xs rounded-md flex items-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              Verify Info
                            </div>
                          )}
                          {currentStage === "EN_EVALUACION" && (
                            <div className="py-1 font-semibold  text-blue-800 text-xs rounded-md flex items-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              In Evaluation
                            </div>
                          )}
                          {currentStage === "FINALISTA" && (
                            <div className="py-1 font-semibold  text-blue-800 text-xs rounded-md flex items-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              Finalist
                            </div>
                          )}
                          {currentStage === "ACEPTADA" && (
                            <div className="py-1  text-green-800 text-xs rounded-md flex items-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                              Contract
                            </div>
                          )}
                          {currentStage === "RECHAZADA" && (
                            <div className="py-1  text-red-800 text-xs rounded-md font-semibold  flex items-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                              Rejected
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 w-full">
                          <div className="flex items-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0097B2"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span className="text-gray-700 text-sm font-medium">
                              Actions
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {currentStage !== "ACEPTADA" &&
                              currentStage !== "RECHAZADA" && (
                                <>
                                  {currentStage !== "FINALISTA" && (
                                    <button
                                      className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleSelectCandidate(
                                          applicant.postulationId,
                                          `${applicant.nombre} ${applicant.apellido}`,
                                          applicant.correo,
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
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo
                                      )
                                    }
                                  >
                                    Reject
                                  </button>
                                  {(currentStage === "EN_EVALUACION" ||
                                    currentStage === "FINALISTA") && (
                                    <button
                                      className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#0097B2]/80 transition-colors cursor-pointer"
                                      onClick={() =>
                                        handleSelectCandidate(
                                          applicant.postulationId,
                                          `${applicant.nombre} ${applicant.apellido}`,
                                          applicant.correo,
                                          "CONTRACT"
                                        )
                                      }
                                    >
                                      Contract
                                    </button>
                                  )}
                                </>
                              )}
                            {(currentStage === "ACEPTADA" ||
                              currentStage === "RECHAZADA") && (
                              <div className="text-gray-400 text-xs">
                                No actions available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No hay aplicantes para esta oferta.
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
                  Postulantes para servicio de:{" "}
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
              {paginatedApplicants.length > 0 ? (
                <>
                  <div className="mb-4 text-gray-500 text-sm">
                    Total: {applicants.length} applicants | Showing page{" "}
                    {currentPage} of {totalPages}
                  </div>
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Nombre
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Perfil
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Video
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Teléfono
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedApplicants.map((applicant) => (
                        <tr
                          key={applicant.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                          onClick={() => {
                            if (!currentStage) {
                              setSelectedCandidateId(applicant.id);
                            }
                          }}
                        >
                          <td className="py-4 px-4 text-gray-700">
                            {`${applicant.nombre} ${applicant.apellido}`}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleOpenProfile(applicant.id)}
                              className="text-[#0097B2] hover:underline flex items-center text-sm font-medium cursor-pointer"
                            >
                              View profile
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-1"
                              >
                                <path
                                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="7"
                                  r="4"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            {applicant.videoPresentacion ? (
                              <button
                                onClick={() =>
                                  handleOpenVideo(applicant.videoPresentacion)
                                }
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
                                  <path
                                    d="M23 7L16 12L23 17V7Z"
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
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Not available
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-[#0097B2] mr-2"
                              >
                                <path
                                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <polyline
                                  points="22,6 12,13 2,6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-gray-700 text-sm">
                                {applicant.correo}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-[#0097B2] mr-2"
                              >
                                <path
                                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-gray-700 text-sm">
                                {applicant.telefono}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {applicant.id === selectedCandidateId &&
                            !isLoading ? (
                              <>
                                {currentStage === "PENDIENTE" && (
                                  <div className="py-1 font-semibold text-[#0097B2] text-xs rounded-md flex items-center">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Verify Info
                                  </div>
                                )}
                                {currentStage === "EN_EVALUACION" && (
                                  <div className="py-1 font-semibold text-blue-800 text-xs rounded-md flex items-center">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    In Evaluation
                                  </div>
                                )}
                                {currentStage === "FINALISTA" && (
                                  <div className="py-1 font-semibold text-blue-800 text-xs rounded-md flex items-center">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Finalist
                                  </div>
                                )}
                                {currentStage === "ACEPTADA" && (
                                  <div className="py-1 text-green-800 text-xs rounded-md flex items-center">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    Contract
                                  </div>
                                )}
                                {currentStage === "RECHAZADA" && (
                                  <div className="py-1 text-red-800 text-xs rounded-md font-semibold flex items-center">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line
                                        x1="15"
                                        y1="9"
                                        x2="9"
                                        y2="15"
                                      ></line>
                                      <line
                                        x1="9"
                                        y1="9"
                                        x2="15"
                                        y2="15"
                                      ></line>
                                    </svg>
                                    Rejected
                                  </div>
                                )}
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  setSelectedCandidateId(applicant.id)
                                }
                                className="text-xs text-[#0097B2] underline cursor-pointer"
                              >
                                Ver status
                              </button>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {applicant.id === selectedCandidateId &&
                            !isLoading &&
                            currentStage ? (
                              <div className="flex space-x-2">
                                {currentStage !== "ACEPTADA" &&
                                  currentStage !== "RECHAZADA" && (
                                    <>
                                      {currentStage !== "FINALISTA" && (
                                        <button
                                          className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors cursor-pointer"
                                          onClick={() =>
                                            handleSelectCandidate(
                                              applicant.postulationId,
                                              `${applicant.nombre} ${applicant.apellido}`,
                                              applicant.correo,
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
                                            `${applicant.nombre} ${applicant.apellido}`,
                                            applicant.correo
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                      {(currentStage === "EN_EVALUACION" ||
                                        currentStage === "FINALISTA") && (
                                        <button
                                          className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#0097B2]/80 transition-colors cursor-pointer"
                                          onClick={() =>
                                            handleSelectCandidate(
                                              applicant.postulationId,
                                              `${applicant.nombre} ${applicant.apellido}`,
                                              applicant.correo,
                                              "CONTRACT"
                                            )
                                          }
                                        >
                                          Contract
                                        </button>
                                      )}
                                    </>
                                  )}
                                {(currentStage === "ACEPTADA" ||
                                  currentStage === "RECHAZADA") && (
                                  <div className="text-gray-400 text-xs">
                                    No actions available
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setSelectedCandidateId(applicant.id)
                                }
                                className="text-xs text-[#0097B2] underline"
                              >
                                Ver acciones
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No hay aplicantes para esta oferta.
                </div>
              )}
            </div>

            {/* Paginación - solo mostrar si hay aplicantes */}
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

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={selectedVideo}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidateId={selectedCandidateId}
      />
    </>
  );
}
