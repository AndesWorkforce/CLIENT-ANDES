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
    setIsLoading(true);
    try {
      const response = await getProfile(candidateId);
      console.log("Profile response:", response);
      if (response.success) {
        // Verificamos la estructura de los datos
        if (response.data && response.data.data) {
          setProfile(response.data.data);
          addNotification("Profile loaded successfully", "success");
        } else {
          addNotification(
            "Error in the data structure of the profile",
            "error"
          );
          setProfile(null);
        }
      } else {
        addNotification("Error loading profile", "error");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Mensajes específicos para ciertos errores
      const errorMsg = String(error);
      if (errorMsg.includes("429")) {
        addNotification("Too many requests. Wait a moment.", "error");
      } else {
        addNotification("Error loading profile", "error");
      }
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar el perfil actual
  const clearProfile = () => {
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
