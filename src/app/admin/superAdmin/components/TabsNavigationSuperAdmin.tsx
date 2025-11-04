"use client";

import { UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TabsNavigationSuperAdmin() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [showLeftShadow, setShowLeftShadow] = useState<boolean>(false);
  const [showRightShadow, setShowRightShadow] = useState<boolean>(false);

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

  return (
    <div className="bg-white border-gray-200">
      <div className="max-w-7xl mx-auto px-4 relative">
        {showLeftShadow && (
          <div className="absolute top-0 left-0 w-8 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto py-2 scrollbar-hide"
          onScroll={checkScrollShadows}
        >
          <div className="flex space-x-4 min-w-max">
            <Link
              href="/admin/superAdmin"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/superAdmin"
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
                    pathname === "/admin/superAdmin" ? "#FFFFFF" : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.875 12.625C11.875 10.8991 9.91586 9.5 7.5 9.5C5.08414 9.5 3.125 10.8991 3.125 12.625"
                  stroke={
                    pathname === "/admin/superAdmin" ? "#FFFFFF" : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Create users
            </Link>
            <Link
              href="/admin/superAdmin/users"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/superAdmin/users"
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
                    pathname === "/admin/superAdmin/users"
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
                    pathname === "/admin/superAdmin/users"
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
                    pathname === "/admin/superAdmin/users"
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
                    pathname === "/admin/superAdmin/users"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Manage users
            </Link>
            <Link
              href="/admin/superAdmin/companies"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
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
                    pathname === "/admin/superAdmin/companies"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Manage Clients
            </Link>
            <Link
              href="/admin/superAdmin/payments"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/superAdmin/payments"
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
                  d="M1.875 5.625C1.875 5.27982 2.01205 4.94874 2.25533 4.70546C2.49861 4.46218 2.82969 4.32513 3.175 4.32513H11.825C12.1703 4.32513 12.5014 4.46218 12.7447 4.70546C12.9879 4.94874 13.125 5.27982 13.125 5.625V10.625C13.125 10.9702 12.9879 11.3013 12.7447 11.5446C12.5014 11.7879 12.1703 11.925 11.825 11.925H3.175C2.82969 11.925 2.49861 11.7879 2.25533 11.5446C2.01205 11.3013 1.875 10.9702 1.875 10.625V5.625Z"
                  stroke={
                    pathname === "/admin/superAdmin/payments"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.875 7.5H13.125"
                  stroke={
                    pathname === "/admin/superAdmin/payments"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="7.5"
                  cy="9.375"
                  r="0.9375"
                  stroke={
                    pathname === "/admin/superAdmin/payments"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                />
              </svg>
              Manage Payments
            </Link>
            <Link
              href="/admin/superAdmin/users-roles"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/superAdmin/users-roles"
                  ? "bg-[#B6B4B4] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <UserCog size={15} />
              Multiple functions
            </Link>
          </div>
        </div>

        {showRightShadow && (
          <div className="absolute top-0 right-0 w-8 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}
