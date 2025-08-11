"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function assignOffer(candidateId: string, offerId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.post(`${API_URL}applications/assign`, {
      candidatoId: candidateId,
      propuestaId: offerId,
    });
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
      message: "Error applying to the offer",
    };
  }
}
