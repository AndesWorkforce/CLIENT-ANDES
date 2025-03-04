"use server";

import { RegisterFormValues } from "../schemas/register.schema";

export async function registerAction(data: RegisterFormValues) {
  try {
    console.log(data);
    // TODO: Implementar la lógica de registro con tu backend
    // Este es un ejemplo de simulación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular éxito
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error en el registro:", error);
    return {
      success: false,
      error: "Error al crear la cuenta. Por favor, intenta nuevamente.",
    };
  }
}
