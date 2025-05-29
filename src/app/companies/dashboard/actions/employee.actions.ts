"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

interface CreateEmployeeData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  residencia?: string;
}

interface UpdateEmployeeData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  residencia?: string;
}

export interface Employee {
  id: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    residencia?: string;
    rol: string;
    activo: boolean;
  };
  rol: string;
  activo: boolean;
}

export async function createEmployee(employeeData: CreateEmployeeData) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(`usuarios/company/employees`, {
      fullName: `${employeeData.nombre} ${employeeData.apellido}`,
      email: employeeData.correo,
      password: employeeData.contrasena,
      position: "Empleado", // Posición por defecto
    });

    if (response.status === 201) {
      revalidatePath("/companies/dashboard/employees");
      return {
        success: true,
        message: "Employee created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: `Server error: ${response.status} ${response.statusText}. ${
        response.data.message || ""
      }`,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error creating employee:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error creating employee",
    };
  }
}

export async function getCompanyEmployees(empresaId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`usuarios/empleados/empresa/${empresaId}`);

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data.message || ""
        }`,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("[Companies] Error fetching employees:", error);
    return {
      success: false,
      message: "Error fetching employees",
    };
  }
}

export async function toggleEmployeeStatus(employeeId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `usuarios/empleados/empresa/${employeeId}/desactivar`
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data.message || ""
        }`,
      };
    }

    revalidatePath("/companies/dashboard/employees");

    return {
      success: true,
      message: "Employee status updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("[Companies] Error updating employee status:", error);
    return {
      success: false,
      message: "Error updating employee status",
    };
  }
}

export const getEmployee = async (id: string) => {
  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[GET_EMPLOYEE]", error);
    return {
      success: false,
      message: "Error getting employee",
    };
  }
};

export async function updateEmployee(
  id: string,
  employeeData: UpdateEmployeeData
) {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(`usuarios/${id}`, {
      nombre: employeeData.nombre,
      apellido: employeeData.apellido,
      correo: employeeData.correo,
      telefono: employeeData.telefono,
      residencia: employeeData.residencia,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data.message || ""
        }`,
      };
    }

    revalidatePath("/companies/dashboard/employees");

    return {
      success: true,
      message: "Employee updated successfully",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error updating employee:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error updating employee",
    };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `usuarios/empleados/empresa/${id}/desactivar`
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data.message || ""
        }`,
      };
    }

    revalidatePath("/companies/dashboard/employees");

    return {
      success: true,
      message: "Employee deleted successfully",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error deleting employee:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error deleting employee",
    };
  }
}
