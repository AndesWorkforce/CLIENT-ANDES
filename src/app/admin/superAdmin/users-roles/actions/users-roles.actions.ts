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
  responsibleCompany?: CompanyItem | null;
  employeeCompany?: { empleadoId: string; empresa: CompanyItem } | null;
}

// Simple company item used for selectors in admin tools
export interface CompanyItem {
  id: string;
  nombre: string;
}

export interface CompanyAssociation {
  responsibleCompany: CompanyItem | null;
  employeeCompany: { empleadoId: string; empresa: CompanyItem } | null;
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
    console.log("[RESPONSE]", response.data?.data);
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
      responsibleCompany: u.empresa
        ? { id: u.empresa.id, nombre: u.empresa.nombre }
        : null,
      employeeCompany: u.empleadoEmpresa
        ? {
            empleadoId: u.empleadoEmpresa.id,
            empresa: {
              id: u.empleadoEmpresa.empresa?.id,
              nombre: u.empleadoEmpresa.empresa?.nombre,
            },
          }
        : null,
    }));

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
    const response = await axios.post("usuarios/empleados/empresa", {
      usuarioId,
      empresaId,
      rol: position,
    });
    return { success: true, data: response.data } as ApiResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Error assigning employee to company";
    console.error(
      "[users-roles.actions] assignUsuarioToCompanyEmployee error",
      message
    );
    return { success: false, message } as ApiResponse;
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
    const payload = (response.data?.data ||
      response.data) as CompanyAssociation;
    return {
      success: true,
      data: payload,
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
