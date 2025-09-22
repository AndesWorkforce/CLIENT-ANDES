import { useState, useEffect } from "react";
import { Phone, Mail, FileText, Play, X, Pause, Edit } from "lucide-react";
import Link from "next/link";
import ProfileModalSkeleton from "./ProfileModalSkeleton";
import { getProfile } from "../actions/profile.actions";
import { useNotificationStore } from "@/store/notifications.store";
import { PerfilCompleto } from "@/app/types/profile";
import ViewFormularioModal from "./ViewFormularioModal";
import ImageViewer from "./ImageViewer";
import PDFDownloadButton from "./PDFDownloadButton";
import AdminExperienceManager from "./AdminExperienceManager";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  candidateId,
}: ProfileModalProps) {
  const { addNotification } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    "experience"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<PerfilCompleto | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isFormularioModalOpen, setIsFormularioModalOpen] =
    useState<boolean>(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getProfile(candidateId);
        if (response.success) {
          addNotification("Profile loaded correctly", "success");
          setProfile(response.data.data);
        }
      } catch (error) {
        addNotification("Error loading profile", "error");
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, candidateId]);

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isOpen) return null;

  const isProfileIncomplete =
    !profile?.datosPersonales.nombre ||
    !profile?.datosPersonales.apellido ||
    !profile?.datosPersonales.telefono ||
    !profile?.datosPersonales.correo ||
    !profile?.datosFormulario ||
    !profile?.educacion.length ||
    !profile?.experiencia.length ||
    !profile?.habilidades.length ||
    !profile?.archivos.videoPresentacion ||
    !profile?.archivos.imagenTestVelocidad ||
    !profile?.archivos.imagenRequerimientosPC;

  if (isLoading || !profile) {
    return <ProfileModalSkeleton isOpen={isOpen} onClose={onClose} />;
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div
          className="relative p-4 bg-white w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg custom-scrollbar"
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
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-2">
                  Profile incomplete: Missing data.
                </div>
              )}
              {/* Contact Info Card */}
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
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/dashboard/candidates/${candidateId}`}
                        className="flex items-center justify-center px-3 py-1.5 bg-[#0097B2] text-white rounded-md hover:bg-[#007a8f] transition-colors"
                      >
                        <Edit size={16} className="mr-1.5" />
                        <span>Edit profile</span>
                      </Link>

                      {!isProfileIncomplete && (
                        <PDFDownloadButton profile={profile} />
                      )}
                    </div>
                  </div>
                  <hr className="border-[#E2E2E2] my-2" />
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Phone size={18} className="text-[#0097B2] mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        {profile.datosPersonales.telefono || (
                          <span className="text-gray-400">No phone</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Mail size={18} className="text-[#0097B2] mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        {profile.datosPersonales.correo || (
                          <span className="text-gray-400">No email</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Button */}
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
                    <h2 className="font-medium text-gray-900 mb-3">
                      Presentation video
                    </h2>
                    <div className="aspect-video bg-gray-100 rounded relative group">
                      <video
                        ref={setVideoRef}
                        src={profile.archivos.videoPresentacion as string}
                        className="w-full h-full object-cover rounded"
                        onEnded={() => setIsPlaying(false)}
                        controls={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={togglePlay}
                          className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause size={32} className="text-[#0097B2]" />
                          ) : (
                            <Play size={32} className="text-[#0097B2] ml-1" />
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

              {/* Imágenes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <h2 className="font-medium text-gray-900 mb-3">
                    PC specifications
                  </h2>
                  <ImageViewer
                    images={[
                      profile.archivos?.imagenTestVelocidad,
                      profile.archivos?.imagenRequerimientosPC,
                    ].filter(Boolean)}
                  />
                </div>
              </div>

              {/* Experience/Education tabs */}
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
                        activeTab === "experience"
                          ? "text-[#6B7280] border-gray-300 border-r border-b-0 relative z-20 bg-white"
                          : "text-gray-500 border-gray-300 border-b border-r-0"
                      }`}
                      onClick={() => setActiveTab("experience")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="text-lg font-medium">Experience</span>
                    </div>

                    {/* Educación */}
                    <div
                      className={`py-3 px-8 rounded-tr-2xl border-t ${
                        activeTab === "education"
                          ? "text-[#6B7280] border-gray-300 border-r border-b-0 relative z-20 bg-white"
                          : "text-gray-500 border-gray-300 border-b border-r"
                      }`}
                      onClick={() => setActiveTab("education")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="text-lg font-medium">Education</span>
                    </div>

                    {/* Resto del borde superior */}
                    <div className="flex-grow border-b border-gray-300" />

                    {/* Botón de edición de experiencia en la esquina derecha */}
                    <div className="border-b border-gray-300 flex items-center">
                      <button
                        onClick={() => setIsExperienceModalOpen(true)}
                        className="ml-2 flex items-center text-[#0097B2] hover:text-[#007d8a] px-2"
                        title="Editar experiencias"
                      >
                        <Edit size={16} className="mr-1" />
                        <span className="text-sm">Editar</span>
                      </button>
                    </div>
                  </div>

                  {/* Segunda sección - Panel con contenido */}
                  <div className="border-l border-r border-b border-gray-300 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-white relative p-4">
                    {activeTab === "experience" ? (
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
                                    No position
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
                                {exp.fechaFin || "Present"}
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
                                    No title
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
                                {edu.añoFin || "Present"}
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
              onClick={() => setIsExperienceModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-medium text-[#0097B2] mb-4">
                Manage Experience
              </h2>
              <AdminExperienceManager candidateId={candidateId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
