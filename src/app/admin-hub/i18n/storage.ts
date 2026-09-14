import {
  ADMIN_HUB_LOCALE_COOKIE,
  ADMIN_HUB_LOCALE_STORAGE_KEY,
  parseAdminHubLocale,
  type AdminHubLocale,
} from "./locales";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function persistAdminHubLocale(locale: AdminHubLocale) {
  if (typeof document !== "undefined") {
    document.cookie = `${ADMIN_HUB_LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(ADMIN_HUB_LOCALE_STORAGE_KEY, locale);
  }
}

export function readStoredAdminHubLocale(): AdminHubLocale | null {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(ADMIN_HUB_LOCALE_STORAGE_KEY);
    if (stored) return parseAdminHubLocale(stored);
  }
  if (typeof document !== "undefined") {
    const match = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ADMIN_HUB_LOCALE_COOKIE}=`));
    if (match) {
      return parseAdminHubLocale(match.split("=")[1]);
    }
  }
  return null;
}
