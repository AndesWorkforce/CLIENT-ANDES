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
              "Candidato seleccionado y correo enviado exitosamente",
              "success"
            );
          } else {
            addNotification(
              "Candidato seleccionado pero hubo un error al enviar el correo",
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
              "Candidato contratado y correo enviado exitosamente",
              "success"
            );
          } else {
            addNotification(
              "Candidato contratado pero hubo un error al enviar el correo",
              "warning"
            );
          }
        } else {
          const emailResponse = await sendAdvanceNextStep(
            candidateName,
            candidateEmail
          );

          if (emailResponse.success) {
            addNotification(
              "Candidato avanzado y correo enviado exitosamente",
              "success"
            );
          } else {
            addNotification(
              "Candidato avanzado pero hubo un error al enviar el correo",
              "warning"
            );
          }
        }

        onClose();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al seleccionar el candidato", error);
      addNotification("Error al seleccionar el candidato", "error");
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
            "Candidato rechazado y correo enviado exitosamente",
            "success"
          );
        } else {
          addNotification(
            "Candidato rechazado pero hubo un error al enviar el correo",
            "warning"
          );
        }

        onClose();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al seleccionar el candidato", error);
      addNotification("Error al seleccionar el candidato", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div
          className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] flex flex-col"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          {/* Botón de cerrar en la esquina superior derecha */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          {/* Header con título */}
          <div className="p-4 border-b border-[#E2E2E2] text-start rounded-t-lg">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Postulantes para servicio de:
            </h3>
            <p className="text-[#0097B2] font-medium">{serviceTitle}</p>
          </div>

          {/* Lista de postulantes con scroll */}
          <div
            className="flex-1 overflow-y-auto rounded-b-lg"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#0097B2 #f3f4f6",
            }}
          >
            {applicants.map((applicant) => (
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
                    <p className="text-lg font-medium mb-0">Nombre</p>
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
                              Perfil
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenProfile(applicant.id)}
                            className="text-[#0097B2] font-medium text-sm text-start cursor-pointer"
                          >
                            Ver
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
                            <span className="text-gray-700 text-sm">Video</span>
                          </div>
                          <button
                            onClick={() =>
                              handleOpenVideo(applicant.videoPresentacion)
                            }
                            className="text-[#0097B2] text-start font-medium text-sm cursor-pointer"
                          >
                            Ver
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
                            <span className="text-gray-700 text-sm">Email</span>
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
                              Teléfono
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
                            En Evaluación
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
                            En Prueba
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
                            Contratado
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
                            Rechazado
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
            ))}
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
