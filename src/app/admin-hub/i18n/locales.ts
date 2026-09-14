export const ADMIN_HUB_LOCALES = ["es", "en"] as const;

export type AdminHubLocale = (typeof ADMIN_HUB_LOCALES)[number];

export const ADMIN_HUB_DEFAULT_LOCALE: AdminHubLocale = "en";

export const ADMIN_HUB_LOCALE_COOKIE = "admin-hub-lang";
export const ADMIN_HUB_LOCALE_STORAGE_KEY = "admin-hub-lang";

export const ADMIN_HUB_DATE_LOCALES: Record<AdminHubLocale, string> = {
  es: "es-ES",
  en: "en-US",
};

export function isAdminHubLocale(value: unknown): value is AdminHubLocale {
  return value === "es" || value === "en";
}

export function parseAdminHubLocale(value: unknown): AdminHubLocale {
  return isAdminHubLocale(value) ? value : ADMIN_HUB_DEFAULT_LOCALE;
}

export function detectLocaleFromAcceptLanguage(
  _header?: string | null,
): AdminHubLocale {
  return ADMIN_HUB_DEFAULT_LOCALE;
}

export function detectLocaleFromNavigator(): AdminHubLocale {
  return ADMIN_HUB_DEFAULT_LOCALE;
}
