"use server";

import { type CreateUserFormData } from "../schemas/createUser.schema";
import { createServerAxios } from "@/services/axios.server";

export async function createUserEmployeeAdmin(data: CreateUserFormData) {
  const axios = await createServerAxios();
  try {
    const response = await axios.post("admin/empleados", {
      ...data,
      rol: "SUPERVISOR",
    });

    if (response.status === 201) {
      return {
        success: true,
        message: "Usuario creado correctamente",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error al crear usuario",
      data: response.data,
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw new Error("Error al crear usuario");
  }
}
