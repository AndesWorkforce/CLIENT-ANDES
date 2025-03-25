import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

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

// Rutas públicas que todos pueden ver (incluso administradores)
const publicRoutes = [
  "/",
  "/api/auth/logout",
  "/api/health",
  // Otras rutas públicas o APIs que deberían estar disponibles para todos
];

export function middleware(request: NextRequest) {
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

  // Determinar si el usuario es administrador
  const isAdmin = userInfo?.rol === "ADMIN";

  // 1. Si ya está autenticado e intenta ir a páginas de login/registro
  if (
    isAuthenticated &&
    authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    const url = request.nextUrl.clone();

    // Redireccionar según el rol
    if (isAdmin) {
      url.pathname = "/admin/dashboard"; // Redirección para administradores
    } else {
      url.pathname = "/pages/offers"; // Redirección para usuarios normales
    }

    return NextResponse.redirect(url);
  }

  // 2. Si es administrador e intenta acceder a rutas de usuario normal o landing page
  if (
    isAuthenticated &&
    isAdmin &&
    !adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) &&
    !publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    // Redirigir al administrador a su dashboard
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. Verificar si la ruta actual es una ruta exclusiva de administrador
  const requiresAdmin = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 4. Si requiere ser administrador pero el usuario no lo es, redirigir
  if (requiresAdmin && (!isAuthenticated || !isAdmin)) {
    const url = request.nextUrl.clone();

    if (!isAuthenticated) {
      // Si no está autenticado, enviar al login
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
    } else {
      // Si está autenticado pero no es admin, enviar a página para usuarios normales
      url.pathname = "/pages/offers";
    }

    return NextResponse.redirect(url);
  }

  // 5. Verificamos si la ruta actual es una ruta protegida que requiere autenticación
  const requiresAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 6. Si requiere autenticación y el usuario no está autenticado, redirigir al login
  if (requiresAuth && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 7. En cualquier otro caso, permitir la navegación
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
