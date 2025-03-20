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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}usuarios/${id}/perfil-completo`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const profile = await response.json();

  console.log(id);
  console.log(token);
  console.log(profile);

  return (
    <main className="bg-white">
      <ProfileContextProvider value={{ profile: profile.data }}>
        {children}
      </ProfileContextProvider>
    </main>
  );
}
