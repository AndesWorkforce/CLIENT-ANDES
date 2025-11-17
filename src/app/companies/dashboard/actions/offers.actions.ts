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
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const cookieStore = await cookies();
    const activeCompanyId =
      cookieStore.get("active_company_id")?.value ||
      cookieStore.get("selected_company_id")?.value ||
      "";

    // 1. Si tenemos empresa activa, probar endpoint scoped primero (/companies/{id}/offers-with-accepted)
    // para garantizar scope correcto. Luego (opcional) complementar con assigned si se requiere paginación.
    let scopedOffers: any[] = [];
    let fallbackError: string | null = null;
    if (activeCompanyId) {
      try {
        const scopedResp = await axios.get(
          `/companies/${activeCompanyId}/offers-with-accepted`
        );
        if (scopedResp.status === 200 && Array.isArray(scopedResp.data)) {
          scopedOffers = normalizeOffers(scopedResp.data);
        }
      } catch (e: any) {
        fallbackError = e?.response?.data?.message || e?.message || null;
        console.warn(
          "[getAssignedOffers] scoped endpoint failed, will fallback to /offers/assigned",
          fallbackError
        );
      }
    }

    let finalOffers: any[] = scopedOffers;
    // 2. Fallback a /offers/assigned sólo si no conseguimos nada scoped (o no había empresaId)
    if (finalOffers.length === 0) {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: searchTerm,
      });
      const url = `offers/assigned?${query.toString()}`;
      let response;
      try {
        response = await axios.get(url, {
          headers: activeCompanyId ? { "x-company-id": activeCompanyId } : {},
        });
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message;
        if (msg && typeof msg === "string" && msg.includes("companyId")) {
          console.warn(
            "[getAssignedOffers] Backend rechazó header companyId; reintentando sin x-company-id"
          );
          response = await axios.get(url);
        } else {
          throw err;
        }
      }
      if (response.status !== 200) {
        return {
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`,
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = response.data.data.data || [];
      finalOffers = normalizeOffers(raw);
    }

    // 3. Filtrado defensivo: si teníamos empresa activa y aún así aparecen ofertas de otra empresa (por título), filtrar.
    // Heurística: si el título contiene '- WHG' y activeCompanyId corresponde a Tabak (no tenemos nombre aquí), se requiere backend.
    // Omitimos filtrado por no tener meta; podría pedirse al backend incluir companyId en cada oferta.

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Assigned offers retrieved successfully",
      data: {
        data: finalOffers,
      },
      hasMore: false, // el endpoint scoped no es paginado; si usamos fallback podríamos calcularlo, omitimos por simplicidad
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error getting assigned offers:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error getting assigned offers",
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
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data.message || ""}`,
      };
    }

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Estado de la oferta actualizado correctamente",
      data: response.data,
    };
  } catch (error) {
    console.error("[Companies] Error updating offer status:", error);
    return {
      success: false,
      message: "Error al actualizar el estado de la oferta",
    };
  }
}
