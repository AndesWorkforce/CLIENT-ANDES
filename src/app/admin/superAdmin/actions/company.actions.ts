"use server";

import { ApiResponse } from "@/interfaces/api.interface";
import { createServerAxios } from "@/services/axios.server";

interface GetCompaniesResponse extends ApiResponse {
  data?: {
    total: number;
    companies: Array<{
      id: string;
      nombre: string;
      descripcion?: string;
      activo: boolean;
      fechaCreacion: string;
      usuarioResponsable: {
        id: string;
        nombre?: string;
        apellido?: string;
        correo: string;
      };
      _count: {
        empleados: number;
      };
      propuestasAsociadas?: Array<{
        propuestaId: string;
      }>;
    }>;
  };
}

export const getCompaniesAdmin = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  includePropuestas: boolean = false
): Promise<GetCompaniesResponse> => {
  const axios = await createServerAxios();
  try {
    const offset = (page - 1) * limit;
    const response = await axios.get(
      `companies?limit=${limit}&offset=${offset}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }${includePropuestas ? "&includePropuestas=true" : ""}`
    );

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error fetching companies");
    }

    return {
      success: true,
      message: "Companies fetched successfully",
      data: {
        total: response.data.total || 0,
        companies: response.data.companies || [],
      },
    };
  } catch (error) {
    console.error("Error in getCompaniesAdmin:", error);
    return {
      success: false,
      message: "Error fetching companies",
      data: {
        total: 0,
        companies: [],
      },
    };
  }
};

export const toggleCompanyStatus = async (
  companyId: string,
  newStatus: boolean
): Promise<ApiResponse> => {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`companies/${companyId}/status`, {
      activo: newStatus,
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error changing company status");
    }

    return {
      success: true,
      message: "Company status updated successfully",
    };
  } catch (error) {
    console.error("Error in toggleCompanyStatus:", error);
    return {
      success: false,
      message: "Error changing company status",
    };
  }
};

export const deleteCompany = async (
  companyId: string
): Promise<ApiResponse> => {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`companies/${companyId}`);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error deleting company");
    }

    return {
      success: true,
      message: "Company deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteCompany:", error);
    return {
      success: false,
      message: "Error deleting company",
    };
  }
};

interface CompanyData {
  nombre: string;
  descripcion: string;
  correo: string;
  contrasena?: string;
}

export const createCompany = async (
  data: CompanyData
): Promise<ApiResponse> => {
  const axios = await createServerAxios();
  try {
    const response = await axios.post("/companies/register", data);

    if (response.status !== 201) {
      throw new Error(response.data.message || "Error creating company");
    }

    return {
      success: true,
      message: "Company created successfully",
    };
  } catch (error) {
    console.error("Error in createCompany:", error);
    return {
      success: false,
      message: "Error creating company",
    };
  }
};

export const updateCompany = async (
  companyId: string,
  data: CompanyData
): Promise<ApiResponse> => {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`/companies/${companyId}`, data);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error updating company");
    }

    return {
      success: true,
      message: "Company updated successfully",
    };
  } catch (error) {
    console.error("Error in updateCompany:", error);
    return {
      success: false,
      message: "Error updating company",
    };
  }
};
