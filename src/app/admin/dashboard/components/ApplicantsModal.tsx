import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Applicant {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  hasProfile?: boolean;
  hasVideo?: boolean;
}

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  applicants: Applicant[];
}

export default function ApplicantsModal({
  isOpen,
  onClose,
  serviceTitle,
  applicants: initialApplicants,
}: ApplicantsModalProps) {
  const [applicants, setApplicants] = useState<
    (Applicant & { isExpanded: boolean })[]
  >(
    initialApplicants.map((applicant) => ({ ...applicant, isExpanded: false }))
  );

  if (!isOpen) return null;

  const toggleApplicant = (id: number) => {
    setApplicants(
      applicants.map((applicant) =>
        applicant.id === id
          ? { ...applicant, isExpanded: !applicant.isExpanded }
          : applicant
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08252A33] bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="p-4 border-b border-[#E2E2E2] relative">
          <h3 className="text-lg font-medium text-gray-900">
            Postulantes para servicio de:
            <br />
            <span className="text-[#0097B2]">{serviceTitle}</span>
          </h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div
          className="max-h-96 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#0097B2 #f3f4f6" }}
        >
          {applicants.map((applicant) => (
            <div key={applicant.id} className="border-b border-[#E2E2E2]">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleApplicant(applicant.id)}
              >
                <div className="flex items-center w-full">
                  {applicant.isExpanded ? (
                    <ChevronUp size={20} className="text-[#0097B2] mr-2" />
                  ) : (
                    <ChevronDown size={20} className="text-[#0097B2] mr-2" />
                  )}
                  <div className="grid grid-cols-2 w-full">
                    <p className="text-gray-900">Nombre</p>
                    <p className="text-gray-900">{applicant.name}</p>
                  </div>
                </div>
              </div>
              {applicant.isExpanded && (
                <div className="px-5 pb-4 space-y-3">
                  {applicant.hasProfile && (
                    <div className="grid grid-cols-2">
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
                        <span className="text-gray-700">Perfil</span>
                      </div>
                      <Link
                        href={`/admin/dashboard/${applicant.id}`}
                        className="text-[#0097B2] font-medium text-sm"
                      >
                        Ver
                      </Link>
                    </div>
                  )}
                  {applicant.hasVideo && (
                    <div className="grid grid-cols-2">
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
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="2.18"
                            ry="2.18"
                          ></rect>
                          <line x1="10" y1="8" x2="10" y2="16"></line>
                          <line x1="14" y1="8" x2="14" y2="16"></line>
                        </svg>
                        <span className="text-gray-700">Video</span>
                      </div>
                      <a
                        href="#"
                        className="text-[#0097B2] font-medium text-sm"
                      >
                        Ver
                      </a>
                    </div>
                  )}
                  {applicant.email && (
                    <div className="grid grid-cols-2">
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
                        <span className="text-gray-700">Email</span>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {applicant.email}
                      </span>
                    </div>
                  )}
                  {applicant.phone && (
                    <div className="grid grid-cols-2">
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
                        <span className="text-gray-700">Teléfono</span>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {applicant.phone}
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
  );
}
