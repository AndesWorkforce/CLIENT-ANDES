import { setClientUserInfoCookie } from "@/lib/client-user-info-cookie";

/** Persiste cookies httpOnly (Next) + user_info legible (navegador). */
export async function persistAuthSession(
  token: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
) {
  if (!token || !user) return;

  setClientUserInfoCookie(user);

  try {
    const sessionResponse = await fetch("/session-api/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, user }),
    });

    if (!sessionResponse.ok) {
      console.error(
        "[Auth Session] ❌ Failed to set cookies:",
        sessionResponse.status,
      );
    }
  } catch (error) {
    console.error("[Auth Session] ❌ Error:", error);
  }
}
