"use server";

import { createServerAxios } from "@/services/axios.server";
import type { CreateUserFormData } from "../schemas/createUser.schema";
import type { UserResponse } from "../schemas/user.schema";
import { revalidatePath } from "next/cache";

export async function getUsersAdmin() {
  const axios = await createServerAxios();
  try {
    const response = await axios.get("admin/empleados");

    if (response.status === 200) {
      revalidatePath("/admin/superAdmin/users");
      return {
        success: true,
        message: "Users fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error getting users",
      data: {
        data: [],
        meta: {
          status: 404,
          message: "No users found",
          timestamp: new Date().toISOString(),
          path: "/api/admin/empleados",
        },
      },
    };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("Error getting users");
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
