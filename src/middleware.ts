import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// AQUÍ SE SIMULA LA AUTENTICACIÓN
// Cambiar a true para simular que el usuario está autenticado y permitir acceso a rutas privadas
// Cambiar a false para simular que no está autenticado y forzar redirección al login
const isAuthenticated = false;

// Definición de rutas públicas (que no requieren autenticación)
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/auth/login",
  "/api/auth/register",
  "/pages/offers",
  "/pages/services",
  "/pages/about",
  "/pages/contact",
  "/pages/privacy-policy",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificamos si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Si es una ruta pública, permitimos el acceso directamente
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si no está autenticado y la ruta es privada, redirigimos al login
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    // Guardamos la URL original para redirigir después del login
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Si está autenticado, permitimos el acceso a la ruta privada
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
