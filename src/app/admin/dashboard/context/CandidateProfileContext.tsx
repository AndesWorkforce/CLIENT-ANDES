"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PerfilCompleto } from "@/app/types/profile";
import { getProfile } from "../actions/profile.actions";
import { useNotificationStore } from "@/store/notifications.store";

// Definimos la interfaz para el contexto
interface CandidateProfileContextType {
  profile: PerfilCompleto | null;
  isLoading: boolean;
  loadProfile: (candidateId: string) => Promise<void>;
  clearProfile: () => void;
}

// Creamos el contexto con un valor predeterminado
const CandidateProfileContext = createContext<CandidateProfileContextType>({
  profile: null,
  isLoading: false,
  loadProfile: async () => {},
  clearProfile: () => {},
});

// Hook para usar el contexto
export const useCandidateProfile = () => useContext(CandidateProfileContext);

// Interfaz para las props del provider
interface CandidateProfileProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const CandidateProfileProvider = ({
  children,
}: CandidateProfileProviderProps) => {
  const [profile, setProfile] = useState<PerfilCompleto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addNotification } = useNotificationStore();

  // Función para cargar el perfil de un candidato
  const loadProfile = async (candidateId: string) => {
    console.log(
      "[CandidateProfileContext] Iniciando carga de perfil para ID:",
      candidateId
    );
    setIsLoading(true);
    try {
      console.log("[CandidateProfileContext] Llamando a getProfile API");
      const response = await getProfile(candidateId);
      console.log("[CandidateProfileContext] Respuesta de API:", response);

      if (response.success) {
        console.log("[CandidateProfileContext] Perfil obtenido con éxito");
        // Verificamos la estructura de los datos
        if (response.data && response.data.data) {
          console.log(
            "[CandidateProfileContext] Estructura de datos correcta, actualizando estado"
          );
          setProfile(response.data.data);
          addNotification("Perfil cargado correctamente", "success");
        } else {
          console.error(
            "[CandidateProfileContext] Estructura de datos incorrecta:",
            response.data
          );
          addNotification(
            "Error en la estructura de datos del perfil",
            "error"
          );
          setProfile(null);
        }
      } else {
        console.error(
          "[CandidateProfileContext] Error en la respuesta:",
          response
        );
        addNotification("Error al cargar el perfil", "error");
        setProfile(null);
      }
    } catch (error) {
      console.error("[CandidateProfileContext] Error en la petición:", error);
      // Mensajes específicos para ciertos errores
      const errorMsg = String(error);
      if (errorMsg.includes("429")) {
        addNotification("Demasiadas peticiones. Espera un momento.", "error");
      } else {
        addNotification("Error al cargar el perfil", "error");
      }
      setProfile(null);
    } finally {
      setIsLoading(false);
      console.log("[CandidateProfileContext] Estado de carga finalizado");
    }
  };

  // Función para limpiar el perfil actual
  const clearProfile = () => {
    console.log("[CandidateProfileContext] Limpiando perfil");
    setProfile(null);
  };

  // Valor del contexto
  const contextValue = {
    profile,
    isLoading,
    loadProfile,
    clearProfile,
  };

  return (
    <CandidateProfileContext.Provider value={contextValue}>
      {children}
    </CandidateProfileContext.Provider>
  );
};
