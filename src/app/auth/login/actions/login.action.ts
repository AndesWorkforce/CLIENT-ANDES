"use server";

import { LoginFormValues } from "../schemas/login.schema";

export async function loginAction(values: LoginFormValues) {
  try {
    console.log(values);
    // Aquí iría la lógica de autenticación
    // Por ejemplo:
    // const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(values),
    // });
    // const data = await response.json();

    // Por ahora simulamos una respuesta
    return {
      success: true,
      data: { message: "Login exitoso" },
    };
  } catch (error) {
    console.error("Error en el formulario:", error);
    return {
      success: false,
      error: "Error al iniciar sesión",
    };
  }
}
