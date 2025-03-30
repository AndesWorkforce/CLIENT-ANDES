"use client";

import { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ExperienceModal from "./components/ExperienceModal";
import EducationModal from "./components/EducationModal";
import FormularioModal from "./components/FormularioModal";
import VideoModal from "./components/VideoModal";
import SkillsModal from "./components/SkillsModal";
import PCRequirementsModal from "./components/PCRequirementsModal";
import ViewFormularioModal from "./components/ViewFormularioModal";
import ViewVideoModal from "./components/ViewVideoModal";
import ViewSkillsModal from "./components/ViewSkillsModal";
import ViewPCRequirementsModal from "./components/ViewPCRequirementsModal";
import ContactoModal from "./components/ContactoModal";
import ViewContactoModal from "./components/ViewContactoModal";
import { useProfileContext } from "./context/ProfileContext";
import Dump from "@/components/icons/Dump";
import Edit from "@/components/icons/Edit";
import UploadFile from "@/components/icons/UploadFile";
import Add from "@/components/icons/Add";
import { Education } from "../types/education";
import { Skill } from "../types/skill";
import { deleteAllSkills, updateUserSkills } from "./actions/skills-actions";
import { useAuthStore } from "@/store/auth.store";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { removeVideoPresentation } from "./actions/video-actions";
import { useNotificationStore } from "@/store/notifications.store";
import { deletePCRequirementsImages } from "./actions/pc-requirements-actions";
import { eliminarDatosFormulario } from "./actions/formulario.actions";
import {
  addExperience,
  deleteExperience,
  Experience,
} from "./actions/experience.actions";
import { addEducation, deleteEducation } from "./actions/education.actions";

export default function ProfilePage() {
  const { profile } = useProfileContext();
  const { user } = useAuthStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [activeTab, setActiveTab] = useState<"experiencia" | "educacion">(
    "experiencia"
  );

  // Estados para el formulario de PC requirements
  const [showPCRequirementsModal, setShowPCRequirementsModal] = useState(false);
  const [showViewPCRequirementsModal, setShowViewPCRequirementsModal] =
    useState(false);

  // Estados para los diferentes tipos de formularios
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [isUpdatingSkills, setIsUpdatingSkills] = useState(false);
  const [showViewFormularioModal, setShowViewFormularioModal] = useState(false);
  const [showViewVideoModal, setShowViewVideoModal] = useState(false);
  const [showViewSkillsModal, setShowViewSkillsModal] = useState(false);
  const [showDeleteSkillsModal, setShowDeleteSkillsModal] = useState(false);
  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);
  const [showDeletePCRequirementsModal, setShowDeletePCRequirementsModal] =
    useState(false);
  const [showDeleteFormularioModal, setShowDeleteFormularioModal] =
    useState(false);
  const [showDeleteExperienceModal, setShowDeleteExperienceModal] =
    useState(false);
  const [experienceIdToDelete, setExperienceIdToDelete] = useState<string>("");
  const [showDeleteEducationModal, setShowDeleteEducationModal] =
    useState(false);
  const [educationIdToDelete, setEducationIdToDelete] = useState<string>("");
  const [showContactoModal, setShowContactoModal] = useState(false);
  const [showEditContactoModal, setShowEditContactoModal] = useState(false);
  const [showViewContactoModal, setShowViewContactoModal] = useState(false);
  const [educationData, setEducationData] = useState<Education | null>(null);
  const [experienceData, setExperienceData] = useState<Experience | null>(null);

  const handleSaveExperience = async (userId: string, data: Experience) => {
    const response = await addExperience(userId, data);
    if (response.success) {
      addNotification("Experience added correctly", "success");
    } else {
      addNotification("Error adding experience", "error");
    }
  };

  const handleSaveEducation = async (data: Education) => {
    const response = await addEducation(user?.id || "", data);
    if (response.success) {
      addNotification("Education added correctly", "success");
    } else {
      addNotification("Error adding education", "error");
    }
  };

  const handleCloseExperienceModal = () => {
    setShowExperienceModal(false);
  };

  const handleCloseEducationModal = () => {
    setShowEducationModal(false);
  };

  const handleSaveSkills = async (newSkills: Skill[]) => {
    // Actualizar skills en el backend si hay un usuario logueado
    if (user?.id && newSkills.length > 0) {
      try {
        // Mostrar indicador de carga
        setIsUpdatingSkills(true);

        // Llamar a la acción del servidor para actualizar skills
        const result = await updateUserSkills(user.id, newSkills);

        if (result.success) {
          // Cerrar modal después de actualizar
          setShowSkillsModal(false);
        } else {
          alert(`Error updating skills: ${result.message}`);
        }
      } catch (error) {
        console.error("[ProfilePage] Error updating skills:", error);
        alert("An unexpected error occurred while updating skills");
      } finally {
        // Ocultar indicador de carga
        setIsUpdatingSkills(false);
      }
    } else if (newSkills.length > 0) {
      // Cerrar modal
      setShowSkillsModal(false);
    } else {
      // Si no hay skills, cerrar el modal
      setShowSkillsModal(false);
    }
  };

  const handleDeleteAllSkills = async () => {
    if (user?.id) {
      try {
        // Mostrar indicador de carga
        setIsUpdatingSkills(true);
        console.log(
          "[ProfilePage] Starting to delete all skills for user:",
          user.id
        );

        const result = await deleteAllSkills(user.id);

        if (result.success) {
          setShowDeleteSkillsModal(false);

          addNotification("All skills have been deleted correctly", "success");

          window.location.href =
            window.location.pathname + "?ts=" + new Date().getTime();
        } else {
          addNotification(`Error deleting skills: ${result.message}`, "error");
        }
      } catch (error) {
        console.error("[ProfilePage] Error deleting skills:", error);
        addNotification(
          "An unexpected error occurred while deleting skills",
          "error"
        );
      } finally {
        // Ocultar indicador de carga
        setIsUpdatingSkills(false);
      }
    } else {
      // Si no hay usuario, solo cerrar el modal
      setShowDeleteSkillsModal(false);
    }
  };

  const handleRemoveVideoPresentation = async () => {
    setShowDeleteVideoModal(true);
  };

  const confirmDeleteVideo = async () => {
    if (user?.id) {
      try {
        const result = await removeVideoPresentation(user.id);

        if (result.success) {
          addNotification("Video presentation deleted correctly", "success");

          window.location.href =
            window.location.pathname + "?ts=" + new Date().getTime();
        } else {
          console.error(
            "[ProfilePage] Error deleting video presentation:",
            result.message
          );
          addNotification(
            `Error deleting video presentation: ${result.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error(
          "[ProfilePage] Error deleting video presentation:",
          error
        );
        addNotification(
          "An unexpected error occurred while deleting video presentation",
          "error"
        );
      } finally {
        setShowDeleteVideoModal(false);
      }
    }
  };

  const confirmDeletePCRequirements = async () => {
    if (user?.id) {
      try {
        const result = await deletePCRequirementsImages(user.id);

        if (result.success) {
          addNotification("PC requirements deleted correctly", "success");

          window.location.href =
            window.location.pathname + "?ts=" + new Date().getTime();
        } else {
          console.error(
            "[ProfilePage] Error deleting PC requirements:",
            result.error
          );
          addNotification(
            `Error deleting PC requirements: ${result.error}`,
            "error"
          );
        }
      } catch (error) {
        console.error("[ProfilePage] Error deleting PC requirements:", error);
        addNotification(
          "An unexpected error occurred while deleting PC requirements",
          "error"
        );
      } finally {
        setShowDeletePCRequirementsModal(false);
      }
    }
  };

  const confirmDeleteFormulario = async () => {
    if (user?.id) {
      try {
        const result = await eliminarDatosFormulario(user.id);

        if (result.success) {
          console.log("[ProfilePage] Form deleted correctly");
          addNotification("Form deleted correctly", "success");
        } else {
          console.error("[ProfilePage] Error deleting form:", result.error);
          addNotification(`Error deleting form: ${result.error}`, "error");
        }
      } catch (error) {
        console.error("[ProfilePage] Error deleting form:", error);
        addNotification(
          "An unexpected error occurred while deleting form",
          "error"
        );
      } finally {
        setShowDeleteFormularioModal(false);
      }
    }
  };

  const confirmDeleteExperience = async (experienceId: string) => {
    if (user?.id) {
      try {
        const result = await deleteExperience(user.id, experienceId);

        if (result.success) {
          addNotification("Experience deleted correctly", "success");
        } else {
          addNotification(
            `Error deleting experience: ${result.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error("[ProfilePage] Error deleting experience:", error);
        addNotification(
          "An unexpected error occurred while deleting experience",
          "error"
        );
      } finally {
        setExperienceIdToDelete("");
        setShowDeleteExperienceModal(false);
      }
    }
  };

  const confirmDeleteEducation = async (educationId: string) => {
    if (user?.id) {
      try {
        const result = await deleteEducation(user.id, educationId);

        if (result.success) {
          addNotification("Education deleted correctly", "success");
        } else {
          addNotification(
            `Error deleting education: ${result.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error("[ProfilePage] Error deleting education:", error);
        addNotification(
          "An unexpected error occurred while deleting education",
          "error"
        );
      } finally {
        setEducationIdToDelete("");
        setShowDeleteEducationModal(false);
      }
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setShowExperienceModal(true);
    setExperienceData(exp);
  };

  const handleDeleteExperience = (exp: Experience) => {
    if (exp && exp.id) {
      setExperienceIdToDelete(exp.id);
      setShowDeleteExperienceModal(true);
    }
  };

  const handleEditEducation = (edu: Education) => {
    setShowEducationModal(true);
    setEducationData(edu);
  };

  const handleDeleteEducation = (edu: Education) => {
    if (edu && edu.id) {
      setEducationIdToDelete(edu.id);
      setShowDeleteEducationModal(true);
    }
  };

  const isVisibleNotification =
    profile.datosFormulario &&
    Boolean(profile.archivos.videoPresentacion) &&
    profile.experiencia.length > 0 &&
    profile.educacion.length > 0 &&
    Boolean(profile.archivos.imagenRequerimientosPC) &&
    Boolean(profile.archivos.imagenTestVelocidad);

  const isVisibleNotification2 =
    !profile.archivos.imagenRequerimientosPC ||
    !profile.archivos.imagenTestVelocidad;

  const isVisibleNotification3 =
    profile.archivos.imagenRequerimientosPC ||
    profile.archivos.imagenTestVelocidad;

  const isDisabledContainer =
    profile.datosFormulario &&
    profile.habilidades.length === 0 &&
    profile.archivos.videoPresentacion &&
    isVisibleNotification2 &&
    profile.experiencia.length === 0 &&
    profile.educacion.length === 0 &&
    profile.datosPersonales.telefono &&
    profile.datosPersonales.residencia;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm mb-2">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-700">
              <ChevronLeft size={24} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-semibold">My Profile</h1>
          </div>
          <div className="flex items-center">
            <Logo />
          </div>
        </div>
      </header>

      {/* Información importante */}
      {!isVisibleNotification && (
        <div className="bg-blue-50 p-4 my-4 mx-4 rounded-lg flex items-start space-x-3 md:hidden">
          <Info className="text-blue-500 shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-800">Important Information</h3>
            <p className="text-sm text-blue-600 mt-1">
              Remember that you need to complete your profile to apply
            </p>
          </div>
        </div>
      )}

      {/* Lista de tareas mobile viwew */}
      <div className="px-4 space-y-0 relative md:hidden">
        {/* Card 1: Formulario */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">Complete Form</span>
          <div className="flex items-center justify-center gap-4">
            {profile.datosFormulario &&
            Object.keys(profile.datosFormulario).length > 0 ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={() => setShowDeleteFormularioModal(true)}
                />
                <Edit
                  className="cursor-pointer"
                  onClick={() => setShowViewFormularioModal(true)}
                />
              </div>
            ) : (
              <svg
                width="35"
                height="35"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={() => setShowFormularioModal(true)}
              >
                <circle cx="12.5" cy="12.5" r="12.5" fill="#0097B2" />
                <g clipPath="url(#clip0_161_384)">
                  <path
                    d="M11.875 7.5H7.5C7.16848 7.5 6.85054 7.6317 6.61612 7.86612C6.3817 8.10054 6.25 8.41848 6.25 8.75V17.5C6.25 17.8315 6.3817 18.1495 6.61612 18.3839C6.85054 18.6183 7.16848 18.75 7.5 18.75H16.25C16.5815 18.75 16.8995 18.6183 17.1339 18.3839C17.3683 18.1495 17.5 17.8315 17.5 17.5V13.125"
                    stroke="#FCFEFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5625 6.5625C16.8111 6.31386 17.1484 6.17417 17.5 6.17417C17.8516 6.17417 18.1889 6.31386 18.4375 6.5625C18.6861 6.81114 18.8258 7.14837 18.8258 7.5C18.8258 7.85163 18.6861 8.18886 18.4375 8.4375L12.5 14.375L10 15L10.625 12.5L16.5625 6.5625Z"
                    stroke="#FCFEFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_161_384">
                    <rect
                      width="15"
                      height="15"
                      fill="white"
                      transform="translate(5 5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
        </div>

        {/* Card 2: Datos de Contacto */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">Contact Information</span>
          <div className="flex items-center justify-center gap-4">
            {profile.datosPersonales.telefono &&
            profile.datosPersonales.residencia ? (
              <div className="flex items-center gap-2">
                <Edit
                  className="cursor-pointer"
                  onClick={() => setShowViewContactoModal(true)}
                />
              </div>
            ) : (
              <svg
                width="35"
                height="35"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={() => setShowContactoModal(true)}
              >
                <circle cx="12.5" cy="12.5" r="12.5" fill="#0097B2" />
                <g clipPath="url(#clip0_161_384)">
                  <path
                    d="M11.875 7.5H7.5C7.16848 7.5 6.85054 7.6317 6.61612 7.86612C6.3817 8.10054 6.25 8.41848 6.25 8.75V17.5C6.25 17.8315 6.3817 18.1495 6.61612 18.3839C6.85054 18.6183 7.16848 18.75 7.5 18.75H16.25C16.5815 18.75 16.8995 18.6183 17.1339 18.3839C17.3683 18.1495 17.5 17.8315 17.5 17.5V13.125"
                    stroke="#FCFEFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5625 6.5625C16.8111 6.31386 17.1484 6.17417 17.5 6.17417C17.8516 6.17417 18.1889 6.31386 18.4375 6.5625C18.6861 6.81114 18.8258 7.14837 18.8258 7.5C18.8258 7.85163 18.6861 8.18886 18.4375 8.4375L12.5 14.375L10 15L10.625 12.5L16.5625 6.5625Z"
                    stroke="#FCFEFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_161_384">
                    <rect
                      width="15"
                      height="15"
                      fill="white"
                      transform="translate(5 5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
        </div>

        {/* Card 3: Video */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">
            Upload Video Presentation
          </span>
          <div className="flex items-center justify-center gap-4">
            {profile.archivos.videoPresentacion ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={handleRemoveVideoPresentation}
                />
                <Edit
                  className="cursor-pointer"
                  onClick={() => setShowViewVideoModal(true)}
                />
              </div>
            ) : (
              <UploadFile
                className="cursor-pointer"
                onClick={() => setShowVideoModal(true)}
              />
            )}
          </div>
        </div>

        {/* Card 4: Skills */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">Add Skills</span>
          <div className="flex items-center justify-center gap-4">
            {profile.habilidades.length > 0 ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (user?.id) {
                      setShowDeleteSkillsModal(true);
                    }
                  }}
                />
                <Edit
                  className="cursor-pointer"
                  onClick={() => setShowViewSkillsModal(true)}
                />
              </div>
            ) : (
              <Add
                className="cursor-pointer"
                onClick={() => setShowSkillsModal(true)}
              />
            )}
          </div>
        </div>

        {/* Card 5: PC Requirements */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">
            Upload PC Requirements
          </span>
          <div className="flex items-center justify-center gap-4">
            {profile.archivos.imagenRequerimientosPC ||
            profile.archivos.imagenTestVelocidad ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={() => {
                    setShowDeletePCRequirementsModal(true);
                  }}
                />
                <Edit
                  className="cursor-pointer"
                  onClick={() => setShowViewPCRequirementsModal(true)}
                />
              </div>
            ) : (
              <svg
                width="35"
                height="35"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={() => setShowPCRequirementsModal(true)}
              >
                <circle cx="12.5" cy="12.5" r="12.5" fill="#0097B2" />
                <g clipPath="url(#clip0_161_384)">
                  <path
                    d="M18.125 14.375V16.875C18.125 17.2065 17.9933 17.5245 17.7589 17.7589C17.5245 17.9933 17.2065 18.125 16.875 18.125H8.125C7.79348 18.125 7.47554 17.9933 7.24112 17.7589C7.0067 17.5245 6.875 17.2065 6.875 16.875V14.375"
                    stroke="#FCFEFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.625 10L12.5 6.875L9.375 10"
                    stroke="#FCFEFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 6.875V14.375"
                    stroke="#FCFEFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_161_384">
                    <rect
                      width="15"
                      height="15"
                      fill="white"
                      transform="translate(5 5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Tabs mobile view */}
      <div className="mx-4 mt-6 mb-20 relative md:hidden">
        <div
          className="relative"
          style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }}
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
          <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white relative">
            {/* Experiencia o Educación */}
            {activeTab === "experiencia" ? (
              <div className="p-0">
                {profile.experiencia.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {profile.experiencia.map((exp) => (
                      <div key={exp.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">
                              {exp.cargo}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {exp.empresa}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {exp.fechaInicio} -{" "}
                              {exp.esActual ? "Presente" : exp.fechaFin}
                            </p>
                            <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                              {exp.descripcion}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteExperience(exp)}
                              className="text-red-500 p-1 rounded cursor-pointer"
                            >
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.75 5.5H4.58333H19.25"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.3335 5.49998V3.66665C7.3335 3.18042 7.52665 2.7141 7.87047 2.37028C8.21428 2.02647 8.6806 1.83331 9.16683 1.83331H12.8335C13.3197 1.83331 13.786 2.02647 14.1299 2.37028C14.4737 2.7141 14.6668 3.18042 14.6668 3.66665V5.49998M17.4168 5.49998V18.3333C17.4168 18.8195 17.2237 19.2859 16.8799 19.6297C16.536 19.9735 16.0697 20.1666 15.5835 20.1666H6.41683C5.9306 20.1666 5.46428 19.9735 5.12047 19.6297C4.77665 19.2859 4.5835 18.8195 4.5835 18.3333V5.49998H17.4168Z"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.1665 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.8335 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditExperience(exp)}
                              className="text-[#0097B2] p-1 hover:bg-blue-50 rounded"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15.8333 8.33332L11.6667 4.16666M2.5 17.5L6.875 16.4583C7.14867 16.3878 7.28551 16.3525 7.41074 16.2961C7.52179 16.2456 7.62627 16.1815 7.7216 16.1055C7.82944 16.0197 7.92189 15.9128 8.10678 15.6989L17.5 6.24999C18.4205 5.32954 18.4205 3.83377 17.5 2.91332C16.5795 1.99287 15.0838 1.99287 14.1633 2.91332L4.77011 12.3065C4.55621 12.4914 4.44926 12.5839 4.36343 12.6917C4.28746 12.787 4.22336 12.8915 4.17293 13.0026C4.11651 13.1278 4.08125 13.2646 4.01074 13.5383L3 17.5"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Add Experience
                      </span>
                      <div
                        className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setShowExperienceModal(true);
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
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
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-xl">
                      Add Experience
                    </span>
                    <div
                      className="w-12 h-12 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setShowExperienceModal(true);
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
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
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-0">
                {profile.educacion.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {profile.educacion.map((edu) => (
                      <div key={edu.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">
                              {edu.titulo}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {edu.institucion}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {edu.añoInicio} -{" "}
                              {edu.esActual ? "Presente" : edu.añoFin}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteEducation(edu)}
                              className="text-red-500 p-1 rounded cursor-pointer"
                            >
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.75 5.5H4.58333H19.25"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.3335 5.49998V3.66665C7.3335 3.18042 7.52665 2.7141 7.87047 2.37028C8.21428 2.02647 8.6806 1.83331 9.16683 1.83331H12.8335C13.3197 1.83331 13.786 2.02647 14.1299 2.37028C14.4737 2.7141 14.6668 3.18042 14.6668 3.66665V5.49998M17.4168 5.49998V18.3333C17.4168 18.8195 17.2237 19.2859 16.8799 19.6297C16.536 19.9735 16.0697 20.1666 15.5835 20.1666H6.41683C5.9306 20.1666 5.46428 19.9735 5.12047 19.6297C4.77665 19.2859 4.5835 18.8195 4.5835 18.3333V5.49998H17.4168Z"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.1665 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.8335 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditEducation(edu)}
                              className="text-[#0097B2] p-1 hover:bg-blue-50 rounded"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15.8333 8.33332L11.6667 4.16666M2.5 17.5L6.875 16.4583C7.14867 16.3878 7.28551 16.3525 7.41074 16.2961C7.52179 16.2456 7.62627 16.1815 7.7216 16.1055C7.82944 16.0197 7.92189 15.9128 8.10678 15.6989L17.5 6.24999C18.4205 5.32954 18.4205 3.83377 17.5 2.91332C16.5795 1.99287 15.0838 1.99287 14.1633 2.91332L4.77011 12.3065C4.55621 12.4914 4.44926 12.5839 4.36343 12.6917C4.28746 12.787 4.22336 12.8915 4.17293 13.0026C4.11651 13.1278 4.08125 13.2646 4.01074 13.5383L3 17.5"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Add Education
                      </span>
                      <div
                        className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setShowEducationModal(true);
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
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
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-xl">
                      Add Education
                    </span>
                    <div
                      className="w-12 h-12 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setShowEducationModal(true);
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
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
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Information view */}
      {!isDisabledContainer ? (
        <div className="hidden md:block md:mx-auto md:max-w-6xl md:px-6 lg:px-8">
          {!isVisibleNotification ? (
            <div className="hidden md:flex bg-blue-50 p-4 my-6 rounded-lg items-start space-x-3">
              <Info className="text-blue-500 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-blue-600">
                  Remember that you have to complete your profile to be able to
                  apply.
                </p>
              </div>
            </div>
          ) : null}
          <div className="relative mt-8">
            {/* Tarjetas */}
            <div className="grid grid-cols-2 gap-6 mb-20">
              {/* Primera fila */}
              {!profile.datosFormulario && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md relative"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <span className="text-gray-800 font-medium">
                    Fill out questionnaire
                  </span>
                  <div
                    className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowFormularioModal(true)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V14"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.5 3.50001C18.0304 2.96958 18.7348 2.67676 19.4645 2.67676C20.1942 2.67676 20.8986 2.96958 21.429 3.50001C21.9594 4.03044 22.2523 4.7348 22.2523 5.46448C22.2523 6.19417 21.9594 6.89853 21.429 7.42896L12 16.858L8 17.858L9 13.858L17.5 5.36501V3.50001Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {profile.habilidades.length === 0 && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <span className="text-gray-800 font-medium">Add skills</span>
                  <div
                    className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowSkillsModal(true)}
                  >
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                </div>
              )}

              {/* Segunda fila */}
              {!profile.archivos.videoPresentacion && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <span className="text-gray-800 font-medium">
                    Upload your video
                  </span>
                  <div
                    className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowVideoModal(true)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 8L12 3L7 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3V15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {isVisibleNotification2 && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <span className="text-gray-800 font-medium">
                    Computer specifications
                  </span>
                  <div
                    className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowPCRequirementsModal(true)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 8L12 3L7 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3V15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Tercera fila */}
              {profile.experiencia.length === 0 && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <span className="text-gray-800 font-medium">
                    Experience doing this service
                  </span>
                  <div
                    className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowExperienceModal(true)}
                  >
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                </div>
              )}

              {profile.educacion.length === 0 && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  <span className="text-gray-800 font-medium">Education</span>
                  <div
                    className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowEducationModal(true)}
                  >
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                </div>
              )}

              {!profile.datosPersonales.telefono &&
                !profile.datosPersonales.residencia && (
                  <div
                    className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-md relative"
                    style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                  >
                    <span className="text-gray-800 font-medium">
                      Contact Information
                    </span>
                    <div className="flex items-center justify-center gap-4">
                      <svg
                        width="35"
                        height="35"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer"
                        onClick={() => setShowContactoModal(true)}
                      >
                        <circle cx="12.5" cy="12.5" r="12.5" fill="#0097B2" />
                        <g clipPath="url(#clip0_161_384)">
                          <path
                            d="M11.875 7.5H7.5C7.16848 7.5 6.85054 7.6317 6.61612 7.86612C6.3817 8.10054 6.25 8.41848 6.25 8.75V17.5C6.25 17.8315 6.3817 18.1495 6.61612 18.3839C6.85054 18.6183 7.16848 18.75 7.5 18.75H16.25C16.5815 18.75 16.8995 18.6183 17.1339 18.3839C17.3683 18.1495 17.5 17.8315 17.5 17.5V13.125"
                            stroke="#FCFEFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16.5625 6.5625C16.8111 6.31386 17.1484 6.17417 17.5 6.17417C17.8516 6.17417 18.1889 6.31386 18.4375 6.5625C18.6861 6.81114 18.8258 7.14837 18.8258 7.5C18.8258 7.85163 18.6861 8.18886 18.4375 8.4375L12.5 14.375L10 15L10.625 12.5L16.5625 6.5625Z"
                            stroke="#FCFEFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_161_384">
                            <rect
                              width="15"
                              height="15"
                              fill="white"
                              transform="translate(5 5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Desktop view */}
      <div className="hidden md:block md:mx-auto md:max-w-6xl md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-between gap-4">
            {profile.datosFormulario && (
              <div
                className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span className="text-gray-800 font-medium">Questionnaire</span>
                <div className="flex items-center justify-center gap-4">
                  {profile.datosFormulario &&
                  Object.keys(profile.datosFormulario).length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Dump
                        className="cursor-pointer"
                        onClick={() => setShowDeleteFormularioModal(true)}
                      />
                      <Edit
                        className="cursor-pointer"
                        onClick={() => setShowViewFormularioModal(true)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            {profile.datosPersonales.telefono &&
              profile.datosPersonales.residencia && (
                <div
                  className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                  style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                >
                  <span className="text-gray-800 font-medium">
                    Contact Information
                  </span>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Edit
                        className="cursor-pointer"
                        onClick={() => setShowViewContactoModal(true)}
                      />
                    </div>
                  </div>
                </div>
              )}
            {profile.archivos.videoPresentacion && (
              <div
                className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span className="text-gray-800 font-medium">
                  Video presentation
                </span>
                <div className="flex items-center justify-center gap-4">
                  {profile.archivos.videoPresentacion ? (
                    <div className="flex items-center gap-2">
                      <Dump
                        className="cursor-pointer"
                        onClick={handleRemoveVideoPresentation}
                      />
                      <Edit
                        className="cursor-pointer"
                        onClick={() => setShowViewVideoModal(true)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            {profile.habilidades.length > 0 && (
              <div
                className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span className="text-gray-800 font-medium">Skills</span>
                <div className="flex items-center justify-center gap-4">
                  {profile.habilidades.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Dump
                        className="cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (user?.id) {
                            setShowDeleteSkillsModal(true);
                          }
                        }}
                      />
                      <Edit
                        className="cursor-pointer"
                        onClick={() => setShowViewSkillsModal(true)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            {profile.experiencia.length > 0 && (
              <div
                className="flex flex-col p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 text-xl font-medium">
                    Experience
                  </span>
                  <div className="p-4 flex items-center">
                    <div
                      className="w-8 h-8 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setShowExperienceModal(true);
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
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
                    </div>
                  </div>
                </div>
                {profile.experiencia.length > 0 && (
                  <div className="grid grid-cols-1 ">
                    {profile.experiencia.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">
                              {exp.empresa}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {exp.cargo}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {exp.fechaInicio} -{" "}
                              {exp.esActual ? "Presente" : exp.fechaFin}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteExperience(exp)}
                              className="text-red-500 p-1 rounded cursor-pointer "
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.75 5.5H4.58333H19.25"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.3335 5.49998V3.66665C7.3335 3.18042 7.52665 2.7141 7.87047 2.37028C8.21428 2.02647 8.6806 1.83331 9.16683 1.83331H12.8335C13.3197 1.83331 13.786 2.02647 14.1299 2.37028C14.4737 2.7141 14.6668 3.18042 14.6668 3.66665V5.49998M17.4168 5.49998V18.3333C17.4168 18.8195 17.2237 19.2859 16.8799 19.6297C16.536 19.9735 16.0697 20.1666 15.5835 20.1666H6.41683C5.9306 20.1666 5.46428 19.9735 5.12047 19.6297C4.77665 19.2859 4.5835 18.8195 4.5835 18.3333V5.49998H17.4168Z"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.1665 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.8335 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditExperience(exp)}
                              className="text-[#0097B2] p-1 cursor-pointer rounded"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15.8333 8.33332L11.6667 4.16666M2.5 17.5L6.875 16.4583C7.14867 16.3878 7.28551 16.3525 7.41074 16.2961C7.52179 16.2456 7.62627 16.1815 7.7216 16.1055C7.82944 16.0197 7.92189 15.9128 8.10678 15.6989L17.5 6.24999C18.4205 5.32954 18.4205 3.83377 17.5 2.91332C16.5795 1.99287 15.0838 1.99287 14.1633 2.91332L4.77011 12.3065C4.55621 12.4914 4.44926 12.5839 4.36343 12.6917C4.28746 12.787 4.22336 12.8915 4.17293 13.0026C4.11651 13.1278 4.08125 13.2646 4.01074 13.5383L3 17.5"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between gap-4">
            {isVisibleNotification3 && (
              <div
                className="flex flex-col p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium">
                    Computer specifications
                  </span>
                  <div className="flex items-center justify-end mt-4">
                    <div className="flex items-center gap-2">
                      {profile.archivos.imagenRequerimientosPC ||
                      profile.archivos.imagenTestVelocidad ? (
                        <>
                          <Dump
                            className="cursor-pointer"
                            onClick={() => {
                              setShowDeletePCRequirementsModal(true);
                            }}
                          />
                          <Edit
                            className="cursor-pointer"
                            onClick={() => setShowViewPCRequirementsModal(true)}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                {profile.archivos.imagenRequerimientosPC && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      PC Specs
                    </h3>
                    <div className="text-white rounded-md">
                      <img
                        src={`${profile.archivos.imagenRequerimientosPC}`}
                        alt="PC Specifications"
                        className="w-[50%] h-auto"
                      />
                    </div>
                  </div>
                )}

                {profile.archivos.imagenTestVelocidad && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Internet Speed
                    </h3>
                    <div className="text-white rounded-md">
                      <img
                        src={`${profile.archivos.imagenTestVelocidad}`}
                        alt="Internet Speed Test"
                        className="w-[50%] h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {profile.educacion.length > 0 && (
              <div
                className="flex flex-col p-6 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 text-xl font-medium">
                    Education
                  </span>
                  <div className="p-4 flex items-center">
                    <div
                      className="w-8 h-8 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setShowExperienceModal(true);
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
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
                    </div>
                  </div>
                </div>
                {profile.educacion.length > 0 && (
                  <div className="grid grid-cols-1 ">
                    {profile.educacion.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">
                              {edu.titulo}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {edu.institucion}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {edu.añoInicio} -{" "}
                              {edu.esActual ? "Presente" : edu.añoFin}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteEducation(edu)}
                              className="text-red-500 p-1 rounded cursor-pointer "
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.75 5.5H4.58333H19.25"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.3335 5.49998V3.66665C7.3335 3.18042 7.52665 2.7141 7.87047 2.37028C8.21428 2.02647 8.6806 1.83331 9.16683 1.83331H12.8335C13.3197 1.83331 13.786 2.02647 14.1299 2.37028C14.4737 2.7141 14.6668 3.18042 14.6668 3.66665V5.49998M17.4168 5.49998V18.3333C17.4168 18.8195 17.2237 19.2859 16.8799 19.6297C16.536 19.9735 16.0697 20.1666 15.5835 20.1666H6.41683C5.9306 20.1666 5.46428 19.9735 5.12047 19.6297C4.77665 19.2859 4.5835 18.8195 4.5835 18.3333V5.49998H17.4168Z"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.1665 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.8335 10.0833V15.5833"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditEducation(edu)}
                              className="text-[#0097B2] p-1 cursor-pointer rounded"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15.8333 8.33332L11.6667 4.16666M2.5 17.5L6.875 16.4583C7.14867 16.3878 7.28551 16.3525 7.41074 16.2961C7.52179 16.2456 7.62627 16.1815 7.7216 16.1055C7.82944 16.0197 7.92189 15.9128 8.10678 15.6989L17.5 6.24999C18.4205 5.32954 18.4205 3.83377 17.5 2.91332C16.5795 1.99287 15.0838 1.99287 14.1633 2.91332L4.77011 12.3065C4.55621 12.4914 4.44926 12.5839 4.36343 12.6917C4.28746 12.787 4.22336 12.8915 4.17293 13.0026C4.11651 13.1278 4.08125 13.2646 4.01074 13.5383L3 17.5"
                                  stroke="#0097B2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales de edición */}
      <FormularioModal
        isOpen={showFormularioModal}
        onClose={() => setShowFormularioModal(false)}
      />

      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
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
        onClose={() => setShowPCRequirementsModal(false)}
      />

      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={handleCloseExperienceModal}
        onSave={handleSaveExperience}
        experienceData={experienceData || undefined}
      />

      <EducationModal
        isOpen={showEducationModal}
        onClose={handleCloseEducationModal}
        onSave={handleSaveEducation}
        educationData={educationData || undefined}
      />

      {/* Nuevos modales de visualización */}
      <ViewFormularioModal
        isOpen={showViewFormularioModal}
        onClose={() => setShowViewFormularioModal(false)}
      />

      <ViewVideoModal
        isOpen={showViewVideoModal}
        onClose={() => setShowViewVideoModal(false)}
      />

      <ViewSkillsModal
        isOpen={showViewSkillsModal}
        onClose={() => setShowViewSkillsModal(false)}
        skills={profile.habilidades}
        onEdit={() => {
          setShowViewSkillsModal(false);
          setShowSkillsModal(true);
        }}
      />

      <ViewPCRequirementsModal
        isOpen={showViewPCRequirementsModal}
        onClose={() => setShowViewPCRequirementsModal(false)}
      />

      {/* Modales de confirmación */}

      <ConfirmDeleteModal
        isOpen={showDeleteFormularioModal}
        onClose={() => setShowDeleteFormularioModal(false)}
        onConfirm={confirmDeleteFormulario}
        title="Delete Form"
        message="Are you sure you want to delete the form? This action cannot be undone."
      />

      <ConfirmDeleteModal
        isOpen={showDeleteSkillsModal}
        onClose={() => setShowDeleteSkillsModal(false)}
        onConfirm={handleDeleteAllSkills}
        title="Delete Skills"
        message="Are you sure you want to delete all your skills? This action cannot be undone."
      />

      <ConfirmDeleteModal
        isOpen={showDeleteVideoModal}
        onClose={() => setShowDeleteVideoModal(false)}
        onConfirm={confirmDeleteVideo}
        title="Delete Video"
        message="Are you sure you want to delete this video presentation? This action cannot be undone."
      />

      <ConfirmDeleteModal
        isOpen={showDeletePCRequirementsModal}
        onClose={() => setShowDeletePCRequirementsModal(false)}
        onConfirm={confirmDeletePCRequirements}
        title="Delete PC Requirements"
        message="Are you sure you want to delete the PC requirements? This action cannot be undone."
      />

      <ConfirmDeleteModal
        isOpen={showDeleteExperienceModal}
        onClose={() => setShowDeleteExperienceModal(false)}
        onConfirm={() => confirmDeleteExperience(experienceIdToDelete)}
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
      />

      <ConfirmDeleteModal
        isOpen={showDeleteEducationModal}
        onClose={() => setShowDeleteEducationModal(false)}
        onConfirm={() => confirmDeleteEducation(educationIdToDelete)}
        title="Delete Education"
        message="Are you sure you want to delete this education? This action cannot be undone."
      />

      <ViewContactoModal
        isOpen={showViewContactoModal}
        onClose={() => setShowViewContactoModal(false)}
        onEdit={() => {
          setShowViewContactoModal(false);
          setShowEditContactoModal(true);
        }}
      />

      <ContactoModal
        isOpen={showContactoModal}
        onClose={() => setShowContactoModal(false)}
      />

      <ContactoModal
        isOpen={showEditContactoModal}
        onClose={() => setShowEditContactoModal(false)}
      />
    </div>
  );
}
