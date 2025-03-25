import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Candidato } from "@/app/types/offers";
import VideoModal from "./VideoModal";
import ProfileModal from "./ProfileModal";

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  applicants: Candidato[];
}

export default function ApplicantsModal({
  isOpen,
  onClose,
  serviceTitle,
  applicants: initialApplicants,
}: ApplicantsModalProps) {
  const [applicants, setApplicants] = useState<
    (Candidato & { isExpanded: boolean })[]
  >(
    initialApplicants.map((applicant) => ({ ...applicant, isExpanded: false }))
  );
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");

  if (!isOpen) return null;

  const toggleApplicant = (id: string) => {
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

  console.log(applicants);
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
                {applicant.isExpanded && (
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
                          <span className="text-gray-700 text-sm">Perfil</span>
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
                  </div>
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
