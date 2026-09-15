import { adminHubMessages } from "./messages";

export const ADMIN_HUB_DATE_LOCALE = "en-US";

export type AdminHubTranslateParams = Record<string, string | number>;

export type AdminHubTranslate = (
  key: string,
  params?: AdminHubTranslateParams,
) => string;

type MessageNode = string | { [key: string]: MessageNode };

function getByPath(source: MessageNode, key: string): string | undefined {
  const parts = key.split(".");
  let current: MessageNode = source;

  for (const part of parts) {
    if (typeof current === "string" || current == null || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params?: AdminHubTranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, token: string) =>
    params[token] === undefined ? `{${token}}` : String(params[token]),
  );
}

export const t: AdminHubTranslate = (key, params) => {
  const localized = getByPath(adminHubMessages as MessageNode, key);
  if (!localized) return key;
  return interpolate(localized, params);
};

export function formatAdminHubPeriod(periodo: string): string {
  const [year, monthStr] = periodo.split("-");
  const monthIndex = Number(monthStr) - 1;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return periodo;
  }
  return `${t(`months.${monthIndex}`)} ${year}`;
}

export function formatRelativeTime(isoDate: string): string {
  const created = new Date(isoDate);
  if (Number.isNaN(created.getTime())) return isoDate;

  const diffMs = Date.now() - created.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return t("relative.lessThanOneMin");
  if (diffMinutes < 60) return t("relative.minutes", { count: diffMinutes });
  if (diffHours < 24) return t("relative.hours", { count: diffHours });
  if (diffDays === 1) return t("relative.oneDay");
  if (diffDays < 7) return t("relative.days", { count: diffDays });
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? t("relative.oneWeek") : t("relative.weeks", { count: weeks });
  }
  const months = Math.floor(diffDays / 30);
  return months === 1 ? t("relative.oneMonth") : t("relative.months", { count: months });
}
