"use server";

import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";
import { ALLOWED_VARIABLES } from "../constants/vars";

export async function saveEmailTemplate(
  formData: FormData,
  isEdit: boolean,
  templateId?: string
) {
  const axios = await createServerAxios();
  try {
    const dataToSend = {
      nombre: formData.get("nombre") as string,
      asunto: formData.get("asunto") as string,
      contenido: formData.get("contenido") as string,
      descripcion: formData.get("descripcion") as string,
      variables: ALLOWED_VARIABLES,
    };
    let response;
    if (isEdit && templateId) {
      response = await axios.patch(`email-templates/${templateId}`, dataToSend);
    } else {
      response = await axios.post("email-templates", dataToSend);
    }
    const responseData = response.data;
    if (response.status !== 201 && response.status !== 200) {
      return {
        success: false,
        message: `Error server: ${response.status} ${response.statusText}. ${
          responseData.message || ""
        }`,
      };
    }
    revalidatePath("/admin/dashboard/templates");
    return {
      success: true,
      message: isEdit
        ? "Template updated successfully"
        : "Template created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "An error occurred while saving the email template: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}

export async function fetchEmailTemplates() {
  const axios = await createServerAxios();
  try {
    const response = await axios.get("email-templates");
    const data = response.data;
    return Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.error("Error fetching templates:", e);
    return [];
  }
}

export async function deleteEmailTemplate(templateId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`email-templates/${templateId}`);
    if (response.status !== 200 && response.status !== 204) {
      return {
        success: false,
        message: `Error server: ${response.status} ${response.statusText}.`,
      };
    }
    revalidatePath("/admin/dashboard/templates");
    return {
      success: true,
      message: "Template deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "An error occurred while deleting the email template: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}
