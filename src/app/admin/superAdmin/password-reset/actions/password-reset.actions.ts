"use server";

import { createServerAxios } from "@/services/axios.server";

export interface PasswordResetUser {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  roles?: string[];
  activo: boolean;
}

interface ListUsersResult {
  success: boolean;
  data?: PasswordResetUser[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  error?: string;
}

function mapUsuario(raw: Record<string, unknown>): PasswordResetUser {
  const roles = Array.isArray(raw.roles)
    ? (raw.roles as string[])
    : raw.rol
      ? [String(raw.rol)]
      : [];

  return {
    id: String(raw.id ?? ""),
    nombre: String(raw.nombre ?? ""),
    apellido: String(raw.apellido ?? ""),
    correo: String(raw.correo ?? ""),
    rol: String(raw.rol ?? roles[0] ?? ""),
    roles,
    activo: raw.activo !== false,
  };
}

export async function searchUsersForPasswordResetAction(
  search: string = "",
  page: number = 1,
  limit: number = 20
): Promise<ListUsersResult> {
  try {
    const axios = await createServerAxios();
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const response = await axios.get(`usuarios?${params.toString()}`);
    const rawData = response.data?.data;
    const items = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.items)
        ? rawData.items
        : [];
    const pagination =
      response.data?.meta?.pagination || rawData?.pagination || undefined;

    return {
      success: true,
      data: items.map(mapUsuario).filter((user: PasswordResetUser) => user.id),
      pagination,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
    };
    return {
      success: false,
      error:
        axiosError?.response?.data?.message || "Error fetching users",
    };
  }
}

export async function sendPasswordResetEmailAction(
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/admin/reset-password", { email });
    const payload = response.data?.data || response.data;
    return {
      success: true,
      message:
        payload?.message ||
        "Password recovery email has been sent if the account exists.",
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const message = axiosError?.response?.data?.message;
    return {
      success: false,
      error: Array.isArray(message)
        ? message.join(", ")
        : message || "Error sending password reset email",
    };
  }
}

export async function setUserPasswordAction(
  userEmail: string,
  newPassword: string,
  reason: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/emergency-password-change", {
      userEmail,
      newPassword,
      reason,
    });
    const payload = response.data?.data?.data || response.data?.data || response.data;
    return {
      success: true,
      message:
        payload?.message ||
        payload?.data?.message ||
        "Password updated successfully",
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const message = axiosError?.response?.data?.message;
    return {
      success: false,
      error: Array.isArray(message)
        ? message.join(", ")
        : message || "Error updating password",
    };
  }
}
