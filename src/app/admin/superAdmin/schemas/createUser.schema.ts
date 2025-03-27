import { z } from "zod";

export const createUserSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres"),
  correo: z.string().email("El correo electrónico no es válido"),
  contrasena: z.string().optional(),
  telefono: z.string().nullable().optional(),
  residencia: z.string().nullable().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
