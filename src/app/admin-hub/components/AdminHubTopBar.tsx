"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, ChevronRight, Settings, LayoutDashboard, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { logoutAction } from "@/app/auth/logout/actions/logout.action";
import Link from "next/link";

const breadcrumbLabels: Record<string, string> = {
  "admin-hub": "Administrador",
  dashboard: "Panel de Control",
  personas: "Personas",
  contratos: "Contratos",
  nominas: "Nóminas",
  pagos: "Pagos",
  historial: "Historial",
  configuracion: "Configuración",
};

export default function AdminHubTopBar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useOutsideClick(userMenuRef, () => setShowUserMenu(false), showUserMenu);

  async function handleLogout() {
    try {
      await logoutAction();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg) => breadcrumbLabels[seg] ?? seg);

  return (
    <header className="flex items-center justify-between h-[60px] px-6 bg-white border-b border-[#EFEFEF] shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[14px] text-[#707070]">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-[#C8C8C8]" />}
            <span className={i === crumbs.length - 1 ? "text-[#343434] font-semibold" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right: bell + user dropdown */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notificaciones"
          className="text-[#525252] hover:text-[#0097B2] transition-colors"
        >
          <Bell size={20} />
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0097B2] flex items-center justify-center text-white text-[12px] font-semibold uppercase shrink-0">
              {(user?.nombre?.[0] ?? "") + (user?.apellido?.[0] ?? "")}
            </div>
            <div className="hidden sm:flex flex-col leading-tight text-left">
              <span className="text-[14px] font-semibold text-[#343434]">
                {user?.nombre} {user?.apellido}
              </span>
              <span className="text-[12px] text-[#707070]">Administrador</span>
            </div>
            <ChevronDown size={14} className="text-[#707070]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[#0097B2] font-medium text-sm cursor-default">
                  {user?.nombre || ""} {user?.apellido || ""}
                </p>
              </div>

              {user?.rol === "ADMIN" && (
                <>
                  <Link
                    href="/admin/superAdmin"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="mr-2 text-[#0097B2]" />
                    Super Admin Panel
                  </Link>
                  <hr className="my-1 border-gray-200" />
                </>
              )}

              <Link
                href="/admin/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                onClick={() => setShowUserMenu(false)}
              >
                <LayoutDashboard size={16} className="mr-2 text-[#0097B2]" />
                Offers Management
              </Link>

              <hr className="my-1 border-gray-200" />
              <Link
                href="/admin-hub/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                onClick={() => setShowUserMenu(false)}
              >
                <LayoutDashboard size={16} className="mr-2 text-[#0097B2]" />
                Admin Hub
              </Link>

              <hr className="my-1 border-gray-200" />
              <Link
                href="/admin/dashboard/account"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={16} className="mr-2 text-[#0097B2]" />
                My Account!
              </Link>
              <hr className="my-1 border-gray-200" />

              <button
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
              >
                <LogOut size={16} className="mr-2 text-[#0097B2]" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
