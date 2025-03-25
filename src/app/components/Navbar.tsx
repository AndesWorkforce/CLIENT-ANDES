"use client";

import { logoutAction } from "@/app/auth/logout/actions/logout.action";
import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";
import { User, LogOut, FileText, UserCircle, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import useRouteExclusion from "@/hooks/useRouteExclusion";
import useOutsideClick from "@/hooks/useOutsideClick";
import useScrollShadow from "@/hooks/useScrollShadow";

const navigation = [
  { name: "Home", href: "/pages/home" },
  { name: "Offers", href: "/pages/offers" },
  { name: "Services", href: "/pages/services" },
  { name: "About", href: "/pages/about" },
  { name: "Contact", href: "/pages/contact" },
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { isNavbarExcluded } = useRouteExclusion();
  const { scrollRef, showLeftShadow, showRightShadow } = useScrollShadow();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Usando el hook useOutsideClick para el menú de usuario
  useOutsideClick(userMenuRef, () => setShowUserMenu(false), showUserMenu);

  // Usando el hook useOutsideClick para el sidebar móvil
  useOutsideClick(
    sidebarRef,
    () => setShowMobileSidebar(false),
    showMobileSidebar
  );

  // Evitar scroll del body cuando el sidebar está abierto
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

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logoutAction();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Función para verificar si una ruta está activa
  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  if (isNavbarExcluded) {
    return null;
  }

  // Renderizar el menú de usuario
  const renderUserMenu = () => (
    <>
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-[#0097B2] font-medium text-sm">
          {user?.nombre || ""} {user?.apellido || ""}
        </p>
      </div>

      <Link
        href="/profile"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setShowUserMenu(false)}
      >
        <UserCircle size={16} className="mr-2 text-[#0097B2]" />
        My Profile
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
        {/* Desktop y Mobile Header */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Navigation Links - Desktop */}
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

          {/* Auth Buttons - Desktop y Mobile Activar cuando se tenga el Modulo Completo */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-[#0097B2] hover:text-[#007A8F] px-3 py-2 text-[16px] font-[600] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-b from-[#0097B2] via-[#0092AC] to-[#00404C] text-white px-4 py-2 rounded text-[16px] font-[600] transition-all hover:shadow-lg"
                >
                  Sign In
                </Link>
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
            )}
          </div>
        </div>

        {/* Mobile Navigation Links con desplazamiento táctil */}
        <div className="md:hidden relative">
          {/* Indicador de scroll izquierdo */}
          {showLeftShadow && (
            <div className="absolute top-0 left-0 w-8 h-full z-10 scroll-shadow-left" />
          )}

          {/* Contenedor desplazable */}
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

          {/* Indicador de scroll derecho */}
          {showRightShadow && (
            <div className="absolute top-0 right-0 w-8 h-full z-10 scroll-shadow-right" />
          )}
        </div>
      </div>

      {/* Mobile Sidebar Activar cuando se tenga el Modulo Completo */}
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
                  {user?.nombre || ""} {user?.apellido || ""}
                </p>

                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <UserCircle size={20} className="mr-2 text-[#0097B2]" />
                  My Profile
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
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
