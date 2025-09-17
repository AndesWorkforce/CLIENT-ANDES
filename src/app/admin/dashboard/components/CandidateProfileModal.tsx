"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Phone,
  Mail,
  FileText,
  Edit,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useCandidateProfile } from "../context/CandidateProfileContext";
import ProfileModalSkeleton from "./ProfileModalSkeleton";
import ViewFormularioModal from "./ViewFormularioModal";
import AdminExperienceManager from "./AdminExperienceManager";
import FormularioModal from "@/app/profile/components/FormularioModal";
import VideoModal from "@/app/profile/components/VideoModal";
import SkillsModal from "@/app/profile/components/SkillsModal";
import PCRequirementsModal from "@/app/profile/components/PCRequirementsModal";
import ExperienceModal from "@/app/profile/components/ExperienceModal";
import EducationModal from "@/app/profile/components/EducationModal";
import {
  addExperience,
  Experience,
} from "@/app/profile/actions/experience.actions";
import { Education } from "@/app/types/education";
import { Skill } from "@/app/types/skill";
import { updateUserSkills } from "@/app/profile/actions/skills-actions";
import { useNotificationStore } from "@/store/notifications.store";
import { ProfileContextProvider } from "@/app/profile/context/ProfileContext";
import { addEducation } from "@/app/profile/actions/education.actions";
import ContactoModal from "@/app/profile/components/ContactoModal";
import { candidateValidationProfile } from "../actions/applicants.actions";
import IdentificationModal from "@/app/profile/components/IdentificationModal";
import BankInfoModal from "@/app/profile/components/BankInfoModal";
import { useAuthStore } from "@/store/auth.store";
import PDFDownloadButton from "./PDFDownloadButton";
import AssessmentModal from "./AssessmentModal";
import {
  saveAssessment,
  removeAssessment,
} from "@/app/profile/actions/identification-actions";

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
}

