import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" }),
  lastName: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" }),
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo electrónico válido" }),
  phone: z
    .string()
    .min(10, {
      message: "El número de teléfono debe tener al menos 10 dígitos",
    })
    .regex(/^\d+$/, {
      message: "El número de teléfono solo debe contener dígitos",
    })
    .optional(),
  smsConsent: z.boolean().optional(),
  service: z.enum(["talent", "job"], {
    required_error: "Por favor selecciona un servicio",
  }),
  message: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres" })
    .max(500, { message: "El mensaje no puede exceder 500 caracteres" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
