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
    "/admin/superAdmin",
    "/admin/dashboard/offers",
    "/admin/dashboard/account",
    "/admin-hub",
    "/companies/dashboard",
    "/companies/dashboard/offers",
    "/companies/dashboard/employees",
    "/companies/dashboard/employees/new",
    "/companies/account",
    "/currentApplication",
  ],
  footer: [
    "/auth",
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
    "/admin/dashboard",
    "/admin/superAdmin",
    "/admin-hub",
    "/companies/dashboard",
    "/companies/dashboard/offers",
    "/admin/dashboard/account",
    "/companies/dashboard/employees",
    "/companies/dashboard/employees/new",
    "/companies/account",
    "/currentApplication",
  ],
};

const HERO_OVERLAY_PREFIXES = [
  "/pages/home",
  "/pages/about",
  "/pages/contact",
  "/pages/services",
  "/pages/offers",
];

/** Landing pages whose hero sits under a fixed transparent navbar (no top padding). */
export function isHeroOverlayPath(pathname: string) {
  if (pathname === "/") return true;
  return HERO_OVERLAY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function useRouteExclusion() {
  const pathname = usePathname();

  const shouldExclude = (componentType: keyof typeof excludedRoutes) => {
    return excludedRoutes[componentType].some((route) =>
      pathname.startsWith(route)
    );
  };

  return {
    shouldExclude,
    isNavbarExcluded: shouldExclude("navbar"),
    isFooterExcluded: shouldExclude("footer"),
    isHeroOverlayPage: isHeroOverlayPath(pathname),
  };
}
