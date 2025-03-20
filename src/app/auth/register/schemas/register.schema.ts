import { z } from "zod";

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres"),
    apellido: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres"),
    correo: z
      .string()
      .email("El email no es válido")
      .min(1, "El email es requerido"),
    contrasena: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña no puede tener más de 50 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
        "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"
      ),
    confirmContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmContrasena"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
