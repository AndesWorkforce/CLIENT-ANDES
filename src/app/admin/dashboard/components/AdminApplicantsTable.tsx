import { X, User } from "lucide-react";
import { useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import { EstadoPostulacion } from "../types/application-status.types";
import ApplicantsTableSkeleton from "./ApplicantsTableSkeleton";
import { ApplicantsMobileCardSkeleton } from "./ApplicantsTableSkeleton";
import UpdateStatusModal from "./UpdateStatusModal";
import VideoModal from "./VideoModal";
import CandidateProfileModal from "./CandidateProfileModal";
import { CandidateProfileProvider } from "../context/CandidateProfileContext";

// Tipos para el sistema de stages
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

interface ExtendedApplicant {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  videoPresentacion?: string;
  postulationId: string;
  estadoPostulacion: EstadoPostulacion;
  serviceTitle: string;
  preferenciaEntrevista: boolean;
  isExpanded: boolean;
  lastRelevantPostulacion?: {
    id: string;
    estado: string;
    titulo: string;
    fecha: string;
  };
  perfilCompleto?: string;
  clasificacionGlobal?: string;
}

interface AdminApplicantsTableProps {
  applicants: ExtendedApplicant[];
  isLoadingApplicants: boolean;
  serviceTitle: string;
  currentPage: number;
  totalPages: number;
  selectedCandidates: Set<string>;
  interviewPreferences: Record<string, boolean>;
  preferencesEstablished: Record<string, boolean>;
  onSelectCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStage: EstadoPostulacion,
    action?: "NEXT" | "CONTRACT"
  ) => void;
  onRejectCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => void;
  onCandidateSelection: (candidateId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onRemoveSelected: () => void;
  onGoToNextPage: () => void;
  onGoToPreviousPage: () => void;
  onGoToPage: (page: number) => void;
}

export default function AdminApplicantsTable({
  applicants,
  isLoadingApplicants,
  serviceTitle,
  currentPage,
  totalPages,
  selectedCandidates,
  interviewPreferences,
  preferencesEstablished,
  onSelectCandidate,
  onRejectCandidate,
  onCandidateSelection,
  onSelectAll,
  onRemoveSelected,
  onGoToNextPage,
  onGoToPreviousPage,
  onGoToPage,
}: AdminApplicantsTableProps) {
  const { addNotification } = useNotificationStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedStatusUpdate, setSelectedStatusUpdate] = useState<{
    postulacionId: string;
    candidatoId: string;
    currentStatus: EstadoPostulacion;
    candidatoName: string;
  } | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedApplicant, setSelectedApplicant] =
    useState<ExtendedApplicant | null>(null);
  const [isCandidateProfileModalOpen, setIsCandidateProfileModalOpen] =
    useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  console.log(selectedApplicant);
  // Función para renderizar Stage Status
  const renderStageStatus = (applicant: ExtendedApplicant): StageStatus => {
    if (applicant.clasificacionGlobal === "BLACKLIST") {
      return "BLACKLIST";
    }

    const perfilCompleto = applicant.perfilCompleto;
    if (
      perfilCompleto === "INCOMPLETO" ||
      perfilCompleto === "PENDIENTE_VALIDACION"
    ) {
      return "PROFILE_INCOMPLETE";
    }

    const estado = applicant.estadoPostulacion;
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
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
            Available
          </span>
        );
      case "FIRST_INTERVIEW_PENDING":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            First Interview
          </span>
        );
      case "FIRST_INTERVIEW_COMPLETED":
        return (
          <span className="px-2 py-1 bg-blue-200 text-blue-900 text-xs rounded-full">
            First Interview Completed
          </span>
        );
      case "SECOND_INTERVIEW_PENDING":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Second Interview
          </span>
        );
      case "SECOND_INTERVIEW_COMPLETED":
        return (
          <span className="px-2 py-1 bg-purple-200 text-purple-900 text-xs rounded-full">
            Second Interview Completed
          </span>
        );
      case "FINALIST":
        return (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            Finalist
          </span>
        );
      case "HIRED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Hired
          </span>
        );
      case "TERMINATED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
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
    applicant: ExtendedApplicant
  ) => {
    const canUpdate = stage !== "PROFILE_INCOMPLETE" && stage !== "BLACKLIST";

    const badgeElement = renderStageStatusBadge(stage);

    if (canUpdate) {
      return (
        <button
          onClick={() => handleOpenUpdateStatusModal(applicant)}
          className="transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
        >
          {badgeElement}
        </button>
      );
    }

    return badgeElement;
  };

  const handleOpenUpdateStatusModal = (applicant: ExtendedApplicant) => {
    setSelectedStatusUpdate({
      postulacionId: applicant.postulationId,
      candidatoId: applicant.id,
      currentStatus: applicant.estadoPostulacion,
      candidatoName: applicant.nombre || "Candidate",
    });
    setIsUpdateStatusModalOpen(true);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalOpen(false);
    setSelectedStatusUpdate(null);
  };

  const handleStatusUpdated = () => {
    addNotification("Application status updated successfully", "success");
    handleCloseUpdateStatusModal();
  };

  const handleViewVideo = (applicant: ExtendedApplicant) => {
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

  return (
    <>
      {/* View Mobile */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
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
            {applicants.length > 0 && (
              <button
                onClick={() =>
                  onSelectAll(selectedCandidates.size !== applicants.length)
                }
                className="text-xs text-[#0097B2] hover:underline mt-1"
              >
                {selectedCandidates.size === applicants.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
          </div>
          {selectedCandidates.size > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-3 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <X size={14} />
              Remove ({selectedCandidates.size})
            </button>
          )}
        </div>

        <div className="space-y-4">
          {isLoadingApplicants ? (
            <ApplicantsMobileCardSkeleton />
          ) : applicants.length > 0 ? (
            applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.has(applicant.id)}
                      onChange={(e) =>
                        onCandidateSelection(applicant.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                    />
                    <div>
                      <p className="text-gray-900 text-sm font-medium">
                        {`${applicant.nombre} ${applicant.apellido}`}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {renderClickableStageStatusBadge(
                          renderStageStatus(applicant),
                          applicant
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-700 text-sm">Profile</p>
                    <button
                      onClick={() => {
                        setSelectedCandidateId(applicant.id);
                        setIsCandidateProfileModalOpen(true);
                      }}
                      className="text-[#0097B2] text-sm cursor-pointer flex items-center"
                    >
                      View profile
                      <User size={16} className="ml-1" />
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">Video</p>
                    <button
                      onClick={() => handleViewVideo(applicant)}
                      className="text-[#0097B2] text-sm cursor-pointer"
                    >
                      View video
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-700 text-sm">Email</p>
                    <p className="text-gray-900 text-sm">{applicant.correo}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">Phone</p>
                    <p className="text-gray-900 text-sm">
                      {applicant.telefono}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-700 text-sm">
                      Interview Preference
                    </p>
                    {interviewPreferences[applicant.id] === true ? (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Yes
                      </span>
                    ) : interviewPreferences[applicant.id] === false ? (
                      <span className="text-orange-600 text-sm font-medium">
                        ✗ No
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Not set</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      First Interview:
                    </span>
                    {applicant.estadoPostulacion === "PENDIENTE" ? (
                      <button
                        className="px-2 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors"
                        onClick={() =>
                          onSelectCandidate(
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
                    ) : [
                        "EN_EVALUACION",
                        "PRIMERA_ENTREVISTA_REALIZADA",
                        "EN_EVALUACION_CLIENTE",
                        "SEGUNDA_ENTREVISTA_REALIZADA",
                        "FINALISTA",
                        "ACEPTADA",
                      ].includes(applicant.estadoPostulacion) ? (
                      <div className="text-green-600 text-xs font-medium">
                        ✓ Done
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs">N/A</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      Second Interview:
                    </span>
                    {applicant.estadoPostulacion === "EN_EVALUACION" ? (
                      <button
                        className="px-2 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors"
                        onClick={() =>
                          onSelectCandidate(
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
                      "PRIMERA_ENTREVISTA_REALIZADA" ? (
                      <button
                        className="px-2 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                        onClick={() =>
                          onSelectCandidate(
                            applicant.postulationId,
                            applicant.id,
                            `${applicant.nombre} ${applicant.apellido}`,
                            applicant.correo,
                            "PRIMERA_ENTREVISTA_REALIZADA",
                            "NEXT"
                          )
                        }
                      >
                        Schedule
                      </button>
                    ) : applicant.estadoPostulacion ===
                      "EN_EVALUACION_CLIENTE" ? (
                      <button
                        className="px-2 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                        onClick={() =>
                          onSelectCandidate(
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
                    ) : [
                        "SEGUNDA_ENTREVISTA_REALIZADA",
                        "FINALISTA",
                        "ACEPTADA",
                      ].includes(applicant.estadoPostulacion) ? (
                      <div className="text-green-600 text-xs font-medium">
                        ✓ Done
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs">N/A</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Hiring:</span>
                    {applicant.estadoPostulacion === "FINALISTA" ? (
                      <button
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                        onClick={() =>
                          onSelectCandidate(
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
                    ) : applicant.estadoPostulacion !== "RECHAZADA" ? (
                      <button
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                        onClick={() =>
                          onSelectCandidate(
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
                    ) : (
                      <div className="text-gray-400 text-xs">N/A</div>
                    )}
                  </div>

                  {applicant.estadoPostulacion !== "ACEPTADA" &&
                    applicant.estadoPostulacion !== "RECHAZADA" && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Rejection:
                        </span>
                        <button
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                          onClick={() =>
                            onRejectCandidate(
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

                  {applicant.estadoPostulacion === "RECHAZADA" && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Status:</span>
                      <div className="text-red-600 text-xs font-medium">
                        ✗ Rejected
                      </div>
                    </div>
                  )}
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
      <div className="hidden md:block">
        {isLoadingApplicants ? (
          <ApplicantsTableSkeleton />
        ) : applicants.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-500 text-sm">
                Total: {applicants.length} applicants | Showing page{" "}
                {currentPage} of {totalPages}
              </div>
              {selectedCandidates.size > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Remove ({selectedCandidates.size})
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-20rem)]">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={
                          selectedCandidates.size === applicants.length &&
                          applicants.length > 0
                        }
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Profile
                    </th>
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
                      Stage
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Interview Preference
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
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.has(applicant.id)}
                          onChange={(e) =>
                            onCandidateSelection(applicant.id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                        />
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {`${applicant.nombre} ${applicant.apellido}`}
                      </td>
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
                          className="text-[#0097B2] hover:underline text-sm font-medium cursor-pointer"
                        >
                          View video
                        </button>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {applicant.correo}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {applicant.telefono}
                      </td>
                      <td className="py-4 px-4">
                        {renderClickableStageStatusBadge(
                          renderStageStatus(applicant),
                          applicant
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {interviewPreferences[applicant.id] === true ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-sm font-medium">
                              ✓ Yes
                            </span>
                            {preferencesEstablished[applicant.id] && (
                              <span className="text-xs text-gray-500">
                                (Set)
                              </span>
                            )}
                          </div>
                        ) : interviewPreferences[applicant.id] === false ? (
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600 text-sm font-medium">
                              ✗ No
                            </span>
                            {preferencesEstablished[applicant.id] && (
                              <span className="text-xs text-gray-500">
                                (Set)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not set</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {applicant.estadoPostulacion === "PENDIENTE" ? (
                          <button
                            className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors"
                            onClick={() =>
                              onSelectCandidate(
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
                        ) : [
                            "EN_EVALUACION",
                            "PRIMERA_ENTREVISTA_REALIZADA",
                            "EN_EVALUACION_CLIENTE",
                            "SEGUNDA_ENTREVISTA_REALIZADA",
                            "FINALISTA",
                            "ACEPTADA",
                          ].includes(applicant.estadoPostulacion) ? (
                          <div className="text-green-600 text-xs font-medium">
                            ✓ Done
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs">N/A</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {applicant.estadoPostulacion === "EN_EVALUACION" ? (
                          <button
                            className="px-3 py-1 bg-[#0097B2] text-white text-xs rounded-md hover:bg-[#007a8f] transition-colors"
                            onClick={() =>
                              onSelectCandidate(
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
                          "PRIMERA_ENTREVISTA_REALIZADA" ? (
                          <button
                            className="px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                            onClick={() =>
                              onSelectCandidate(
                                applicant.postulationId,
                                applicant.id,
                                `${applicant.nombre} ${applicant.apellido}`,
                                applicant.correo,
                                "PRIMERA_ENTREVISTA_REALIZADA",
                                "NEXT"
                              )
                            }
                          >
                            Schedule
                          </button>
                        ) : applicant.estadoPostulacion ===
                          "EN_EVALUACION_CLIENTE" ? (
                          <button
                            className="px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                            onClick={() =>
                              onSelectCandidate(
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
                        ) : [
                            "SEGUNDA_ENTREVISTA_REALIZADA",
                            "FINALISTA",
                            "ACEPTADA",
                          ].includes(applicant.estadoPostulacion) ? (
                          <div className="text-green-600 text-xs font-medium">
                            ✓ Done
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs">N/A</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {applicant.estadoPostulacion === "FINALISTA" ? (
                          <button
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                            onClick={() =>
                              onSelectCandidate(
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
                        ) : applicant.estadoPostulacion !== "RECHAZADA" ? (
                          <button
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                            onClick={() =>
                              onSelectCandidate(
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
                        ) : (
                          <div className="text-gray-400 text-xs">N/A</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {applicant.estadoPostulacion !== "ACEPTADA" &&
                        applicant.estadoPostulacion !== "RECHAZADA" ? (
                          <button
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors"
                            onClick={() =>
                              onRejectCandidate(
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 p-4 flex justify-center mt-4">
                <div className="inline-flex border border-gray-300 rounded-md">
                  <button
                    className={`px-3 py-1 text-[#0097B2] border-r border-gray-300 ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={onGoToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 ${
                        currentPage === index + 1
                          ? "text-white bg-[#0097B2]"
                          : "text-[#0097B2] hover:bg-gray-50"
                      }`}
                      onClick={() => onGoToPage(index + 1)}
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
                    onClick={onGoToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            There are no applicants for this offer.
          </div>
        )}
      </div>

      {/* Modals */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={selectedVideo}
      />

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
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    onRemoveSelected();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Remove {selectedCandidates.size} Candidate(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de actualización de estado */}
      {isUpdateStatusModalOpen && selectedStatusUpdate && (
        <UpdateStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={handleCloseUpdateStatusModal}
          postulacionId={selectedStatusUpdate.postulacionId}
          candidatoId={selectedStatusUpdate.candidatoId}
          currentStatus={selectedStatusUpdate.currentStatus}
          candidatoName={selectedStatusUpdate.candidatoName}
          applicant={selectedApplicant} // Pass the selected applicant
          onUpdate={handleStatusUpdated}
        />
      )}
    </>
  );
}
