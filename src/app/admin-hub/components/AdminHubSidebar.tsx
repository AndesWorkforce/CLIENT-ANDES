"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Receipt,
  CreditCard,
  Clock,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const rolLabels: Record<string, string> = {
  ADMIN: "Administrador",
  ADMIN_RECLUTAMIENTO: "Admin Reclutamiento",
  EMPLEADO_ADMIN: "Admin Empleados",
};

const navItems = [
  { label: "Panel de control", href: "/admin-hub/dashboard", icon: LayoutDashboard },
  { label: "Personas", href: "/admin-hub/personas", icon: Users },
  { label: "Contratos", href: "/admin-hub/contratos", icon: ClipboardList },
  { label: "Nóminas", href: "/admin-hub/nominas", icon: Receipt },
];

const pagosSubItems = [
  { label: "Pagos", href: "/admin-hub/pagos" },
  { label: "Facturas", href: "/admin-hub/pagos/facturas" },
  { label: "Historial", href: "/admin-hub/pagos/historial", icon: Clock },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin-hub/pagos") {
    return pathname === href;
  }
  if (href === "/admin-hub/pagos/facturas") {
    return pathname === href || pathname.startsWith("/admin-hub/pagos/facturas/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminHubSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isPagosSection = pathname.startsWith("/admin-hub/pagos");

  return (
    <aside className="flex w-[280px] shrink-0 flex-col min-h-screen border-r border-[#C8C8C8] bg-white">
      <div className="px-4 py-5 border-b border-[#EFEFEF]">
        <Link href="/">
          <img src="/logo-andes.png" alt="Andes Workforce" className="h-8" />
        </Link>
      </div>

      <div className="flex items-center justify-between bg-[#F8F8F8] rounded-[8px] pl-[14px] pr-[18px] pt-[12px] pb-[9px] mx-2 mt-3 mb-1 min-h-[66px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[14px] font-semibold text-black leading-[1.3]">
            {rolLabels[user?.rol ?? ""] ?? "Administrador"}
          </p>
          <p className="text-[14px] text-[#525252] leading-[1.1] tracking-[0.28px]">
            {user?.nombre}
          </p>
        </div>
        <ChevronDown size={20} className="text-[#707070] shrink-0" />
      </div>

      <nav className="flex flex-col gap-[11px] flex-1 px-2 py-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] transition-colors ${
                isActive
                  ? "bg-[#F8F8F8] text-[#0097B2] font-semibold"
                  : "text-[#707070] hover:bg-[#F8F8F8] hover:text-[#0097B2]"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="tracking-[0.28px]">{label}</span>
            </Link>
          );
        })}

        <div>
          <Link
            href="/admin-hub/pagos"
            className={`flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] transition-colors ${
              isPagosSection
                ? "bg-[#DFFAFF] text-[#0097B2] font-semibold"
                : "text-[#707070] hover:bg-[#F8F8F8] hover:text-[#0097B2]"
            }`}
          >
            <CreditCard size={20} className="shrink-0" />
            <span className="tracking-[0.28px]">Pagos</span>
          </Link>

          <div className="mt-[11px] flex flex-col gap-[11px]">
            {pagosSubItems.map(({ label, href, icon: SubIcon }) => {
              const isSubActive = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex h-10 items-center gap-3 rounded-lg pl-3 pr-3 text-[14px] transition-colors ${
                    isSubActive
                      ? "font-semibold text-[#0097B2]"
                      : "text-[#707070] hover:text-[#0097B2]"
                  }`}
                >
                  {SubIcon ? (
                    <SubIcon size={20} className="shrink-0" />
                  ) : (
                    <ChevronRight size={20} className="shrink-0" />
                  )}
                  <span className="tracking-[0.28px]">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="px-2 py-3 border-t border-[#EFEFEF]">
        <Link
          href="/admin-hub/configuracion"
          className={`flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] transition-colors ${
            pathname.startsWith("/admin-hub/configuracion")
              ? "bg-[#F8F8F8] text-[#0097B2] font-semibold"
              : "text-[#707070] hover:bg-[#F8F8F8] hover:text-[#0097B2]"
          }`}
        >
          <Settings size={20} className="shrink-0" />
          <span className="tracking-[0.28px]">Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
