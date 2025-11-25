"use client";

import { useAuthStore } from "@/store/auth.store";
import { LogOut, Settings, LayoutDashboard, User } from "lucide-react";
import { useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { logoutAction } from "@/app/auth/logout/actions/logout.action";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationsBell from "@/app/components/NotificationsBell";

export default function HeaderDashboard() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  useOutsideClick(userMenuRef, () => setShowUserMenu(false), showUserMenu);

  async function handleLogout() {
    try {
      await logoutAction();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  if (pathname === "/admin/dashboard/account") return null;

  return (
    <header className="container mx-auto bg-white shadow-sm">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <Logo />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationsBell />
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-[16px] text-[#0097B2] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{`${user?.nombre || ""} ${user?.apellido || ""}`}</span>
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
                      <Settings
                        size={16}
                        className="mr-2 text-[#0097B2] cursor-pointer"
                      />
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
                  <LayoutDashboard
                    size={16}
                    className="mr-2 text-[#0097B2] cursor-pointer"
                  />
                  Offers Management
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
                  <LogOut
                    size={16}
                    className="mr-2 text-[#0097B2] cursor-pointer"
                  />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
