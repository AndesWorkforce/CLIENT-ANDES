"use server";

import { createServerAxios } from "@/services/axios.server";
import type { CreateUserFormData } from "../schemas/createUser.schema";
import type { UsersResponse, UserResponse } from "../schemas/user.schema";
import { revalidatePath } from "next/cache";

export async function getUsersAdmin() {
  const axios = await createServerAxios();
  try {
    const response = await axios.get("admin/empleados");

    if (response.status === 200) {
      revalidatePath("/admin/superAdmin/users");
      return {
        success: true,
        message: "Usuarios obtenidos correctamente",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error al obtener usuarios",
      data: {
        data: [],
        meta: {
          status: 404,
          message: "No se encontraron usuarios",
          timestamp: new Date().toISOString(),
          path: "/api/admin/empleados",
        },
      },
    };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("Error al obtener usuarios");
  }
}

export async function updateUser(userId: string, data: CreateUserFormData) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`admin/empleados/${userId}`, {
      ...data,
    });

    if (response.status === 200) {
      revalidatePath("/admin/superAdmin/users");
      return {
        success: true,
        message: "Usuario actualizado correctamente",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error al actualizar usuario",
      data: response.data,
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw new Error("Error al actualizar usuario");
  }
}

export async function toggleUserStatus(userId: string, activo: boolean) {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch<UserResponse>(
      `admin/empleados/${userId}`,
      {
        activo,
      }
    );

    if (response.status === 200) {
      revalidatePath("/admin/superAdmin/users");
      return {
        success: true,
        message: "Usuario actualizado correctamente",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error al actualizar el estado del usuario",
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "[TOGGLE USER STATUS]",
      error.response?.data || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actualizar el estado del usuario",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.delete(`admin/empleados/${userId}`);

    // Revalidamos la ruta independientemente del resultado
    revalidatePath("/admin/superAdmin/users");

    if (response.status === 200) {
      return {
        success: true,
        message: "Usuario eliminado correctamente",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error al eliminar el usuario",
      data: response.data,
    };
  } catch (error: any) {
    console.error("[DELETE USER]", error.response?.data || error.message);
    // También revalidamos en caso de error para asegurar consistencia
    revalidatePath("/admin/superAdmin/users");
    return {
      success: false,
      message: error.response?.data?.message || "Error al eliminar el usuario",
    };
  }
}
