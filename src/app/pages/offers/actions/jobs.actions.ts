"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOffers() {
  const axios = await createServerAxios();
  try {
    if (!API_URL) {
      return {
        success: false,
        message: "Configuration error: API URL not available",
      };
    }

    const response = await axios.get(`${API_URL}offers/search`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      success: false,
      message: "Error fetching jobs",
    };
  }
}

export async function applyToOffer(offerId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.post(`${API_URL}applications`, {
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

export async function userIsAppliedToOffer(userId: string) {
  const axios = await createServerAxios();
  try {
    const timestamp = new Date().getTime();
    const response = await axios.get(
      `users/${userId}/profile-status?timestamp=${timestamp}`,
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error fetching profile status",
      };
    }

    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching profile status:", error);
    return {
      success: false,
      message: "Error fetching profile status",
    };
  }
}

export async function getCurrentContract(userId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`users/${userId}/current-contract`, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error fetching current contract",
      };
    }

    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching current contract:", error);
    return {
      success: false,
      message: "Error fetching current contract",
    };
  }
}
