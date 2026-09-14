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
  const adminRoles = ["ADMIN", "EMPLEADO_ADMIN", "ADMIN_RECLUTAMIENTO"];

  try {
    const axios = await createServerAxios();
    const seenUserIds = new Set<string>();
    const admins: any[] = [];

    // Fetch all users across pages to find any with admin roles (including multi-role)
    let allUsuarios: any[] = [];
    let page = 1;
    const pageSize = 200;
    let hasMore = true;

    while (hasMore) {
      const usrResponse = await axios.get(
        `usuarios?limit=${pageSize}&page=${page}`
      );
      const rawData = usrResponse.data?.data;
      const pageItems = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
          ? rawData.items
          : [];

      allUsuarios = allUsuarios.concat(pageItems);

      const pagination =
        usrResponse.data?.meta?.pagination || rawData?.pagination;
      hasMore = pagination?.hasNextPage === true;
      page++;

      if (pageItems.length === 0) break;
    }

    for (const u of allUsuarios) {
      const userId = u.id;
      if (!userId || seenUserIds.has(userId)) continue;

      const rol = u.rol || "";
      const rolesArr: string[] = Array.isArray(u.roles) ? u.roles : [];
      const hasAdminRole =
        adminRoles.includes(rol) ||
        rolesArr.some((r: string) => adminRoles.includes(r));

      if (!hasAdminRole) continue;
      seenUserIds.add(userId);

      const effectiveRole = adminRoles.includes(rol)
        ? rol
        : rolesArr.find((r: string) => adminRoles.includes(r)) || rol;

      admins.push({
        id: userId,
        usuarioId: userId,
        rol: effectiveRole,
        roles: rolesArr,
        usuario: {
          id: userId,
          nombre: u.nombre || "",
          apellido: u.apellido || "",
          correo: u.correo || "",
          rol: effectiveRole,
          roles: rolesArr,
        },
      });
    }

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
