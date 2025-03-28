"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export async function currentStageStatus(
  postulationId: string,
  candidateId: string
) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `applications/offer/${postulationId}/candidate/${candidateId}`
    );

    console.log("[response] ", response.data);
    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener el estado de la etapa",
      };
    }
    revalidatePath(`/admin/dashboard`);
    return {
      success: true,
      message: "Etapa actualizada correctamente",
      data: response.data,
    };
  } catch (error) {
    console.log("[error] ", error);
    return {
      success: false,
      message: "Error al obtener el estado de la etapa",
    };
  }
}
export async function advancedStage(
  postulationId: string,
  currentStage: string,
  action: "NEXT" | "CONTRACT" = "NEXT"
) {
  const axios = await createServerAxios();
  try {
    let nextStage = "";
    let additionalData = {};

    if (action === "CONTRACT") {
      nextStage = "ACEPTADA";
      additionalData = {
        notasInternas: "Candidato contratado",
      };
    } else {
      switch (currentStage) {
        case "PENDIENTE":
          nextStage = "EN_EVALUACION";
          additionalData = {
            fechaEntrevista: new Date().toISOString(),
            linkEntrevista: "https://meet.google.com/abc123",
            notasInternas: "Candidato seleccionado para entrevista inicial",
          };
          break;
        case "EN_EVALUACION":
          nextStage = "FINALISTA";
          additionalData = {
            notasInternas: "Candidato seleccionado como finalista",
          };
          break;
        default:
          return {
            success: false,
            message: "No se puede avanzar más en el proceso",
          };
      }
    }

    const response = await axios.patch(
      `admin/postulaciones/${postulationId}/status`,
      {
        estadoPostulacion: nextStage,
        ...additionalData,
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al actualizar la etapa",
      };
    }

    return {
      success: true,
      message: "Etapa actualizada correctamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar la etapa",
    };
  }
}

export async function rejectStage(postulationId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `admin/postulaciones/${postulationId}/status`,
      {
        estadoPostulacion: "RECHAZADA",
        notasInternas: "Candidato rechazado, no cumple con los requisitos",
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al actualizar la etapa",
      };
    }

    return {
      success: true,
      message: "Etapa actualizada correctamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar la etapa",
    };
  }
}
