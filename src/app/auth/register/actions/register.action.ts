"use server";

import { RegisterFormValues } from "../schemas/register.schema";
import { createServerAxios } from "@/services/axios.server";

export async function registerAction(data: RegisterFormValues) {
  const axios = await createServerAxios();
  try {
    console.log("DATOS PARA ENVIAR", data);

    const { nombre, apellido, correo, contrasena } = data;

    const response = await axios.post(`auth/register`, {
      nombre,
      apellido,
      correo,
      contrasena,
    });

    if (response.status !== 201) {
      return {
        success: false,
        error: "Error al crear la cuenta. Por favor, intenta nuevamente.",
      };
    }

    const responseData = response.data;

    return {
      success: true,
      message: "Cuenta creada exitosamente",
      data: responseData,
    };
  } catch (error) {
    console.error("Error en el registro:", error);
    return {
      success: false,
      error: "Error al crear la cuenta. Por favor, intenta nuevamente.",
    };
  }
}
