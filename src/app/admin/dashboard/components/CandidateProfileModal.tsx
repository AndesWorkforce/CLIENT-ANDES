"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Phone, Mail, FileText, Edit } from "lucide-react";
import { useCandidateProfile } from "../context/CandidateProfileContext";
import ProfileModalSkeleton from "./ProfileModalSkeleton";
import ViewFormularioModal from "./ViewFormularioModal";
import AdminExperienceManager from "./AdminExperienceManager";
import ImageViewer from "./ImageViewer";
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
  const { profile, isLoading, loadProfile } = useCandidateProfile();
  const { addNotification } = useNotificationStore();
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

  // Usar useRef para evitar múltiples cargas
  const hasLoadedRef = useRef(false);
  const [manualReload, setManualReload] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  console.log("errorCount", errorCount);
  const validateCandidateProfile = useCallback(async () => {
    const response = await candidateValidationProfile(candidateId);
    if (response.success) {
      console.log("[CandidateProfileModal] Perfil validado correctamente");
    }
  }, [candidateId]);

  useEffect(() => {
    if (isOpen && candidateId && (!hasLoadedRef.current || manualReload > 0)) {
      console.log("[CandidateProfileModal] Cargando perfil (evitando bucle):", {
        candidateId,
        manualReload,
      });

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
        } catch (error) {
          console.error("[CandidateProfileModal] Error al cargar:", error);
          // Increment error count
          setErrorCount((prev) => prev + 1);
        }
      };

      loadData();
      validateCandidateProfile();
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
          addNotification("Habilidades actualizadas correctamente", "success");
        } else {
          addNotification(
            `Error al actualizar habilidades: ${result.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error(
          "[CandidateProfileModal] Error al actualizar habilidades:",
          error
        );
        addNotification("Error inesperado al actualizar habilidades", "error");
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
    addNotification("Datos actualizados correctamente", "success");
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

  if (!isOpen) return null;

  if (isLoading || !profile) {
    return <ProfileModalSkeleton isOpen={isOpen} onClose={onClose} />;
  }

  console.log("[CandidateProfileModal] Perfil disponible:", profile);

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
    !profile?.archivos.imagenRequerimientosPC;

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
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setShowContactoModal(true)}
                      className="text-[#0097B2] flex items-center hover:bg-blue-50 p-2 rounded"
                    >
                      <Edit size={16} className="mr-1" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">Form</span>
                  <button
                    onClick={() => setShowFormularioModal(true)}
                    className="text-[#0097B2] flex items-center hover:bg-blue-50 p-2 rounded"
                  >
                    <Edit size={16} className="mr-1" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Video Presentation */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">
                    Video Presentation
                  </span>
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="text-[#0097B2] flex items-center hover:bg-blue-50 p-2 rounded"
                  >
                    <Edit size={16} className="mr-1" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Habilidades */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">Skills</span>
                  <button
                    onClick={() => setShowSkillsModal(true)}
                    className="text-[#0097B2] flex items-center hover:bg-blue-50 p-2 rounded"
                  >
                    <Edit size={16} className="mr-1" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Especificaciones del PC */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <span className="text-gray-800 font-medium">
                    PC Specifications
                  </span>
                  <button
                    onClick={() => setShowPCRequirementsModal(true)}
                    className="text-[#0097B2] flex items-center hover:bg-blue-50 p-2 rounded"
                  >
                    <Edit size={16} className="mr-1" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Experiencia y Educación */}
              <div className="mt-8 space-y-6">
                {/* Experiencia */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Experience
                    </h2>
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
                    <h2 className="text-lg font-medium text-gray-900">
                      Educación
                    </h2>
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
                                    Sin título
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {edu.institucion || (
                                  <span className="text-gray-400">
                                    Sin institución
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
                      Sin educación registrada
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
              {/* Mensaje de perfil incompleto */}
              {isProfileIncomplete && (
                <div className="flex justify-between bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-2 cursor-pointer">
                  Incomplete profile: Missing data.
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="ml-2 flex items-center text-[#0097B2] hover:text-[#007d8a] px-2"
                    title="Editar perfil"
                  >
                    <Edit size={16} className="mr-1" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
              )}
              {!isProfileIncomplete && (
                <div className="flex items-center justify-end cursor-pointer">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="ml-2 flex items-center text-[#0097B2] hover:text-[#007d8a] px-2"
                    title="Editar perfil"
                  >
                    <Edit size={16} className="mr-1" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
              )}

              {/* Información de contacto */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-xl font-medium text-[#0097B2] mb-2">
                        {profile.datosPersonales.nombre || (
                          <span className="text-gray-400">Sin nombre</span>
                        )}{" "}
                        {profile.datosPersonales.apellido || (
                          <span className="text-gray-400">Sin apellido</span>
                        )}
                      </h1>
                      <h2 className="font-medium text-gray-900 mb-3">
                        Información de contacto
                      </h2>
                    </div>
                  </div>
                  <hr className="border-[#E2E2E2] my-2" />
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Phone size={18} className="text-[#0097B2] mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        {profile.datosPersonales.telefono || (
                          <span className="text-gray-400">Sin teléfono</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Mail size={18} className="text-[#0097B2] mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        {profile.datosPersonales.correo || (
                          <span className="text-gray-400">Sin correo</span>
                        )}
                      </span>
                    </div>
                    {profile.datosPersonales.residencia && (
                      <div className="flex items-start">
                        <span className="text-gray-700">
                          Residence: {profile.datosPersonales.residencia}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulario */}
              {profile.datosFormulario && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Formulario
                    </span>
                    <button
                      onClick={() => setIsFormularioModalOpen(true)}
                      className="text-[#0097B2] flex items-center hover:underline cursor-pointer"
                    >
                      <FileText size={18} className="mr-1" />
                      <span>Ver</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Video */}
              {profile.archivos.videoPresentacion && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <h2 className="font-medium text-gray-900 mb-3">
                      Video de presentación
                    </h2>
                    <div className="aspect-video bg-gray-100 rounded relative group">
                      <video
                        ref={setVideoRef}
                        src={profile.archivos.videoPresentacion as string}
                        className="w-full h-full object-cover rounded"
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

              {/* Habilidades */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <h2 className="font-medium text-gray-900 mb-3">
                    Habilidades
                  </h2>
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
                      <li className="text-gray-400">Sin habilidades</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Imágenes PC */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <h2 className="font-medium text-gray-900 mb-3">
                    Especificaciones del PC
                  </h2>
                  <ImageViewer
                    images={[
                      profile.archivos?.imagenTestVelocidad,
                      profile.archivos?.imagenRequerimientosPC,
                    ].filter(Boolean)}
                  />
                </div>
              </div>

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
                      <span className="text-lg font-medium">Experiencia</span>
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
                      <span className="text-lg font-medium">Educación</span>
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
                                    Sin cargo
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {exp.empresa || (
                                  <span className="text-gray-400">
                                    Sin empresa
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
                                    Sin descripción
                                  </span>
                                )}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400">Sin experiencia</div>
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
                                    Sin título
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {edu.institucion || (
                                  <span className="text-gray-400">
                                    Sin institución
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
                          <div className="text-gray-400">Sin educación</div>
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
    </>
  );
}
