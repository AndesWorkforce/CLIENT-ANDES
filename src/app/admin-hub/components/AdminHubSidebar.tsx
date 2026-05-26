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
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { label: "Panel de control", href: "/admin-hub/dashboard", icon: LayoutDashboard },
  { label: "Personas", href: "/admin-hub/personas", icon: Users },
  { label: "Contratos", href: "/admin-hub/contratos", icon: ClipboardList },
  { label: "Nóminas", href: "/admin-hub/nominas", icon: Receipt },
  { label: "Pagos", href: "/admin-hub/pagos", icon: CreditCard },
  { label: "Historial", href: "/admin-hub/historial", icon: Clock },
];

export default function AdminHubSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="flex flex-col w-[196px] min-h-screen bg-white border-r border-[#EFEFEF] shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#EFEFEF]">
        <Link href="/">
          <img src="/logo-andes.png" alt="Andes Workforce" className="h-8" />
        </Link>
      </div>

      {/* Admin info */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#EFEFEF]">
        <div>
          <p className="text-[12px] font-semibold text-[#343434] leading-tight">
            Administrador
          </p>
          <p className="text-[12px] text-[#707070] leading-tight">
            {user?.nombre} {user?.apellido}
          </p>
        </div>
        <ChevronDown size={14} className="text-[#707070] shrink-0" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1 px-2 py-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href);
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
      </nav>

      {/* Configuración bottom */}
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
