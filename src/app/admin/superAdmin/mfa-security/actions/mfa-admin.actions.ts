"use server";

import { createServerAxios } from "@/services/axios.server";

export interface AdminMfaUser {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  mfaEnabled: boolean;
  mfaEnabledAt?: string;
  backupCodesRemaining?: number;
}

export async function getAdminUsersAction(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get("usuarios");
    const allUsers = response.data?.data || response.data || [];

    const adminRoles = ["ADMIN", "EMPLEADO_ADMIN", "ADMIN_RECLUTAMIENTO"];
    const admins = allUsers.filter((u: any) =>
      adminRoles.includes(u.usuario?.rol || u.rol)
    );

    return { success: true, data: admins };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error fetching admin users",
    };
  }
}

export async function getAdminMfaStatusAction(
  userId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`auth/mfa/admin/status/${userId}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error fetching MFA status",
    };
  }
}

export async function forceResetMfaAction(
  targetUserId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const axios = await createServerAxios();
    await axios.post("auth/mfa/admin/force-reset", { targetUserId, reason });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error resetting MFA",
    };
  }
}
