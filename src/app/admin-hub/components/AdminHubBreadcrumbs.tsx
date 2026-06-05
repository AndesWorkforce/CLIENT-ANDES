"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "admin-hub": "Administrador",
  dashboard: "Panel de Control",
  personas: "Personas",
  contratos: "Contratos",
  nominas: "Nóminas",
  pagos: "Pagos",
  facturas: "Facturas",
  historial: "Historial",
  configuracion: "Configuración",
  variables: "Variables de nóminas",
};

export function getAdminHubBreadcrumbs(pathname: string): string[] {
  if (pathname.startsWith("/admin-hub/nominas/variables")) {
    return ["Administrador", "Nóminas", "Variables de nóminas"];
  }

  if (pathname === "/admin-hub/nominas" || pathname === "/admin-hub/nominas/todas") {
    return ["Administrador", "Nóminas"];
  }

  const segments = pathname.split("/").filter(Boolean);
  return segments
    .filter((seg) => !/^\d+$/.test(seg))
    .map((seg) => breadcrumbLabels[seg] ?? seg);
}

interface AdminHubBreadcrumbsProps {
  items?: string[];
  className?: string;
}

export default function AdminHubBreadcrumbs({ items, className = "" }: AdminHubBreadcrumbsProps) {
  const pathname = usePathname();
  const crumbs = items ?? getAdminHubBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav
      className={`flex items-center gap-1 text-[14px] font-semibold text-[#858585] ${className}`}
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, i) => (
        <span key={`${crumb}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="shrink-0 text-[#C8C8C8]" />}
          <span className={i === crumbs.length - 1 ? "text-[#343434]" : undefined}>{crumb}</span>
        </span>
      ))}
    </nav>
  );
}
