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
import { useProfileContext } from "./context/ProfileContext";
import Dump from "@/components/icons/Dump";
import Edit from "@/components/icons/Edit";
import UploadFile from "@/components/icons/UploadFile";
import Add from "@/components/icons/Add";
import { Experience } from "../types/experience";
import { Education } from "../types/education";
import { Skill } from "../types/skill";
import { Task } from "../types/task";
import { EducationData } from "../types/education-data";
import { ExperienceData } from "../types/experience-data";

export default function ProfilePage() {
  const { profile } = useProfileContext();

  console.log(profile);

  const [activeTab, setActiveTab] = useState<"experiencia" | "educacion">(
    "experiencia"
  );
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showPCRequirementsModal, setShowPCRequirementsModal] = useState(false);
  const [showViewFormularioModal, setShowViewFormularioModal] = useState(false);
  const [showViewVideoModal, setShowViewVideoModal] = useState(false);
  const [showViewSkillsModal, setShowViewSkillsModal] = useState(false);
  const [showViewPCRequirementsModal, setShowViewPCRequirementsModal] =
    useState(false);
  const [skills, setSkills] = useState<Skill[]>(profile.habilidades || []);
  console.log("skills", skills);
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      position: "Diseñadora Gráfica",
      company: "Mercado Libre",
      startDate: "Nov 2024",
      endDate: "Presente",
      currentlyWorking: true,
      description:
        "Creación de wireframes y prototipos en baja, media y alta fidelidad, asegurando una experiencia de usuario intuitiva y alineada con los objetivos del negocio. Coordino el handoff con los desarrolladores, proporcionando documentación detallada para asegurar la implementación correcta del diseño.",
    },
    {
      id: "2",
      position: "Diseñadora Gráfica",
      company: "Mercado Libre",
      startDate: "Nov 2024",
      endDate: "Presente",
      currentlyWorking: true,
      description:
        "Creación de wireframes y prototipos en baja, media y alta fidelidad, asegurando una experiencia de usuario intuitiva y alineada con los objetivos del negocio. Coordino el handoff con los desarrolladores, proporcionando documentación detallada para asegurar la implementación correcta del diseño.",
    },
  ]);
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "Diseño UX/UI",
      institution: "Coderhouse",
      field: "Diseño",
      startDate: "Feb 2022",
      endDate: "Dic 2022",
      currentlyStudying: false,
      description:
        "Especialización en diseño de interfaces digitales, usabilidad y experiencia de usuario. Desarrollé proyectos prácticos aplicando metodologías centradas en el usuario y técnicas de prototipado.",
    },
  ]);
  const [selectedExperience, setSelectedExperience] = useState<
    ExperienceData | undefined
  >(undefined);
  const [selectedEducation, setSelectedEducation] = useState<
    EducationData | undefined
  >(undefined);

  // Inicializar tareas y su estado de completado
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Completar formulario",
      completed: false,
      icon: () => (
        <svg
          width="35"
          height="35"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      ),
    },
    {
      id: 2,
      title: "Subir video presentación",
      completed: false,
      icon: () => (
        <svg
          width="35"
          height="35"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      ),
    },
    {
      id: 3,
      title: "Agregar skills",
      completed: false,
      icon: () => (
        <svg
          width="35"
          height="35"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12.5" cy="12.5" r="12.5" fill="#0097B2" />
          <path
            d="M18.5 12.75H7"
            stroke="#FCFEFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.75 7V18.5"
            stroke="#FCFEFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Subir requerimientos PC",
      completed: false,
      icon: () => (
        <svg
          width="35"
          height="35"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      ),
    },
  ]);

  const handleSaveExperience = (data: ExperienceData) => {
    if (data.id) {
      // Actualizar experiencia existente
      const updatedExperience = data as Experience;
      setExperiences(
        experiences.map((exp) => (exp.id === data.id ? updatedExperience : exp))
      );
    } else {
      // Agregar nueva experiencia con ID único
      const newExperience: Experience = { ...data, id: Date.now().toString() };
      setExperiences([...experiences, newExperience]);
    }

    // Limpiar la experiencia seleccionada
    setSelectedExperience(undefined);
  };

  const handleSaveEducation = (data: EducationData) => {
    if (data.id) {
      // Actualizar educación existente
      const updatedEducation = data as Education;
      setEducation(
        education.map((edu) => (edu.id === data.id ? updatedEducation : edu))
      );
    } else {
      // Agregar nueva educación con ID único
      const newEducation: Education = { ...data, id: Date.now().toString() };
      setEducation([...education, newEducation]);
    }

    // Limpiar la educación seleccionada
    setSelectedEducation(undefined);
  };

  // const handleEditExperience = (exp: any) => {
  //   setSelectedExperience(exp);
  //   setShowExperienceModal(true);
  // };

  const handleEditEducation = (edu: EducationData) => {
    setSelectedEducation(edu);
    setShowEducationModal(true);
  };

  const handleCloseExperienceModal = () => {
    setShowExperienceModal(false);
    setSelectedExperience(undefined);
  };

  const handleCloseEducationModal = () => {
    setShowEducationModal(false);
    setSelectedEducation(undefined);
  };

  const handleSaveFormulario = () => {
    // Actualizar el estado de la tarea como completada
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((task) => task.id === 1);
    if (taskIndex !== -1) {
      updatedTasks[taskIndex].completed = true;
      setTasks(updatedTasks);
    }
  };

  const handleSaveVideo = () => {
    // Actualizar el estado de la tarea como completada
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((task) => task.id === 2);
    if (taskIndex !== -1) {
      updatedTasks[taskIndex].completed = true;
      setTasks(updatedTasks);
    }
  };

  const handleSaveSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);

    // Actualizar el estado de la tarea como completada si hay skills
    if (newSkills.length > 0) {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((task) => task.id === 3);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].completed = true;
        setTasks(updatedTasks);
      }
    }
  };

  const handleSavePCRequirements = () => {
    // Actualizar el estado de la tarea como completada
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((task) => task.id === 4);
    if (taskIndex !== -1) {
      updatedTasks[taskIndex].completed = true;
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-700">
              <ChevronLeft size={24} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-semibold">Mi perfil</h1>
          </div>
          <div className="flex items-center">
            <Logo />
          </div>
        </div>
      </header>

      {/* Información importante */}
      <div className="bg-blue-50 p-4 my-4 mx-4 rounded-lg flex items-start space-x-3">
        <Info className="text-blue-500 shrink-0 mt-1" size={20} />
        <div>
          <h3 className="font-medium text-blue-800">Información importante</h3>
          <p className="text-sm text-blue-600 mt-1">
            Recuerda que tienes que completar tu perfil para poder postularte
          </p>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="px-4 space-y-0 relative">
        {/* Card 1: Formulario */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">
            Completar formulario
          </span>
          <div
            className="flex items-center justify-center gap-4"
            onClick={() =>
              profile.datosFormulario
                ? setShowViewFormularioModal(true)
                : setShowFormularioModal(true)
            }
          >
            {profile.datosFormulario ? (
              <div className="flex items-center gap-2">
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
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_599_11255)">
                    <path
                      d="M10.0835 3.66669H3.66683C3.1806 3.66669 2.71428 3.85984 2.37047 4.20366C2.02665 4.54747 1.8335 5.01379 1.8335 5.50002V18.3334C1.8335 18.8196 2.02665 19.2859 2.37047 19.6297C2.71428 19.9735 3.1806 20.1667 3.66683 20.1667H16.5002C16.9864 20.1667 17.4527 19.9735 17.7965 19.6297C18.1403 19.2859 18.3335 18.8196 18.3335 18.3334V11.9167"
                      stroke="#0097B2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.9585 2.29165C17.3232 1.92698 17.8178 1.72211 18.3335 1.72211C18.8492 1.72211 19.3438 1.92698 19.7085 2.29165C20.0732 2.65632 20.278 3.15093 20.278 3.66665C20.278 4.18238 20.0732 4.67698 19.7085 5.04165L11.0002 13.75L7.3335 14.6667L8.25016 11L16.9585 2.29165Z"
                      stroke="#0097B2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_599_11255">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            ) : (
              <svg
                width="35"
                height="35"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

        {/* Card 2: Video */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">
            Subir video presentación
          </span>
          <div className="flex items-center justify-center gap-4">
            {!profile.archivos.videoPresentacion ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={() => {
                    console.log("click");
                  }}
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

        {/* Card 3: Skills */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">Agregar skills</span>
          <div
            className="flex items-center justify-center gap-4"
            onClick={() =>
              tasks[2].completed
                ? setShowViewSkillsModal(true)
                : setShowSkillsModal(true)
            }
          >
            {profile.habilidades.length > 0 ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={() => {
                    console.log("click");
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

        {/* Card 4: PC Requirements */}
        <div
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-4 relative z-10"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <span className="text-gray-800 font-medium">
            Subir requerimientos PC
          </span>
          <div
            className="flex items-center justify-center gap-4"
            onClick={() =>
              tasks[3].completed
                ? setShowViewPCRequirementsModal(true)
                : setShowPCRequirementsModal(true)
            }
          >
            {tasks[3].completed ? (
              <div className="flex items-center gap-2">
                <Dump
                  className="cursor-pointer"
                  onClick={() => {
                    console.log("click");
                  }}
                />
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_599_11255)">
                    <path
                      d="M10.0835 3.66669H3.66683C3.1806 3.66669 2.71428 3.85984 2.37047 4.20366C2.02665 4.54747 1.8335 5.01379 1.8335 5.50002V18.3334C1.8335 18.8196 2.02665 19.2859 2.37047 19.6297C2.71428 19.9735 3.1806 20.1667 3.66683 20.1667H16.5002C16.9864 20.1667 17.4527 19.9735 17.7965 19.6297C18.1403 19.2859 18.3335 18.8196 18.3335 18.3334V11.9167"
                      stroke="#0097B2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.9585 2.29165C17.3232 1.92698 17.8178 1.72211 18.3335 1.72211C18.8492 1.72211 19.3438 1.92698 19.7085 2.29165C20.0732 2.65632 20.278 3.15093 20.278 3.66665C20.278 4.18238 20.0732 4.67698 19.7085 5.04165L11.0002 13.75L7.3335 14.6667L8.25016 11L16.9585 2.29165Z"
                      stroke="#0097B2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_599_11255">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            ) : (
              <svg
                width="35"
                height="35"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

      {/* Tabs */}
      <div className="mx-4 mt-6 mb-20 relative">
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
          <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white relative">
            {/* Experiencia o Educación */}
            {activeTab === "experiencia" ? (
              <div className="p-0">
                {experiences.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">
                              {exp.position}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {exp.company}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {exp.startDate} -{" "}
                              {exp.currentlyWorking ? "Presente" : exp.endDate}
                            </p>
                            <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                              {exp.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setExperiences(
                                  experiences.filter((e) => e.id !== exp.id)
                                );
                              }}
                              className="text-red-500 p-1 hover:bg-red-50 rounded"
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
                              onClick={() => {
                                setExperiences(
                                  experiences.filter((e) => e.id !== exp.id)
                                );
                              }}
                              className="text-red-500 p-1 hover:bg-red-50 rounded"
                            >
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_599_11255)">
                                  <path
                                    d="M10.0835 3.66669H3.66683C3.1806 3.66669 2.71428 3.85984 2.37047 4.20366C2.02665 4.54747 1.8335 5.01379 1.8335 5.50002V18.3334C1.8335 18.8196 2.02665 19.2859 2.37047 19.6297C2.71428 19.9735 3.1806 20.1667 3.66683 20.1667H16.5002C16.9864 20.1667 17.4527 19.9735 17.7965 19.6297C18.1403 19.2859 18.3335 18.8196 18.3335 18.3334V11.9167"
                                    stroke="#0097B2"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M16.9585 2.29165C17.3232 1.92698 17.8178 1.72211 18.3335 1.72211C18.8492 1.72211 19.3438 1.92698 19.7085 2.29165C20.0732 2.65632 20.278 3.15093 20.278 3.66665C20.278 4.18238 20.0732 4.67698 19.7085 5.04165L11.0002 13.75L7.3335 14.6667L8.25016 11L16.9585 2.29165Z"
                                    stroke="#0097B2"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_599_11255">
                                    <rect width="22" height="22" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Agregar Experiencia
                      </span>
                      <div
                        className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                        onClick={() => setShowExperienceModal(true)}
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
                      Agregar Experiencia
                    </span>
                    <div
                      className="w-12 h-12 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                      onClick={() => setShowExperienceModal(true)}
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
                {education.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">
                              {edu.degree}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {edu.institution}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {edu.startDate} -{" "}
                              {edu.currentlyStudying ? "Presente" : edu.endDate}
                            </p>
                            <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                              {edu.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
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
                            <button
                              onClick={() => {
                                setEducation(
                                  education.filter((e) => e.id !== edu.id)
                                );
                              }}
                              className="text-red-500 p-1 hover:bg-red-50 rounded"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.5 5H17.5M15.8333 5L15.1105 13.8622C15.0482 14.9616 14.9878 15.5113 14.7523 15.9257C14.5452 16.2912 14.2495 16.5868 13.884 16.7939C13.4696 17.0294 12.9199 17.0898 11.8205 17.0898H8.17949C7.08014 17.0898 6.53046 17.0294 6.11603 16.7939C5.75049 16.5868 5.45483 16.2912 5.24769 15.9257C5.01225 15.5113 4.95184 14.9616 4.88954 13.8622L4.16667 5M8.33333 8.75V13.4167M11.6667 8.75V13.4167M12.5 5L11.9436 3.33171C11.7895 2.87904 11.7124 2.6527 11.5841 2.4782C11.471 2.32487 11.3237 2.20072 11.1551 2.11719C10.965 2.02304 10.7398 2 10.2894 2H9.71062C9.26019 2 9.03497 2.02304 8.8449 2.11719C8.67632 2.20072 8.52897 2.32487 8.41589 2.4782C8.28755 2.6527 8.2105 2.87904 8.05641 3.33171L7.5 5"
                                  stroke="#FF3B30"
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
                        Agregar Educación
                      </span>
                      <div
                        className="w-10 h-10 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                        onClick={() => setShowEducationModal(true)}
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
                      Agregar Educación
                    </span>
                    <div
                      className="w-12 h-12 rounded-full bg-[#0097B2] flex items-center justify-center cursor-pointer"
                      onClick={() => setShowEducationModal(true)}
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

      {/* Modales */}
      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={handleCloseExperienceModal}
        onSave={handleSaveExperience}
        experienceData={selectedExperience}
      />

      <EducationModal
        isOpen={showEducationModal}
        onClose={handleCloseEducationModal}
        onSave={handleSaveEducation}
        educationData={selectedEducation}
      />

      <FormularioModal
        isOpen={showFormularioModal}
        onClose={() => setShowFormularioModal(false)}
        onSave={handleSaveFormulario}
      />

      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onSave={handleSaveVideo}
      />

      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        onSave={handleSaveSkills}
        initialSkills={profile.habilidades}
      />

      <PCRequirementsModal
        isOpen={showPCRequirementsModal}
        onClose={() => setShowPCRequirementsModal(false)}
        onSave={handleSavePCRequirements}
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
    </div>
  );
}
