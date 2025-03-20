"use client";

import { useRouter } from "next/navigation";

export default function HeaderDashboard() {
  const router = useRouter();

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <img
              src="/logo-andes.png"
              alt="Andes Workforce"
              className="h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/120x40?text=Andes+Workforce";
              }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-sm text-[#0097B2] hover:text-[#007A8F]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
