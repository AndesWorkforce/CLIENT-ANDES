"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "admin-hub": "Administrador",
  dashboard: "Panel de Control",
  personas: "Personas",
  contratos: "Contratos",
  nominas: "Nóminas",
  pagos: "Pagos",
  facturas: "Factura",
  historial: "Historial",
  configuracion: "Configuración",
  variables: "Variables de nóminas",
};

export interface AdminHubBreadcrumbItem {
  label: string;
  href?: string;
}

export function getAdminHubBreadcrumbItems(pathname: string): AdminHubBreadcrumbItem[] {
  if (/^\/admin-hub\/nominas\/variables\/[^/]+$/.test(pathname)) {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: "Variables de nóminas", href: "/admin-hub/nominas/variables" },
      { label: "Detalle de variable" },
    ];
  }

  if (pathname.startsWith("/admin-hub/nominas/variables")) {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: "Variables de nóminas" },
    ];
  }

  if (pathname === "/admin-hub/nominas" || pathname === "/admin-hub/nominas/todas") {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas" },
    ];
  }

  if (/^\/admin-hub\/personas\/[^/]+$/.test(pathname)) {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Personas", href: "/admin-hub/personas" },
      { label: "Contratista" },
    ];
  }

  if (/^\/admin-hub\/contratos\/[^/]+$/.test(pathname)) {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Contratos", href: "/admin-hub/contratos" },
      { label: "Detalle de contrato" },
    ];
  }

  if (/^\/admin-hub\/nominas\/[^/]+$/.test(pathname) && pathname !== "/admin-hub/nominas/variables") {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Nóminas", href: "/admin-hub/nominas" },
      { label: "Detalle de nómina" },
    ];
  }

  if (/^\/admin-hub\/pagos\/facturas\/[^/]+$/.test(pathname)) {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Pagos", href: "/admin-hub/pagos" },
      { label: "Factura" },
    ];
  }

  if (pathname === "/admin-hub/pagos") {
    return [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Pagos" },
    ];
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "admin-hub") return [];

  const sectionSegments = segments
    .slice(1)
    .filter((seg) => !seg.startsWith("inv-") && !/^\d+$/.test(seg) && seg !== "facturas");

  const items: AdminHubBreadcrumbItem[] = [
    { label: "Administrador", href: "/admin-hub/dashboard" },
  ];

  sectionSegments.forEach((seg, index) => {
    const label = breadcrumbLabels[seg] ?? seg;
    const isLast = index === sectionSegments.length - 1;
    const href = `/admin-hub/${sectionSegments.slice(0, index + 1).join("/")}`;

    items.push({
      label,
      href: isLast ? undefined : href,
    });
  });

  return items;
}

/** @deprecated Usar getAdminHubBreadcrumbItems */
export function getAdminHubBreadcrumbs(pathname: string): string[] {
  return getAdminHubBreadcrumbItems(pathname).map((item) => item.label);
}

interface AdminHubBreadcrumbsProps {
  items?: AdminHubBreadcrumbItem[];
  className?: string;
}

export default function AdminHubBreadcrumbs({ items, className = "" }: AdminHubBreadcrumbsProps) {
  const pathname = usePathname();
  const crumbs = items ?? getAdminHubBreadcrumbItems(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav
      className={`flex items-center gap-1 text-[14px] font-semibold text-[#858585] ${className}`}
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;

        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="shrink-0 text-[#C8C8C8]" />}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-[#0097B2]"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[#343434]" : undefined}>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
