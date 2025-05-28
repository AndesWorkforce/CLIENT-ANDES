"use server";

import { createServerAxios } from "@/services/axios.server";
import type { CreateUserFormData } from "../schemas/createUser.schema";
import type { UserResponse } from "../schemas/user.schema";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/interfaces/api.interface";

interface GetUsersResponse extends ApiResponse {
  data: {
    data: Array<{
      id: string;
      usuario: {
        id: string;
        nombre: string;
        apellido: string;
        correo: string;
        telefono?: string;
        residencia?: string;
      };
    }>;
  };
}

export const getUsersAdmin = async (
  search: string = ""
): Promise<GetUsersResponse> => {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `admin/empleados${search ? `?search=${encodeURIComponent(search)}` : ""}`
    );

    if (response.status === 200) {
      revalidatePath("/admin/superAdmin/users");
      const users = Array.isArray(response.data.data) ? response.data.data : [];
      return {
        success: true,
        message: "Users fetched successfully",
        data: {
          data: users.map((user: any) => ({
            id: user.id,
            usuarioId: user.usuario.id,
            activo: true,
            rol: "EMPLEADO_ADMIN",
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            actualizadoPorId: "",
            usuario: {
              ...user.usuario,
              telefono: user.usuario.telefono || "",
              residencia: user.usuario.residencia || "",
            },
          })),
        },
      };
    }

    return {
      success: false,
      message: "Error fetching users",
      data: {
        data: [],
      },
    };
  } catch (error) {
    console.error("Error in getUsersAdmin:", error);
    return {
      success: false,
      message: "Error fetching users",
      data: {
        data: [],
      },
    };
  }
};

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
        message: "User updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error updating user",
      data: response.data,
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw new Error("Error updating user");
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
        message: "User updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error updating user status",
      data: response.data,
    };
  } catch (error) {
    console.error("Error al actualizar el estado del usuario:", error);
    return {
      success: false,
      message: "Error updating user status",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.delete(`admin/empleados/${userId}`);

    revalidatePath("/admin/superAdmin/users");

    if (response.status === 200) {
      return {
        success: true,
        message: "User deleted successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error deleting user",
      data: response.data,
    };
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    revalidatePath("/admin/superAdmin/users");
    return {
      success: false,
      message: "Error deleting user",
    };
  }
}
