"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";

interface CreateCompanyEmployeeData {
  usuarioId: string;
  empresaId: string;
  rol: string;
}

interface CreateNewUserEmployeeData {
  // Datos del nuevo usuario
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  residencia?: string;
  // Datos del empleado
  empresaId: string;
  rol: string;
}

export interface CompanyEmployeeResponse extends ApiResponse {
  data?: {
    id: string;
    usuario: {
      id: string;
      nombre: string;
      apellido: string;
      correo: string;
      telefono?: string;
      residencia?: string;
    };
    empresa: {
      id: string;
      nombre: string;
    };
    rol: string;
    activo: boolean;
  };
}

/**
 * Crear empleado para empresa usando usuario existente
 */
export async function createCompanyEmployee(
  employeeData: CreateCompanyEmployeeData
): Promise<CompanyEmployeeResponse> {
  try {
    const axios = await createServerAxios();

    const response = await axios.post("usuarios/empleados/empresa", {
      usuarioId: employeeData.usuarioId,
      empresaId: employeeData.empresaId,
      rol: employeeData.rol,
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: "Employee assigned to company successfully",
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Error creating company employee",
    };
  } catch (error: unknown) {
    console.error("[createCompanyEmployee] Error:", error);

    const errorResponse = error as {
      response?: { data?: { message?: string } };
    };
    if (errorResponse.response?.data?.message) {
      return {
        success: false,
        message: errorResponse.response.data.message,
      };
    }

    return {
      success: false,
      message: "Error creating company employee",
    };
  }
}

/**
 * Crear nuevo usuario y asignarlo como empleado de empresa
 */
export async function createNewUserForCompany(
  userData: CreateNewUserEmployeeData
): Promise<CompanyEmployeeResponse> {
  try {
    const axios = await createServerAxios();

    // Crear el usuario directamente como empleado de empresa
    const response = await axios.post("usuarios/company/employees", {
      fullName: `${userData.nombre} ${userData.apellido}`,
      email: userData.correo,
      password: userData.contrasena,
      position: "Employee", // Posición por defecto
      empresaId: userData.empresaId,
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: "New user created and assigned to company successfully",
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Error creating employee",
    };
  } catch (error: unknown) {
    console.error("[createNewUserForCompany] Error:", error);

    const errorResponse = error as {
      response?: { data?: { message?: string } };
    };
    if (errorResponse.response?.data?.message) {
      return {
        success: false,
        message: errorResponse.response.data.message,
      };
    }

    return {
      success: false,
      message: "Error creating new user for company",
    };
  }
}

/**
 * Obtener lista de usuarios disponibles para asignar como empleados
 */
export async function getAvailableUsers(): Promise<{
  success: boolean;
  message?: string;
  data?: Array<{
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  }>;
}> {
  try {
    const axios = await createServerAxios();

    // Obtener todos los usuarios para poder seleccionar cuál asignar
    const response = await axios.get("usuarios");

    if (response.status === 200) {
      // Filtrar usuarios que no sean empleados de empresa o admins
      const users = response.data.data || [];
      const availableUsers = users.filter(
        (user: { rol: string }) =>
          user.rol === "CLIENTE" || user.rol === "POSTULANTE"
      );

      return {
        success: true,
        data: availableUsers,
      };
    }

    return {
      success: false,
      message: "Error fetching available users",
    };
  } catch (error: unknown) {
    console.error("[getAvailableUsers] Error:", error);

    return {
      success: false,
      message: "Error fetching available users",
    };
  }
}
