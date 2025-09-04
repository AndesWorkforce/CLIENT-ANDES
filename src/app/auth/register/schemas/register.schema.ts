import { z } from "zod";

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, "Name must have at least 2 characters")
      .max(50, "Name cannot have more than 50 characters"),
    apellido: z
      .string()
      .min(2, "Last name must have at least 2 characters")
      .max(50, "Last name cannot have more than 50 characters"),
    correo: z.string().email("Email is not valid").min(1, "Email is required"),
    contrasena: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .max(50, "Password cannot have more than 50 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      ),
    confirmContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmContrasena, {
    message: "Passwords do not match",
    path: ["confirmContrasena"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
