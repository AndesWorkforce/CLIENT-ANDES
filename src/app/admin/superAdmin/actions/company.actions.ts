"use server";

import { ApiResponse } from "@/interfaces/api.interface";
import { createServerAxios } from "@/services/axios.server";
import { sendCompanyWelcomeEmail } from "@/app/admin/dashboard/actions/sendEmail.actions";

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
  } catch (error: any) {
    console.error("Error in toggleCompanyStatus:", error);
    const errorMessage =
      error?.response?.data?.message || "Error changing company status";
    return {
      success: false,
      message: errorMessage,
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
  } catch (error: any) {
    console.error("Error in deleteCompany:", error);
    const errorMessage =
      error?.response?.data?.message || "Error deleting company";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

interface CompanyData {
  nombre: string;
  descripcion: string;
  correo: string;
  contrasena?: string;
  nombreRepresentante?: string;
  apellidoRepresentante?: string;
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

    // Enviar email de bienvenida con las credenciales
    if (data.contrasena && data.nombreRepresentante) {
      console.log("📧 [createCompany] Sending welcome email...");

      try {
        const emailResponse = await sendCompanyWelcomeEmail(
          data.nombre,
          data.nombreRepresentante,
          data.correo,
          data.contrasena
        );

        if (emailResponse.success) {
          console.log("✅ [createCompany] Welcome email sent successfully");
        } else {
          console.warn(
            "⚠️ [createCompany] Failed to send welcome email:",
            emailResponse.error
          );
        }
      } catch (emailError) {
        console.error(
          "❌ [createCompany] Error sending welcome email:",
          emailError
        );
        // No fallar la creación de empresa si el email falla
      }
    }

    return {
      success: true,
      message: "Company created successfully and welcome email sent",
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
    // Para actualización, enviamos todos los datos excepto la contraseña
    const updateData = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      correo: data.correo,
      nombreRepresentante: data.nombreRepresentante,
      apellidoRepresentante: data.apellidoRepresentante,
      // No enviamos la contraseña en las actualizaciones
    };

    const response = await axios.patch(`companies/${companyId}`, updateData);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error updating company");
    }

    return {
      success: true,
      message: "Company updated successfully",
    };
  } catch (error: any) {
    console.error("Error in updateCompany:", error);
    const errorMessage =
      error?.response?.data?.message || "Error updating company";
    return {
      success: false,
      message: errorMessage,
    };
  }
};
