import { z } from "zod";

const userInfoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  correo: z.string(),
  telefono: z.string(),
  residencia: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  activo: z.boolean(),
  rol: z.string(),
  fechaCreacion: z.string(),
  fechaActualizacion: z.string(),
  actualizadoPorId: z.string(),
  usuario: userInfoSchema,
});

export type UserInfo = z.infer<typeof userInfoSchema>;
export type User = z.infer<typeof userSchema>;

const metaSchema = z.object({
  status: z.number(),
  message: z.string(),
  timestamp: z.string(),
  path: z.string(),
});

const dataWrapperSchema = z.object({
  data: z.array(userSchema),
  meta: metaSchema,
});

export const usersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: dataWrapperSchema,
});

export type UsersResponse = z.infer<typeof usersResponseSchema>;

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}
