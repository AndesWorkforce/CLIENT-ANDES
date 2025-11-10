import axios from "axios";

// Normalize API base URL and add guardrails to avoid accidental prod hits from local dev
function normalizeApiUrl(raw?: string): string {
  const fallback = "http://localhost:5000/api/"; // sensible default for local
  let url = (raw || "").trim();
  if (!url) return fallback;

  // Ensure trailing slash
  if (!url.endsWith("/")) url = url + "/";

  // If the path doesn't include /api/, enforce it (common source of 404s like "Cannot PATCH /api/...")
  // Only do this when URL ends with domain or path not already containing /api/
  const lower = url.toLowerCase();
  if (!lower.includes("/api/")) {
    // Append api/ ensuring single slash
    url = url + (url.endsWith("/") ? "" : "/") + "api/";
    // fix any double slashes (except after protocol)
    url = url.replace(/([^:]\/)\/+/g, "$1");
  }

  return url;
}

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = normalizeApiUrl(RAW_API_URL);

// Safety guard: In development, warn loudly if pointing to production
if (process.env.NODE_ENV !== "production") {
  const isProdHost =
    /https?:\/\/(?:api\.|.*\.)?(andes|teamandes|andes-workforce)\.(com|app)/i.test(
      API_URL
    );
  if (isProdHost) {
    // eslint-disable-next-line no-console
    console.warn(
      `[axios.instance] Warning: You are running in ${process.env.NODE_ENV} but NEXT_PUBLIC_API_URL points to PRODUCTION: ${API_URL}`
    );
  }
}

export const axiosBase = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
