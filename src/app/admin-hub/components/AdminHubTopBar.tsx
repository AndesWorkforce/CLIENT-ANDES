"use client";

import { Bell, ChevronDown, Settings, LayoutDashboard, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { logoutAction } from "@/app/auth/logout/actions/logout.action";
import Link from "next/link";
import { getUnreadAvisosCount } from "../avisos/data/mock-avisos";

export default function AdminHubTopBar() {
  const { user, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadAvisosCount = getUnreadAvisosCount();

  useOutsideClick(userMenuRef, () => setShowUserMenu(false), showUserMenu);

  async function handleLogout() {
    try {
      await logoutAction();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-end border-b border-[#EFEFEF] bg-white px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin-hub/avisos"
          aria-label={
            unreadAvisosCount > 0
              ? `Notificaciones, ${unreadAvisosCount} sin leer`
              : "Notificaciones"
          }
          className="relative inline-flex text-[#525252] transition-colors hover:text-[#0097B2]"
        >
          <Bell size={25} />
          {unreadAvisosCount > 0 ? (
            <span className="absolute -bottom-1 -right-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#0097B2] px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
              {unreadAvisosCount > 9 ? "9+" : unreadAvisosCount}
            </span>
          ) : null}
        </Link>

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
