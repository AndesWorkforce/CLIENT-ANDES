"use client";

import { usePathname } from "next/navigation";

// Rutas donde no queremos mostrar ciertos componentes (como Navbar y Footer)
export const excludedRoutes = {
  navbar: [
    "/auth", 
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
    "/profile", 
    "/applications",
    "/account",
    "/admin/login",
    "/admin/dashboard",
  ],
  footer: [
    "/auth", 
    "/auth/login",
    "/auth/register", 
    "/auth/reset-password",
  ],
};

export default function useRouteExclusion() {
  const pathname = usePathname();

  const shouldExclude = (componentType: keyof typeof excludedRoutes) => {
    return excludedRoutes[componentType].some((route) => pathname.startsWith(route));
  };

  return {
    shouldExclude,
    isNavbarExcluded: shouldExclude("navbar"),
    isFooterExcluded: shouldExclude("footer"),
  };
} 