export default function CandidateProfileModal({
  isOpen,
  onClose,
  candidateId,
}: CandidateProfileModalProps) {
  console.log("Candidate ID:", candidateId);
  const { profile, isLoading, loadProfile } = useCandidateProfile();
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  const isCompanyUser =
    user?.rol === "EMPRESA" || user?.rol === "EMPLEADO_EMPRESA";
  const [activeTab, setActiveTab] = useState<"experiencia" | "educacion">(
    "experiencia"
  );
  const [isFormularioModalOpen, setIsFormularioModalOpen] =
    useState<boolean>(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] =
    useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Estado para controlar el modo de edición
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Estados para los diferentes tipos de modales de edición
  const [showFormularioModal, setShowFormularioModal] =
    useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [showSkillsModal, setShowSkillsModal] = useState<boolean>(false);
  const [showPCRequirementsModal, setShowPCRequirementsModal] =
    useState<boolean>(false);
  const [showEducationModal, setShowEducationModal] = useState<boolean>(false);
  const [showEditExperienceModal, setShowEditExperienceModal] =
    useState<boolean>(false);
  const [educationData, setEducationData] = useState<Education | null>(null);
  const [experienceData, setExperienceData] = useState<Experience | null>(null);
  const [isUpdatingSkills, setIsUpdatingSkills] = useState<boolean>(false);
  const [showContactoModal, setShowContactoModal] = useState<boolean>(false);
  const [showIdentificationModal, setShowIdentificationModal] =
    useState<boolean>(false);
  const [showBankInfoModal, setShowBankInfoModal] = useState<boolean>(false);

  // Usar useRef para evitar múltiples cargas
  const hasLoadedRef = useRef(false);
  const [manualReload, setManualReload] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  console.log(" ", !!errorCount);

  const validateCandidateProfile = useCallback(async () => {
    const response = await candidateValidationProfile(candidateId);
    if (response.success) {
      console.log("");
    }
  }, [candidateId]);

  useEffect(() => {
    if (isOpen && candidateId && (!hasLoadedRef.current || manualReload > 0)) {
      const loadData = async () => {
        try {
          hasLoadedRef.current = true;
          await loadProfile(candidateId);
          // Si estábamos recargando manualmente, restablecemos el contador
          if (manualReload > 0) {
            setManualReload(0);
          }
          // Reset error count on success
          setErrorCount(0);
        } catch {
          // Increment error count
          setErrorCount((prev) => prev + 1);
        }
      };

      loadData();

      if (!isCompanyUser) {
        validateCandidateProfile();
      }
    }

    // Reset cuando se cierra el modal
    if (!isOpen) {
      hasLoadedRef.current = false;
      setErrorCount(0);
      setIsEditMode(false);
      // Asegurarnos de que manualReload esté en 0 al cerrar
      if (manualReload > 0) {
        setManualReload(0);
      }
    }
  }, [isOpen, candidateId, loadProfile, manualReload]);

  const togglePlay = () => {
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleSaveSkills = async (newSkills: Skill[]) => {
    if (candidateId && newSkills.length > 0) {
      try {
        setIsUpdatingSkills(true);
        const result = await updateUserSkills(candidateId, newSkills);

        if (result.success) {
          setShowSkillsModal(false);
          // Recargar el perfil para mostrar las habilidades actualizadas
          setManualReload((prev) => prev + 1);
          addNotification("Skills updated successfully", "success");
        } else {
          addNotification(
            `Error updating skills: ${result.message || "Unknown error"}`,
            "error"
          );
        }
      } catch {
        addNotification("Unexpected error updating skills", "error");
      } finally {
        setIsUpdatingSkills(false);
      }
    } else {
      setShowSkillsModal(false);
    }
  };

  // Función para notificar cambios al cerrar modales
  const notifyChangesAndReload = () => {
    // Solo establecemos hasLoadedRef a false para forzar una recarga la próxima vez
    // en lugar de incrementar manualReload
    hasLoadedRef.current = false;
    addNotification("Data updated successfully", "success");
  };

  const handleEditExperience = (exp: Experience) => {
    setExperienceData(exp);
    setShowEditExperienceModal(true);
  };

  const handleEditEducation = (edu: Education) => {
    setEducationData(edu);
    setShowEducationModal(true);
  };

  const handleCloseExperienceModal = () => {
    setShowEditExperienceModal(false);
    setExperienceData(null);
    notifyChangesAndReload();
  };

  const handleCloseEducationModal = () => {
    setShowEducationModal(false);
    setEducationData(null);
    notifyChangesAndReload();
  };

  const handleSaveExperience = async (userId: string, data: Experience) => {
    const response = await addExperience(userId, data);
    if (response.success) {
      addNotification("Experience added correctly", "success");
    } else {
      addNotification("Error adding experience", "error");
    }
  };

  const handleSaveEducation = async (userId: string, data: Education) => {
    const response = await addEducation(userId, data);
    if (response.success) {
      addNotification("Education added correctly", "success");
    } else {
      addNotification("Error adding education", "error");
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const uploadImage = async (
    file: File | null,
    type: string
  ): Promise<string> => {
    if (!file) {
      throw new Error("No se puede subir una imagen nula");
    }
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("folder", "pdf");

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const uploadEndpoint = `${apiBase}files/upload/pdf`;

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const publicUrl = await response.text();
      return publicUrl;
    } catch (error) {
      console.error(
        `[IdentificationModal] Error uploading image of ${type}:`,
        error
      );
      throw error;
    }
  };

  const isAdminRole = [
    "ADMIN",
    "EMPLEADO_ADMIN",
    "ADMIN_RECLUTAMIENTO",
  ].includes(user?.rol || "");
  const isCompanyRole = ["EMPRESA", "EMPLEADO_EMPRESA"].includes(
    user?.rol || ""
  );
  const canSeeAssessment = isAdminRole || isCompanyRole;
  const canUploadAssessment = isAdminRole;
  const assessmentUrl = profile?.assessmentUrl ?? null;
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const userId =
    profile && "id" in profile && profile.id ? profile.id : candidateId;

  const handleAssessmentUpload = async (file: File) => {
    if (!userId || !file) return;

    try {
      // 1. Primero subir el archivo con uploadImage para obtener la URL
      const pdfUrl = await uploadImage(file, "pdf");

      // 2. Usar saveAssessment para guardar la URL en la base de datos
      const response = await saveAssessment(userId as string, pdfUrl as string);

      if (!response.success) {
        throw new Error(
          response.error || "Error al guardar la URL del assessment"
        );
      }

      addNotification("Assessment guardado correctamente", "success");
      setManualReload((prev) => prev + 1);
    } catch {
      addNotification("Error al guardar el assessment", "error");
    }
  };

  const handleAssessmentRemove = async () => {
    if (!userId) return;

    try {
      const response = await removeAssessment(userId as string);

      if (!response.success) {
        throw new Error(response.error || "Error al eliminar el assessment");
      }

      addNotification("Assessment eliminado correctamente", "success");
      setManualReload((prev) => prev + 1);
    } catch {
      addNotification("Error al eliminar el assessment", "error");
    }
  };

  if (!isOpen) return null;

  if (isLoading || !profile) {
    return <ProfileModalSkeleton isOpen={isOpen} onClose={onClose} />;
  }

  const isProfileIncomplete =
    !profile?.datosPersonales.nombre ||
    !profile?.datosPersonales.apellido ||
    !profile?.datosPersonales.telefono ||
    !profile?.datosPersonales.residencia ||
    !profile?.datosPersonales.correo ||
    !profile?.datosFormulario ||
    !profile?.educacion.length ||
    !profile?.experiencia.length ||
    !profile?.habilidades.length ||
    !profile?.archivos.videoPresentacion ||
    !profile?.archivos.imagenTestVelocidad ||
    !profile?.archivos.imagenRequerimientosPC ||
    !profile?.archivos.fotoCedulaFrente ||
    !profile?.archivos.fotoCedulaDorso;

  // Renderizado del modo de edición
  if (isEditMode) {
    // Adaptamos el formato del perfil para que coincida con lo que espera ProfileContextProvider
    const profileData = {
      profile: {
        datosPersonales: {
          ...profile.datosPersonales,
          fotoPerfil: profile.datosPersonales.fotoPerfil || null,
        },
        requisitosDispositivo: profile.requisitosDispositivo,
        archivos: {
          ...profile.archivos,
          curriculum: profile.archivos.curriculum || null,
          documentosAdicionales: profile.archivos.documentosAdicionales || [],
        },
        datosFormulario:
          typeof profile.datosFormulario === "object"
            ? JSON.stringify(profile.datosFormulario)
            : profile.datosFormulario,
        habilidades: profile.habilidades,
        educacion: profile.educacion.map((edu) => ({
          ...edu,
          añoFin: edu.añoFin || "", // Convertir posibles nulls a string vacío
        })),
        experiencia: profile.experiencia.map((exp) => ({
          ...exp,
          fechaFin: exp.fechaFin || "", // Convertir posibles nulls a string vacío
        })),
        estadoPerfil: profile.estadoPerfil || "INCOMPLETO",
        validacionExterna: profile.validacionExterna || false,
      },
    };

    return (
      <ProfileContextProvider initialValue={profileData}>
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div
            className="relative p-4 bg-white w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg custom-scrollbar"
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          >
            {/* Botón de cerrar */}
            <button
              onClick={() => {
                setIsEditMode(false);
                hasLoadedRef.current = false;
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h1 className="text-xl font-medium text-[#0097B2] mb-4">
                Edit profile of {profile.datosPersonales.nombre || ""}{" "}
                {profile.datosPersonales.apellido || ""}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Contact Information */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">
                    Contact Information
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowContactoModal(true)}
                      className="text-[#0097B2] flex items-center justify-center hover:bg-blue-50 p-2 rounded-full w-11 h-11"
                    >
                      <Edit size={26} />
                    </button>
                    {profile.datosPersonales.nombre &&
                      profile.datosPersonales.apellido && (
                        <div className="flex items-center justify-center w-11 h-11">
                          <CheckCircle
                            size={30}
                            className="text-[#0097B2] fill-white stroke-[#0097B2] stroke-[1.5]"
                          />
                        </div>
                      )}
                  </div>
                </div>

                {/* Form */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">Form</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFormularioModal(true)}
                      className="text-[#0097B2] flex items-center justify-center hover:bg-blue-50 p-2 rounded-full w-11 h-11"
                    >
                      <Edit size={26} />
                    </button>
                    {profile.datosFormulario && (
                      <div className="flex items-center justify-center w-11 h-11">
                        <CheckCircle
                          size={30}
                          className="text-[#0097B2] fill-white stroke-[#0097B2] stroke-[1.5]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Presentation */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">
                    Video Presentation
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="text-[#0097B2] flex items-center justify-center hover:bg-blue-50 p-2 rounded-full w-11 h-11"
                    >
                      <Edit size={26} />
                    </button>
                    {profile.archivos.videoPresentacion && (
                      <div className="flex items-center justify-center w-11 h-11">
                        <CheckCircle
                          size={30}
                          className="text-[#0097B2] fill-white stroke-[#0097B2] stroke-[1.5]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">Skills</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSkillsModal(true)}
                      className="text-[#0097B2] flex items-center justify-center hover:bg-blue-50 p-2 rounded-full w-11 h-11"
                    >
                      <Edit size={26} />
                    </button>
                    {profile.habilidades && profile.habilidades.length > 0 && (
                      <div className="flex items-center justify-center w-11 h-11">
                        <CheckCircle
                          size={30}
                          className="text-[#0097B2] fill-white stroke-[#0097B2] stroke-[1.5]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* PC Specifications */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">
                    PC Specifications
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowPCRequirementsModal(true)}
                      className="text-[#0097B2] flex items-center justify-center hover:bg-blue-50 p-2 rounded-full w-11 h-11"
                    >
                      <Edit size={26} />
                    </button>
                    {(profile.archivos?.imagenTestVelocidad ||
                      profile.archivos?.imagenRequerimientosPC) && (
                      <div className="flex items-center justify-center w-11 h-11">
                        <CheckCircle
                          size={30}
                          className="text-[#0097B2] fill-white stroke-[#0097B2] stroke-[1.5]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Identification */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">
                    Identification Document
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowIdentificationModal(true)}
                      className="text-[#0097B2] flex items-center justify-center hover:bg-blue-50 p-2 rounded-full w-11 h-11"
                    >
                      <Edit size={26} />
                    </button>
                    {profile.archivos.fotoCedulaFrente &&
                      profile.archivos.fotoCedulaDorso && (
                        <div className="flex items-center justify-center w-11 h-11">
                          <CheckCircle
                            size={30}
                            className="text-[#0097B2] fill-white stroke-[#0097B2] stroke-[1.5]"
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Experiencia y Educación */}
              <div className="mt-8 space-y-6">
                {/* Experiencia */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium text-gray-900">
                        Experience
                      </h2>
                      {profile.experiencia &&
                        profile.experiencia.length > 0 && (
                          <CheckCircle
                            size={20}
                            className="text-[#0097B2] fill-[#0097B2] stroke-white"
                          />
                        )}
                    </div>
                    <button
                      onClick={() => {
                        setExperienceData(null);
                        setShowEditExperienceModal(true);
                      }}
                      className="w-8 h-8 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {profile.experiencia.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {profile.experiencia.map((exp) => (
                        <div key={exp.id} className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {exp.cargo || (
                                  <span className="text-gray-400">
                                    No job title
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {exp.empresa || (
                                  <span className="text-gray-400">
                                    No company
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                {exp.fechaInicio || "?"} -{" "}
                                {exp.fechaFin || "Presente"}
                              </p>
                            </div>
                            <button
                              onClick={() => handleEditExperience(exp)}
                              className="text-[#0097B2] p-1 hover:bg-blue-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No experiences registered
                    </p>
                  )}
                </div>

                {/* Educación */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium text-gray-900">
                        Education
                      </h2>
                      {profile.educacion && profile.educacion.length > 0 && (
                        <CheckCircle
                          size={20}
                          className="text-[#0097B2] fill-[#0097B2] stroke-white"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setEducationData(null);
                        setShowEducationModal(true);
                      }}
                      className="w-8 h-8 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {profile.educacion.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {profile.educacion.map((edu) => (
                        <div key={edu.id} className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {edu.titulo || (
                                  <span className="text-gray-400">
                                    No degree
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {edu.institucion || (
                                  <span className="text-gray-400">
                                    No institution
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                {edu.añoInicio || "?"} -{" "}
                                {edu.añoFin || "Presente"}
                              </p>
                            </div>
                            <button
                              onClick={() => handleEditEducation(edu)}
                              className="text-[#0097B2] p-1 hover:bg-blue-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No education registered
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modales de edición - Ahora utilizarán el candidateId del usuario actual temporal */}
          <FormularioModal
            isOpen={showFormularioModal}
            onClose={() => {
              setShowFormularioModal(false);
              notifyChangesAndReload();
            }}
            candidateId={candidateId}
            datosFormulario={profile.datosFormulario}
          />

          <VideoModal
            isOpen={showVideoModal}
            onClose={() => {
              setShowVideoModal(false);
              notifyChangesAndReload();
            }}
            candidateId={candidateId}
          />

          <SkillsModal
            isOpen={showSkillsModal}
            onClose={() => setShowSkillsModal(false)}
            onSave={handleSaveSkills}
            initialSkills={profile.habilidades}
            isLoading={isUpdatingSkills}
          />

          <PCRequirementsModal
            isOpen={showPCRequirementsModal}
            onClose={() => {
              setShowPCRequirementsModal(false);
              notifyChangesAndReload();
            }}
            candidateId={candidateId}
            imagenRequerimientosPC={profile.archivos?.imagenRequerimientosPC}
            imagenTestVelocidad={profile.archivos?.imagenTestVelocidad}
          />

          <ExperienceModal
            isOpen={showEditExperienceModal}
            onClose={handleCloseExperienceModal}
            onSave={handleSaveExperience}
            experienceData={experienceData || undefined}
            candidateId={candidateId}
          />

          <EducationModal
            isOpen={showEducationModal}
            onClose={handleCloseEducationModal}
            onSave={handleSaveEducation}
            educationData={educationData || undefined}
            candidateId={candidateId}
          />

          <ContactoModal
            isOpen={showContactoModal}
            onClose={() => setShowContactoModal(false)}
            candidateId={candidateId}
          />

          <IdentificationModal
            isOpen={showIdentificationModal}
            onClose={() => {
              setShowIdentificationModal(false);
              notifyChangesAndReload();
            }}
            candidateId={candidateId}
          />
        </div>
      </ProfileContextProvider>
    );
  }

  // Renderizado normal (modo visualización)
  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div
          className="relative p-4 bg-white w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg custom-scrollbar"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <div className="space-y-4">
              {/* Mensaje de perfil incompleto y botón de edición */}
              {!isCompanyUser && (
                <>
                  {isProfileIncomplete && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-2">
                      <div className="flex justify-between items-center">
                        <span>Incomplete profile: Missing data.</span>
                        <button
                          onClick={() => setIsEditMode(true)}
                          className="ml-2 flex items-center text-[#0097B2] hover:text-[#007d8a] px-2"
                          title="Editar perfil"
                        >
                          <Edit size={16} className="mr-1" />
                          <span className="text-sm">Edit</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-right">
                        Edit general profile information
                      </p>
                    </div>
                  )}
                  {!isProfileIncomplete && (
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="ml-2 flex items-center text-[#0097B2] hover:text-[#007d8a] px-2 cursor-pointer"
                        title="Editar perfil"
                      >
                        <Edit size={16} className="mr-1" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Edit general profile information
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-xl font-medium text-[#0097B2] mb-2">
                        {profile.datosPersonales.nombre || (
                          <span className="text-gray-400">No name</span>
                        )}{" "}
                        {profile.datosPersonales.apellido || (
                          <span className="text-gray-400">No last name</span>
                        )}
                      </h1>
                      <h2 className="font-medium text-gray-900 mb-3">
                        Contact information
                      </h2>
                      <hr className="border-[#E2E2E2] my-2" />
                      <div className="space-y-3">
                        {!isCompanyUser && (
                          <>
                            <div className="flex items-start">
                              <Phone
                                size={18}
                                className="text-[#0097B2] mr-2 mt-0.5"
                              />
                              <span className="text-gray-700">
                                {profile.datosPersonales.telefono || (
                                  <span className="text-gray-400">
                                    No phone
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <Mail
                                size={18}
                                className="text-[#0097B2] mr-2 mt-0.5"
                              />
                              <span className="text-gray-700">
                                {profile.datosPersonales.correo || (
                                  <span className="text-gray-400">
                                    No email
                                  </span>
                                )}
                              </span>
                            </div>
                          </>
                        )}
                        {profile.datosPersonales.residencia && (
                          <div className="flex items-start">
                            <span className="text-gray-700">
                              Residence: {profile.datosPersonales.residencia}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!isCompanyUser && (
                        <PDFDownloadButton profile={profile} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Information (admins editable) */}
              {isAdminRole && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-medium text-gray-900">
                        Bank Information
                      </h2>
                      <button
                        onClick={() => setShowBankInfoModal(true)}
                        className="text-[#0097B2] text-sm hover:underline cursor-pointer"
                      >
                        {profile.bankInfo ? "Edit" : "Add"}
                      </button>
                    </div>
                    {profile.bankInfo ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        {profile.bankInfo.usaDollarApp !== null && (
                          <div>
                            DollarApp:{" "}
                            {profile.bankInfo.usaDollarApp ? "Yes" : "No"}
                            {profile.bankInfo.usaDollarApp &&
                            profile.bankInfo.dollarTag
                              ? ` (${profile.bankInfo.dollarTag})`
                              : ""}
                          </div>
                        )}
                        {profile.bankInfo.bancoNombre && (
                          <div>
                            Bank: {profile.bankInfo.bancoNombre}
                            {profile.bankInfo.bancoPais
                              ? `, ${profile.bankInfo.bancoPais}`
                              : ""}
                          </div>
                        )}
                        {profile.bankInfo.numeroCuentaBancaria && (
                          <div>
                            Account: {profile.bankInfo.numeroCuentaBancaria}
                          </div>
                        )}
                        {profile.bankInfo.nombreTitularCuenta && (
                          <div>
                            Account holder:{" "}
                            {profile.bankInfo.nombreTitularCuenta}
                          </div>
                        )}
                        {profile.bankInfo.direccionBanco && (
                          <div>
                            Bank address: {profile.bankInfo.direccionBanco}
                          </div>
                        )}
                        {profile.bankInfo.numeroRutaBancaria && (
                          <div>
                            Routing number:{" "}
                            {profile.bankInfo.numeroRutaBancaria}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        No bank information provided.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form - Solo mostrar si no es usuario empresa */}
              {profile.datosFormulario && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <span className="font-medium text-gray-900">Form</span>
                    <button
                      onClick={() => setIsFormularioModalOpen(true)}
                      className="text-[#0097B2] flex items-center hover:underline cursor-pointer"
                    >
                      <FileText size={18} className="mr-1" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Video */}
              {profile.archivos.videoPresentacion && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-medium text-gray-900">
                        Video presentation
                      </h2>
                      <button
                        onClick={() =>
                          setSelectedImage(
                            profile.archivos.videoPresentacion as string
                          )
                        }
                        className="text-[#0097B2] text-sm hover:underline flex items-center gap-1"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        Expandir
                      </button>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded relative group">
                      <video
                        ref={setVideoRef}
                        src={profile.archivos.videoPresentacion as string}
                        className="w-full h-full object-contain rounded"
                        onEnded={() => setIsVideoPlaying(false)}
                        controls={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={togglePlay}
                          className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
                        >
                          {isVideoPlaying ? (
                            <div className="h-8 w-8 flex items-center justify-center">
                              <div className="h-6 w-6 bg-[#0097B2]"></div>
                            </div>
                          ) : (
                            <div className="h-8 w-8 flex items-center justify-center">
                              <div className="h-0 w-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-[#0097B2]"></div>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <h2 className="font-medium text-gray-900 mb-3">Skills</h2>
                  <ul className="space-y-2">
                    {(profile.habilidades || []).length > 0 ? (
                      profile.habilidades.map((habilidad) => (
                        <li key={habilidad.id} className="flex items-start">
                          <span className="text-[#0097B2] mr-2">•</span>
                          <span className="text-gray-700">
                            {habilidad.nombre}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No skills</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* PC Specifications */}
              {(profile.archivos?.imagenTestVelocidad ||
                profile.archivos?.imagenRequerimientosPC) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <h2 className="font-medium text-gray-900 mb-3">
                      PC Specifications
                    </h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {[
                        profile.archivos?.imagenTestVelocidad,
                        profile.archivos?.imagenRequerimientosPC,
                      ]
                        .filter(Boolean)
                        .map((image, index) => (
                          <div
                            key={index}
                            className="w-40 h-40 relative group cursor-pointer bg-gray-50 rounded-lg border border-gray-200"
                            onClick={() => setSelectedImage(image as string)}
                          >
                            <img
                              src={image as string}
                              alt={`PC Specification ${index + 1}`}
                              className="w-full h-full object-contain rounded-lg p-1"
                            />
                            <div className="absolute inset-0 bg-[#0097B2] bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <div className="text-[#0097B2] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1 rounded-full shadow-sm">
                                View image
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Documento de Identidad - Solo visible para usuarios no empresa */}
              {!isCompanyUser && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <h2 className="font-medium text-gray-900 mb-3">
                      Identity Document
                    </h2>
                    {profile.archivos?.fotoCedulaFrente ||
                    profile.archivos?.fotoCedulaDorso ? (
                      <div className="flex flex-wrap gap-4 justify-center">
                        {profile.archivos?.fotoCedulaFrente && (
                          <div className="flex-1 flex flex-col items-center max-w-[160px]">
                            <span className="text-gray-700 mb-2 font-medium">
                              Front photo
                            </span>
                            <div
                              className="w-40 h-40 relative group cursor-pointer bg-gray-50 rounded-lg border border-gray-200"
                              onClick={() =>
                                setSelectedImage(
                                  profile.archivos.fotoCedulaFrente as string
                                )
                              }
                            >
                              <img
                                src={
                                  profile.archivos.fotoCedulaFrente as string
                                }
                                alt="ID Front"
                                className="w-full h-full object-contain rounded-lg p-1"
                              />
                              <div className="absolute inset-0 bg-[#0097B2] bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                                <div className="text-[#0097B2] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1 rounded-full shadow-sm">
                                  View image
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {profile.archivos?.fotoCedulaDorso && (
                          <div className="flex-1 flex flex-col items-center max-w-[160px]">
                            <span className="text-gray-700 mb-2 font-medium">
                              Back photo
                            </span>
                            <div
                              className="w-40 h-40 relative group cursor-pointer bg-gray-50 rounded-lg border border-gray-200"
                              onClick={() =>
                                setSelectedImage(
                                  profile.archivos.fotoCedulaDorso as string
                                )
                              }
                            >
                              <img
                                src={profile.archivos.fotoCedulaDorso as string}
                                alt="ID Back"
                                className="w-full h-full object-contain rounded-lg p-1"
                              />
                              <div className="absolute inset-0 bg-[#0097B2] bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                                <div className="text-[#0097B2] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1 rounded-full shadow-sm">
                                  View image
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">
                          No identity document images uploaded
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          The candidate needs to upload both front and back
                          photos of their ID
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assessment */}
              {canSeeAssessment && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-gray-900">Assessment</h2>
                    {canUploadAssessment && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAssessmentModalOpen(true)}
                          className="p-2 text-[#0097B2] hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                          title={
                            assessmentUrl
                              ? "Replace Assessment"
                              : "Upload Assessment"
                          }
                        >
                          <Edit size={16} />
                        </button>
                        {assessmentUrl && (
                          <button
                            onClick={() => setShowDeleteConfirmModal(true)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                            title="Remove Assessment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    {assessmentUrl ? (
                      <a
                        href={
                          typeof assessmentUrl === "string" && assessmentUrl
                            ? assessmentUrl
                            : ""
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0097B2] underline hover:text-[#007A8C]"
                      >
                        View Assessment PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        No assessment uploaded
                      </span>
                    )}
                  </div>
                  <AssessmentModal
                    isOpen={isAssessmentModalOpen}
                    onClose={() => setIsAssessmentModalOpen(false)}
                    onUpload={handleAssessmentUpload}
                  />

                  {/* Modal de confirmación para eliminar assessment */}
                  {showDeleteConfirmModal && (
                    <div className="fixed inset-0 bg-black/40  z-[70] flex items-center justify-center p-4">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Confirm remove assessment
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Are you sure you want to remove the assessment? This
                          action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setShowDeleteConfirmModal(false)}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleAssessmentRemove();
                              setShowDeleteConfirmModal(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experiencia/Educación tabs */}
              <div className="mt-6 mb-4 relative">
                <div
                  className="relative"
                  style={{
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                  }}
                >
                  {/* Primera sección - Pestañas en forma de L */}
                  <div className="flex">
                    {/* Experiencia */}
                    <div
                      className={`py-3 px-8 rounded-tl-2xl border-t border-l ${
                        activeTab === "experiencia"
                          ? "text-[#6B7280] border-gray-300 border-r border-b-0 relative z-20 bg-white"
                          : "text-gray-500 border-gray-300 border-b border-r-0"
                      }`}
                      onClick={() => setActiveTab("experiencia")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="text-lg font-medium">Experience</span>
                    </div>

                    {/* Educación */}
                    <div
                      className={`py-3 px-8 rounded-tr-2xl border-t ${
                        activeTab === "educacion"
                          ? "text-[#6B7280] border-gray-300 border-r border-b-0 relative z-20 bg-white"
                          : "text-gray-500 border-gray-300 border-b border-r"
                      }`}
                      onClick={() => setActiveTab("educacion")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="text-lg font-medium">Education</span>
                    </div>

                    {/* Resto del borde superior */}
                    <div className="flex-grow border-b border-gray-300" />
                  </div>

                  {/* Segunda sección - Panel con contenido */}
                  <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white relative p-4">
                    {activeTab === "experiencia" ? (
                      <div className="space-y-6">
                        {(profile.experiencia || []).length > 0 ? (
                          profile.experiencia.map((exp) => (
                            <div
                              key={exp.id}
                              className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                            >
                              <h3 className="font-medium text-gray-800 text-lg">
                                {exp.cargo || (
                                  <span className="text-gray-400">
                                    No job title
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {exp.empresa || (
                                  <span className="text-gray-400">
                                    No company
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {exp.fechaInicio || "?"} -{" "}
                                {exp.fechaFin || "Presente"}
                              </p>
                              <p className="text-sm text-gray-700 mt-3">
                                {exp.descripcion || (
                                  <span className="text-gray-400">
                                    No description
                                  </span>
                                )}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400">No experience</div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {(profile.educacion || []).length > 0 ? (
                          profile.educacion.map((edu) => (
                            <div
                              key={edu.id}
                              className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                            >
                              <h3 className="font-medium text-gray-800 text-lg">
                                {edu.titulo || (
                                  <span className="text-gray-400">
                                    No degree
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {edu.institucion || (
                                  <span className="text-gray-400">
                                    No institution
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {edu.añoInicio || "?"} -{" "}
                                {edu.añoFin || "Presente"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400">No education</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del Formulario */}
      <ViewFormularioModal
        isOpen={isFormularioModalOpen}
        onClose={() => setIsFormularioModalOpen(false)}
        datosFormulario={profile.datosFormulario}
        name={`${profile.datosPersonales.nombre} ${profile.datosPersonales.apellido}`}
      />

      {/* Modal de Experiencia */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div
            className="relative bg-white w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg custom-scrollbar"
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          >
            <button
              onClick={() => {
                setIsExperienceModalOpen(false);
                // Recargar el perfil para mostrar los cambios
                setManualReload((prev) => prev + 1);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-medium text-[#0097B2] mb-4">
                Gestionar Experiencia
              </h2>
              <AdminExperienceManager candidateId={candidateId} />
            </div>
          </div>
        </div>
      )}

      {/* Modal to view full image/video */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(0,0,0,0.8)]"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[95vh] p-4 w-full h-full flex items-center justify-center">
            {selectedImage === profile.archivos.videoPresentacion ? (
              <video
                src={selectedImage}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={selectedImage}
                alt="PC Specification"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* BankInfoModal - Available outside edit mode */}
      {isAdminRole && (
        <BankInfoModal
          isOpen={showBankInfoModal}
          onClose={() => {
            setShowBankInfoModal(false);
            // force reload to fetch updated bank info
            hasLoadedRef.current = false;
            setManualReload((prev) => prev + 1);
          }}
          targetUserId={candidateId}
          initialBankInfo={
            profile.bankInfo
              ? {
                  usaDollarApp: profile.bankInfo.usaDollarApp ?? undefined,
                  dollarTag: profile.bankInfo.dollarTag ?? undefined,
                  bancoNombre: profile.bankInfo.bancoNombre ?? undefined,
                  bancoPais: profile.bankInfo.bancoPais ?? undefined,
                  numeroCuentaBancaria:
                    profile.bankInfo.numeroCuentaBancaria ?? undefined,
                  direccionBanco: profile.bankInfo.direccionBanco ?? undefined,
                  nombreTitularCuenta:
                    profile.bankInfo.nombreTitularCuenta ?? undefined,
                  numeroRutaBancaria:
                    profile.bankInfo.numeroRutaBancaria ?? undefined,
                }
              : null
          }
        />
      )}
    </>
  );
}
