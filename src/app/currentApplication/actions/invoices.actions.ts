"use server";

import { createServerAxios } from "@/services/axios.server";

export async function getUserInboxesAction(
  userId: string,
  cursor?: string,
  limit: number = 20
) {
  try {
    const axios = await createServerAxios();
    const params = new URLSearchParams();
    if (cursor) params.set("cursor", cursor);
    if (limit) params.set("limit", String(limit));
    const url = `users/${userId}/inboxes${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await axios.get(url);
    return { success: true, data: response.data };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}

export async function viewInboxPdfAction(inboxId: string) {
  console.log("[viewInboxPdfAction] ===== SERVER ACTION VIEW =====");
  console.log("[viewInboxPdfAction] Received inboxId parameter:", inboxId);
  console.log("[viewInboxPdfAction] inboxId type:", typeof inboxId);
  console.log("[viewInboxPdfAction] inboxId value:", JSON.stringify(inboxId));
  console.log("[viewInboxPdfAction] inboxId truthy:", !!inboxId);
  console.log("[viewInboxPdfAction] inboxId === 'undefined':", inboxId === "undefined");
  console.log("[viewInboxPdfAction] inboxId === 'null':", inboxId === "null");
  
  if (!inboxId || typeof inboxId !== "string" || inboxId.trim() === "") {
    console.error("[viewInboxPdfAction] ❌ Validation failed:", {
      inboxId,
      hasInboxId: !!inboxId,
      isString: typeof inboxId === "string",
      trimmed: inboxId?.trim(),
      isEmpty: inboxId?.trim() === ""
    });
    return {
      success: false,
      error: "Invalid invoice ID",
    };
  }
  
  try {
    console.log("[viewInboxPdfAction] ✅ Making request to:", `users/inboxes/${inboxId}/view`);
    const axios = await createServerAxios();
    const response = await axios.get(`users/inboxes/${inboxId}/view`, {
      responseType: "arraybuffer",
    });
    const bytes = Buffer.from(response.data);
    const base64 = bytes.toString("base64");
    const disposition = (response.headers?.["content-disposition"] ||
      "") as string;
    let filename = "invoice.pdf";
    const match = /filename="?([^";]+)"?/i.exec(disposition);
    if (match && match[1]) filename = match[1];
    return { success: true, filename, base64 };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}

export async function downloadInboxPdfAction(inboxId: string) {
  console.log("[downloadInboxPdfAction] ===== SERVER ACTION DOWNLOAD =====");
  console.log("[downloadInboxPdfAction] Received inboxId parameter:", inboxId);
  console.log("[downloadInboxPdfAction] inboxId type:", typeof inboxId);
  console.log("[downloadInboxPdfAction] inboxId value:", JSON.stringify(inboxId));
  console.log("[downloadInboxPdfAction] inboxId truthy:", !!inboxId);
  console.log("[downloadInboxPdfAction] inboxId === 'undefined':", inboxId === "undefined");
  console.log("[downloadInboxPdfAction] inboxId === 'null':", inboxId === "null");
  
  if (!inboxId || typeof inboxId !== "string" || inboxId.trim() === "") {
    console.error("[downloadInboxPdfAction] ❌ Validation failed:", {
      inboxId,
      hasInboxId: !!inboxId,
      isString: typeof inboxId === "string",
      trimmed: inboxId?.trim(),
      isEmpty: inboxId?.trim() === ""
    });
    return {
      success: false,
      error: "Invalid invoice ID",
    };
  }
  
  try {
    console.log("[downloadInboxPdfAction] ✅ Making request to:", `users/inboxes/${inboxId}/download`);
    const axios = await createServerAxios();
    const response = await axios.get(`users/inboxes/${inboxId}/download`, {
      responseType: "arraybuffer",
    });
    const bytes = Buffer.from(response.data);
    const base64 = bytes.toString("base64");
    const disposition = (response.headers?.["content-disposition"] ||
      "") as string;
    let filename = "invoice.pdf";
    const match = /filename="?([^";]+)"?/i.exec(disposition);
    if (match && match[1]) filename = match[1];
    return { success: true, filename, base64 };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}

export async function generateUserInboxAction(
  userId: string,
  yearMonth?: string,
  processId?: string
) {
  try {
    const axios = await createServerAxios();
    const body: any = {};
    if (yearMonth) body.yearMonth = yearMonth;
    if (processId) body.processId = processId;
    const url = `users/${userId}/inboxes/generate`;
    const response = await axios.post(url, body);
    return { success: true, data: response.data };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}
