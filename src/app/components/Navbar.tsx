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
  Briefcase,
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import useRouteExclusion from "@/hooks/useRouteExclusion";
import useOutsideClick from "@/hooks/useOutsideClick";
import useScrollShadow from "@/hooks/useScrollShadow";
import {
  getCurrentContract,
  userIsAppliedToOffer,
} from "../pages/offers/actions/jobs.actions";

const navigation = [
  { name: "Home", href: "/pages/home" },
  { name: "About", href: "/pages/about" },
  { name: "Services", href: "/pages/services" },
  { name: "Open Contracts", href: "/pages/offers" },
  { name: "Contact", href: "/pages/contact" },
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61553675729226&mibextid=LQQJ4d", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/andesworkforce/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/andes-workforce/posts/?feedView=all", label: "LinkedIn" },
];

const contactInfo = [
  { icon: Phone, text: "+1 7572373612 - +1 3057030023" },
  { icon: Mail, text: "info@andes-workforce.com" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const { isNavbarExcluded } = useRouteExclusion();
  const { scrollRef, showLeftShadow, showRightShadow } = useScrollShadow();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [currentContractStatus, setCurrentContractStatus] =
    useState<boolean>(false);
  const [stepContract, setStepContract] = useState<string>("");
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
    }
  }, [user, isAuthenticated]); // Agregar isAuthenticated para evitar llamadas con token expirado

  // Efecto separado para manejar redirecciones basadas en stepContract
  useEffect(() => {
    if (stepContract.length > 0) {
      if (stepContract === "FIRMADO_CANDIDATO") {
        router.push("/currentApplication");
      }
      if (stepContract === "FIRMADO_PROVEEDOR") {
        router.push("/admin/dashboard/postulants");
      }
    }
  }, [stepContract, router]);

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
          Incentives & Holidays
        </Link>
      )}

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
    <>
    <header className="w-full bg-white z-50 shadow-[0px_4px_4px_0px_rgba(210,210,210,0.25)] fixed top-0 left-0">
      {/* Top Header - Contact & Social */}
      <div className="hidden md:block bg-white border-b border-[rgba(210,210,210,0.5)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[25px]">
            {/* Social Media Links */}
            <div className="flex items-center gap-[10px]">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0097B2] hover:text-[#007a94] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={16} strokeWidth={3} />
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

      {/* Main Header - Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[45px] md:h-[60px]">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center justify-center h-full">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`h-full flex items-center justify-center px-[15px] text-[16px] font-normal transition-colors relative ${
                  isActive(item.href)
                    ? "text-[#0097B2] border-b-[3px] border-[#0097B2]"
                    : "text-black hover:text-[#0097B2]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Auth area */}
          <div className="flex items-center gap-[10px]">
            {isLoading ? (
              <div className="w-[97px] h-[34px] bg-gray-200 rounded-[15px] animate-pulse" />
            ) : !isAuthenticated ? (
              <>
                <Link
                  href="/auth/register"
                  className="hidden md:flex items-center justify-center h-[45px] px-[15px] text-[16px] text-black hover:text-[#0097B2] font-normal transition-colors"
                >
                  Register
                </Link>
                <button
                  type="button"
                  className="bg-[#0097B2] text-white h-[34px] px-[25px] py-[5px] rounded-[15px] text-[16px] font-normal hover:bg-[#007a94] transition-colors cursor-pointer"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                {user?.rol === "CANDIDATO" ? (
                  <>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center justify-center h-[45px] px-[15px] text-[16px] text-[#0097B2] hover:text-[#007a94] font-normal transition-colors cursor-pointer"
                      >
                        {`${user?.nombre || ""} ${user?.apellido || ""}`}
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
                        className="text-[16px] text-[#0097B2] hover:text-[#007a94] px-3 py-2 font-normal transition-colors cursor-pointer"
                      >
                        {`${user?.nombre || ""} ${user?.apellido || ""}`}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center justify-center h-[45px] px-[15px] text-[16px] text-[#0097B2] hover:text-[#007a94] font-normal transition-colors cursor-pointer"
                      >
                        {`${user?.nombre || ""} ${user?.apellido || ""}`}
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-[#0097B2] font-medium text-sm cursor-default">
                              {user?.nombre || ""} {user?.apellido || ""}
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
                        className="text-[16px] text-[#0097B2] hover:text-[#007a94] px-3 py-2 font-normal transition-colors cursor-pointer"
                      >
                        {`${user?.nombre || ""} ${user?.apellido || ""}`}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden relative pb-2">
          {showLeftShadow && (
            <div className="absolute top-0 left-0 w-8 h-full z-10 scroll-shadow-left" />
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide -mx-4 px-4"
          >
            <div className="flex space-x-2 min-w-max">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-center px-4 py-1.5 border text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                    isActive(item.href)
                      ? "bg-[#0097B2] text-white border-[#0097B2]"
                      : "bg-white text-black border-gray-200 hover:text-[#0097B2] hover:border-[#0097B2]"
                  }`}
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
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
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

                    {currentContractStatus && (
                      <Link
                        href="/currentApplication"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <Briefcase size={20} className="mr-2 text-[#0097B2]" />
                        Current Contract
                      </Link>
                    )}

                    {currentContractStatus && (
                      <Link
                        href="/bonifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowMobileSidebar(false)}
                      >
                        <Briefcase size={20} className="mr-2 text-[#0097B2]" />
                        Incentives & Holidays
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    {user?.rol === "EMPRESA" ||
                    user?.rol === "EMPLEADO_EMPRESA" ? (
                      <>
                        <Link
                          href="/companies/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setShowMobileSidebar(false)}
                        >
                          <LayoutDashboard
                            size={20}
                            className="mr-2 text-[#0097B2]"
                          />
                          Company Panel
                        </Link>
                      </>
                    ) : (
                      <>
                        {user?.rol === "ADMIN" && (
                          <>
                            <Link
                              href="/admin/superAdmin"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => setShowMobileSidebar(false)}
                            >
                              <Settings
                                size={20}
                                className="mr-2 text-[#0097B2]"
                              />
                              Super Admin Panel
                            </Link>
                            <hr className="my-1 border-gray-200" />
                          </>
                        )}

                        {(user?.rol === "ADMIN" ||
                          user?.rol === "ADMIN_RECLUTAMIENTO") && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setShowMobileSidebar(false)}
                          >
                            <LayoutDashboard
                              size={20}
                              className="mr-2 text-[#0097B2]"
                            />
                            {user?.rol === "ADMIN"
                              ? "Offers Management"
                              : "Dashboard"}
                          </Link>
                        )}
                      </>
                    )}
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
                  {user?.rol === "CANDIDATO" ? "Logout" : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
    {/* Spacer to prevent content from being hidden behind fixed navbar */}
    <div className="h-[45px] md:h-[85px]" />
    </>
  );
}
