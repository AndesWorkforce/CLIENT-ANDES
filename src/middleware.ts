import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

const PRODUCTION_FALLBACK_ORIGIN = "https://andesworkforce.com";

/** Hosts inválidos cuando Next corre en Docker con HOSTNAME=0.0.0.0 */
function isInvalidRedirectHost(hostname: string): boolean {
  return !hostname || hostname === "0.0.0.0";
}

/**
 * Origen público real detrás de Traefik/nginx.
 * Evita redirects a https://0.0.0.0/... (HOSTNAME del contenedor).
 * No trata localhost como inválido: hace falta en Docker local y en test.
 */
function getPublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const hostHeader = request.headers.get("host")?.split(",")[0]?.trim();
  const host = forwardedHost || hostHeader || request.nextUrl.host;

  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProto ||
    (request.nextUrl.protocol === "https:" ? "https" : "http");

  if (isInvalidRedirectHost(host.split(":")[0])) {
    return PRODUCTION_FALLBACK_ORIGIN;
  }

  return `${protocol}://${host}`;
}

function buildRedirectUrl(request: NextRequest, pathname: string): URL {
  const url = new URL(pathname, getPublicOrigin(request));
  if (process.env.NODE_ENV === "production") {
    url.port = "";
    const hostname = url.hostname;
    if (
      hostname === "andes-workforce.com" ||
      hostname === "www.andes-workforce.com"
    ) {
      url.host = "andes-workforce.com";
    } else if (
      hostname === "andesworkforce.com" ||
      hostname === "www.andesworkforce.com"
    ) {
      url.host = "andesworkforce.com";
    }
  }
  return url;
}

function createCleanRedirect(request: NextRequest, pathname: string) {
  return NextResponse.redirect(buildRedirectUrl(request, pathname));
}

function redirectWithSearch(
  request: NextRequest,
  pathname: string,
  searchParams?: Record<string, string>
) {
  const url = buildRedirectUrl(request, pathname);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }
  return NextResponse.redirect(url);
}

const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/admin/login",
];

const protectedRoutes = [
  "/profile",
  "/applications",
  "/account",
  "/pages/offers/apply",
  "/pages/open-contracts",
  "/user",
];

const adminRoutes = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/offers",
  "/admin-hub",
];

const superAdminRoutes = ["/admin/superAdmin"];

const companyRoutes = [
  "/companies/dashboard",
  "/companies/dashboard/offers",
  "/companies/dashboard/employees",
  "/companies/dashboard/employees/new",
  "/companies/account",
];

const publicRoutes = [
  "/",
  "/api/auth/logout",
  "/api/auth/login/with-company",
  "/api/health",
  "/health",
  "/session-api/set",
  "/session-api/login",
  "/session-api/login/with-company",
  "/session-api/verify",
  "/session-api/logout",
  "/esign",
];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === "andes.client.andes-workforce.com") {
    const url = buildRedirectUrl(request, request.nextUrl.pathname);
    url.host = "andes-workforce.com";
    url.port = "";
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;

  if (
    pathname === "/api/auth/login/with-company" ||
    pathname.startsWith("/api/auth/login/with-company/") ||
    pathname === "/session-api/login/with-company" ||
    pathname.startsWith("/session-api/login/with-company/") ||
    pathname.startsWith("/session-api/")
  ) {
    return NextResponse.next();
  }
  const isRoleSelectionPath =
    pathname === "/auth/login/select-role" ||
    pathname.startsWith("/auth/login/select-role/");

  const authToken = request.cookies.get(AUTH_COOKIE)?.value;

  let hasUserInfoSession = false;
  try {
    const userInfoCookie = request.cookies.get(USER_INFO_COOKIE)?.value;
    if (userInfoCookie) {
      const parsed = JSON.parse(decodeURIComponent(userInfoCookie)) as {
        id?: string;
      };
      hasUserInfoSession = Boolean(parsed?.id);
    }
  } catch {
    hasUserInfoSession = false;
  }

  const isAuthenticated = !!authToken || hasUserInfoSession;

  let userInfo: { rol?: string } = {};
  try {
    const userInfoCookie = request.cookies.get(USER_INFO_COOKIE)?.value;
    if (userInfoCookie) {
      userInfo = JSON.parse(decodeURIComponent(userInfoCookie));
    }
  } catch (error) {
    console.error("Error al parsear cookie de usuario:", error);
  }

  const isAdmin =
    userInfo?.rol === "ADMIN" ||
    userInfo?.rol === "EMPLEADO_ADMIN" ||
    userInfo?.rol === "ADMIN_RECLUTAMIENTO";
  const isSuperAdmin = userInfo?.rol === "ADMIN";
  const isCompany =
    userInfo?.rol === "EMPRESA" || userInfo?.rol === "EMPLEADO_EMPRESA";

  if (
    isAuthenticated &&
    !isRoleSelectionPath &&
    authRoutes.some((route) => {
      if (route === "/api/auth/login") {
        if (
          pathname === "/api/auth/login/with-company" ||
          pathname.startsWith("/api/auth/login/with-company/")
        ) {
          return false;
        }
      }
      return pathname === route || pathname.startsWith(`${route}/`);
    })
  ) {
    if (isAdmin) {
      return createCleanRedirect(request, "/admin/dashboard");
    } else if (isCompany) {
      return createCleanRedirect(request, "/companies/dashboard");
    } else {
      return createCleanRedirect(request, "/pages/offers");
    }
  }

  if (
    isAuthenticated &&
    isCompany &&
    !companyRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) &&
    !publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return createCleanRedirect(request, "/companies/dashboard");
  }

  const requiresCompany = companyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (requiresCompany && (!isAuthenticated || !isCompany)) {
    if (!isAuthenticated) {
      return redirectWithSearch(request, "/auth/forced-logout", {
        reason: "session_expired",
        callbackUrl: pathname,
      });
    }
    return createCleanRedirect(
      request,
      isAdmin ? "/admin/dashboard" : "/pages/offers"
    );
  }

  const requiresSuperAdmin = superAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (requiresSuperAdmin && (!isAuthenticated || !isSuperAdmin)) {
    if (!isAuthenticated) {
      return redirectWithSearch(request, "/auth/forced-logout", {
        reason: "session_expired",
        callbackUrl: pathname,
      });
    }
    return createCleanRedirect(request, "/admin/dashboard");
  }

  const requiresAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (requiresAdmin && (!isAuthenticated || !isAdmin)) {
    if (!isAuthenticated) {
      return redirectWithSearch(request, "/auth/forced-logout", {
        reason: "session_expired",
        callbackUrl: pathname,
      });
    }
    return createCleanRedirect(request, "/pages/offers");
  }

  const requiresAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (requiresAuth && !isAuthenticated) {
    return redirectWithSearch(request, "/auth/forced-logout", {
      reason: "session_expired",
      callbackUrl: pathname,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
