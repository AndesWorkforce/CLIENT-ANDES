import { cookies } from "next/headers";
import { ProfileContextProvider } from "./context/ProfileContext";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const { id } = JSON.parse(cookieStore.get("user_info")?.value || "{}");
  const token = cookieStore.get("auth_token")?.value;

  // Fetch profile data - this will be automatically revalidated when needed
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}usuarios/${id}/perfil-completo`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const profile = await response.json();

  // Asegurar que aceptaPoliticaDatos esté presente
  const profileWithPolicy = {
    ...profile.data,
    aceptaPoliticaDatos: profile.data.aceptaPoliticaDatos ?? false,
  };

  return (
    <main className="container mx-auto bg-white">
      <ProfileContextProvider initialValue={{ profile: profileWithPolicy }}>
        {children}
      </ProfileContextProvider>
    </main>
  );
}
