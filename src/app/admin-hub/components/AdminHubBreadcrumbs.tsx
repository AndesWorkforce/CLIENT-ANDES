"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { t, type AdminHubTranslate } from "../i18n";

export interface AdminHubBreadcrumbItem {
  label: string;
  href?: string;
}

export function getAdminHubBreadcrumbItems(
  pathname: string,
  t: AdminHubTranslate,
): AdminHubBreadcrumbItem[] {
  if (/^\/admin-hub\/nominas\/variables\/[^/]+$/.test(pathname)) {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.nominas"), href: "/admin-hub/nominas" },
      { label: t("breadcrumbs.nominasVariables"), href: "/admin-hub/nominas/variables" },
      { label: t("breadcrumbs.variableDetail") },
    ];
  }

  if (pathname.startsWith("/admin-hub/nominas/variables")) {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.nominas"), href: "/admin-hub/nominas" },
      { label: t("breadcrumbs.nominasVariables") },
    ];
  }

  if (pathname === "/admin-hub/nominas" || pathname === "/admin-hub/nominas/todas") {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.nominas") },
    ];
  }

  if (/^\/admin-hub\/personas\/[^/]+$/.test(pathname)) {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.personas"), href: "/admin-hub/personas" },
      { label: t("breadcrumbs.contratista") },
    ];
  }

  if (/^\/admin-hub\/contratos\/[^/]+$/.test(pathname)) {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.contratos"), href: "/admin-hub/contratos" },
      { label: t("breadcrumbs.contractDetail") },
    ];
  }

  if (/^\/admin-hub\/nominas\/[^/]+$/.test(pathname) && pathname !== "/admin-hub/nominas/variables") {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.nominas"), href: "/admin-hub/nominas" },
      { label: t("breadcrumbs.payrollDetail") },
    ];
  }

  if (/^\/admin-hub\/pagos\/facturas\/[^/]+$/.test(pathname)) {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.pagos"), href: "/admin-hub/pagos" },
      { label: t("breadcrumbs.factura") },
    ];
  }

  if (pathname === "/admin-hub/pagos") {
    return [
      { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
      { label: t("breadcrumbs.pagos") },
    ];
  }

  const breadcrumbLabels: Record<string, string> = {
    "admin-hub": t("breadcrumbs.admin"),
    dashboard: t("breadcrumbs.dashboard"),
    personas: t("breadcrumbs.personas"),
    contratos: t("breadcrumbs.contratos"),
    nominas: t("breadcrumbs.nominas"),
    pagos: t("breadcrumbs.pagos"),
    facturas: t("breadcrumbs.factura"),
    historial: t("breadcrumbs.historial"),
    configuracion: t("breadcrumbs.configuracion"),
    variables: t("breadcrumbs.nominasVariables"),
    avisos: t("breadcrumbs.avisos"),
    emitidas: t("breadcrumbs.emitidas"),
    "dias-festivos": t("breadcrumbs.holidays"),
  };

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "admin-hub") return [];

  const sectionSegments = segments
    .slice(1)
    .filter((seg) => !seg.startsWith("inv-") && !/^\d+$/.test(seg) && seg !== "facturas");

  const items: AdminHubBreadcrumbItem[] = [
    { label: t("breadcrumbs.admin"), href: "/admin-hub/dashboard" },
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
export function getAdminHubBreadcrumbs(pathname: string, t: AdminHubTranslate): string[] {
  return getAdminHubBreadcrumbItems(pathname, t).map((item) => item.label);
}

interface AdminHubBreadcrumbsProps {
  items?: AdminHubBreadcrumbItem[];
  className?: string;
}

export default function AdminHubBreadcrumbs({ items, className = "" }: AdminHubBreadcrumbsProps) {
  const pathname = usePathname();
  const crumbs = items ?? getAdminHubBreadcrumbItems(pathname, t);

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
