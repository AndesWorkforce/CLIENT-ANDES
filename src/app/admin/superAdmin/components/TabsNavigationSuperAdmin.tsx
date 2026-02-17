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
            <Link
              href="/admin/superAdmin/settings"
              className={`px-2 py-1 text-sm font-medium rounded-md flex items-center shadow-sm focus:outline-none gap-1 cursor-pointer ${
                pathname === "/admin/superAdmin/settings"
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
                  d="M7.5 9.375C8.44535 9.375 9.375 8.44535 9.375 7.5C9.375 6.55465 8.44535 5.625 7.5 5.625C6.55465 5.625 5.625 6.55465 5.625 7.5C5.625 8.44535 6.55465 9.375 7.5 9.375Z"
                  stroke={
                    pathname === "/admin/superAdmin/settings"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0938 9.375C11.9961 9.57031 11.9648 9.79102 12.0039 10.0039C12.043 10.2168 12.1504 10.4102 12.3094 10.5562L12.3469 10.5938C12.4746 10.7214 12.5758 10.873 12.6447 11.0398C12.7136 11.2067 12.749 11.3856 12.749 11.5664C12.749 11.7472 12.7136 11.9262 12.6447 12.093C12.5758 12.2598 12.4746 12.4114 12.3469 12.5391C12.2192 12.6667 12.0676 12.7679 11.9008 12.8368C11.734 12.9057 11.555 12.9411 11.3742 12.9411C11.1934 12.9411 11.0144 12.9057 10.8476 12.8368C10.6808 12.7679 10.5292 12.6667 10.4016 12.5391L10.3641 12.5016C10.218 12.3426 10.0246 12.2352 9.81175 12.1961C9.59888 12.157 9.37817 12.1883 9.17285 12.2859C8.97168 12.3789 8.80442 12.5304 8.69262 12.7197C8.58083 12.9091 8.52002 13.1277 8.51785 13.3512V13.5C8.51785 13.8647 8.37277 14.2144 8.11538 14.4718C7.85798 14.7292 7.50824 14.8743 7.14348 14.8743C6.77871 14.8743 6.42897 14.7292 6.17158 14.4718C5.91418 14.2144 5.7691 13.8647 5.7691 13.5V13.4391C5.76282 13.2083 5.69331 12.9839 5.56845 12.7912C5.44359 12.5986 5.26849 12.4451 5.06348 12.3469C4.85817 12.2492 4.63745 12.2179 4.42458 12.257C4.21171 12.2961 4.01833 12.4035 3.87223 12.5625L3.83473 12.6C3.70708 12.7276 3.55547 12.8288 3.38867 12.8977C3.22187 12.9666 3.04291 13.002 2.86207 13.002C2.68123 13.002 2.50227 12.9666 2.33547 12.8977C2.16867 12.8288 2.01706 12.7276 1.8891 12.6C1.76145 12.4723 1.66027 12.3207 1.59138 12.1539C1.52249 11.9871 1.48706 11.8082 1.48706 11.6273C1.48706 11.4465 1.52249 11.2676 1.59138 11.1008C1.66027 10.934 1.76145 10.7824 1.8891 10.6547L1.92661 10.6172C2.08559 10.4711 2.19297 10.2777 2.23208 10.0648C2.27118 9.85196 2.23989 9.63125 2.14223 9.42594C2.04918 9.22477 1.89773 9.05751 1.70837 8.94571C1.51902 8.83392 1.30045 8.77311 1.07692 8.77094H0.9375C0.572736 8.77094 0.222993 8.62586 -0.0344048 8.36846C-0.291803 8.11106 -0.436881 7.76132 -0.436881 7.39656C-0.436881 7.0318 -0.291803 6.68206 -0.0344048 6.42466C0.222993 6.16726 0.572736 6.02219 0.9375 6.02219H1.00161C1.23233 6.0159 1.4567 5.9464 1.64939 5.82154C1.84209 5.69668 1.99552 5.52158 2.09379 5.31656C2.19145 5.11125 2.22274 4.89054 2.18364 4.67767C2.14453 4.4648 2.03715 4.27142 1.87817 4.12531L1.84067 4.08781C1.71302 3.96016 1.61183 3.80855 1.54294 3.64175C1.47405 3.47495 1.43862 3.29599 1.43862 3.11515C1.43862 2.93431 1.47405 2.75535 1.54294 2.58855C1.61183 2.42175 1.71302 2.27014 1.84067 2.14219C1.96862 2.01453 2.12023 1.91335 2.28703 1.84446C2.45383 1.77557 2.63279 1.74014 2.81363 1.74014C2.99447 1.74014 3.17343 1.77557 3.34023 1.84446C3.50703 1.91335 3.65864 2.01453 3.78629 2.14219L3.82379 2.17969C3.9699 2.33867 4.16328 2.44605 4.37615 2.48516C4.58902 2.52426 4.80973 2.49297 5.01504 2.39531H5.06348C5.26465 2.30227 5.43191 2.15081 5.5437 1.96146C5.6555 1.7721 5.71631 1.55353 5.71848 1.33V1.19062C5.71848 0.825861 5.86356 0.476118 6.12096 0.218719C6.37836 -0.0386791 6.7281 -0.183758 7.09286 -0.183758C7.45763 -0.183758 7.80737 -0.0386791 8.06477 0.218719C8.32217 0.476118 8.46724 0.825861 8.46724 1.19062V1.25156C8.46941 1.47509 8.53022 1.69366 8.64202 1.88301C8.75381 2.07237 8.92107 2.22383 9.12223 2.31687C9.32754 2.41454 9.54825 2.44583 9.76112 2.40672C9.97399 2.36762 10.1674 2.26024 10.3135 2.10125L10.351 2.06375C10.4786 1.9361 10.6302 1.83491 10.797 1.76602C10.9638 1.69713 11.1428 1.6617 11.3236 1.6617C11.5045 1.6617 11.6834 1.69713 11.8502 1.76602C12.017 1.83491 12.1686 1.9361 12.2963 2.06375C12.4239 2.1914 12.5251 2.34301 12.594 2.50981C12.6629 2.67661 12.6983 2.85557 12.6983 3.03641C12.6983 3.21725 12.6629 3.39621 12.594 3.56301C12.5251 3.72981 12.4239 3.88142 12.2963 4.00906L12.2588 4.04656C12.0998 4.19267 11.9924 4.38605 11.9533 4.59892C11.9142 4.81179 11.9455 5.0325 12.0432 5.23781V5.28625C12.1362 5.48742 12.2877 5.65468 12.477 5.76648C12.6664 5.87827 12.885 5.93908 13.1085 5.94125H13.2479C13.6126 5.94125 13.9624 6.08633 14.2198 6.34373C14.4772 6.60113 14.6222 6.95087 14.6222 7.31563C14.6222 7.68039 14.4772 8.03014 14.2198 8.28754C13.9624 8.54494 13.6126 8.69001 13.2479 8.69001H13.1869C12.9634 8.69218 12.7448 8.753 12.5555 8.86479C12.3661 8.97659 12.2147 9.14385 12.1216 9.34501C12.024 9.55032 11.9927 9.77103 12.0318 9.9839C12.0709 10.1968 12.1783 10.3902 12.3373 10.5363L12.3748 10.5738C12.5024 10.7014 12.6036 10.8531 12.6725 11.0198C12.7414 11.1866 12.7768 11.3656 12.7768 11.5464C12.7768 11.7273 12.7414 11.9062 12.6725 12.073C12.6036 12.2398 12.5024 12.3914 12.3748 12.5191"
                  stroke={
                    pathname === "/admin/superAdmin/settings"
                      ? "#FFFFFF"
                      : "#6D6D6D"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Settings Platform
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
