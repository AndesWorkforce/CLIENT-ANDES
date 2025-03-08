"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

const navigation = [
  { name: "Offers", href: "/pages/offers" },
  { name: "Services", href: "/pages/services" },
  { name: "About", href: "/pages/about" },
  { name: "Contact", href: "/pages/contact" },
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/auth");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

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
