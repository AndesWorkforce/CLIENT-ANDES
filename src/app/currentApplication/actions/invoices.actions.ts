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
  try {
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
  try {
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
  yearMonth?: string
) {
  try {
    const axios = await createServerAxios();
    const body: any = {};
    if (yearMonth) body.yearMonth = yearMonth;
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
