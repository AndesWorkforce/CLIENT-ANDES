/**
 * Cookies de auth con flag `secure` acorde al protocolo real.
 * En servidores HTTP con NODE_ENV=production (PM2), `secure: true` impide
 * que el navegador guarde auth_token → verify y middleware fallan.
 */
export function isSecureAuthCookie(): boolean {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";

  if (appUrl.startsWith("https://")) return true;
  if (appUrl.startsWith("http://")) return false;

  // Sin URL explícita: no forzar Secure solo por NODE_ENV
  return false;
}

export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export function getAuthCookieBaseOptions() {
  return {
    httpOnly: true,
    secure: isSecureAuthCookie(),
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
  };
}

export function getClientReadableCookieOptions() {
  return {
    httpOnly: false,
    secure: isSecureAuthCookie(),
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
  };
}
