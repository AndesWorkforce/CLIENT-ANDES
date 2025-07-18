import { X, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Candidato } from "@/app/types/offers";
import { useNotificationStore } from "@/store/notifications.store";
import {
  advancedStage,
  currentStageStatus,
  rejectStage,
  directStageJump,
} from "../actions/stage.actions";
import { useAuthStore } from "@/store/auth.store";
import {
  sendContractJobEmail,
  sendInterviewInvitation,
  sendRejectionEmail,
  sendAdvanceNextStep,
} from "../actions/sendEmail.actions";
import { useRouter } from "next/navigation";
import { removeMultipleApplications } from "../actions/applicants.actions";
import { updateInterviewPreference } from "../actions/applicants.actions";
import { EstadoPostulacion } from "../types/application-status.types";
import VideoModal from "./VideoModal";
import CandidateProfileModal from "./CandidateProfileModal";
import { CandidateProfileProvider } from "../context/CandidateProfileContext";
import UpdateStatusModal from "./UpdateStatusModal";
import ApplicantsTableSkeleton from "./ApplicantsTableSkeleton";
import TableSkeleton from "./TableSkeleton";

// Definir StageStatus aquí
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

interface CandidatoWithPostulationId extends Candidato {
  postulationId: string;
  estadoPostulacion: EstadoPostulacion;
  serviceTitle: string;
  preferenciaEntrevista: boolean;
}

interface ExtendedApplicant extends CandidatoWithPostulationId {
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

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  applicants: CandidatoWithPostulationId[];
  onUpdate?: () => void;
  disableStatusChange?: boolean; // Nuevo prop para deshabilitar el cambio de estado
}

