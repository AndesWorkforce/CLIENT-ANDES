"use server";

import { RegisterFormValues } from "../schemas/register.schema";

export async function registerAction(data: RegisterFormValues) {
  try {
    console.log("DATOS PARA ENVIAR", data);

    const { nombre, apellido, correo, contrasena } = data;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, apellido, correo, contrasena }),
      }
    );

    const responseData = await response.json();

    return {
      success: true,
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
