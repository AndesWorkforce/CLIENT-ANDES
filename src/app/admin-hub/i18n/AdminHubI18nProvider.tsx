"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADMIN_HUB_DATE_LOCALES,
  ADMIN_HUB_DEFAULT_LOCALE,
  detectLocaleFromNavigator,
  parseAdminHubLocale,
  type AdminHubLocale,
} from "./locales";
import { persistAdminHubLocale, readStoredAdminHubLocale } from "./storage";
import { translate, type AdminHubTranslate } from "./translate";

interface AdminHubI18nValue {
  locale: AdminHubLocale;
  setLocale: (locale: AdminHubLocale) => void;
  t: AdminHubTranslate;
  dateLocale: string;
}

const AdminHubI18nContext = createContext<AdminHubI18nValue | null>(null);

interface AdminHubI18nProviderProps {
  initialLocale?: AdminHubLocale;
  children: ReactNode;
}

export function AdminHubI18nProvider({
  initialLocale = ADMIN_HUB_DEFAULT_LOCALE,
  children,
}: AdminHubI18nProviderProps) {
  const [locale, setLocaleState] = useState<AdminHubLocale>(
    parseAdminHubLocale(initialLocale),
  );

  useEffect(() => {
    const stored = readStoredAdminHubLocale();
    if (stored) {
      if (stored !== initialLocale) {
        setLocaleState(stored);
      }
      persistAdminHubLocale(stored);
      return;
    }
    persistAdminHubLocale(parseAdminHubLocale(initialLocale));
  }, [initialLocale]);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "es";
  }, [locale]);

  const setLocale = useCallback((next: AdminHubLocale) => {
    const parsed = parseAdminHubLocale(next);
    setLocaleState(parsed);
    persistAdminHubLocale(parsed);
  }, []);

  const t = useCallback<AdminHubTranslate>(
    (key, params) => translate(locale, key, params),
    [locale],
  );

  const value = useMemo<AdminHubI18nValue>(
    () => ({
      locale,
      setLocale,
      t,
      dateLocale: ADMIN_HUB_DATE_LOCALES[locale],
    }),
    [locale, setLocale, t],
  );

  return (
    <AdminHubI18nContext.Provider value={value}>
      {children}
    </AdminHubI18nContext.Provider>
  );
}

const fallbackValue: AdminHubI18nValue = {
  locale: ADMIN_HUB_DEFAULT_LOCALE,
  setLocale: () => undefined,
  t: (key, params) => translate(ADMIN_HUB_DEFAULT_LOCALE, key, params),
  dateLocale: ADMIN_HUB_DATE_LOCALES[ADMIN_HUB_DEFAULT_LOCALE],
};

export function useAdminHubI18n(): AdminHubI18nValue {
  return useContext(AdminHubI18nContext) ?? fallbackValue;
}

export function detectInitialClientLocale(serverLocale: AdminHubLocale): AdminHubLocale {
  return readStoredAdminHubLocale() ?? detectLocaleFromNavigator() ?? serverLocale;
}
