import { z } from "zod";

export const loginSchema = z.object({
  correo: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
  contrasena: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  // Rol activo opcional para usuarios con múltiples roles
  selectedRole: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