// Tabla para usuarios Admin
const AdminApplicantsTable = ({
  applicants,
  selectedCandidates,
  handleSelectAll,
  handleCandidateSelection,
  setSelectedCandidateId,
  setIsCandidateProfileModalOpen,
  handleViewVideo,
  renderClickableStageStatusBadge,
  renderStageStatus,
  interviewPreferences,
  preferencesEstablished,
  handleFirstInterview,
  handleSecondInterview,
  handleHireCandidate,
  handleRejectCandidate,
  isActionLoading,
  currentPage,
  totalPages,
}: {
  applicants: ExtendedApplicant[];
  selectedCandidates: Set<string>;
  handleSelectAll: (checked: boolean) => void;
  handleCandidateSelection: (id: string, checked: boolean) => void;
  setSelectedCandidateId: (id: string) => void;
  setIsCandidateProfileModalOpen: (open: boolean) => void;
  handleViewVideo: (applicant: ExtendedApplicant) => void;
  renderClickableStageStatusBadge: (
    stage: StageStatus,
    applicant: ExtendedApplicant
  ) => React.ReactElement;
  renderStageStatus: (applicant: ExtendedApplicant) => StageStatus;
  interviewPreferences: Record<string, boolean>;
  preferencesEstablished: Record<string, boolean>;
  handleSelectCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion,
    action?: "NEXT" | "CONTRACT"
  ) => Promise<void>;
  handleFirstInterview: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion
  ) => Promise<void>;
  handleSecondInterview: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion
  ) => Promise<void>;
  handleHireCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion
  ) => Promise<void>;
  handleRejectCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => void;
  isActionLoading: (
    postulationId: string,
    action: "hiring" | "rejecting" | "advancing"
  ) => boolean;
  currentPage: number;
  totalPages: number;
}) => (
  <>
    <div className="mb-4 text-gray-500 text-sm">
      Total: {applicants.length} applicants | Showing page {currentPage} of{" "}
      {totalPages}
    </div>
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
              onChange={(e) => handleSelectAll(e.target.checked)}
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
                  handleCandidateSelection(applicant.id, e.target.checked)
                }
                className="rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
              />
            </td>
            <td className="py-4 px-4 text-gray-700">{`${applicant.nombre} ${applicant.apellido}`}</td>
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
            <td className="py-4 px-4 text-gray-700">{applicant.correo}</td>
            <td className="py-4 px-4 text-gray-700">{applicant.telefono}</td>
            <td className="py-4 px-4 text-gray-700">
              <div className="flex flex-col">
                {renderClickableStageStatusBadge(
                  renderStageStatus(applicant),
                  applicant
                )}
              </div>
            </td>
            <td className="py-4 px-4">
              {(() => {
                const preference = interviewPreferences[applicant.id];
                const established = preferencesEstablished[applicant.id];

                if (preference === true) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Yes
                      </span>
                      {established && (
                        <span className="text-xs text-gray-500">(Set)</span>
                      )}
                    </div>
                  );
                } else if (preference === false) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 text-sm font-medium">
                        ✗ No
                      </span>
                      {established && (
                        <span className="text-xs text-gray-500">(Set)</span>
                      )}
                    </div>
                  );
                } else {
                  return <span className="text-gray-400 text-sm">Not set</span>;
                }
              })()}
            </td>
            <td className="py-4 px-4">
              {applicant.estadoPostulacion === "PENDIENTE" ? (
                <button
                  className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                    isActionLoading(applicant.id, "advancing")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
                  }`}
                  onClick={() =>
                    handleFirstInterview(
                      applicant.postulationId,
                      applicant.id,
                      `${applicant.nombre} ${applicant.apellido}`,
                      applicant.correo,
                      applicant.estadoPostulacion
                    )
                  }
                  disabled={isActionLoading(applicant.id, "advancing")}
                >
                  {isActionLoading(applicant.id, "advancing")
                    ? "Sending..."
                    : "Send"}
                </button>
              ) : [
                  "EN_EVALUACION",
                  "PRIMERA_ENTREVISTA_REALIZADA",
                  "EN_EVALUACION_CLIENTE",
                  "SEGUNDA_ENTREVISTA_REALIZADA",
                  "FINALISTA",
                  "ACEPTADA",
                ].includes(applicant.estadoPostulacion) ? (
                <div className="text-green-600 text-xs font-medium">✓ Done</div>
              ) : (
                <div className="text-gray-400 text-xs">N/A</div>
              )}
            </td>
            <td className="py-4 px-4">
              {/* Second Interview: habilitado si está en EN_EVALUACION o PRIMERA_ENTREVISTA_REALIZADA y la preferencia es Yes */}
              {(applicant.estadoPostulacion === "EN_EVALUACION" ||
                applicant.estadoPostulacion ===
                  "PRIMERA_ENTREVISTA_REALIZADA") &&
              interviewPreferences[applicant.id] === true ? (
                <button
                  className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                    isActionLoading(applicant.id, "advancing")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
                  }`}
                  onClick={() =>
                    handleSecondInterview(
                      applicant.postulationId,
                      applicant.id,
                      `${applicant.nombre} ${applicant.apellido}`,
                      applicant.correo,
                      applicant.estadoPostulacion
                    )
                  }
                  disabled={isActionLoading(applicant.id, "advancing")}
                >
                  {isActionLoading(applicant.id, "advancing")
                    ? "Sending..."
                    : "Send"}
                </button>
              ) : [
                  "EN_EVALUACION_CLIENTE",
                  "SEGUNDA_ENTREVISTA_REALIZADA",
                  "FINALISTA",
                  "ACEPTADA",
                ].includes(applicant.estadoPostulacion) ? (
                <div className="text-green-600 text-xs font-medium">✓ Done</div>
              ) : (
                <div className="text-gray-400 text-xs">N/A</div>
              )}
            </td>
            <td className="py-4 px-4">
              {applicant.estadoPostulacion === "FINALISTA" ? (
                <button
                  className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                    isActionLoading(applicant.id, "hiring")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                  }`}
                  onClick={() =>
                    handleHireCandidate(
                      applicant.postulationId,
                      applicant.id,
                      `${applicant.nombre} ${applicant.apellido}`,
                      applicant.correo,
                      applicant.estadoPostulacion
                    )
                  }
                  disabled={isActionLoading(applicant.id, "hiring")}
                >
                  {isActionLoading(applicant.id, "hiring")
                    ? "Hiring..."
                    : "Hire"}
                </button>
              ) : applicant.estadoPostulacion !== "ACEPTADA" &&
                applicant.estadoPostulacion !== "RECHAZADA" ? (
                <button
                  className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                    isActionLoading(applicant.id, "hiring")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                  }`}
                  onClick={() =>
                    handleHireCandidate(
                      applicant.postulationId,
                      applicant.id,
                      `${applicant.nombre} ${applicant.apellido}`,
                      applicant.correo,
                      applicant.estadoPostulacion
                    )
                  }
                  disabled={isActionLoading(applicant.id, "hiring")}
                >
                  {isActionLoading(applicant.id, "hiring")
                    ? "Hiring..."
                    : "Hire"}
                </button>
              ) : applicant.estadoPostulacion === "ACEPTADA" ? (
                <div className="text-green-600 text-xs font-medium">
                  ✓ Hired
                </div>
              ) : (
                <div className="text-gray-400 text-xs">N/A</div>
              )}
            </td>
            <td className="py-4 px-4">
              {/* Admin puede rechazar cualquier candidato, excepto los ya rechazados */}
              {applicant.estadoPostulacion !== "RECHAZADA" ? (
                <button
                  className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                    isActionLoading(applicant.id, "rejecting")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 cursor-pointer"
                  }`}
                  onClick={() =>
                    handleRejectCandidate(
                      applicant.postulationId,
                      applicant.id,
                      `${applicant.nombre} ${applicant.apellido}`,
                      applicant.correo
                    )
                  }
                  disabled={isActionLoading(applicant.id, "rejecting")}
                >
                  {isActionLoading(applicant.id, "rejecting")
                    ? "Rejecting..."
                    : "Reject"}
                </button>
              ) : (
                <div className="text-red-600 text-xs font-medium">
                  ✗ Rejected
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

// Tabla para usuarios Company
const CompanyApplicantsTable = ({
  applicants,
  setSelectedCandidateId,
  setIsCandidateProfileModalOpen,
  renderClickableStageStatusBadge,
  renderStageStatus,
  interviewPreferences,
  preferencesEstablished,
  handleInterviewPreferenceChange,
  handleHireCandidate,
  handleRejectCandidate,
  isActionLoading,
  currentPage,
  totalPages,
}: {
  applicants: ExtendedApplicant[];
  setSelectedCandidateId: (id: string) => void;
  setIsCandidateProfileModalOpen: (open: boolean) => void;
  renderClickableStageStatusBadge: (
    stage: StageStatus,
    applicant: ExtendedApplicant
  ) => React.ReactElement;
  renderStageStatus: (applicant: ExtendedApplicant) => StageStatus;
  interviewPreferences: Record<string, boolean>;
  preferencesEstablished: Record<string, boolean>;
  handleInterviewPreferenceChange: (
    applicantId: string,
    preference: boolean
  ) => void;
  handleSelectCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion,
    action?: "NEXT" | "CONTRACT"
  ) => Promise<void>;
  handleFirstInterview: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion
  ) => Promise<void>;
  handleSecondInterview: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion
  ) => Promise<void>;
  handleHireCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStatus: EstadoPostulacion
  ) => Promise<void>;
  handleRejectCandidate: (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => void;
  isActionLoading: (
    postulationId: string,
    action: "hiring" | "rejecting" | "advancing"
  ) => boolean;
  currentPage: number;
  totalPages: number;
}) => (
  <>
    <div className="mb-4 text-gray-500 text-sm">
      Total: {applicants.length} applicants | Showing page {currentPage} of{" "}
      {totalPages}
    </div>
    <table className="w-full border-collapse">
      <thead className="sticky top-0 bg-white z-10">
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Name
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Profile
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Stage
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Schedule Interview?
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Second Interview
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
            <td className="py-4 px-4 text-gray-700">{`${applicant.nombre} ${applicant.apellido}`}</td>
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
            <td className="py-4 px-4 text-gray-700">
              <div className="flex flex-col">
                {renderClickableStageStatusBadge(
                  renderStageStatus(applicant),
                  applicant
                )}
              </div>
            </td>
            <td className="py-4 px-4">
              {preferencesEstablished[applicant.id] ? (
                // Si ya está establecida, solo mostrar el texto
                <div className="flex items-center gap-2">
                  {interviewPreferences[applicant.id] === true ? (
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Yes
                    </span>
                  ) : (
                    <span className="text-orange-600 text-sm font-medium">
                      ✗ No
                    </span>
                  )}
                  <span className="text-xs text-gray-500">(Set)</span>
                </div>
              ) : (
                // Si no está establecida, mostrar los radio buttons
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`interview-${applicant.id}`}
                      checked={interviewPreferences[applicant.id] === true}
                      onChange={() =>
                        handleInterviewPreferenceChange(applicant.id, true)
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`interview-${applicant.id}`}
                      checked={interviewPreferences[applicant.id] === false}
                      onChange={() =>
                        handleInterviewPreferenceChange(applicant.id, false)
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              )}
            </td>
            <td className="py-4 px-4">
              <div className="text-gray-400 text-xs">
                {/* Para clientes (company): pueden hacer Hire desde varios estados para mover a FINALISTA */}
                {applicant.estadoPostulacion === "PENDIENTE" ||
                applicant.estadoPostulacion === "EN_EVALUACION" ||
                applicant.estadoPostulacion ===
                  "PRIMERA_ENTREVISTA_REALIZADA" ||
                applicant.estadoPostulacion === "EN_EVALUACION_CLIENTE" ||
                applicant.estadoPostulacion ===
                  "SEGUNDA_ENTREVISTA_REALIZADA" ? (
                  <button
                    className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                      isActionLoading(applicant.id, "hiring")
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 cursor-pointer"
                    }`}
                    onClick={() =>
                      handleHireCandidate(
                        applicant.postulationId,
                        applicant.id,
                        `${applicant.nombre} ${applicant.apellido}`,
                        applicant.correo,
                        applicant.estadoPostulacion
                      )
                    }
                    disabled={isActionLoading(applicant.id, "hiring")}
                  >
                    {isActionLoading(applicant.id, "hiring")
                      ? "Hiring..."
                      : "Hire"}
                  </button>
                ) : applicant.estadoPostulacion === "FINALISTA" ? (
                  <div className="text-blue-600 text-xs font-medium">
                    ✓ Approved
                  </div>
                ) : applicant.estadoPostulacion === "ACEPTADA" ? (
                  <div className="text-green-600 text-xs font-medium">
                    ✓ Hired
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">N/A</div>
                )}
              </div>
            </td>
            <td className="py-4 px-4">
              {/* No se puede rechazar si ya está aprobado (FINALISTA) o contratado (ACEPTADA) */}
              {applicant.estadoPostulacion !== "RECHAZADA" &&
              applicant.estadoPostulacion !== "ACEPTADA" &&
              applicant.estadoPostulacion !== "FINALISTA" ? (
                <button
                  className={`px-3 py-1 text-white text-xs rounded-md transition-colors ${
                    isActionLoading(applicant.id, "rejecting")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 cursor-pointer"
                  }`}
                  onClick={() =>
                    handleRejectCandidate(
                      applicant.postulationId,
                      applicant.id,
                      `${applicant.nombre} ${applicant.apellido}`,
                      applicant.correo
                    )
                  }
                  disabled={isActionLoading(applicant.id, "rejecting")}
                >
                  {isActionLoading(applicant.id, "rejecting")
                    ? "Rejecting..."
                    : "Reject"}
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
);

export default function ApplicantsModal({
  isOpen,
  onClose,
  serviceTitle,
  applicants: initialApplicants,
  onUpdate,
  disableStatusChange = false, // Valor por defecto es false
}: ApplicantsModalProps) {
  console.log("\n\n\n [ApplicantsModal] onUpdate", onUpdate, "\n\n\n");
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  const isCompanyUser =
    user?.rol === "EMPRESA" || user?.rol === "EMPLEADO_EMPRESA";
  const [applicants, setApplicants] = useState<ExtendedApplicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  // Estados de loading para acciones específicas
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: "hiring" | "rejecting" | "advancing" | null;
  }>({});

  // Helper functions para manejar loading states
  const setActionLoading = (
    candidateId: string,
    action: "hiring" | "rejecting" | "advancing" | null
  ) => {
    setLoadingActions((prev) => ({
      ...prev,
      [candidateId]: action,
    }));
  };

  const isActionLoading = (
    candidateId: string,
    action: "hiring" | "rejecting" | "advancing"
  ) => {
    return loadingActions[candidateId] === action;
  };

  // Estados para el modal de actualización de estado
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [selectedStatusUpdate, setSelectedStatusUpdate] = useState<{
    postulacionId: string;
    candidatoId: string;
    currentStatus: EstadoPostulacion;
    candidatoName: string;
  } | null>(null);

  // Función para renderizar Stage Status (igual que en postulants)
  const renderStageStatus = (applicant: ExtendedApplicant): StageStatus => {
    // 1. Verificar si el usuario está en blacklist
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

    // 3. Basarse en el estado de la postulación
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
          <span className="px-2 py-1 text-gray-800 text-xs rounded-full">
            Profile Incomplete
          </span>
        );
      case "AVAILABLE":
        return (
          <span className="px-2 py-1 text-emerald-800 text-xs rounded-full">
            Available
          </span>
        );
      case "FIRST_INTERVIEW_PENDING":
        return (
          <span className="px-2 py-1  text-blue-800 text-xs rounded-full">
            First Interview
          </span>
        );
      case "FIRST_INTERVIEW_COMPLETED":
        return (
          <span className="px-2 py-1  text-blue-900 text-xs rounded-full">
            First Interview Completed
          </span>
        );
      case "SECOND_INTERVIEW_PENDING":
        return (
          <span className="px-2 py-1  text-purple-800 text-xs rounded-full">
            Second Interview
          </span>
        );
      case "SECOND_INTERVIEW_COMPLETED":
        return (
          <span className="px-2 py-1  text-purple-900 text-xs rounded-full">
            Second Interview Completed
          </span>
        );
      case "FINALIST":
        return (
          <span className="px-2 py-1  text-indigo-800 text-xs rounded-full">
            Finalist
          </span>
        );
      case "HIRED":
        return (
          <span className="px-2 py-1  text-green-800 text-xs rounded-full">
            Hired
          </span>
        );
      case "TERMINATED":
        return (
          <span className="px-2 py-1  text-red-800 text-xs rounded-full">
            Terminated
          </span>
        );
      case "BLACKLIST":
        return (
          <span className="px-2 py-1  text-red-800 text-xs rounded-full">
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
    const canUpdate =
      stage !== "PROFILE_INCOMPLETE" &&
      stage !== "BLACKLIST" &&
      !disableStatusChange &&
      !isCompanyUser; // ✅ Los usuarios company (clientes) no pueden modificar estados

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
    // Recargar los datos después de actualizar el estado
    if (isOpen && initialApplicants.length > 0) {
      loadStages();
    }
    addNotification("Application status updated successfully", "success");
  };

  // Estado para manejar las selecciones de candidatos
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );

  // Estado para manejar las preferencias de entrevista
  const [interviewPreferences, setInterviewPreferences] = useState<
    Record<string, boolean>
  >({});

  // Estado para rastrear si la preferencia ya fue establecida (para evitar cambios constantes)
  const [preferencesEstablished, setPreferencesEstablished] = useState<
    Record<string, boolean>
  >({});

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
    ExtendedApplicant[]
  >([]);
  const APPLICANTS_PER_PAGE = 7;

  console.log(selectedApplicant, paginatedApplicants);
  console.log("🔍 [ApplicantsModal] Initial applicants:", applicants);

  // Function to paginate applicants
  const paginateApplicants = (
    applicants: ExtendedApplicant[],
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

  const loadStages = async () => {
    setIsLoadingApplicants(true);

    // Objetos para acumular las preferencias
    const newInterviewPreferences: Record<string, boolean> = {};
    const newPreferencesEstablished: Record<string, boolean> = {};

    // Primero, cargar las preferencias de entrevista desde los datos iniciales
    initialApplicants.forEach((applicant) => {
      console.log(
        `📝 [ApplicantsModal] Verificando preferencia para ${
          applicant.nombre
        }: ${
          applicant.preferenciaEntrevista
        } (tipo: ${typeof applicant.preferenciaEntrevista})`
      );

      if (
        applicant.preferenciaEntrevista !== null &&
        applicant.preferenciaEntrevista !== undefined
      ) {
        console.log(
          `📝 [ApplicantsModal] Cargando preferencia inicial para ${applicant.nombre}: ${applicant.preferenciaEntrevista}`
        );
        newInterviewPreferences[applicant.id] = applicant.preferenciaEntrevista;
        newPreferencesEstablished[applicant.id] = true;
      } else {
        console.log(
          `📝 [ApplicantsModal] No hay preferencia inicial para ${applicant.nombre} (valor: ${applicant.preferenciaEntrevista})`
        );
        // No establecemos nada en newInterviewPreferences, dejamos que sea undefined
        // para que se muestre "Not set"
      }
    });

    const updatedApplicants = await Promise.all(
      initialApplicants.map(async (applicant) => {
        try {
          const response = await currentStageStatus(
            applicant.postulationId,
            applicant.id
          );
          if (response.success && response.data?.estadoPostulacion) {
            console.log(
              `📝 [ApplicantsModal] Response completa para ${applicant.nombre}:`,
              response.data
            );

            return {
              ...applicant,
              isExpanded: false,
              estadoPostulacion: response.data
                .estadoPostulacion as EstadoPostulacion,
              lastRelevantPostulacion: {
                id: applicant.postulationId,
                estado: response.data.estadoPostulacion,
                titulo: serviceTitle,
                fecha: new Date().toISOString(),
              },
              perfilCompleto: "COMPLETO", // Asumimos que está completo si está aplicando
              clasificacionGlobal: "ACTIVE", // Asumimos que está activo
            };
          }
          return {
            ...applicant,
            isExpanded: false,
            lastRelevantPostulacion: {
              id: applicant.postulationId,
              estado: applicant.estadoPostulacion,
              titulo: serviceTitle,
              fecha: new Date().toISOString(),
            },
            perfilCompleto: "COMPLETO",
            clasificacionGlobal: "ACTIVE",
          };
        } catch (error) {
          console.error("Error loading stage for applicant:", error);
          return {
            ...applicant,
            isExpanded: false,
            lastRelevantPostulacion: {
              id: applicant.postulationId,
              estado: applicant.estadoPostulacion,
              titulo: serviceTitle,
              fecha: new Date().toISOString(),
            },
            perfilCompleto: "COMPLETO",
            clasificacionGlobal: "ACTIVE",
          };
        }
      })
    );

    // Actualizar estados al final
    setInterviewPreferences(newInterviewPreferences);
    setPreferencesEstablished(newPreferencesEstablished);

    // Para usuarios de empresa, filtrar candidatos rechazados SOLAMENTE
    // Los contratados (ACEPTADA) SÍ deben aparecer para que la empresa los vea
    const filteredApplicants = isCompanyUser
      ? updatedApplicants.filter(
          (applicant) => applicant.estadoPostulacion !== "RECHAZADA"
        )
      : updatedApplicants;

    console.log("🔍 [ApplicantsModal] Applicants filtering:", {
      isCompanyUser,
      originalCount: updatedApplicants.length,
      filteredCount: filteredApplicants.length,
      rejected: updatedApplicants.filter(
        (a) => a.estadoPostulacion === "RECHAZADA"
      ).length,
      hired: updatedApplicants.filter((a) => a.estadoPostulacion === "ACEPTADA")
        .length,
    });

    setApplicants(filteredApplicants);
    setIsLoadingApplicants(false);

    // Log para verificar el estado final
    console.log("📝 [ApplicantsModal] Estados finales después de cargar:");
    console.log("newInterviewPreferences:", newInterviewPreferences);
    console.log("newPreferencesEstablished:", newPreferencesEstablished);

    // Log específico para cada applicant
    filteredApplicants.forEach((applicant) => {
      console.log(
        `📝 [ApplicantsModal] ${applicant.nombre} - preferenciaEntrevista: ${
          applicant.preferenciaEntrevista
        } -> interviewPreferences[${applicant.id}]: ${
          newInterviewPreferences[applicant.id]
        } (${typeof newInterviewPreferences[applicant.id]})`
      );
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setInterviewPreferences({});
      setPreferencesEstablished({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialApplicants.length > 0) {
      loadStages();
    }
  }, [isOpen, serviceTitle]); // Cambié la dependencia para usar serviceTitle como identificador único

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Nueva función para contratar candidato que salta directamente al estado objetivo
  // Función para enviar candidato a First Interview
  const handleFirstInterview = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStage: EstadoPostulacion
  ) => {
    console.log("🚀 [handleFirstInterview] Enviando a primera entrevista:", {
      postulationId,
      candidateId,
      candidateName,
      candidateEmail,
      currentStage,
    });

    setIsLoading(true);
    try {
      // Actualizar estado a EN_EVALUACION
      const response = await directStageJump(
        postulationId,
        candidateId,
        "EN_EVALUACION"
      );

      if (response && response.success) {
        // Enviar email de invitación a entrevista
        const emailResponse = await sendInterviewInvitation(
          candidateName,
          candidateEmail
        );

        if (emailResponse && emailResponse.success) {
          addNotification(
            "First interview invitation sent successfully",
            "success"
          );
        } else {
          addNotification(
            "Stage updated but error sending interview invitation",
            "warning"
          );
        }

        // Actualizar lista de candidatos
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === candidateId
              ? { ...app, estadoPostulacion: "EN_EVALUACION" }
              : app
          )
        );

        if (onUpdate) {
          onUpdate();
        }
      } else {
        addNotification(
          response?.message || "Error updating candidate stage",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error in handleFirstInterview:", error);
      addNotification("Error processing first interview", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para enviar candidato a Second Interview
  const handleSecondInterview = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStage: EstadoPostulacion
  ) => {
    console.log("🚀 [handleSecondInterview] Enviando a segunda entrevista:", {
      postulationId,
      candidateId,
      candidateName,
      candidateEmail,
      currentStage,
    });

    setIsLoading(true);
    try {
      // Actualizar estado a EN_EVALUACION_CLIENTE
      const response = await directStageJump(
        postulationId,
        candidateId,
        "EN_EVALUACION_CLIENTE"
      );

      if (response && response.success) {
        // Enviar email de avance a siguiente etapa
        const emailResponse = await sendAdvanceNextStep(
          candidateName,
          candidateEmail
        );

        if (emailResponse && emailResponse.success) {
          addNotification(
            "Second interview invitation sent successfully",
            "success"
          );
        } else {
          addNotification(
            "Stage updated but error sending second interview invitation",
            "warning"
          );
        }

        // Actualizar lista de candidatos
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === candidateId
              ? { ...app, estadoPostulacion: "EN_EVALUACION_CLIENTE" }
              : app
          )
        );

        if (onUpdate) {
          onUpdate();
        }
      } else {
        addNotification(
          response?.message || "Error updating candidate stage",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error in handleSecondInterview:", error);
      addNotification("Error processing second interview", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para contratar candidato directamente
  const handleHireCandidate = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string,
    currentStage: EstadoPostulacion
  ) => {
    console.log("🚀 [handleHireCandidate] Contratando candidato:", {
      postulationId,
      candidateId,
      candidateName,
      candidateEmail,
      currentStage,
      serviceTitle,
      isCompanyUser,
    });

    // Evitar múltiples clicks
    if (isActionLoading(candidateId, "hiring")) {
      return;
    }

    setActionLoading(candidateId, "hiring");
    try {
      // Determinar el estado objetivo y email según el rol del usuario
      let targetStage: EstadoPostulacion;
      let emailFunction: (
        name: string,
        email: string,
        title?: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Promise<any>;
      let successMessage: string;

      if (isCompanyUser) {
        // Para clientes (EMPRESA/EMPLEADO_EMPRESA): Hire significa pasar a FINALISTA
        if (currentStage === "FINALISTA") {
          addNotification("Candidate is already a finalist", "info");
          return;
        }
        if (currentStage === "ACEPTADA") {
          addNotification("Candidate is already hired", "info");
          return;
        }
        if (currentStage === "RECHAZADA") {
          addNotification("Cannot hire a rejected candidate", "error");
          return;
        }

        targetStage = "FINALISTA";
        emailFunction = sendAdvanceNextStep;
        successMessage = "Candidate moved to finalist successfully";
      } else {
        // Para administradores: Hire significa pasar a ACEPTADA
        if (currentStage === "ACEPTADA") {
          addNotification("Candidate is already hired", "info");
          return;
        }
        if (currentStage === "RECHAZADA") {
          addNotification("Cannot hire a rejected candidate", "error");
          return;
        }

        targetStage = "ACEPTADA";
        emailFunction = (name: string, email: string) =>
          sendContractJobEmail(name, email, serviceTitle);
        successMessage =
          "Candidate hired and contract notification sent successfully";
      }

      // Actualizar estado
      const response = await directStageJump(
        postulationId,
        candidateId,
        targetStage
      );

      if (response && response.success) {
        // Enviar email correspondiente
        const emailResponse = await emailFunction(
          candidateName,
          candidateEmail,
          serviceTitle
        );

        if (emailResponse && emailResponse.success) {
          addNotification(successMessage, "success");
        } else {
          addNotification(
            `Candidate status updated but error sending notification`,
            "warning"
          );
        }

        // Actualizar lista de candidatos
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app.id === candidateId
              ? { ...app, estadoPostulacion: targetStage }
              : app
          )
        );

        if (onUpdate) {
          onUpdate();
        }
      } else {
        addNotification(
          response?.message || "Error updating candidate stage",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error in handleHireCandidate:", error);
      addNotification("Error processing hire action", "error");
    } finally {
      setActionLoading(candidateId, null);
    }
  };

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

    // Evitar múltiples clicks
    if (isActionLoading(candidateId, "advancing")) {
      return;
    }

    setActionLoading(candidateId, "advancing");
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
      setActionLoading(candidateId, null);
    }
  };

  const handleInterviewPreferenceChange = async (
    applicantId: string,
    wantsInterview: boolean
  ) => {
    // Para usuarios empresa, permitir cambios incluso si ya está establecido
    // Para usuarios admin, solo mostrar la información (no editable)

    // Actualizar estado local inmediatamente
    setInterviewPreferences((prev) => ({
      ...prev,
      [applicantId]: wantsInterview,
    }));

    // Para usuarios de empresa, guardar la preferencia en la base de datos
    if (isCompanyUser) {
      try {
        const applicant = applicants.find((app) => app.id === applicantId);
        if (applicant) {
          const response = await updateInterviewPreference(
            applicant.postulationId,
            wantsInterview
          );

          if (response.success) {
            // Marcar como establecido
            setPreferencesEstablished((prev) => ({
              ...prev,
              [applicantId]: true,
            }));

            const preferenceText = wantsInterview ? "YES" : "NO";
            const candidateName = `${applicant.nombre} ${applicant.apellido}`;

            addNotification(
              `Interview preference set to "${preferenceText}" for ${candidateName}`,
              "success"
            );
          } else {
            console.error("❌ Error al guardar preferencia:", response.error);
            addNotification("Error saving interview preference", "error");
            // Revertir el estado local si hay error
            setInterviewPreferences((prev) => ({
              ...prev,
              [applicantId]: !wantsInterview,
            }));
          }
        }
      } catch (error) {
        console.error("❌ Error saving interview preference:", error);
        addNotification("Error saving interview preference", "error");
        // Revertir el estado local si hay error
        setInterviewPreferences((prev) => ({
          ...prev,
          [applicantId]: !wantsInterview,
        }));
      }
    }
  };

  const handleRejectCandidate = async (
    postulationId: string,
    candidateId: string,
    candidateName: string,
    candidateEmail: string
  ) => {
    // Solo aplicar restricción para usuarios de empresa (clientes)
    if (isCompanyUser) {
      const candidate = applicants.find((app) => app.id === candidateId);
      if (
        candidate &&
        (candidate.estadoPostulacion === "FINALISTA" ||
          candidate.estadoPostulacion === "ACEPTADA")
      ) {
        addNotification(
          `Cannot reject ${candidateName} because they are already ${
            candidate.estadoPostulacion === "FINALISTA" ? "approved" : "hired"
          }`,
          "error"
        );
        return;
      }
    }

    // Evitar múltiples clicks
    if (isActionLoading(candidateId, "rejecting")) {
      return;
    }

    setActionLoading(candidateId, "rejecting");
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
      setActionLoading(candidateId, null);
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

  console.log("🔍 [ApplicantsModal] initialApplicants:", initialApplicants);

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
            {isLoadingApplicants ? (
              <TableSkeleton />
            ) : applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.id} className="border-b border-[#E2E2E2]">
                  <div className="px-4 py-3">
                    {/* Checkbox y nombre */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
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
                        <div className="flex items-center justify-between w-full">
                          <p className="text-gray-900 text-sm font-medium">{`${applicant.nombre} ${applicant.apellido}`}</p>
                          <div className="text-xs text-gray-500">
                            {renderClickableStageStatusBadge(
                              renderStageStatus(applicant),
                              applicant
                            )}
                          </div>
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
                          <p className="text-gray-700 text-sm">
                            Schedule Interview?
                          </p>
                          <div className="flex flex-col gap-2">
                            {preferencesEstablished[applicant.id] ? (
                              // Si ya está establecida, solo mostrar el texto
                              <div className="flex items-center gap-2">
                                {interviewPreferences[applicant.id] === true ? (
                                  <span className="text-green-600 text-sm font-medium">
                                    ✓ Yes
                                  </span>
                                ) : (
                                  <span className="text-orange-600 text-sm font-medium">
                                    ✗ No
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  (Set)
                                </span>
                              </div>
                            ) : (
                              // Si no está establecida, mostrar los radio buttons
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`interview-mobile-${applicant.id}`}
                                    checked={
                                      interviewPreferences[applicant.id] ===
                                      true
                                    }
                                    onChange={() => {
                                      handleInterviewPreferenceChange(
                                        applicant.id,
                                        true
                                      );
                                    }}
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <span className="text-sm">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`interview-mobile-${applicant.id}`}
                                    checked={
                                      interviewPreferences[applicant.id] ===
                                      false
                                    }
                                    onChange={() => {
                                      handleInterviewPreferenceChange(
                                        applicant.id,
                                        false
                                      );
                                    }}
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <span className="text-sm">No</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 w-full">
                      <p className="text-gray-700 text-sm">Actions</p>
                      <div className="flex flex-col space-y-2">
                        {/* For company users: different actions based on status */}
                        {isCompanyUser ? (
                          <>
                            {/* Si el candidato puede ser contratado por la empresa */}
                            {(applicant.estadoPostulacion === "PENDIENTE" ||
                              applicant.estadoPostulacion === "EN_EVALUACION" ||
                              applicant.estadoPostulacion ===
                                "PRIMERA_ENTREVISTA_REALIZADA" ||
                              applicant.estadoPostulacion ===
                                "EN_EVALUACION_CLIENTE" ||
                              applicant.estadoPostulacion ===
                                "SEGUNDA_ENTREVISTA_REALIZADA") && (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "hiring")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    handleHireCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      applicant.estadoPostulacion
                                    )
                                  }
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "hiring"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "hiring")
                                    ? "Hiring..."
                                    : "Hire"}
                                </button>
                                <button
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "rejecting")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-red-500 hover:bg-red-600 cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    handleRejectCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo
                                    )
                                  }
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "rejecting"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "rejecting")
                                    ? "Rejecting..."
                                    : "Reject"}
                                </button>
                              </div>
                            )}

                            {/* Si ya está aprobado (FINALISTA) */}
                            {applicant.estadoPostulacion === "FINALISTA" && (
                              <div className="text-green-600 text-xs font-medium">
                                ✓ Already Approved
                              </div>
                            )}

                            {/* Si ya está contratado (ACEPTADA) */}
                            {applicant.estadoPostulacion === "ACEPTADA" && (
                              <div className="text-blue-600 text-xs font-medium">
                                ✓ Already Hired
                              </div>
                            )}

                            {/* Si ya está rechazado (RECHAZADA) */}
                            {applicant.estadoPostulacion === "RECHAZADA" && (
                              <div className="text-red-600 text-xs font-medium">
                                ✗ Already Rejected
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
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "advancing")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
                                  }`}
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
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "advancing"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "advancing")
                                    ? "Sending..."
                                    : "Send"}
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
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "advancing")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
                                  }`}
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
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "advancing"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "advancing")
                                    ? "Scheduling..."
                                    : "Schedule"}
                                </button>
                              ) : applicant.estadoPostulacion ===
                                "EN_EVALUACION_CLIENTE" ? (
                                <button
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "advancing")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-purple-500 hover:bg-purple-600 cursor-pointer"
                                  }`}
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
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "advancing"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "advancing")
                                    ? "Advancing..."
                                    : "Advance"}
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
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "hiring")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    handleHireCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      applicant.estadoPostulacion
                                    )
                                  }
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "hiring"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "hiring")
                                    ? "Hiring..."
                                    : "Hire"}
                                </button>
                              ) : applicant.estadoPostulacion !== "ACEPTADA" &&
                                applicant.estadoPostulacion !== "RECHAZADA" ? (
                                <button
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                    isActionLoading(applicant.id, "hiring")
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                                  }`}
                                  onClick={() =>
                                    handleHireCandidate(
                                      applicant.postulationId,
                                      applicant.id,
                                      `${applicant.nombre} ${applicant.apellido}`,
                                      applicant.correo,
                                      applicant.estadoPostulacion
                                    )
                                  }
                                  disabled={isActionLoading(
                                    applicant.id,
                                    "hiring"
                                  )}
                                >
                                  {isActionLoading(applicant.id, "hiring")
                                    ? "Hiring..."
                                    : "Hire"}
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
                                    className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
                                      isActionLoading(applicant.id, "rejecting")
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 cursor-pointer"
                                    }`}
                                    onClick={() =>
                                      handleRejectCandidate(
                                        applicant.postulationId,
                                        applicant.id,
                                        `${applicant.nombre} ${applicant.apellido}`,
                                        applicant.correo
                                      )
                                    }
                                    disabled={isActionLoading(
                                      applicant.id,
                                      "rejecting"
                                    )}
                                  >
                                    {isActionLoading(applicant.id, "rejecting")
                                      ? "Rejecting..."
                                      : "Reject"}
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
              {isLoadingApplicants ? (
                <ApplicantsTableSkeleton />
              ) : applicants.length > 0 ? (
                <>
                  {isCompanyUser ? (
                    <CompanyApplicantsTable
                      applicants={applicants}
                      setSelectedCandidateId={setSelectedCandidateId}
                      setIsCandidateProfileModalOpen={
                        setIsCandidateProfileModalOpen
                      }
                      renderClickableStageStatusBadge={
                        renderClickableStageStatusBadge
                      }
                      renderStageStatus={renderStageStatus}
                      interviewPreferences={interviewPreferences}
                      preferencesEstablished={preferencesEstablished}
                      handleInterviewPreferenceChange={
                        handleInterviewPreferenceChange
                      }
                      handleSelectCandidate={handleSelectCandidate}
                      handleFirstInterview={handleFirstInterview}
                      handleSecondInterview={handleSecondInterview}
                      handleHireCandidate={handleHireCandidate}
                      handleRejectCandidate={handleRejectCandidate}
                      isActionLoading={isActionLoading}
                      currentPage={currentPage}
                      totalPages={totalPages}
                    />
                  ) : (
                    <AdminApplicantsTable
                      applicants={applicants}
                      selectedCandidates={selectedCandidates}
                      handleSelectAll={handleSelectAll}
                      handleCandidateSelection={handleCandidateSelection}
                      setSelectedCandidateId={setSelectedCandidateId}
                      setIsCandidateProfileModalOpen={
                        setIsCandidateProfileModalOpen
                      }
                      handleViewVideo={handleViewVideo}
                      renderClickableStageStatusBadge={
                        renderClickableStageStatusBadge
                      }
                      renderStageStatus={renderStageStatus}
                      interviewPreferences={interviewPreferences}
                      preferencesEstablished={preferencesEstablished}
                      handleSelectCandidate={handleSelectCandidate}
                      handleFirstInterview={handleFirstInterview}
                      handleSecondInterview={handleSecondInterview}
                      handleHireCandidate={handleHireCandidate}
                      handleRejectCandidate={handleRejectCandidate}
                      isActionLoading={isActionLoading}
                      currentPage={currentPage}
                      totalPages={totalPages}
                    />
                  )}
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

      {/* Modal de actualización de estado */}
      {isUpdateStatusModalOpen && selectedStatusUpdate && (
        <UpdateStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={handleCloseUpdateStatusModal}
          postulacionId={selectedStatusUpdate.postulacionId}
          candidatoId={selectedStatusUpdate.candidatoId}
          currentStatus={selectedStatusUpdate.currentStatus}
          candidatoName={selectedStatusUpdate.candidatoName}
          onUpdate={handleStatusUpdated}
        />
      )}
    </>
  );
}
