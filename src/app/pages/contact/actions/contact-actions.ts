"use server";

import {
  contactFormSchema,
  type ContactFormValues,
} from "../schema/contact-schema";

export async function submitContactForm(formData: ContactFormValues) {
  try {
    // Validar los datos del formulario con el esquema Zod
    const validatedData = contactFormSchema.parse(formData);
    console.log(validatedData);
    // Aquí iría la lógica de envío a un endpoint externo
    // Por ahora solo simulamos una respuesta exitosa

    // Ejemplo de cómo se usaría fetch para enviar los datos a un endpoint
    /*
    const response = await fetch('https://api.example.com/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });
    
    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }
    
    const responseData = await response.json();
    */

    // Simulamos una respuesta exitosa
    return {
      success: true,
      message:
        "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.",
    };
  } catch (error) {
    console.error("Error al enviar el formulario:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    }

    return {
      success: false,
      message:
        "Ocurrió un error al enviar el formulario. Por favor intenta de nuevo.",
    };
  }
}
