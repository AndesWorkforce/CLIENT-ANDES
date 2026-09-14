/**
 * i18n de Admin Hub.
 *
 * Mecanismo: diccionarios propios (ES/EN) + React context, sin next-intl ni
 * next-i18next. Se acota a `/admin-hub` para no introducir routing por locale
 * en landing, candidato o contratista.
 *
 * Persistencia: cookie `admin-hub-lang` (SSR; default EN) y localStorage
 * (override manual del selector). El idioma inicial es inglés.
 */
export {
  ADMIN_HUB_DEFAULT_LOCALE,
  ADMIN_HUB_LOCALE_COOKIE,
  ADMIN_HUB_LOCALES,
  detectLocaleFromAcceptLanguage,
  parseAdminHubLocale,
  type AdminHubLocale,
} from "./locales";
export { AdminHubI18nProvider, useAdminHubI18n } from "./AdminHubI18nProvider";
export { default as AdminHubLanguageSwitcher } from "./LanguageSwitcher";
export {
  formatAdminHubPeriod,
  formatRelativeTime,
  translate,
  type AdminHubTranslate,
} from "./translate";
