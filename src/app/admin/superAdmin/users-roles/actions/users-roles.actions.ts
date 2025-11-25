"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/interfaces/api.interface";

export type Rol =
  | "ADMIN"
  | "EMPLEADO_ADMIN"
  | "ADMIN_RECLUTAMIENTO"
  | "EMPRESA"
  | "EMPLEADO_EMPRESA"
  | "CANDIDATO";

export interface UsuarioListItem {
  id: string;
  nombre: string | null;
  apellido: string | null;
  correo: string;
  rol?: Rol; // rol principal legacy
  roles?: Rol[]; // multi-roles
  // Optional association info returned inline by backend list endpoint
  responsibleCompanies?: CompanyItem[];
  employeeCompanies?: {
    empleadoId: string;
    empresa: CompanyItem;
    rol?: string;
  }[];
}

// Simple company item used for selectors in admin tools
export interface CompanyItem {
  id: string;
  nombre: string;
}

export interface CompanyAssociation {
  responsibleCompanies: CompanyItem[];
  employeeCompanies: {
    empleadoId: string;
    empresa: CompanyItem;
    rol?: string;
  }[];
}

interface UsuariosSearchResponse extends ApiResponse {
  data?: {
    items: UsuarioListItem[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export async function searchUsuarios(
  query: string,
  page = 1,
  limit = 20
): Promise<UsuariosSearchResponse> {
  const axios = await createServerAxios();
  try {
    const params: Record<string, string | number> = { page, limit };
    if (query) params.search = query;

    const response = await axios.get("usuarios", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    // The backend returns a paginated shape from TransformResponseInterceptor
    // Ensure we normalize at least the items list
    const items = response.data?.data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalized: UsuarioListItem[] = items.map((u: any) => ({
      id: u.id,
      nombre: u.nombre ?? null,
      apellido: u.apellido ?? null,
      correo: u.correo,
      rol: u.rol,
      roles: u.roles ?? (u.rol ? [u.rol] : []),
      responsibleCompanies: Array.isArray(u.empresasResponsable)
        ? // disable-next-line @typescript-eslint/no-explicit-any
          u.empresasResponsable.map((c: any) => ({
            id: c.id,
            nombre: c.nombre,
          }))
        : [],
      employeeCompanies: Array.isArray(u.empleadoEmpresa)
        ? // disable-next-line @typescript-eslint/no-explicit-any
          u.empleadoEmpresa.map((e: any) => ({
            empleadoId: e.id,
            empresa: { id: e.empresa?.id, nombre: e.empresa?.nombre },
            rol: e.rol,
          }))
        : [],
    }));

    // Debug counts for associations per user
    normalized.forEach((u) => {
      const respCount = u.responsibleCompanies?.length || 0;
      const empCount = u.employeeCompanies?.length || 0;
      if (respCount || empCount) {
        console.log(
          `[users-roles.searchUsuarios.user-assoc] user=${u.id} responsible=${respCount} employee=${empCount}`,
          {
            responsibleCompanies: u.responsibleCompanies,
            employeeCompanies: u.employeeCompanies,
          }
        );
      }
    });

    return {
      success: true,
      message: "Usuarios obtenidos",
      data: {
        items: normalized,
        pagination: response.data?.data?.pagination || undefined,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      (status === 401
        ? "Unauthorized (401): session expired or insufficient permissions"
        : status === 403
        ? "Forbidden (403): you don't have permission"
        : "Error fetching users");
    console.error("[users-roles.actions] searchUsuarios error", {
      status,
      message,
      data: error?.response?.data,
      url: "usuarios",
    });
    return { success: false, message };
  }
}

export async function updateUsuarioRoles(usuarioId: string, roles: Rol[]) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`usuarios/${usuarioId}/roles`, {
      roles,
    });

    revalidatePath("/admin/superAdmin/users-roles");

    if (response.status === 200) {
      return {
        success: true,
        message: "Roles actualizados",
        data: response.data,
      };
    }
    return {
      success: false,
      message: "Error al actualizar roles",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      (status === 401
        ? "Unauthorized (401): session expired or insufficient permissions"
        : status === 403
        ? "Forbidden (403): you don't have permission"
        : "Error al actualizar roles");
    console.error("[users-roles.actions] updateUsuarioRoles error", {
      status,
      message,
      data: error?.response?.data,
    });
    return { success: false, message };
  }
}

// --- Companies helpers for assigning company roles ---
export async function searchCompanies(query: string, page = 1, limit = 10) {
  const axios = await createServerAxios();
  try {
    const params: Record<string, string | number> = { page, limit };
    if (query) params.search = query;
    const response = await axios.get("companies", { params });
    const companies = (response.data?.companies ||
      response.data?.data?.companies ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      []) as any[];
    const items: CompanyItem[] = companies.map((c) => ({
      id: c.id,
      nombre: c.nombre,
    }));
    const total =
      response.data?.total ?? response.data?.data?.total ?? items.length;
    return { success: true, data: { items, total } } as ApiResponse & {
      data?: { items: CompanyItem[]; total: number };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error fetching companies";
    console.error("[users-roles.actions] searchCompanies error", message);
    return { success: false, message } as ApiResponse;
  }
}

export async function assignUsuarioToCompanyEmployee(
  usuarioId: string,
  empresaId: string,
  position = "employee"
) {
  const axios = await createServerAxios();
  try {
    console.log("[users-roles.assignUsuarioToCompanyEmployee.request]", {
      usuarioId,
      empresaId,
      position,
    });
    const response = await axios.post("usuarios/empleados/empresa", {
      usuarioId,
      empresaId,
      rol: position,
    });
    console.log(
      "[users-roles.assignUsuarioToCompanyEmployee.response]",
      response.status,
      response.data
    );
    return {
      success: true,
      data: response.data,
      status: response.status,
    } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.error ||
      error?.message ||
      "Error assigning employee to company";
    console.error(
      "[users-roles.actions] assignUsuarioToCompanyEmployee error",
      { status, message, data, url: "usuarios/empleados/empresa" }
    );
    return { success: false, message, status } as ApiResponse;
  }
}

export async function setCompanyResponsible(
  empresaId: string,
  usuarioId: string
) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`companies/${empresaId}/responsible`, {
      usuarioId,
    });
    return { success: true, data: response.data } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error setting company responsible";
    console.error("[users-roles.actions] setCompanyResponsible error", message);
    return { success: false, message } as ApiResponse;
  }
}

export async function moveCompanyResponsible(
  toCompanyId: string,
  usuarioId: string
) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`companies/responsible/move`, {
      toCompanyId,
      usuarioId,
    });
    return { success: true, data: response.data } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error moving company responsible";
    console.error(
      "[users-roles.actions] moveCompanyResponsible error",
      message
    );
    return { success: false, message } as ApiResponse;
  }
}

