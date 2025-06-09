"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminExperienceModal, { AdminExperience } from "./AdminExperienceModal";
import {
  getCandidateExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../actions/experience.actions";

interface AdminExperienceManagerProps {
  candidateId: string;
}

export default function AdminExperienceManager({
  candidateId,
}: AdminExperienceManagerProps) {
  const { addNotification } = useNotificationStore();
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<
    AdminExperience | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const response = await getCandidateExperiences(candidateId);
      if (response.success) {
        setExperiences(response.data);
      } else {
        addNotification("Error al cargar experiencias", "error");
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      addNotification("Error al cargar experiencias", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (candidateId) {
      fetchExperiences();
    }
  }, [candidateId]);

  const handleOpenModal = (experience?: AdminExperience) => {
    setCurrentExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentExperience(undefined);
  };

  const handleSaveExperience = async (data: AdminExperience) => {
    try {
      if (data.id) {
        // Actualizar experiencia existente
        const response = await updateExperience(data.id, candidateId, data);
        if (response.success) {
          addNotification("Experiencia actualizada correctamente", "success");
          fetchExperiences();
        } else {
          addNotification("Error al actualizar experiencia", "error");
        }
      } else {
        // Crear nueva experiencia
        const response = await createExperience(candidateId, data);
        if (response.success) {
          addNotification("Experiencia creada correctamente", "success");
          fetchExperiences();
        } else {
          addNotification("Error al crear experiencia", "error");
        }
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      addNotification("Error al guardar experiencia", "error");
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta experiencia?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteExperience(experienceId, candidateId);
      if (response.success) {
        addNotification("Experiencia eliminada correctamente", "success");
        fetchExperiences();
      } else {
        addNotification("Error al eliminar experiencia", "error");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      addNotification("Error al eliminar experiencia", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="font-medium text-lg text-gray-900">
          Experiencia Laboral
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center text-sm font-medium text-[#0097B2] hover:text-[#007d8a]"
        >
          <Plus size={16} className="mr-1" />
          Agregar experiencia
        </button>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-pulse">Cargando experiencias...</div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No hay experiencias registradas para este candidato
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(experience)}
                    className="text-gray-500 hover:text-[#0097B2]"
                    title="Editar"
                    disabled={isDeleting}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() =>
                      experience.id && handleDeleteExperience(experience.id)
                    }
                    className="text-gray-500 hover:text-red-500"
                    title="Eliminar"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="font-medium text-gray-800">
                  {experience.cargo}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {experience.empresa}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {experience.fechaInicio} -{" "}
                  {experience.esActual ? "Presente" : experience.fechaFin}
                </p>
                <p className="text-sm text-gray-700 mt-3">
                  {experience.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminExperienceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveExperience}
        experienceData={currentExperience}
      />
    </div>
  );
}
