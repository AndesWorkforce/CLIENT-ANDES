"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function ForcedLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().logout();

    const searchParams = new URLSearchParams(window.location.search);
    const reason = searchParams.get("reason") || "session_expired";

    router.replace(`/auth/login?error=${reason}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Cerrando sesión...</h1>
        <p>Serás redirigido en un momento.</p>
      </div>
    </div>
  );
}