export async function getUsuarioCompanyAssociation(usuarioId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `usuarios/${usuarioId}/company-association`
    );
    const raw = response.data?.data || response.data;

    // Normalize various backend response shapes into CompanyAssociation
    // Accepted shapes:
    // - { responsibleCompanies: CompanyItem[], employeeCompanies: {empleadoId, empresa, rol?}[] }
    // - { responsibleCompany: CompanyItem, employeeCompany: {empleadoId, empresa, rol?} }
    // - { empresasResponsable: Company[], empleadoEmpresa: EmpleadoEmpresa[] }
    const normalized: CompanyAssociation = {
      responsibleCompanies: [],
      employeeCompanies: [],
    };

    // Responsible companies normalization
    const rcPlural = raw?.responsibleCompanies || raw?.empresasResponsable;
    if (Array.isArray(rcPlural)) {
      normalized.responsibleCompanies = rcPlural
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => ({
          id: c?.id || c?.empresaId || c?.empresa?.id,
          nombre: c?.nombre || c?.empresa?.nombre,
        }))
        .filter((c: CompanyItem) => c && c.id && c.nombre);
    } else if (raw?.responsibleCompany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c: any = raw.responsibleCompany;
      const item: CompanyItem = {
        id: c?.id || c?.empresaId || c?.empresa?.id,
        nombre: c?.nombre || c?.empresa?.nombre,
      };
      if (item.id && item.nombre) normalized.responsibleCompanies.push(item);
    }

    // Employee companies normalization
    const ecPlural = raw?.employeeCompanies || raw?.empleadoEmpresa;
    if (Array.isArray(ecPlural)) {
      normalized.employeeCompanies = ecPlural
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((e: any) => ({
          empleadoId: e?.empleadoId || e?.id,
          empresa: {
            id: e?.empresa?.id || e?.empresaId || e?.id,
            nombre: e?.empresa?.nombre || e?.nombre,
          },
          rol: e?.rol,
        }))
        .filter((e) => e?.empresa?.id && e?.empresa?.nombre && e?.empleadoId);
    } else if (raw?.employeeCompany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = raw.employeeCompany;
      const item = {
        empleadoId: e?.empleadoId || e?.id,
        empresa: {
          id: e?.empresa?.id || e?.empresaId || e?.id,
          nombre: e?.empresa?.nombre || e?.nombre,
        },
        rol: e?.rol,
      };
      if (item.empresa.id && item.empresa.nombre && item.empleadoId) {
        normalized.employeeCompanies.push(item);
      }
    }

    console.log("[users-roles.getUsuarioCompanyAssociation.raw]", {
      usuarioId,
      status: response.status,
      raw,
    });
    console.log(
      "[users-roles.getUsuarioCompanyAssociation.normalized]",
      normalized
    );
    return {
      success: true,
      data: normalized,
    } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error fetching company association";
    return { success: false, message } as ApiResponse;
  }
}

export async function removeUsuarioCompanyEmployee(empleadoId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(
      `usuarios/empleados/empresa/${empleadoId}/desactivar`
    );
    return { success: true, data: response.data } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error removing employee from company";
    return { success: false, message } as ApiResponse;
  }
}

export async function clearCompanyResponsible(
  empresaId: string,
  usuarioId?: string
) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `companies/${empresaId}/responsible/clear`,
      usuarioId ? { usuarioId } : {}
    );
    return { success: true, data: response.data } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error?.response?.status;
    const rawMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message;
    let message = rawMessage || "Error clearing company responsible";
    // Specific diagnostic when Nest returns 404 route not found: "Cannot PATCH /api/..."
    if (
      status === 404 &&
      typeof rawMessage === "string" &&
      rawMessage.startsWith("Cannot PATCH")
    ) {
      message =
        "Endpoint not found. Revisa que NEXT_PUBLIC_API_URL apunte al backend (incluyendo /api/) y que no estés usando el proxy interno.";
    }
    console.error("[users-roles.actions] clearCompanyResponsible error", {
      status,
      message,
      raw: error?.response?.data,
      empresaId,
      urlTried: `companies/${empresaId}/responsible/clear`,
      baseURL: axios.defaults.baseURL,
      envApi: process.env.NEXT_PUBLIC_API_URL,
    });
    return { success: false, message } as ApiResponse;
  }
}
