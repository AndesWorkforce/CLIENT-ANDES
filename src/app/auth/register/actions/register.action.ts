"use server";

import { RegisterFormValues } from "../schemas/register.schema";
import { createServerAxios } from "@/services/axios.server";

export async function registerAction(data: RegisterFormValues) {
  const axios = await createServerAxios();
  try {
    console.log("DATA TO SEND", data);

    const { nombre, apellido, correo, contrasena, aceptaPoliticaDatos } = data;

    const response = await axios.post(`auth/register`, {
      nombre,
      apellido,
      correo,
      contrasena,
      aceptaPoliticaDatos,
    });

    if (response.status !== 201) {
      return {
        success: false,
        error: "Error creating account. Please try again.",
      };
    }

    const responseData = response.data;

    return {
      success: true,
      message: "Account created successfully",
      data: responseData,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Error creating account. Please try again.",
    };
  }
}
