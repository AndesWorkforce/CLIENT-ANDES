"use server";

import { ApiResponse } from "@/app/types/offers";
import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Helper para transformar ofertas al shape del dashboard
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOffers(raw: any[]): any[] {
  return (raw || []).map((offer: any) => ({
    ...offer,
    postulacionesCount:
      offer._count?.postulaciones || offer.postulaciones?.length || 0,
  }));
}

export async function getAssignedOffers(
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
) {
  try {
    const axios = await createServerAxios();
    const cookieStore = await cookies();
    const activeCompanyId =
      cookieStore.get("active_company_id")?.value ||
      cookieStore.get("selected_company_id")?.value ||
      "";
    const response = await axios.get(
      `offers/assigned?page=${page}&limit=${limit}&search=${searchTerm}`,
      { headers: activeCompanyId ? { "x-company-id": activeCompanyId } : {} }
    );
    console.log("[RESPONSE]", response);
    if (response.status === 200) {
      revalidatePath("/companies/dashboard");

      return {
        success: true,
        message: "Assigned offers retrieved successfully",
        data: {
          data: normalizeOffers(response.data?.data ?? response.data ?? []),
        },
        hasMore: false, // scoped endpoint isn't paginated currently
      };
    } else {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data?.message || ""
        }`,
      };
    }
  } catch (error) {
    console.error("[Companies] Error getting assigned offers:", error);
    return {
      success: false,
      message: "Error getting assigned offers",
    };
  }
}

export async function toggleOfferStatus(
  offerId: string,
  newStatus: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const cookieStore = await cookies();
    const activeCompanyId =
      cookieStore.get("active_company_id")?.value ||
      cookieStore.get("selected_company_id")?.value ||
      "";
    const response = await axios.patch(
      `offers/${offerId}/status`,
      { estado: newStatus },
      { headers: activeCompanyId ? { "x-company-id": activeCompanyId } : {} }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data?.message || ""
        }`,
      };
    }

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Offer status updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("[Companies] Error updating offer status:", error);
    return {
      success: false,
      message: "Error updating offer status",
    };
  }
}
