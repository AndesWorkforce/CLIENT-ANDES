"use client";

import { useAuthStore } from "@/store/auth.store";

export default function AdminHubDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-[32px] font-bold text-[#343434] leading-[1.3]">
        Hola, {user?.nombre ?? "Administrador"}!
      </h1>
    </div>
  );
}
