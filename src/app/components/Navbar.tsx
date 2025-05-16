"use client";

import { logoutAction } from "@/app/auth/logout/actions/logout.action";
import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  LogOut,
  FileText,
  UserCircle,
  X,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import useRouteExclusion from "@/hooks/useRouteExclusion";
import useOutsideClick from "@/hooks/useOutsideClick";
import useScrollShadow from "@/hooks/useScrollShadow";
import { userIsAppliedToOffer } from "../pages/offers/actions/jobs.actions";

const navigation = [
  { name: "Home", href: "/pages/home" },
  { name: "Available Contracts", href: "/pages/offers" },
  { name: "Services", href: "/pages/services" },
  { name: "About", href: "/pages/about" },
  { name: "Contact", href: "/pages/contact" },
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { isNavbarExcluded } = useRouteExclusion();
  const { scrollRef, showLeftShadow, showRightShadow } = useScrollShadow();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [isValidProfileUserState, setIsValidProfileUserState] =
    useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  useOutsideClick(userMenuRef, () => setShowUserMenu(false), showUserMenu);
  useOutsideClick(
    sidebarRef,
    () => setShowMobileSidebar(false),
    showMobileSidebar
  );

  const fetchAndUpdateProfileStatus = async () => {
    if (!user?.id) return;

    try {
      const now = new Date().getTime();
      const response = await userIsAppliedToOffer(user.id);

      if (response.success) {
        const isComplete = response.data?.perfilCompleto === "COMPLETO";
        setIsValidProfileUserState(isComplete);
        console.log(
          `[${now}] Perfil verificado:`,
          isComplete ? "COMPLETO" : "INCOMPLETO"
        );
      }
    } catch (error) {
      console.error("[Navbar] Error al verificar el perfil:", error);
    }
  };

  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileSidebar]);

  useEffect(() => {
    if (user) {
      fetchAndUpdateProfileStatus();
    }
  }, [user, pathname]);

  const handleLogout = async () => {
    try {
      await logoutAction();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  if (isNavbarExcluded) {
    return null;
  }

  const renderUserMenu = () => (
    <>
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-[#0097B2] font-medium text-sm">
          {isValidProfileUserState !== undefined && (
            <span
              className={`text-[10px] block ${
                isValidProfileUserState ? "text-green-500" : "text-red-500"
              }`}
            >
              {isValidProfileUserState
                ? "Profile Completed"
                : "Profile Incomplete"}
            </span>
          )}
          {user?.nombre || ""} {user?.apellido || ""}
        </p>
      </div>

      <Link
        href="/profile"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setShowUserMenu(false)}
      >
        <UserCircle size={16} className="mr-2 text-[#0097B2]" />
        <div className="relative">My Profile</div>
      </Link>

      <Link
        href="/applications"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setShowUserMenu(false)}
      >
        <FileText size={16} className="mr-2 text-[#0097B2]" />
        My Applications
      </Link>

      <Link
        href="/account"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setShowUserMenu(false)}
      >
        <User size={16} className="mr-2 text-[#0097B2]" />
        My Account
      </Link>

      <hr className="my-1 border-gray-200" />

      <button
        onClick={() => {
          handleLogout();
          setShowUserMenu(false);
        }}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
      >
        <LogOut size={16} className="mr-2 text-[#0097B2] cursor-pointer" />
        Logout
      </button>
    </>
  );

  return (
    <header className="w-full bg-[#FCFEFF] shadow-sm z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex-7 flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center space-x-8 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[16px] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors relative ${
                    isActive(item.href)
                      ? "text-[#0097B2] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0097B2]"
                      : "text-[#08252A]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-3 md:flex-2 flex flex-col items-center justify-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="bg-[#0097B2] text-white w-full max-w-[100px] py-1 px-1 rounded-[5px] text-[16px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer m-0"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </button>

                <div className="text-center">
                  <p className="flex flex-col text-[10px] text-[#B6B4B4] m-0 mt-1">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-[#0097B2] font-[600] text-[12px] hover:underline"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {user?.rol === "CANDIDATO" ? (
                  <>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="text-[16px] text-[#0097B2] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{`${user?.nombre || ""} ${
                          user?.apellido || ""
                        }`}</span>
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          {renderUserMenu()}
                        </div>
                      )}
                    </div>
                    <div className="md:hidden">
                      <button
                        onClick={() => setShowMobileSidebar(true)}
                        className="text-[16px] text-[#0097B2] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{`${user?.nombre || ""} ${
                          user?.apellido || ""
                        }`}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="text-[16px] text-[#0097B2] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{`${user?.nombre || ""} ${
                          user?.apellido || ""
                        }`}</span>
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-[#0097B2] font-medium text-sm cursor-default">
                              {isValidProfileUserState !== undefined && (
                                <span
                                  className={`text-[10px] block ${
                                    isValidProfileUserState
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {isValidProfileUserState
                                    ? "Completed"
                                    : "Incomplete"}
                                </span>
                              )}
                              {user?.nombre || ""} {user?.apellido || ""}
                            </p>
                          </div>
                          {user?.rol === "ADMIN" ? (
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
                                Panel de Super Admin
                              </Link>
                              <hr className="my-1 border-gray-200" />
                            </>
                          ) : null}

                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard
                              size={16}
                              className="mr-2 text-[#0097B2] cursor-pointer"
                            />
                            Gestión de Ofertas
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
                            Cerrar sesión
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="md:hidden">
                      <button
                        onClick={() => setShowMobileSidebar(true)}
                        className="text-[16px] text-[#0097B2] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{`${user?.nombre || ""} ${
                          user?.apellido || ""
                        }`}</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="md:hidden relative">
          {showLeftShadow && (
            <div className="absolute top-0 left-0 w-8 h-full z-10 scroll-shadow-left" />
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4 pt-2 -mx-4 px-4"
          >
            <div className="flex space-x-2 min-w-max">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-center px-4 py-1.5 border text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-gray-300 text-white border-gray-300"
                      : "bg-[#FCFEFF] text-[#08252A] border-gray-200 hover:text-[#0097B2] hover:border-[#0097B2]"
                  } rounded-md`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {showRightShadow && (
            <div className="absolute top-0 right-0 w-8 h-full z-10 scroll-shadow-right" />
          )}
        </div>
      </div>

      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-[#08252A33] z-50 md:hidden animate-fade-in"
          onClick={() => setShowMobileSidebar(false)}
        >
          <div
            ref={sidebarRef}
            className="absolute right-0 top-0 h-full w-[250px] bg-white shadow-xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Logo />
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="text-gray-500 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-2">
              <div className="flex flex-col space-y-1 py-2">
                <p className="px-4 text-[#0097B2] font-medium">
                  {isValidProfileUserState !== undefined && (
                    <span
                      className={`text-[10px] block ${
                        isValidProfileUserState
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {isValidProfileUserState ? "Completed" : "Incomplete"}
                    </span>
                  )}
                  {user?.nombre || ""} {user?.apellido || ""}
                </p>

                {user?.rol === "CANDIDATO" ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <UserCircle size={20} className="mr-2 text-[#0097B2]" />
                      <div className="relative">
                        My Profile
                        {isValidProfileUserState !== undefined && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 6 6"
                            fill={
                              isValidProfileUserState ? "#10B981" : "#EF4444"
                            }
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute -top-2 -right-2"
                          >
                            <circle cx="3" cy="3" r="3" />
                          </svg>
                        )}
                      </div>
                    </Link>

                    <Link
                      href="/applications"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <FileText size={20} className="mr-2 text-[#0097B2]" />
                      My Applications
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <User size={20} className="mr-2 text-[#0097B2]" />
                      My Account
                    </Link>
                  </>
                ) : (
                  <>
                    {user?.rol === "ADMIN" && (
                      <Link
                        href="/admin/superAdmin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <Settings size={20} className="mr-2 text-[#0097B2]" />
                        Panel de Super Admin
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200" />

                    <Link
                      href="/admin/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <LayoutDashboard
                        size={20}
                        className="mr-2 text-[#0097B2]"
                      />
                      Gestión de Ofertas
                    </Link>
                  </>
                )}

                <hr className="my-1 border-gray-200" />

                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileSidebar(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-left w-full cursor-pointer"
                >
                  <LogOut
                    size={20}
                    className="mr-2 text-[#0097B2] cursor-pointer"
                  />
                  {user?.rol === "CANDIDATO" ? "Logout" : "Cerrar sesión"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
