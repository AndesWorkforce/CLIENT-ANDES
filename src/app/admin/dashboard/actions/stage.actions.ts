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
    | "EN_EVALUACION_CLIENTE"
    | "FINALISTA"
    | "ACEPTADA"
    | "RECHAZADA",
  action: "NEXT" | "CONTRACT" = "NEXT"
) {
  console.log("🚀 [advancedStage] Iniciando con parámetros:", {
    postulationId,
    candidateId,
    currentStage,
    action,
  });

  const axios = await createServerAxios();
  try {
    let nextStage:
      | "PENDIENTE"
      | "EN_EVALUACION"
      | "EN_EVALUACION_CLIENTE"
      | "FINALISTA"
      | "ACEPTADA"
      | "RECHAZADA";
    let additionalData = {};

    if (action === "CONTRACT") {
      console.log(
        "📋 [advancedStage] Acción CONTRACT detectada, estableciendo nextStage = ACEPTADA"
      );
      nextStage = "ACEPTADA";
      additionalData = {
        notasInternas: "Candidate hired",
      };
    } else {
      console.log(
        "📋 [advancedStage] Acción NEXT detectada, procesando currentStage:",
        currentStage
      );
      switch (currentStage) {
        case "PENDIENTE":
          nextStage = "EN_EVALUACION";
          additionalData = {
            fechaEntrevista: new Date().toISOString(),
            linkEntrevista: "https://meet.google.com/abc123",
            notasInternas: "Candidate invited to first interview",
          };
          break;
        case "EN_EVALUACION":
          nextStage = "EN_EVALUACION_CLIENTE";
          additionalData = {
            notasInternas:
              "Candidate scheduled for second interview with client",
          };
          break;
        case "EN_EVALUACION_CLIENTE":
          nextStage = "FINALISTA";
          additionalData = {
            notasInternas:
              "Candidate selected as finalist after client interview",
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

    console.log("📤 [advancedStage] Enviando petición al backend:", {
      url: `admin/postulaciones/${postulationId}/candidate/${candidateId}/status`,
      data: {
        estadoPostulacion: nextStage,
        ...additionalData,
      },
    });

    const response = await axios.patch(
      `admin/postulaciones/${postulationId}/candidate/${candidateId}/status`,
      {
        estadoPostulacion: nextStage,
        ...additionalData,
      }
    );

    console.log("📥 [advancedStage] Respuesta del backend:", {
      status: response.status,
      data: response.data,
    });

    if (response.status !== 200) {
      console.error(
        "❌ [advancedStage] Error en respuesta del backend:",
        response.status
      );
      return {
        success: false,
        message: "Error updating stage",
      };
    }

    console.log("✅ [advancedStage] Proceso exitoso, revalidando paths...");
    revalidatePath(`/admin/dashboard`);
    revalidatePath(`/admin/dashboard/postulants`);
    return {
      success: true,
      message: "Stage updated successfully",
      nextStage,
    };
  } catch (error) {
    console.error("💥 [advancedStage] Error en el proceso:", error);
    revalidatePath(`/admin/dashboard`);
    revalidatePath(`/admin/dashboard/postulants`);
    console.log("[error] ", error);
    return {
      success: false,
      message: "Error updating stage",
    };
  }
}

// Nueva función para saltar directamente a cualquier etapa
export async function directStageJump(
  postulationId: string,
  candidateId: string,
  targetStage:
    | "EN_EVALUACION"
    | "EN_EVALUACION_CLIENTE"
    | "FINALISTA"
    | "ACEPTADA"
) {
  console.log("🚀 [directStageJump] Iniciando salto directo a etapa:", {
    postulationId,
    candidateId,
    targetStage,
  });

  const axios = await createServerAxios();
  try {
    let additionalData = {};

    // Configurar datos adicionales según la etapa objetivo
    switch (targetStage) {
      case "EN_EVALUACION":
        additionalData = {
          fechaEntrevista: new Date().toISOString(),
          linkEntrevista: "https://meet.google.com/abc123",
          notasInternas: "Candidate invited to first interview (direct jump)",
        };
        break;
      case "EN_EVALUACION_CLIENTE":
        additionalData = {
          notasInternas:
            "Candidate scheduled for second interview with client (direct jump)",
        };
        break;
      case "FINALISTA":
        additionalData = {
          notasInternas: "Candidate selected as finalist (direct jump)",
        };
        break;
      case "ACEPTADA":
        additionalData = {
          notasInternas: "Candidate hired (direct jump)",
        };
        break;
      default:
        return {
          success: false,
          message: `Invalid target stage: ${targetStage}`,
        };
    }

    console.log("📤 [directStageJump] Enviando petición al backend:", {
      url: `admin/postulaciones/${postulationId}/candidate/${candidateId}/status`,
      data: {
        estadoPostulacion: targetStage,
        ...additionalData,
      },
    });

    const response = await axios.patch(
      `admin/postulaciones/${postulationId}/candidate/${candidateId}/status`,
      {
        estadoPostulacion: targetStage,
        ...additionalData,
      }
    );

    console.log("📥 [directStageJump] Respuesta del backend:", {
      status: response.status,
      data: response.data,
    });

    if (response.status !== 200) {
      console.error(
        "❌ [directStageJump] Error en respuesta del backend:",
        response.status
      );
      return {
        success: false,
        message: "Error updating stage",
      };
    }

    console.log("✅ [directStageJump] Proceso exitoso, revalidando paths...");
    revalidatePath(`/admin/dashboard`);
    revalidatePath(`/admin/dashboard/postulants`);
    return {
      success: true,
      message: "Stage updated successfully",
      nextStage: targetStage,
    };
  } catch (error) {
    console.error("💥 [directStageJump] Error en el proceso:", error);
    revalidatePath(`/admin/dashboard`);
    revalidatePath(`/admin/dashboard/postulants`);
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
      message: "Candidate rejected successfully",
    };
  } catch (error) {
    console.error("[rejectStage] Error:", error);
    return {
      success: false,
      message: "Error rejecting candidate",
    };
  }
}
