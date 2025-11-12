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
  sendAdvanceNextStep,
  sendContractJobEmail,
  sendInterviewInvitation,
  sendRejectionEmail,
  sendRemovalNotification,
} from "../actions/sendEmail.actions";
import { useRouter } from "next/navigation";
import { removeMultipleApplications } from "../actions/applicants.actions";
import {
  updateInterviewPreference,
  updateInterviewAvailability,
} from "../actions/applicants.actions";
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
  preferenciaEntrevista: boolean | null;
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
  totalCount,
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
  totalCount: number;
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
  interviewPreferences: Record<string, boolean | undefined>;
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
      Total: {totalCount} applicants | Showing page {currentPage} of{" "}
      {totalPages}
    </div>
    <table className="w-full border-collapse">
      <thead className="sticky top-0 bg-white z-10">
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            <input
              type="checkbox"
              checked={selectedCandidates.size === totalCount && totalCount > 0}
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
              {/* Second Interview: Para admin, permitir salto de etapas desde estados tempranos */}
              {applicant.estadoPostulacion === "PENDIENTE" ||
              applicant.estadoPostulacion === "EN_EVALUACION" ||
              applicant.estadoPostulacion === "PRIMERA_ENTREVISTA_REALIZADA" ? (
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
  totalCount,
  setSelectedCandidateId,
  setIsCandidateProfileModalOpen,
  renderClickableStageStatusBadge,
  renderStageStatus,
  interviewPreferences,
  interviewAvailability,
  savingAvailability,
  onChangeInterviewAvailability,
  onSaveInterviewAvailability,
  handleInterviewPreferenceChange,
  handleHireCandidate,
  handleRejectCandidate,
  isActionLoading,
  currentPage,
  totalPages,
}: {
  applicants: ExtendedApplicant[];
  totalCount: number;
  setSelectedCandidateId: (id: string) => void;
  setIsCandidateProfileModalOpen: (open: boolean) => void;
  renderClickableStageStatusBadge: (
    stage: StageStatus,
    applicant: ExtendedApplicant
  ) => React.ReactElement;
  renderStageStatus: (applicant: ExtendedApplicant) => StageStatus;
  interviewPreferences: Record<string, boolean | undefined>;
  interviewAvailability: Record<string, string | undefined>;
  savingAvailability: Record<string, boolean>;
  onChangeInterviewAvailability: (applicantId: string, iso: string) => void;
  onSaveInterviewAvailability: (
    applicantId: string,
    postulationId: string
  ) => void;
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
      Total: {totalCount} applicants | Showing page {currentPage} of{" "}
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
            Proposed Date
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Hire
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Reject
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
              {(() => {
                const preference = interviewPreferences[applicant.id];

                // Para empresa: siempre mostrar radio buttons para permitir cambios
                // Solo mostrar el estado actual si está definido
                if (preference === true) {
                  return (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`interview-${applicant.id}`}
                          checked={true}
                          onChange={() =>
                            handleInterviewPreferenceChange(applicant.id, true)
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium text-green-600">
                          Yes
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`interview-${applicant.id}`}
                          checked={false}
                          onChange={() =>
                            handleInterviewPreferenceChange(applicant.id, false)
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  );
                } else if (preference === false) {
                  return (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`interview-${applicant.id}`}
                          checked={false}
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
                          checked={true}
                          onChange={() =>
                            handleInterviewPreferenceChange(applicant.id, false)
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium text-orange-600">
                          No
                        </span>
                      </label>
                    </div>
                  );
                } else {
                  // Estado no seleccionado - mostrar radio buttons sin seleccionar
                  return (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`interview-${applicant.id}`}
                          checked={false}
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
                          checked={false}
                          onChange={() =>
                            handleInterviewPreferenceChange(applicant.id, false)
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  );
                }
              })()}
            </td>
            <td className="py-4 px-4">
              {interviewPreferences[applicant.id] ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="datetime-local"
                    value={(() => {
                      const raw = interviewAvailability[applicant.id];
                      if (!raw) return "";
                      try {
                        // Convert ISO to local datetime-local format
                        const d = new Date(raw);
                        const pad = (n: number) =>
                          n.toString().padStart(2, "0");
                        const year = d.getFullYear();
                        const month = pad(d.getMonth() + 1);
                        const day = pad(d.getDate());
                        const hours = pad(d.getHours());
                        const minutes = pad(d.getMinutes());
                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                      } catch {
                        return "";
                      }
                    })()}
                    min={(() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() + 10); // enforce +10 minutes lead time
                      const pad = (n: number) => n.toString().padStart(2, "0");
                      return `${now.getFullYear()}-${pad(
                        now.getMonth() + 1
                      )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(
                        now.getMinutes()
                      )}`;
                    })()}
                    onChange={(e) => {
                      const val = e.target.value; // local string YYYY-MM-DDTHH:mm
                      if (!val) {
                        onChangeInterviewAvailability(applicant.id, "");
                        return;
                      }
                      // Convert local to ISO
                      const localDate = new Date(val);
                      onChangeInterviewAvailability(
                        applicant.id,
                        localDate.toISOString()
                      );
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() =>
                      onSaveInterviewAvailability(
                        applicant.id,
                        applicant.postulationId
                      )
                    }
                    disabled={savingAvailability[applicant.id]}
                    className={`px-3 py-1 text-white text-xs rounded-md transition-colors w-fit ${
                      savingAvailability[applicant.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    }`}
                  >
                    {savingAvailability[applicant.id]
                      ? "Saving..."
                      : interviewAvailability[applicant.id]
                      ? "Update"
                      : "Save"}
                  </button>
                  {interviewAvailability[applicant.id] && (
                    <span className="text-xs text-gray-500">
                      {new Date(
                        interviewAvailability[applicant.id] as string
                      ).toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400">N/A</span>
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
  console.log("\n\n\n [ApplicantsModal] applicants", applicants, "\n\n\n");
  // Estados de loading para acciones específicas
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: "hiring" | "rejecting" | "advancing" | null;
  }>({});

  // Disponibilidad de entrevista por candidato (ISO string)
  const [interviewAvailability, setInterviewAvailability] = useState<
    Record<string, string | undefined>
  >({});
  const [savingAvailability, setSavingAvailability] = useState<
    Record<string, boolean>
  >({});

  // Guardar disponibilidad (PATCH backend)
  const handleInterviewAvailabilitySave = async (
    applicantId: string,
    postulationId: string
  ) => {
    const iso = interviewAvailability[applicantId];
    if (!iso) {
      addNotification("Selecciona una fecha antes de guardar", "warning");
      return;
    }
    setSavingAvailability((prev) => ({ ...prev, [applicantId]: true }));
    try {
      const res = await updateInterviewAvailability(postulationId, iso);
      if (res.success) {
        addNotification("Disponibilidad guardada y notificada", "success");
      } else {
        addNotification(
          res.message || "Error al guardar disponibilidad",
          "error"
        );
      }
    } catch (e) {
      console.error(e);
      addNotification("Error inesperado al guardar disponibilidad", "error");
    } finally {
      setSavingAvailability((prev) => ({ ...prev, [applicantId]: false }));
    }
  };

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
  // undefined = no seleccionado, true = Yes, false = No
  const [interviewPreferences, setInterviewPreferences] = useState<
    Record<string, boolean | undefined>
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
    const newTotalPages =
      Math.ceil(applicants.length / APPLICANTS_PER_PAGE) || 1;
    setTotalPages(newTotalPages);
    // Clamp current page if it exceeds newTotalPages
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
      return; // next effect run will set the slice
    }
    setPaginatedApplicants(paginateApplicants(applicants, currentPage));
  }, [applicants, currentPage]);

  const loadStages = async () => {
    setIsLoadingApplicants(true);

    // Objetos para acumular las preferencias
    const newInterviewPreferences: Record<string, boolean | undefined> = {};
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

      // Para usuarios de empresa: permitir cambiar la preferencia
      if (isCompanyUser) {
        // Solo si hay un valor explícito (true o false), usarlo como inicial y marcarlo como establecido
        // Si es null/undefined, dejar como undefined para mostrar estado "no seleccionado"
        if (
          applicant.preferenciaEntrevista !== null &&
          applicant.preferenciaEntrevista !== undefined
        ) {
          newInterviewPreferences[applicant.id] =
            applicant.preferenciaEntrevista;
          // Si ya hay un valor guardado, marcarlo como establecido pero permitir cambios
          newPreferencesEstablished[applicant.id] = true;
        } else {
          // Si es null/undefined, no está establecida
          newPreferencesEstablished[applicant.id] = false;
        }
        // No asignar nada si es null/undefined (queda como undefined)
      } else {
        // Para admin, usar la lógica original pero mejorada
        if (
          applicant.preferenciaEntrevista !== null &&
          applicant.preferenciaEntrevista !== undefined
        ) {
          console.log(
            `📝 [ApplicantsModal] Cargando preferencia inicial para ${applicant.nombre}: ${applicant.preferenciaEntrevista}`
          );
          newInterviewPreferences[applicant.id] =
            applicant.preferenciaEntrevista;
          newPreferencesEstablished[applicant.id] = true;
        } else {
          console.log(
            `📝 [ApplicantsModal] No hay preferencia inicial para ${applicant.nombre} (valor: ${applicant.preferenciaEntrevista})`
          );
          // Explícitamente marcar como NO establecida y dejar undefined
          newPreferencesEstablished[applicant.id] = false;
          // No asignar nada, queda como undefined
        }
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
        } (${typeof newInterviewPreferences[applicant.id]}), established: ${
          newPreferencesEstablished[applicant.id]
        }`
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
        // Enviar email de avance a segunda entrevista
        try {
          const emailResponse = await sendAdvanceNextStep(
            candidateName,
            candidateEmail
          );
          if (emailResponse && emailResponse.success) {
            addNotification(
              "Candidate moved to second interview stage and email sent successfully",
              "success"
            );
          } else {
            addNotification(
              "Candidate moved to second interview stage but there was an error sending the email",
              "warning"
            );
          }
        } catch (emailError) {
          console.error("❌ Error sending second interview email:", emailError);
          addNotification(
            "Candidate moved to second interview stage but there was an error sending the email",
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
      // Determinar el estado objetivo según el rol del usuario
      let targetStage: EstadoPostulacion;
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
        successMessage = "Candidate hired successfully";
      }

      // Actualizar estado
      const response = await directStageJump(
        postulationId,
        candidateId,
        targetStage
      );

      if (response && response.success) {
        // Enviar email correspondiente SOLO si la actualización fue exitosa
        try {
          let emailResponse;

          if (isCompanyUser) {
            // Para empresas: NO enviar email cuando pasan a finalista
            // El candidato será notificado cuando el admin tome la decisión final
            console.log(
              "📧 Company user moved candidate to finalist - no email sent"
            );
            addNotification(
              `${successMessage} - candidate will be notified when final decision is made`,
              "success"
            );
          } else {
            // Para admins: enviar email de contratación
            emailResponse = await sendContractJobEmail(
              candidateName,
              candidateEmail,
              serviceTitle
            );

            if (emailResponse && emailResponse.success) {
              addNotification(
                `${successMessage} and notification sent`,
                "success"
              );
            } else {
              addNotification(
                `${successMessage} but notification failed to send`,
                "warning"
              );
            }
          }
        } catch (emailError) {
          console.error("❌ Error sending notification email:", emailError);
          addNotification(
            `${successMessage} but notification failed to send`,
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
          // Para otras acciones como FINALIST, no enviar emails genéricos
          console.log(
            "✅ [handleSelectCandidate] Candidato avanzado sin email genérico. Acción:",
            action
          );

          addNotification("Candidate stage updated successfully", "success");
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
    console.log(
      `📝 [handleInterviewPreferenceChange] Cambiando preferencia para ${applicantId}: ${wantsInterview}`
    );

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
            // Marcar como establecida después de guardar exitosamente
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

            console.log(
              `✅ [handleInterviewPreferenceChange] Preferencia guardada y marcada como establecida para ${applicantId}`
            );
          } else {
            console.error("❌ Error al guardar preferencia:", response.error);
            addNotification("Error saving interview preference", "error");
            // Revertir el estado local si hay error
            setInterviewPreferences((prev) => ({
              ...prev,
              [applicantId]: undefined, // Volver al estado no seleccionado
            }));
          }
        }
      } catch (error) {
        console.error("❌ Error saving interview preference:", error);
        addNotification("Error saving interview preference", "error");
        // Revertir el estado local si hay error
        setInterviewPreferences((prev) => ({
          ...prev,
          [applicantId]: undefined, // Volver al estado no seleccionado
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
        // Remover los candidatos eliminados de la lista inmediatamente
        setApplicants((prevApplicants) =>
          prevApplicants.filter((app) => !selectedCandidates.has(app.id))
        );
        setSelectedCandidates(new Set());

        // Mostrar mensaje de éxito inmediatamente
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

        // Actualizar la interfaz
        router.refresh();
        onUpdate?.();

        // Enviar correos de notificación de forma asíncrona en background
        if (
          response.data.details &&
          response.data.details.removedApplications
        ) {
          // Mostrar notificación de que se están enviando los correos
          addNotification(
            `Sending removal notifications to ${response.data.details.removedApplications.length} candidates...`,
            "info"
          );

          // Enviar correos en background sin bloquear la UI
          sendRemovalNotificationsInBackground(
            response.data.details.removedApplications
          );
        }
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

  // Función para enviar notificaciones en background
  const sendRemovalNotificationsInBackground = async (
    removedApplications: Array<{
      candidateName: string;
      candidateEmail: string;
      offerName: string;
    }>
  ) => {
    // Procesar todos los emails y esperar resultados
    try {
      const results = await Promise.all(
        removedApplications.map(async (application) => {
          try {
            const res = await sendRemovalNotification(
              application.candidateName,
              application.candidateEmail,
              application.offerName,
              "Your application has been removed from this position by the administrator."
            );
            if (res && res.success) {
              return { success: true, email: application.candidateEmail };
            } else {
              return {
                success: false,
                email: application.candidateEmail,
                error: res?.error || "Unknown error",
              };
            }
          } catch (emailError) {
            return {
              success: false,
              email: application.candidateEmail,
              error:
                typeof emailError === "object" &&
                emailError !== null &&
                "message" in emailError
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (emailError as any).message
                  : String(emailError),
            };
          }
        })
      );
      const successCount = results.filter((r) => r.success).length;
      const errorResults = results.filter((r) => !r.success);
      if (successCount > 0) {
        addNotification(
          `${successCount} removal notification(s) sent successfully`,
          "success"
        );
      }
      if (errorResults.length > 0) {
        errorResults.forEach((r) => {
          addNotification(
            `Failed to send removal notification to ${r.email}: ${r.error}`,
            "warning"
          );
        });
      }
    } catch (error) {
      console.error("Error in background email processing:", error);
      addNotification("Some notifications failed to send", "warning");
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
            className="flex-1 overflow-y-auto rounded-b-lg custom-scrollbar"
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
                            {preferencesEstablished[applicant.id] === true ? (
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
                              {/* Para admin en móvil: permitir salto de etapas desde estados tempranos */}
                              {applicant.estadoPostulacion === "PENDIENTE" ||
                              applicant.estadoPostulacion === "EN_EVALUACION" ||
                              applicant.estadoPostulacion ===
                                "PRIMERA_ENTREVISTA_REALIZADA" ? (
                                <button
                                  className={`px-2 py-1 text-white text-xs rounded-md transition-colors ${
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
              className="flex-1 overflow-y-auto px-6 pb-6 pt-0 custom-scrollbar"
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
                      applicants={paginatedApplicants}
                      totalCount={applicants.length}
                      setSelectedCandidateId={setSelectedCandidateId}
                      setIsCandidateProfileModalOpen={
                        setIsCandidateProfileModalOpen
                      }
                      renderClickableStageStatusBadge={
                        renderClickableStageStatusBadge
                      }
                      renderStageStatus={renderStageStatus}
                      interviewPreferences={interviewPreferences}
                      interviewAvailability={interviewAvailability}
                      savingAvailability={savingAvailability}
                      onChangeInterviewAvailability={(applicantId, iso) =>
                        setInterviewAvailability((prev) => ({
                          ...prev,
                          [applicantId]: iso || undefined,
                        }))
                      }
                      onSaveInterviewAvailability={
                        handleInterviewAvailabilitySave
                      }
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
                      applicants={paginatedApplicants}
                      totalCount={applicants.length}
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

            {/* Pagination - only show if more than one page */}
            {applicants.length > 0 && totalPages > 1 && (
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
          applicant={applicants.find(
            (a) => a.id === selectedStatusUpdate.candidatoId
          )}
          onUpdate={handleStatusUpdated}
        />
      )}
    </>
  );
}
