import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

const PRODUCTION_FALLBACK_ORIGIN = "https://andesworkforce.com";

/** Hosts inválidos cuando Next corre en Docker con HOSTNAME=0.0.0.0 */
function isInvalidRedirectHost(hostname: string): boolean {
  return (
    !hostname ||
    hostname === "0.0.0.0" ||
    hostname === "localhost" ||
    hostname.startsWith("127.") ||
    hostname.endsWith(".local")
  );
}

/**
 * Origen público real detrás de Traefik/nginx.
 * Evita redirects a https://0.0.0.0/... (HOSTNAME del contenedor).
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

// Función helper para crear redirects limpios sin puerto
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

// Rutas de autenticación que deben redirigir si el usuario ya está autenticado
const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/admin/login",
];

// Rutas que requieren autenticación de usuario normal
const protectedRoutes = [
  "/profile",
  "/applications",
  "/account",
  "/pages/offers/apply",
  "/pages/open-contracts",
  "/user",
];

// Rutas exclusivas para administradores
const adminRoutes = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/offers",
  // Agregar aquí todas las rutas de administrador
];

// Rutas exclusivas para super administradores
const superAdminRoutes = [
  "/admin/superAdmin",
  // Agregar aquí todas las rutas de super administrador
];

// Rutas exclusivas para empresas
const companyRoutes = [
  "/companies/dashboard",
  "/companies/dashboard/offers",
  "/companies/dashboard/employees",
  "/companies/dashboard/employees/new",
  "/companies/account",
];

// Rutas públicas que todos pueden ver (incluso administradores)
const publicRoutes = [
  "/",
  "/api/auth/logout",
  // Allow the company-selection login proxy to bypass auth redirects
  "/api/auth/login/with-company",
  "/api/health",
  "/health",
  // ESIGN public flows must be accessible without auth
  "/esign",
  // Otras rutas públicas o APIs que deberían estar disponibles para todos
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

  // Hard-exempt our login proxy so it never gets redirected by middleware
  if (
    pathname === "/api/auth/login/with-company" ||
    pathname.startsWith("/api/auth/login/with-company/")
  ) {
    return NextResponse.next();
  }
  const isRoleSelectionPath =
    pathname === "/auth/login/select-role" ||
    pathname.startsWith("/auth/login/select-role/");

  // Verificar autenticación usando la cookie
  const authToken = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = !!authToken;

  // Obtener información del usuario (si existe)
  let userInfo: { rol?: string } = {};
  try {
    const userInfoCookie = request.cookies.get(USER_INFO_COOKIE)?.value;
    if (userInfoCookie) {
      userInfo = JSON.parse(decodeURIComponent(userInfoCookie));
    }
  } catch (error) {
    console.error("Error al parsear cookie de usuario:", error);
  }

  // Determinar roles de usuario
  const isAdmin =
    userInfo?.rol === "ADMIN" ||
    userInfo?.rol === "EMPLEADO_ADMIN" ||
    userInfo?.rol === "ADMIN_RECLUTAMIENTO";
  const isSuperAdmin = userInfo?.rol === "ADMIN";
  const isCompany =
    userInfo?.rol === "EMPRESA" || userInfo?.rol === "EMPLEADO_EMPRESA";

  // 1. Si ya está autenticado e intenta ir a páginas de login/registro
  if (
    isAuthenticated &&
    !isRoleSelectionPath &&
    authRoutes.some((route) => {
      // Do not treat our proxy as a generic auth route
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
    // Redireccionar según el rol usando función helper
    if (isAdmin) {
      return createCleanRedirect(request, "/admin/dashboard");
    } else if (isCompany) {
      return createCleanRedirect(request, "/companies/dashboard");
    } else {
      return createCleanRedirect(request, "/pages/offers");
    }
  }

  // 2. Si es empresa e intenta acceder a rutas que no le corresponden
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
    // Redirigir a la empresa a su dashboard
    return createCleanRedirect(request, "/companies/dashboard");
  }

  // 3. Verificar si la ruta actual es una ruta exclusiva de empresa
  const requiresCompany = companyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 4. Si requiere ser empresa pero el usuario no lo es, redirigir
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

  // 5. Verificar si la ruta actual es una ruta exclusiva de super administrador
  const requiresSuperAdmin = superAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 6. Si requiere ser super administrador pero el usuario no lo es, redirigir
  if (requiresSuperAdmin && (!isAuthenticated || !isSuperAdmin)) {
    if (!isAuthenticated) {
      return redirectWithSearch(request, "/auth/forced-logout", {
        reason: "session_expired",
        callbackUrl: pathname,
      });
    }
    return createCleanRedirect(request, "/admin/dashboard");
  }

  // 7. Verificar si la ruta actual es una ruta exclusiva de administrador
  const requiresAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 8. Si requiere ser administrador pero el usuario no lo es, redirigir
  if (requiresAdmin && (!isAuthenticated || !isAdmin)) {
    if (!isAuthenticated) {
      return redirectWithSearch(request, "/auth/forced-logout", {
        reason: "session_expired",
        callbackUrl: pathname,
      });
    }
    return createCleanRedirect(request, "/pages/offers");
  }

  // 9. Verificamos si la ruta actual es una ruta protegida que requiere autenticación
  const requiresAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 10. Si requiere autenticación y el usuario no está autenticado, redirigir al login
  if (requiresAuth && !isAuthenticated) {
    return redirectWithSearch(request, "/auth/forced-logout", {
      reason: "session_expired",
      callbackUrl: pathname,
    });
  }

  return NextResponse.next();
}

// Configuración de rutas donde se aplicará el middleware
export const config = {
  matcher: [
    /*
     * Excluir rutas para archivos públicos:
     * - /_next/ (archivos estáticos de Next.js)
     * - /favicon.ico, /robots.txt, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
