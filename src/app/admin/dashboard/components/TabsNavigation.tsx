"use client";

import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TabsNavigation() {
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const checkScrollShadows = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScrollShadows();
    window.addEventListener("resize", checkScrollShadows);
    return () => window.removeEventListener("resize", checkScrollShadows);
  }, []);

  const isAdmin = user?.rol === "ADMIN" || user?.rol === "ADMIN_RECLUTAMIENTO";

  if (pathname === "/admin/dashboard/account") return null;

  return (
    <div className="container mx-auto bg-white border-gray-200">
      <div className="mx-auto px-4 relative">
        {/* Left scroll indicator */}
        {showLeftShadow && (
          <div className="absolute top-0 left-0 w-8 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        )}

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto py-2 scrollbar-hide"
          onScroll={checkScrollShadows}
        >
          <div className="flex space-x-4 min-w-max">
            {/* Dashboard */}
            <Link
              href="/admin/dashboard"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/dashboard"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="15" height="15" fill="none" />
                <path
                  d="M12.5 4.375H2.5C1.80964 4.375 1.25 4.93464 1.25 5.625V11.875C1.25 12.5654 1.80964 13.125 2.5 13.125H12.5C13.1904 13.125 13.75 12.5654 13.75 11.875V5.625C13.75 4.93464 13.1904 4.375 12.5 4.375Z"
                  stroke={
                    pathname === "/admin/dashboard" ? "#FFFFFF" : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 13.125V3.125C10 2.79348 9.8683 2.47554 9.63388 2.24112C9.39946 2.0067 9.08152 1.875 8.75 1.875H6.25C5.91848 1.875 5.60054 2.0067 5.36612 2.24112C5.1317 2.47554 5 2.79348 5 3.125V13.125"
                  stroke={
                    pathname === "/admin/dashboard" ? "#FFFFFF" : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Offers
            </Link>
            {/* Create Offers */}
            <Link
              href="/admin/dashboard/offers"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/dashboard/offers"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_475_12485)">
                  <path
                    d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                    stroke={
                      pathname === "/admin/dashboard/offers"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 5V10"
                    stroke={
                      pathname === "/admin/dashboard/offers"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 7.5H10"
                    stroke={
                      pathname === "/admin/dashboard/offers"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_475_12485">
                    <rect width="15" height="15" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Add offers
            </Link>
            {/* Saved Offers */}
            <Link
              href="/admin/dashboard/save-offers"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/dashboard/save-offers"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H10L13.125 5V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125Z"
                  stroke={
                    pathname === "/admin/dashboard/save-offers"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.625 13.125V8.125H4.375V13.125"
                  stroke={
                    pathname === "/admin/dashboard/save-offers"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.375 1.875V5H9.375"
                  stroke={
                    pathname === "/admin/dashboard/save-offers"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Saved offers
            </Link>
            {/* Applicants */}
            <Link
              href="/admin/dashboard/postulants"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/dashboard/postulants"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke={
                    pathname === "/admin/dashboard/postulants"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke={
                    pathname === "/admin/dashboard/postulants"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Applicants
            </Link>
            {/* Clients */}
            <Link
              href="/admin/dashboard/clients"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/dashboard/clients"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.875 13.125H13.125"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 13.125V6.25L6.875 2.5V13.125"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 13.125V6.25L8.125 2.5V13.125"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.375 5H5"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.375 7.5H5"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.375 10H5"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 5H10.625"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 7.5H10.625"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10H10.625"
                  stroke={
                    pathname === "/admin/dashboard/clients"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Clients
            </Link>
            {/* Emails */}
            {isAdmin && (
              <Link
                href="/admin/dashboard/templates"
                className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                  pathname === "/admin/dashboard/templates"
                    ? "bg-[#B6B4B4] text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 3.75L7.5 7.5L12.5 3.75"
                    stroke={
                      pathname === "/admin/dashboard/templates"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.25 3.75C1.25 3.41848 1.3817 3.10054 1.61612 2.86612C1.85054 2.6317 2.16848 2.5 2.5 2.5H12.5C12.8315 2.5 13.1495 2.6317 13.3839 2.86612C13.6183 3.10054 13.75 3.41848 13.75 3.75V11.25C13.75 11.5815 13.6183 11.8995 13.3839 12.1339C13.1495 12.3683 12.8315 12.5 12.5 12.5H2.5C2.16848 12.5 1.85054 12.3683 1.61612 12.1339C1.3817 11.8995 1.25 11.5815 1.25 11.25V3.75Z"
                    stroke={
                      pathname === "/admin/dashboard/templates"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Emails
              </Link>
            )}
            {/* Process */}
            <Link
              href="/admin/dashboard/process"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/dashboard/process"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_475_12485)">
                  <path
                    d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                    stroke={
                      pathname === "/admin/dashboard/process"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 5V10"
                    stroke={
                      pathname === "/admin/dashboard/process"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 7.5H10"
                    stroke={
                      pathname === "/admin/dashboard/process"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_475_12485">
                    <rect width="15" height="15" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Process
            </Link>
          </div>
        </div>

        {/* Right scroll indicator */}
        {showRightShadow && (
          <div className="absolute top-0 right-0 w-8 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}
