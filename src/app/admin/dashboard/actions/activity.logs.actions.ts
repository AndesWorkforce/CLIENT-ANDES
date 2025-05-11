"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCandidateActivityLogs(candidateId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `${API_URL}admin/postulantes/${candidateId}/bitacora`
    );
    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
    return {
      success: false,
      message: "Error getting candidate activity logs",
    };
  }
}
