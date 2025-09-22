import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

// Función helper para crear redirects limpios sin puerto
function createCleanRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;

  // En producción, limpiar el puerto si es necesario
  if (process.env.NODE_ENV === "production") {
    url.port = "";
    // Asegurar que use el host correcto en producción
    if (url.hostname.includes("andes-workforce.com")) {
      url.host = "andes-workforce.com";
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
  "/api/health",
  "/health",
  // Otras rutas públicas o APIs que deberían estar disponibles para todos
];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === "andes.client.andes-workforce.com") {
    // clonar la URL y forzar el host principal
    const url = request.nextUrl.clone();
    url.host = "andes-workforce.com";
    url.port = ""; // Limpiar puerto en redirección
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;

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
    authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
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
    const url = request.nextUrl.clone();

    if (!isAuthenticated) {
      url.pathname = "/auth/forced-logout";
      url.searchParams.set("reason", "session_expired");
      url.searchParams.set("callbackUrl", pathname);
    } else {
      // Si está autenticado pero no es empresa, enviar a su página correspondiente
      url.pathname = isAdmin ? "/admin/dashboard" : "/pages/offers";
    }

    return NextResponse.redirect(url);
  }

  // 5. Verificar si la ruta actual es una ruta exclusiva de super administrador
  const requiresSuperAdmin = superAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 6. Si requiere ser super administrador pero el usuario no lo es, redirigir
  if (requiresSuperAdmin && (!isAuthenticated || !isSuperAdmin)) {
    const url = request.nextUrl.clone();

    if (!isAuthenticated) {
      url.pathname = "/auth/forced-logout";
      url.searchParams.set("reason", "session_expired");
      url.searchParams.set("callbackUrl", pathname);
    } else {
      url.pathname = "/admin/dashboard";
    }

    return NextResponse.redirect(url);
  }

  // 7. Verificar si la ruta actual es una ruta exclusiva de administrador
  const requiresAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 8. Si requiere ser administrador pero el usuario no lo es, redirigir
  if (requiresAdmin && (!isAuthenticated || !isAdmin)) {
    const url = request.nextUrl.clone();

    if (!isAuthenticated) {
      url.pathname = "/auth/forced-logout";
      url.searchParams.set("reason", "session_expired");
      url.searchParams.set("callbackUrl", pathname);
    } else {
      url.pathname = "/pages/offers";
    }

    return NextResponse.redirect(url);
  }

  // 9. Verificamos si la ruta actual es una ruta protegida que requiere autenticación
  const requiresAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 10. Si requiere autenticación y el usuario no está autenticado, redirigir al login
  if (requiresAuth && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/forced-logout";
    url.searchParams.set("reason", "session_expired");
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
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
