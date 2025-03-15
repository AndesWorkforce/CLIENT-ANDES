"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { logoutAction } from "@/app/auth/logout/actions/logout.action";
import { User, LogOut, FileText, UserCircle } from "lucide-react";

const navigation = [
  { name: "Offers", href: "/pages/offers" },
  { name: "Services", href: "/pages/services" },
  { name: "About", href: "/pages/about" },
  { name: "Contact", href: "/pages/contact" },
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAuthPage = pathname.includes("/auth");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Manejar visibilidad de sombras al desplazarse
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftShadow(scrollLeft > 20);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // Añadir listener de evento
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      // Inicializar estado
      handleScroll();
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logoutAction();
      logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función para verificar si una ruta está activa
  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  if (isAuthPage) {
    return null;
  }

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
          {/* Auth Buttons - Desktop y Mobile */}
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-[16px] text-[#0097B2] hover:text-[#0097B2] px-3 py-2 text-sm font-[600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{`${user?.nombre || ""} ${user?.apellido || ""}`}</span>
                  <span
                    className={`transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Menú desplegable */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[#0097B2] font-medium text-sm">
                        {user?.nombre || ""} {user?.apellido || ""}
                      </p>
                    </div>

                    <Link
                      href="/perfil"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircle size={16} className="mr-2 text-[#0097B2]" />
                      Mi perfil
                    </Link>

                    <Link
                      href="/postulaciones"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FileText size={16} className="mr-2 text-[#0097B2]" />
                      Mis postulaciones
                    </Link>

                    <Link
                      href="/cuenta"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="mr-2 text-[#0097B2]" />
                      Mi cuenta
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
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
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
    </header>
  );
}
