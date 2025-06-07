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

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error getting stage status",
      };
    }

    revalidatePath(`/admin/dashboard`);
    return {
      success: true,
      message: "Stage status retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    console.log("[error] ", error);
    // El interceptor de Axios manejará el error 401 automáticamente
    return {
      success: false,
      message: "Error getting stage status",
    };
  }
}

export async function advancedStage(
  postulationId: string,
  candidateId: string,
  currentStage:
    | "PENDIENTE"
    | "EN_EVALUACION"
    | "FINALISTA"
    | "ACEPTADA"
    | "RECHAZADA",
  action: "NEXT" | "CONTRACT" = "NEXT"
) {
  const axios = await createServerAxios();
  try {
    let nextStage:
      | "PENDIENTE"
      | "EN_EVALUACION"
      | "FINALISTA"
      | "ACEPTADA"
      | "RECHAZADA";
    let additionalData = {};

    if (action === "CONTRACT") {
      nextStage = "ACEPTADA";
      additionalData = {
        notasInternas: "Candidate hired",
      };
    } else {
      switch (currentStage) {
        case "PENDIENTE":
          nextStage = "EN_EVALUACION";
          additionalData = {
            fechaEntrevista: new Date().toISOString(),
            linkEntrevista: "https://meet.google.com/abc123",
            notasInternas: "Candidate selected for initial interview",
          };
          break;
        case "EN_EVALUACION":
          nextStage = "FINALISTA";
          additionalData = {
            notasInternas: "Candidate selected as finalist",
          };
          break;
        case "FINALISTA":
          nextStage = "ACEPTADA";
          additionalData = {
            notasInternas: "Candidate approved for hiring",
          };
          break;
        case "ACEPTADA":
          return {
            success: false,
            message: "Candidate is already in ACEPTADA stage",
          };
        case "RECHAZADA":
          return {
            success: false,
            message: "Cannot advance a rejected candidate",
          };
        default:
          return {
            success: false,
            message: `Invalid current stage: ${currentStage}`,
          };
      }
    }

    const response = await axios.patch(
      `admin/postulaciones/${postulationId}/candidate/${candidateId}/status`,
      {
        estadoPostulacion: nextStage,
        ...additionalData,
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error updating stage",
      };
    }

    revalidatePath(`/admin/dashboard`);
    return {
      success: true,
      message: "Stage updated successfully",
      nextStage,
    };
  } catch (error) {
    console.log("[error] ", error);
    return {
      success: false,
      message: "Error updating stage",
    };
  }
}

export async function rejectStage(postulationId: string, candidateId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `admin/postulaciones/${postulationId}/candidate/${candidateId}/status`,
      {
        estadoPostulacion: "RECHAZADA",
        notasInternas: "Candidate rejected, does not meet requirements",
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error updating stage",
      };
    }

    revalidatePath(`/admin/dashboard`);
    return {
      success: true,
      message: "Stage updated successfully",
    };
  } catch (error) {
    console.log("[error] ", error);
    return {
      success: false,
      message: "Error updating stage",
    };
  }
}
