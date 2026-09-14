import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ProfileContextProvider,
  type ProfileData,
} from "./context/ProfileContext";
import { getApiUrl } from "@/services/axios.server";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let userId: string | undefined;
  try {
    const raw = cookieStore.get("user_info")?.value;
    if (raw) {
      const parsed = JSON.parse(raw) as { id?: string };
      userId = typeof parsed?.id === "string" ? parsed.id : undefined;
    }
  } catch {
    userId = undefined;
  }

  if (!userId || !token) {
    redirect("/auth/login?returnUrl=/profile");
  }

  const baseUrl = getApiUrl();
  let response: Response;
  try {
    response = await fetch(
      `${baseUrl}usuarios/${userId}/perfil-completo`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  } catch (err) {
    console.error("[ProfileLayout] fetch perfil-completo failed:", err);
    redirect("/auth/login?returnUrl=/profile");
  }

  if (response.status === 401 || response.status === 403) {
    redirect("/auth/login?returnUrl=/profile");
  }

  let payload: { data?: Record<string, unknown> };
  try {
    payload = await response.json();
  } catch {
    console.error("[ProfileLayout] invalid JSON from perfil-completo");
    redirect("/auth/login?returnUrl=/profile");
  }

  const rawData = payload?.data;
  if (!response.ok || !rawData || typeof rawData !== "object") {
    console.error(
      "[ProfileLayout] perfil-completo error:",
      response.status,
      rawData
    );
    redirect("/auth/login?returnUrl=/profile");
  }

  const profileWithPolicy = {
    ...rawData,
    aceptaPoliticaDatos:
      (rawData as { aceptaPoliticaDatos?: boolean }).aceptaPoliticaDatos ??
      false,
  };

  return (
    <main className="container mx-auto bg-white">
      <ProfileContextProvider
        initialValue={{
          profile: profileWithPolicy as unknown as ProfileData,
        }}
      >
        {children}
      </ProfileContextProvider>
    </main>
  );
}
