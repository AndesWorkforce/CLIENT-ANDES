import { axiosBase } from "@/services/axios.instance";
import type { Alerta, AlertsStats } from "../types/avisos.types";
import { ApiResponse } from "@/interfaces/api.interface";

const ALERTS_BASE_URL = "admin-hub/alerts";

export interface QueryAlertsParams {
  estado?: string;
  tipo?: string;
  prioridad?: string;
  empresaId?: string;
  procesoContratacionId?: string;
}

export const alertsService = {
  async getAll(params?: QueryAlertsParams): Promise<Alerta[]> {
    const response = await axiosBase.get<ApiResponse>(`${ALERTS_BASE_URL}`, {
      params,
    });
    return response.data.data;
  },

  async getPendientes(): Promise<Alerta[]> {
    const response = await axiosBase.get<ApiResponse>(
      `${ALERTS_BASE_URL}/pendientes`
    );
    return response.data.data;
  },

  async getStatsByType(): Promise<AlertsStats[]> {
    const response = await axiosBase.get<ApiResponse>(
      `${ALERTS_BASE_URL}/stats/by-type`
    );
    return response.data.data;
  },

  async getById(id: string): Promise<Alerta> {
    const response = await axiosBase.get<ApiResponse>(
      `${ALERTS_BASE_URL}/${id}`
    );
    return response.data.data;
  },

  async updateEstado(
    id: string,
    estado: string
  ): Promise<Alerta> {
    const response = await axiosBase.patch<ApiResponse>(
      `${ALERTS_BASE_URL}/${id}`,
      { estado }
    );
    return response.data.data;
  },

  async updatePrioridad(
    id: string,
    prioridad: string
  ): Promise<Alerta> {
    const response = await axiosBase.patch<ApiResponse>(
      `${ALERTS_BASE_URL}/${id}`,
      { prioridad }
    );
    return response.data.data;
  },
};
