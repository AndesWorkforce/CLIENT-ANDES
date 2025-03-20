import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";

// Rutas de autenticación que deben redirigir si el usuario ya está autenticado
const authRoutes: string[] = [
  // "/auth/login",
  // "/auth/register",
  // "/api/auth/login",
  // "/api/auth/register",
  // "/admin/login",
  // "/admin/dashboard",
];

// Rutas que requieren autenticación
const protectedRoutes = [
  "/perfil",
  "/postulaciones",
  "/cuenta",
  "/pages/offers/apply",
  "/user",
  "/dashboard",
  "/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar autenticación usando la cookie
  const authToken = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = !!authToken;

  // 1. Si ya está autenticado e intenta ir a páginas de login/registro, redirigir a offers
  if (
    isAuthenticated &&
    authRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/pages/offers";
    return NextResponse.redirect(url);
  }

  // 2. Verificamos si la ruta actual es una ruta protegida que requiere autenticación
  const requiresAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 3. Si requiere autenticación y el usuario no está autenticado, redirigir al login
  if (requiresAuth && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    // Guardar URL original para redirigir después del login
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 4. En cualquier otro caso, permitir la navegación
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
