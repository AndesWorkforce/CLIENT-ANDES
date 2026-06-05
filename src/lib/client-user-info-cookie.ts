const USER_INFO_COOKIE = "user_info";
const MAX_AGE = 7 * 24 * 60 * 60;

/** Fallback en el navegador si set-session no alcanza Next (p. ej. nginx /api → Nest). */
export function setClientUserInfoCookie(user: Record<string, unknown>) {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:";
  const value = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${USER_INFO_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax${
    secure ? "; secure" : ""
  }`;
}
