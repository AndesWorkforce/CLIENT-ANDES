"use client";

import { createContext, ReactNode, useContext } from "react";

interface DatosPersonales {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  residencia: string;
  fotoPerfil: string | null;
}

interface RequisitosDispositivo {
  tipoDispositivo: "PC_LAPTOP" | "TABLET" | "SMARTPHONE" | string;
  proveedorInternet: string;
  cantidadRAM: string;
  velocidadDescarga: string;
  conexionCableada: boolean;
}

interface Archivos {
  videoPresentacion: string | null;
  curriculum: string | null;
  documentosAdicionales: string[];
  imagenTestVelocidad?: string;
  imagenRequerimientosPC?: string;
  fotoCedulaFrente: string | null;
  fotoCedulaDorso: string | null;
}

interface Habilidad {
  id: string;
  nombre: string;
  nivel: number;
  usuarioId: string;
}

interface Educacion {
  id: string;
  institucion: string;
  titulo: string;
  añoInicio: string;
  añoFin: string;
  usuarioId: string;
  esActual?: boolean;
}

interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string | null;
  esActual?: boolean;
  usuarioId: string;
}

type EstadoPerfil = "COMPLETO" | "INCOMPLETO" | "PENDIENTE" | string;

interface ProfileData {
  datosPersonales: DatosPersonales;
  requisitosDispositivo: RequisitosDispositivo;
  archivos: Archivos;
  datosFormulario: string | null;
  habilidades: Habilidad[];
  educacion: Educacion[];
  experiencia: Experiencia[];
  estadoPerfil: EstadoPerfil;
  validacionExterna: boolean;
}

interface ProfileContextType {
  profile: ProfileData;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error(
      "useProfileContext debe ser usado dentro de un ProfileContextProvider"
    );
  }
  return context;
}

export function ProfileContextProvider({
  children,
  initialValue,
}: {
  children: ReactNode;
  initialValue: { profile: ProfileData };
}) {
  // Ya no necesitamos estado local ni funciones de actualización
  // El server component manejará todo con la revalidación

  const value = {
    profile: initialValue.profile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
