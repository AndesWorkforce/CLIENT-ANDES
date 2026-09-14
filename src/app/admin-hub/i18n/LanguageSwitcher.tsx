"use client";

import { ADMIN_HUB_LOCALES } from "./locales";
import { useAdminHubI18n } from "./AdminHubI18nProvider";

export default function AdminHubLanguageSwitcher() {
  const { locale, setLocale, t } = useAdminHubI18n();

  return (
    <div
      role="group"
      aria-label={t("language.switcherAria")}
      className="inline-flex h-8 items-center rounded-[8px] border border-[#EFEFEF] bg-[#F8F8F8] p-0.5"
    >
      {ADMIN_HUB_LOCALES.map((option) => {
        const isActive = option === locale;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLocale(option)}
            aria-pressed={isActive}
            aria-label={option === "es" ? t("language.spanish") : t("language.english")}
            className={`inline-flex h-7 min-w-[34px] items-center justify-center rounded-[6px] px-2 text-[12px] font-semibold tracking-[0.28px] transition-colors ${
              isActive
                ? "bg-[#0097B2] text-white"
                : "text-[#707070] hover:text-[#0097B2]"
            }`}
          >
            {t(`language.${option}`)}
          </button>
        );
      })}
    </div>
  );
}
