"use server";

import { cookies } from "next/headers";
import { getApiUrl } from "@/services/axios.server";
import { getUserInboxesAction } from "@/app/currentApplication/actions/invoices.actions";
import {
  getActiveContractsForUser,
  getCurrentContract,
  type MonthlyProof,
} from "@/app/currentApplication/actions/current-contract.actions";

export type LastInvoiceInfo = {
  yearMonth: string;
  monthLabel: string;
  year: number;
  invoiceNumber: string | null;
};

export type PaymentChecklistState = {
  authenticated: boolean;
  isColombiaResident: boolean;
  bankInformationUpdated: boolean;
  invoiceGenerated: boolean;
  planillaUploaded: boolean;
  planillaApplicable: boolean;
  currentYearMonth: string;
  lastInvoice: LastInvoiceInfo | null;
};

type BankInfo = {
  usaDollarApp?: boolean | null;
  dollarTag?: string | null;
  bancoNombre?: string | null;
  bancoPais?: string | null;
  numeroCuentaBancaria?: string | null;
  nombreTitularCuenta?: string | null;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getCurrentYearMonth(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function isBankInfoUpdated(bankInfo?: BankInfo | null): boolean {
  if (!bankInfo) return false;
  if (bankInfo.usaDollarApp) {
    return Boolean(bankInfo.dollarTag?.trim());
  }
  return Boolean(
    bankInfo.bancoNombre?.trim() &&
      bankInfo.numeroCuentaBancaria?.trim() &&
      bankInfo.nombreTitularCuenta?.trim()
  );
}

function isColombiaCountry(value?: string | null): boolean {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "colombia";
}

function proofMatchesCurrentMonth(
  proof: MonthlyProof & { añoMes?: string | null },
  currentYm: string
): boolean {
  if (proof.añoMes && String(proof.añoMes) === currentYm) {
    return true;
  }

  const [yearStr, monthStr] = currentYm.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const monthName = MONTH_NAMES[monthIndex];

  return (
    Number(proof.year) === year &&
    String(proof.month).toLowerCase() === monthName.toLowerCase()
  );
}

function hasUploadedPlanilla(
  proofs: Array<MonthlyProof & { añoMes?: string | null; documentoSubido?: string | null }>,
  currentYm: string
): boolean {
  return proofs.some((proof) => {
    if (!proofMatchesCurrentMonth(proof, currentYm)) return false;
    const hasFile = Boolean(proof.file || proof.documentoSubido);
    if (!hasFile) return false;
    return proof.status !== "REJECTED";
  });
}

function formatYearMonthLabel(yearMonth: string): LastInvoiceInfo | null {
  const [yearStr, monthStr] = String(yearMonth).split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  if (!year || monthIndex < 0 || monthIndex > 11) return null;
  return {
    yearMonth,
    monthLabel: MONTH_NAMES[monthIndex],
    year,
    invoiceNumber: null,
  };
}

function emptyState(currentYearMonth: string): PaymentChecklistState {
  return {
    authenticated: false,
    isColombiaResident: false,
    bankInformationUpdated: false,
    invoiceGenerated: false,
    planillaUploaded: false,
    planillaApplicable: false,
    currentYearMonth,
    lastInvoice: null,
  };
}

export async function getPaymentChecklistState(): Promise<PaymentChecklistState> {
  const currentYearMonth = getCurrentYearMonth();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let userId: string | undefined;
  let cookiePais: string | undefined;
  try {
    const raw = cookieStore.get("user_info")?.value;
    if (raw) {
      const parsed = JSON.parse(raw) as { id?: string; pais?: string };
      userId = typeof parsed?.id === "string" ? parsed.id : undefined;
      cookiePais =
        typeof parsed?.pais === "string" ? parsed.pais : undefined;
    }
  } catch {
    userId = undefined;
  }

  if (!userId || !token) {
    return emptyState(currentYearMonth);
  }

  let bankInformationUpdated = false;
  let isColombiaResident = isColombiaCountry(cookiePais);

  try {
    const response = await fetch(
      `${getApiUrl()}usuarios/${userId}/perfil-completo`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const payload = (await response.json()) as {
        data?: {
          bankInfo?: BankInfo | null;
          datosPersonales?: { pais?: string | null };
          pais?: string | null;
        };
      };
      const data = payload?.data;
      bankInformationUpdated = isBankInfoUpdated(data?.bankInfo);
      isColombiaResident = isColombiaCountry(
        data?.datosPersonales?.pais ?? data?.pais ?? cookiePais
      );
    }
  } catch (error) {
    console.error("[getPaymentChecklistState] perfil-completo failed:", error);
  }

  let invoiceGenerated = false;
  let lastInvoice: LastInvoiceInfo | null = null;
  try {
    const inboxesRes = await getUserInboxesAction(userId, undefined, 50);
    if (inboxesRes.success) {
      const payload = inboxesRes.data || {};
      const items = (payload.data || payload.items || []) as Array<{
        añoMes?: string;
        invoiceNumber?: string | null;
        generatedAt?: string | null;
        createdAt?: string | null;
        fechaCreacion?: string | null;
      }>;

      invoiceGenerated = items.some(
        (item) => String(item.añoMes || "") === currentYearMonth
      );

      const sorted = [...items].sort((a, b) => {
        const aYm = String(a.añoMes || "");
        const bYm = String(b.añoMes || "");
        if (aYm !== bYm) return bYm.localeCompare(aYm);
        const aDate = Date.parse(
          String(a.generatedAt || a.createdAt || a.fechaCreacion || "")
        );
        const bDate = Date.parse(
          String(b.generatedAt || b.createdAt || b.fechaCreacion || "")
        );
        return (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate);
      });

      const newest = sorted[0];
      if (newest?.añoMes) {
        const base = formatYearMonthLabel(String(newest.añoMes));
        if (base) {
          lastInvoice = {
            ...base,
            invoiceNumber: newest.invoiceNumber
              ? String(newest.invoiceNumber)
              : null,
          };
        }
      }
    }
  } catch (error) {
    console.error("[getPaymentChecklistState] inboxes failed:", error);
  }

  let planillaUploaded = false;
  if (isColombiaResident) {
    try {
      const activeRes = await getActiveContractsForUser(userId);
      const contracts = activeRes.success
        ? activeRes.data || []
        : [];

      let proofs: Array<
        MonthlyProof & { añoMes?: string | null; documentoSubido?: string | null }
      > = [];

      if (contracts.length > 0) {
        proofs = contracts.flatMap((contract) =>
          (contract.monthlyProofs || []).map((proof) => ({
            ...proof,
            procesoContratacionId:
              proof.procesoContratacionId || contract.id,
          }))
        );
      } else {
        const currentRes = await getCurrentContract();
        if (currentRes.success && currentRes.data?.monthlyProofs) {
          proofs = currentRes.data.monthlyProofs;
        }
      }

      planillaUploaded = hasUploadedPlanilla(proofs, currentYearMonth);
    } catch (error) {
      console.error("[getPaymentChecklistState] proofs failed:", error);
    }
  }

  return {
    authenticated: true,
    isColombiaResident,
    bankInformationUpdated,
    invoiceGenerated,
    planillaUploaded,
    planillaApplicable: isColombiaResident,
    currentYearMonth,
    lastInvoice,
  };
}
