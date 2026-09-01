"use client";

import React from "react";
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
  Briefcase,
  HelpCircle,
  Phone,
  Mail,
  Home,
  Users,
  Headphones,
  Handshake,
  Globe,
  Menu,
  LifeBuoy,
  BookOpen,
} from "lucide-react";
import { FaSquareFacebook, FaLinkedin } from "react-icons/fa6";
import { AiFillInstagram, AiFillTikTok } from "react-icons/ai";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ItSupportRedirectModal, {
  IT_SUPPORT_PORTAL_URL,
} from "./ItSupportRedirectModal";
import useRouteExclusion from "@/hooks/useRouteExclusion";
import useOutsideClick from "@/hooks/useOutsideClick";
import {
  getCurrentContract,
  getCurrentUserBasic,
  userIsAppliedToOffer,
} from "../pages/offers/actions/jobs.actions";

const navigation = [
  { name: "Home", href: "/pages/home", icon: Home },
  { name: "About Us", href: "/pages/about", icon: Users },
  { name: "Our Services", href: "/pages/services", icon: Headphones },
  { name: "Join Our Team", href: "/pages/offers", icon: Handshake },
  { name: "Blog", href: "/pages/blog", icon: BookOpen },
  { name: "Contact Us", href: "/pages/contact", icon: Globe },
];

