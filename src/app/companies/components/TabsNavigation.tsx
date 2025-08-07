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

  const isCompany = user?.rol === "EMPRESA";

  if (
    pathname === "/admin/dashboard/account" ||
    pathname === "/companies/account"
  )
    return null;

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
              href="/companies/dashboard"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/companies/dashboard"
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
                    pathname === "/companies/dashboard" ? "#FFFFFF" : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 13.125V3.125C10 2.79348 9.8683 2.47554 9.63388 2.24112C9.39946 2.0067 9.08152 1.875 8.75 1.875H6.25C5.91848 1.875 5.60054 2.0067 5.36612 2.24112C5.1317 2.47554 5 2.79348 5 3.125V13.125"
                  stroke={
                    pathname === "/companies/dashboard" ? "#FFFFFF" : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Offers
            </Link>
            {isCompany && (
              <Link
                href="/companies/dashboard/employees"
                className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                  pathname === "/companies/dashboard/employees"
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
                    d="M7.5 6.875C8.74264 6.875 9.75 5.86764 9.75 4.625C9.75 3.38236 8.74264 2.375 7.5 2.375C6.25736 2.375 5.25 3.38236 5.25 4.625C5.25 5.86764 6.25736 6.875 7.5 6.875Z"
                    stroke={
                      pathname === "/companies/dashboard/employees"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.875 12.625C11.875 10.8991 9.91586 9.5 7.5 9.5C5.08414 9.5 3.125 10.8991 3.125 12.625"
                    stroke={
                      pathname === "/companies/dashboard/employees"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Create employee
              </Link>
            )}
            {isCompany && (
              <Link
                href="/companies/dashboard/listEmployees"
                className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                  pathname === "/companies/dashboard/listEmployees"
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
                    d="M10.625 13.125V11.875C10.625 11.212 10.3616 10.5761 9.89277 10.1073C9.42393 9.63839 8.78804 9.375 8.125 9.375H3.125C2.46196 9.375 1.82607 9.63839 1.35723 10.1073C0.888392 10.5761 0.625 11.212 0.625 11.875V13.125"
                    stroke={
                      pathname === "/companies/dashboard/listEmployees"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.625 6.875C7.00571 6.875 8.125 5.75571 8.125 4.375C8.125 2.99429 7.00571 1.875 5.625 1.875C4.24429 1.875 3.125 2.99429 3.125 4.375C3.125 5.75571 4.24429 6.875 5.625 6.875Z"
                    stroke={
                      pathname === "/companies/dashboard/listEmployees"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.375 13.125V11.875C14.3744 11.3219 14.1902 10.7831 13.8502 10.3393C13.5102 9.89555 13.0329 9.57132 12.4844 9.41875"
                    stroke={
                      pathname === "/companies/dashboard/listEmployees"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.98438 1.91875C10.5346 2.07006 11.0138 2.39397 11.3553 2.83842C11.6967 3.28287 11.8815 3.82309 11.8815 4.37734C11.8815 4.93159 11.6967 5.47181 11.3553 5.91626C11.0138 6.36071 10.5346 6.68462 9.98438 6.83594"
                    stroke={
                      pathname === "/companies/dashboard/listEmployees"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Manage employee
              </Link>
            )}
            {isCompany && (
              <Link
                href="/companies/dashboard/team-members"
                className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                  pathname === "/companies/dashboard/team-members"
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
                    d="M10.625 13.125V11.875C10.625 11.212 10.3616 10.5761 9.89277 10.1073C9.42393 9.63839 8.78804 9.375 8.125 9.375H3.125C2.46196 9.375 1.82607 9.63839 1.35723 10.1073C0.888392 10.5761 0.625 11.212 0.625 11.875V13.125"
                    stroke={
                      pathname === "/companies/dashboard/team-members"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.625 6.875C7.00571 6.875 8.125 5.75571 8.125 4.375C8.125 2.99429 7.00571 1.875 5.625 1.875C4.24429 1.875 3.125 2.99429 3.125 4.375C3.125 5.75571 4.24429 6.875 5.625 6.875Z"
                    stroke={
                      pathname === "/companies/dashboard/team-members"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.375 13.125V11.875C14.3744 11.3219 14.1902 10.7831 13.8502 10.3393C13.5102 9.89555 13.0329 9.57132 12.4844 9.41875"
                    stroke={
                      pathname === "/companies/dashboard/team-members"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.98438 1.91875C10.5346 2.07006 11.0138 2.39397 11.3553 2.83842C11.6967 3.28287 11.8815 3.82309 11.8815 4.37734C11.8815 4.93159 11.6967 5.47181 11.3553 5.91626C11.0138 6.36071 10.5346 6.68462 9.98438 6.83594"
                    stroke={
                      pathname === "/companies/dashboard/team-members"
                        ? "#FFFFFF"
                        : "#6D6D6D"
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Team Members
              </Link>
            )}
            {/* Process */}
            {/* <Link
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
            </Link> */}
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
