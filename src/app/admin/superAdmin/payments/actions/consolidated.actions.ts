"use server";

import { createServerAxios } from "@/services/axios.server";

export interface ConsolidatedUser {
  id: string;
  usuarioId?: string | null;
  country?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string | null;
  documentUploadedThisMonth: boolean;
  lastDocumentDate: string | null;
  documentImageUrl: string | null;
  paymentEnabled: boolean;
  paymentEnabledDate: string | null;
  evaluacionMensualId?: string | null;
  evaluacionMesAnteriorId?: string | null;
  observacionesRevision?: string | null;
  documentoRevisado?: boolean;
  mesAnteriorAprobado?: boolean;
  inboxMesActualId?: string | null;
  inboxMesActualAñoMes?: string | null;
}

export type PeriodDocs = Record<
  string,
  Record<
    string,
    {
      exists: boolean;
      url: string | null;
      date: string | null;
      evaluacionId: string | null;
    }
  >
>;

export async function getMonthlyPaymentsData(
  year: number,
  month: number,
  countryFilter: "all" | "colombia" | "rest" = "all"
): Promise<{
  success: boolean;
  users: ConsolidatedUser[];
  periodDocs: PeriodDocs;
}> {
  const ym = `${year}-${String(month).padStart(2, "0")}`;
  const users: ConsolidatedUser[] = [];
  const periodDocs: PeriodDocs = {};

  const axios = await createServerAxios();
  try {
    const params: Record<string, any> = { anioMes: ym, page: 1, limit: 1000 };
    if (countryFilter === "colombia") params.pais = "Colombia";

    const response = await axios.get("/admin/monthly-payments/consolidated", {
      params,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    const data = response.data?.data || response.data;
    const backendUsers = Array.isArray(data?.users) ? data.users : [];
    const backendPeriodDocs = data?.periodDocs || {};

    // Map backend users + processes into ConsolidatedUser (one per proceso)
    for (const u of backendUsers) {
      const procesos = Array.isArray(u?.procesos) ? u.procesos : [];
      for (const p of procesos) {
        const nombre = String(p?.nombreCompleto || u?.nombre || "").trim();
        const [first, ...rest] = nombre.split(" ");
        const evalPeriodo = p?.evaluacionPeriodo || null;
        const inboxPeriodo = p?.inboxPeriodo || null;

        users.push({
          id: p?.procesoId,
          usuarioId: u?.usuarioId || null,
          country: u?.pais || null,
          firstName: first || "",
          lastName: rest.join(" ") || "",
          email: u?.correo || "",
          documentUploadedThisMonth: !!evalPeriodo?.documentoSubido,
          lastDocumentDate: evalPeriodo?.fechaSubidaDocumento
            ? new Date(evalPeriodo.fechaSubidaDocumento).toLocaleDateString()
            : null,
          documentImageUrl: evalPeriodo?.documentoSubido || null,
          paymentEnabled: !!evalPeriodo?.pagoHabilitado,
          paymentEnabledDate: evalPeriodo?.pagoHabilitado
            ? new Date().toLocaleDateString()
            : null,
          evaluacionMensualId: evalPeriodo?.id || null,
          observacionesRevision: null,
          documentoRevisado: !!evalPeriodo?.documentoRevisado,
          mesAnteriorAprobado: false,
          evaluacionMesAnteriorId: null,
          companyName: p?.propuesta?.titulo || null,
          inboxMesActualId: inboxPeriodo?.id || null,
          inboxMesActualAñoMes: ym,
        });
      }
    }

    // Apply country filter for "rest" on client side
    const filtered = users.filter((u) => {
      if (countryFilter === "all") return true;
      const isCol = String(u.country || "").toLowerCase() === "colombia";
      return countryFilter === "colombia" ? isCol : !isCol;
    });

    // periodDocs from backend response
    for (const pid of Object.keys(backendPeriodDocs)) {
      periodDocs[pid] = periodDocs[pid] || {};
      const byYm = backendPeriodDocs[pid]?.[ym];
      if (byYm) {
        periodDocs[pid][ym] = {
          exists: !!byYm.exists,
          url: byYm.url || null,
          date: byYm.date || null,
          evaluacionId: byYm.evaluacionId || null,
        };
      }
    }

    return { success: true, users: filtered, periodDocs };
  } catch (error) {
    console.error("Error fetching consolidated monthly payments:", error);
    return { success: false, users: [], periodDocs: {} } as any;
  }
}