const socialLinks = [
  { icon: FaSquareFacebook, href: "https://www.facebook.com/profile.php?id=61553675729226&mibextid=LQQJ4d", label: "Facebook" },
  { icon: AiFillInstagram, href: "https://www.instagram.com/andesworkforce/", label: "Instagram" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/company/andes-workforce/posts/?feedView=all", label: "LinkedIn" },
  { icon: AiFillTikTok, href: "https://www.tiktok.com/@andesworkforce?_r=1&_t=ZS-95Qs2ALJBau", label: "TikTok" },
];

/** Texto mostrado en la navbar: prioriza el alias (override o `user.alias`);
 *  si no hay, nombre + apellido (comportamiento anterior). */
function getNavbarDisplayName(
  user:
    | {
        nombre?: string | null;
        apellido?: string | null;
        alias?: string | null;
      }
    | null
    | undefined,
  aliasOverride?: string | null
): string {
  const overrideTrimmed =
    typeof aliasOverride === "string" ? aliasOverride.trim() : "";
  if (overrideTrimmed) return overrideTrimmed;
  if (!user) return "";
  const alias = typeof user.alias === "string" ? user.alias.trim() : "";
  if (alias) return alias;
  return `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim();
}

const contactInfo: { icon: typeof Phone; text: React.ReactNode }[] = [
  {
    icon: Phone,
    text: (
      <>
        +1 7572373612{" "}
        <span className="text-[#0097B2]">-</span>
        {" "}+1 3057030023
      </>
    ),
  },
  { icon: Mail, text: "info@andes-workforce.com" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const { isNavbarExcluded } = useRouteExclusion();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [showItSupportModal, setShowItSupportModal] = useState<boolean>(false);
  const [currentContractStatus, setCurrentContractStatus] =
    useState<boolean>(false);
  const [stepContract, setStepContract] = useState<string>("");
  const [isValidProfileUserState, setIsValidProfileUserState] =
    useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage =
    pathname === "/" ||
    pathname === "/pages/home" ||
    pathname.startsWith("/pages/home/");
  const isAboutPage =
    pathname === "/pages/about" || pathname.startsWith("/pages/about/");
  const isHeroOverlayPage = isHomePage || isAboutPage;
  const isTransparentNav = isHeroOverlayPage && !isScrolled;
  /**
   * Alias leído en caliente desde `users/me`. Esto evita depender de la cookie
   * `user_info` (que puede tener un objeto de usuario viejo sin `alias`).
   */
  const [aliasFromServer, setAliasFromServer] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  useOutsideClick(userMenuRef, () => setShowUserMenu(false), showUserMenu);
  useOutsideClick(
    sidebarRef,
    () => setShowMobileSidebar(false),
    showMobileSidebar
  );

  useEffect(() => {
    if (!isHeroOverlayPage) {
      setIsScrolled(false);
      return;
    }

    const updateNavStyle = () => {
      const hero =
        document.getElementById("home-hero") ||
        document.getElementById("about-hero");
      if (!hero) {
        setIsScrolled(window.scrollY > 40);
        return;
      }

      // Mantener navbar transparente hasta que termine el frame del Hero
      const heroBottom = hero.getBoundingClientRect().bottom;
      setIsScrolled(heroBottom <= 0);
    };

    updateNavStyle();
    window.addEventListener("scroll", updateNavStyle, { passive: true });
    window.addEventListener("resize", updateNavStyle);
    return () => {
      window.removeEventListener("scroll", updateNavStyle);
      window.removeEventListener("resize", updateNavStyle);
    };
  }, [isHeroOverlayPage]);

  const fetchAndUpdateProfileStatus = async () => {
    if (!user?.id) return;

    try {
      const response = await userIsAppliedToOffer(user.id);

      if (response?.success && response?.data) {
        const isComplete = response.data?.perfilCompleto === "COMPLETO";
        setIsValidProfileUserState(isComplete);
      } else {
        // Usuario sin datos de perfil - estado por defecto
        setIsValidProfileUserState(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Solo logear errores reales, no respuestas vacías o 404
      if (
        !errorMessage.includes("404") &&
        !errorMessage.includes("Not Found")
      ) {
        console.error("[Navbar] Error verifying profile:", errorMessage);
      }

      // Estado por defecto en caso de error
      setIsValidProfileUserState(false);
    }
  };

  const currentContract = async () => {
    if (!user?.id) return;

    try {
      const response = await getCurrentContract(user?.id);

      // Solo logear si realmente hay datos válidos
      if (response?.success && response?.data) {
        console.log("[Navbar] Contract data loaded successfully");
        setCurrentContractStatus(response.data?.activo || false);
        setStepContract(response.data?.estadoContratacion || "");
      } else {
        // Usuario sin contrato activo - esto es normal, no es un error
        setCurrentContractStatus(false);
        setStepContract("");
      }
    } catch (error) {
      // Solo logear errores reales de conexión/servidor, no 404 o "sin datos"
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        !errorMessage.includes("404") &&
        !errorMessage.includes("Not Found")
      ) {
        console.error(
          "[Navbar] Error fetching current contract:",
          errorMessage
        );
      }

      // Resetear estados en caso de error
      setCurrentContractStatus(false);
      setStepContract("");
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

  // Hidratar el store desde cookies si está vacío (solo en cliente)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Si el store está cargando o no hay usuario, intentar hidratar desde cookies
    if (isLoading || (!user && !isAuthenticated)) {
      try {
        const raw = document.cookie
          .split("; ")
          .find((c) => c.startsWith("user_info="));
        
        if (raw) {
          const value = raw.split("=")[1];
          if (value) {
            const decoded = decodeURIComponent(value);
            const cookieUser = JSON.parse(decoded);
            
            // Si hay usuario en cookie pero no en store, hidratar
            if (cookieUser && cookieUser.id && !user) {
              useAuthStore.getState().setUser(cookieUser);
              useAuthStore.getState().setAuthenticated(true);
              useAuthStore.getState().setLoading(false);
              console.log("[Navbar] Store hidratado desde cookie");
            }
          }
        } else {
          // No hay cookie de usuario, asegurar que el estado esté limpio
          if (!isLoading) {
            useAuthStore.getState().setLoading(false);
          }
        }
      } catch (error) {
        console.warn("[Navbar] Error hidratando desde cookie:", error);
        useAuthStore.getState().setLoading(false);
      }
    }
  }, [isLoading, user, isAuthenticated]);

  useEffect(() => {
    // Solo ejecutar si el usuario está autenticado y tiene ID
    if (user && isAuthenticated && user.id) {
      // Solo ejecutar las funciones cuando el usuario cambia, no en cada pathname
      fetchAndUpdateProfileStatus();
      currentContract();
      // Sincronizar el alias actual desde la BD (el de la cookie puede ser viejo)
      (async () => {
        try {
          const res = await getCurrentUserBasic();
          if (res?.success && res.data) {
            const freshAlias =
              typeof res.data.alias === "string" ? res.data.alias : null;
            setAliasFromServer(freshAlias);
            // Mantener el store sincronizado para el resto de la app
            if (freshAlias !== (user.alias ?? null)) {
              useAuthStore
                .getState()
                .setUser({ ...user, alias: freshAlias } as typeof user);
            }
          }
        } catch (error) {
          console.warn("[Navbar] Error fetching current user alias:", error);
        }
      })();
    }
  }, [user?.id, isAuthenticated]); // Agregar isAuthenticated para evitar llamadas con token expirado

  // Redirecciones por estado de contrato: no bloquear rutas que el usuario debe poder abrir siempre
  useEffect(() => {
    if (stepContract.length === 0) return;

    const allowedPrefixes = [
      "/profile",
      "/account",
      "/applications",
      "/bonifications",
      "/faq",
      "/contractor-guide",
      "/auth/",
    ];
    if (allowedPrefixes.some((p) => pathname.startsWith(p))) {
      return;
    }

    if (stepContract === "FIRMADO_CANDIDATO") {
      router.push("/currentApplication");
    }
    if (stepContract === "FIRMADO_PROVEEDOR") {
      router.push("/admin/dashboard/postulants");
    }
  }, [stepContract, router, pathname]);

  const handleLogout = async () => {
    try {
      await logoutAction();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  function openItSupportModal() {
    setShowUserMenu(false);
    setShowMobileSidebar(false);
    setShowItSupportModal(true);
  }

  function handleAcceptItSupportRedirect() {
    window.location.href = IT_SUPPORT_PORTAL_URL;
  }

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
          {getNavbarDisplayName(user, aliasFromServer)}
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

      {currentContractStatus && (
        <Link
          href="/currentApplication"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={() => setShowUserMenu(false)}
        >
          <Briefcase size={16} className="mr-2 text-[#0097B2]" />
          Current Contract
        </Link>
      )}

      {currentContractStatus && (
        <Link
          href="/bonifications"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={() => setShowUserMenu(false)}
        >
          <Briefcase size={16} className="mr-2 text-[#0097B2]" />
          Additional Incentives & Holidays
        </Link>
      )}

      {currentContractStatus && (
        <button
          type="button"
          onClick={openItSupportModal}
          className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          <LifeBuoy size={16} className="mr-2 text-[#0097B2]" />
          Request IT Support
        </button>
      )}

      <Link
        href="/contractor-guide"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setShowUserMenu(false)}
      >
        <BookOpen size={16} className="mr-2 text-[#0097B2]" />
        Contractor Guide
      </Link>

      <Link
        href="/faq"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setShowUserMenu(false)}
      >
        <HelpCircle size={16} className="mr-2 text-[#0097B2]" />
        Frequently Asked Questions
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

  const navLinkClass = (active: boolean) => {
    if (isTransparentNav) {
      return active
        ? "text-white"
        : "text-white/90 hover:text-white";
    }
    return active
      ? "text-[#0097B2] border-b-[3px] border-[#0097B2]"
      : "text-black hover:text-[#0097B2]";
  };

  return (
    <>
      {/* Espaciador: en home/about el hero ocupa el espacio bajo el navbar fijo */}
      {!isHeroOverlayPage && (
        <div className="h-[45px] md:h-[85px]" aria-hidden="true" />
      )}
      
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isTransparentNav
            ? "bg-transparent shadow-none"
            : "bg-white shadow-[0px_4px_4px_0px_rgba(210,210,210,0.25)]"
        }`}
      >
      {/* Top Header - Contact & Social (oculto en home/about según diseño Figma) */}
      {!isHeroOverlayPage && (
        <div className="hidden md:block bg-white border-b border-[rgba(210,210,210,0.5)]">
          <div className="container px-[20px] md:px-[40px]">
            <div className="flex items-center justify-between h-[25px]">
              {/* Social Media Links */}
              <div className="flex items-center gap-[10px]">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#005a70] hover:text-[#003d4d] transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-[20px]">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-[5px]">
                    <info.icon size={16} strokeWidth={1.5} className="text-[#0097B2]" />
                    <span className="text-[12px] font-normal text-black">
                      {info.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header - Navigation */}
      <div className="container px-[20px] md:px-[40px]">
        <div
          className={`grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center ${
            isTransparentNav ? "h-[66px] md:h-[77px] pt-[11px]" : "h-[45px] md:h-[60px]"
          }`}
        >
          {/* Left: Logo */}
          <div className="flex items-center justify-self-start">
            <Link href="/" className="flex-shrink-0">
              <Logo variant={isTransparentNav ? "white" : "default"} />
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-6 xl:gap-[32px] h-full justify-self-center px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`h-full flex items-center justify-center text-[16px] font-medium leading-[1.2] whitespace-nowrap transition-colors relative ${navLinkClass(
                  isActive(item.href)
                )}`}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated && user?.rol === "CANDIDATO" && (
              <Link
                href="/pages/open-contracts"
                className={`h-full flex items-center justify-center text-[16px] font-medium leading-[1.2] whitespace-nowrap transition-colors relative ${navLinkClass(
                  isActive("/pages/open-contracts")
                )}`}
              >
                Open Contracts
              </Link>
            )}
          </nav>

          {/* Right: Auth area */}
          <div className="flex items-center justify-end gap-[10px] justify-self-end">
            {isLoading ? (
              <div className="w-[97px] h-[34px] bg-gray-200/40 rounded-[15px] animate-pulse" />
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/auth/register"
                  className={`hidden md:flex items-center justify-center h-[43px] px-[25px] text-[16px] font-medium leading-[1.2] transition-colors ${
                    isTransparentNav
                      ? "text-white hover:text-white/80"
                      : isHomePage
                        ? "text-[#0097B2] hover:text-[#007a94]"
                        : "text-black hover:text-[#0097B2]"
                  }`}
                >
                  Sign Up
                </Link>
                <button
                  type="button"
                  className={`hidden md:flex items-center justify-center h-[43px] px-[25px] rounded-[20px] text-[16px] font-medium leading-[1.2] transition-colors cursor-pointer ${
                    isTransparentNav
                      ? "bg-white text-[#044e5c] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] hover:bg-white/90"
                      : "bg-[#0097B2] text-white hover:bg-[#007a94]"
                  }`}
                  onClick={() => router.push("/auth/login")}
                >
                  Log In
                </button>
                {/* Mobile Menu Button for Non-Authenticated Users */}
                <button
                  type="button"
                  className={`md:hidden transition-colors cursor-pointer p-2 ${
                    isTransparentNav
                      ? "text-white hover:text-white/80"
                      : "text-[#0097B2] hover:text-[#007a94]"
                  }`}
                  onClick={() => setShowMobileSidebar(true)}
                  aria-label="Open menu"
                >
                  <Menu size={28} strokeWidth={2} />
                </button>
              </>
            ) : (
              <>
                {user?.rol === "CANDIDATO" ? (
                  <>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex items-center justify-center h-[45px] px-[15px] text-[16px] font-normal transition-colors cursor-pointer ${
                          isTransparentNav
                            ? "text-white hover:text-white/80"
                            : "text-[#0097B2] hover:text-[#007a94]"
                        }`}
                      >
                        {getNavbarDisplayName(user, aliasFromServer)}
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 min-w-[280px] w-max bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          {renderUserMenu()}
                        </div>
                      )}
                    </div>
                    <div className="md:hidden">
                      <button
                        onClick={() => setShowMobileSidebar(true)}
                        className={`transition-colors cursor-pointer p-2 ${
                          isTransparentNav
                            ? "text-white hover:text-white/80"
                            : "text-[#0097B2] hover:text-[#007a94]"
                        }`}
                        aria-label="Open menu"
                      >
                        <Menu size={28} strokeWidth={2} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex items-center justify-center h-[45px] px-[15px] text-[16px] font-normal transition-colors cursor-pointer ${
                          isTransparentNav
                            ? "text-white hover:text-white/80"
                            : "text-[#0097B2] hover:text-[#007a94]"
                        }`}
                      >
                        {getNavbarDisplayName(user, aliasFromServer)}
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 min-w-[280px] w-max bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-[#0097B2] font-medium text-sm cursor-default">
                              {getNavbarDisplayName(user, aliasFromServer)}
                            </p>
                          </div>

                          {user?.rol === "EMPRESA" ||
                          user?.rol === "EMPLEADO_EMPRESA" ? (
                            <>
                              <Link
                                href="/companies/dashboard"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <LayoutDashboard
                                  size={16}
                                  className="mr-2 text-[#0097B2] cursor-pointer"
                                />
                                Company Dashboard
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
                            </>
                          ) : user?.rol === "ADMIN" ||
                            user?.rol === "ADMIN_RECLUTAMIENTO" ? (
                            <>
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
                                {user?.rol === "ADMIN"
                                  ? "Offers Management"
                                  : "Dashboard"}
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
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="md:hidden">
                      <button
                        onClick={() => setShowMobileSidebar(true)}
                        className={`transition-colors cursor-pointer p-2 ${
                          isTransparentNav
                            ? "text-white hover:text-white/80"
                            : "text-[#0097B2] hover:text-[#007a94]"
                        }`}
                        aria-label="Open menu"
                      >
                        <Menu size={28} strokeWidth={2} />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-white z-50 md:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={sidebarRef}
            className="h-full w-full bg-white flex flex-col"
          >
            {/* Header with Logo and Close Button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <Logo />
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* If not authenticated, show Sign Up button and navigation */}
              {!isAuthenticated ? (
                <div className="p-6 space-y-4">
                  {/* Sign Up Button */}
                  <button
                    type="button"
                    className="w-full bg-[#0097B2] text-white h-[45px] px-6 rounded-[8px] text-[16px] font-medium hover:bg-[#007a94] transition-colors cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => {
                      router.push("/auth/register");
                      setShowMobileSidebar(false);
                    }}
                  >
                    <UserCircle size={20} />
                    Sign Up
                  </button>

                  {/* Main Navigation */}
                  <nav className="space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] transition-colors ${
                            isActive(item.href)
                              ? "text-[#0097B2] bg-[#0097B2]/10"
                              : "text-gray-600 hover:text-[#0097B2] hover:bg-gray-50"
                          }`}
                          onClick={() => setShowMobileSidebar(false)}
                        >
                          <Icon size={20} strokeWidth={2} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* User Info */}
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-[#0097B2] font-medium text-[16px]">
                      {getNavbarDisplayName(user, aliasFromServer)}
                    </p>
                    {user?.rol === "CANDIDATO" && isValidProfileUserState !== undefined && (
                      <span
                        className={`text-[12px] ${
                          isValidProfileUserState
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {isValidProfileUserState
                          ? "Profile Completed"
                          : "Profile Incomplete"}
                      </span>
                    )}
                  </div>

                  {/* Navigation for authenticated users */}
                  {user?.rol === "CANDIDATO" ? (
                    <nav className="space-y-1">
                      {/* Main navigation items */}
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] transition-colors ${
                              isActive(item.href)
                                ? "text-[#0097B2] bg-[#0097B2]/10"
                                : "text-gray-600 hover:text-[#0097B2] hover:bg-gray-50"
                            }`}
                            onClick={() => setShowMobileSidebar(false)}
                          >
                            <Icon size={20} strokeWidth={2} />
                            {item.name}
                          </Link>
                        );
                      })}

                      {/* Open Contracts */}
                      <Link
                        href="/pages/open-contracts"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] transition-colors ${
                          isActive("/pages/open-contracts")
                            ? "text-[#0097B2] bg-[#0097B2]/10"
                            : "text-gray-600 hover:text-[#0097B2] hover:bg-gray-50"
                        }`}
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <Briefcase size={20} strokeWidth={2} />
                        Open Contracts
                      </Link>

                      {/* Separator */}
                      <div className="py-2">
                        <div className="border-t border-gray-200"></div>
                      </div>

                      {/* User specific items */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <UserCircle size={20} strokeWidth={2} />
                        My Profile
                      </Link>

                      <Link
                        href="/applications"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <FileText size={20} strokeWidth={2} />
                        My Applications
                      </Link>

                      {currentContractStatus && (
                        <Link
                          href="/currentApplication"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                          onClick={() => setShowMobileSidebar(false)}
                        >
                          <Briefcase size={20} strokeWidth={2} />
                          Current Contract
                        </Link>
                      )}

                      {currentContractStatus && (
                        <Link
                          href="/bonifications"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                          onClick={() => setShowMobileSidebar(false)}
                        >
                          <Briefcase size={20} strokeWidth={2} />
                          Additional Incentives & Holidays
                        </Link>
                      )}

                      {currentContractStatus && (
                        <button
                          type="button"
                          onClick={openItSupportModal}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[16px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#0097B2]"
                        >
                          <LifeBuoy size={20} strokeWidth={2} />
                          Request IT Support
                        </button>
                      )}

                      <Link
                        href="/contractor-guide"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <BookOpen size={20} strokeWidth={2} />
                        Contractor Guide
                      </Link>

                      <Link
                        href="/faq"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <HelpCircle size={20} strokeWidth={2} />
                        FAQ
                      </Link>
                    </nav>
                  ) : user?.rol === "EMPRESA" || user?.rol === "EMPLEADO_EMPRESA" ? (
                    <nav className="space-y-1">
                      {/* Main navigation items */}
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] transition-colors ${
                              isActive(item.href)
                                ? "text-[#0097B2] bg-[#0097B2]/10"
                                : "text-gray-600 hover:text-[#0097B2] hover:bg-gray-50"
                            }`}
                            onClick={() => setShowMobileSidebar(false)}
                          >
                            <Icon size={20} strokeWidth={2} />
                            {item.name}
                          </Link>
                        );
                      })}

                      {/* Separator */}
                      <div className="py-2">
                        <div className="border-t border-gray-200"></div>
                      </div>

                      <Link
                        href="/companies/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <LayoutDashboard size={20} strokeWidth={2} />
                        Company Dashboard
                      </Link>
                    </nav>
                  ) : (user?.rol === "ADMIN" || user?.rol === "ADMIN_RECLUTAMIENTO") && (
                    <nav className="space-y-1">
                      {/* Main navigation items */}
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] transition-colors ${
                              isActive(item.href)
                                ? "text-[#0097B2] bg-[#0097B2]/10"
                                : "text-gray-600 hover:text-[#0097B2] hover:bg-gray-50"
                            }`}
                            onClick={() => setShowMobileSidebar(false)}
                          >
                            <Icon size={20} strokeWidth={2} />
                            {item.name}
                          </Link>
                        );
                      })}

                      {/* Separator */}
                      <div className="py-2">
                        <div className="border-t border-gray-200"></div>
                      </div>

                      {user?.rol === "ADMIN" && (
                        <Link
                          href="/admin/superAdmin"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                          onClick={() => setShowMobileSidebar(false)}
                        >
                          <Settings size={20} strokeWidth={2} />
                          Super Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <LayoutDashboard size={20} strokeWidth={2} />
                        {user?.rol === "ADMIN" ? "Offers Management" : "Dashboard"}
                      </Link>
                    </nav>
                  )}
                </div>
              )}
            </div>

            {/* Footer - Configuration and Logout (only when authenticated) */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 p-6 space-y-1">
                {user?.rol === "CANDIDATO" && (
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-[#0097B2] hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <Settings size={20} strokeWidth={2} />
                    Configuration
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileSidebar(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[16px] text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                >
                  <LogOut size={20} strokeWidth={2} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>

      <ItSupportRedirectModal
        open={showItSupportModal}
        onClose={() => setShowItSupportModal(false)}
        onAccept={handleAcceptItSupportRedirect}
      />
    </>
  );
}
