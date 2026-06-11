import { cookies } from "next/headers";
import {
  getAuthCookieBaseOptions,
  getClientReadableCookieOptions,
} from "@/lib/auth-cookies";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

/** Establece auth_token (httpOnly) y user_info en el servidor. */
export async function applyAuthSessionCookies(
  token: string,
  user: Record<string, unknown>,
) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE,
    value: token,
    ...getAuthCookieBaseOptions(),
  });

  cookieStore.set({
    name: USER_INFO_COOKIE,
    value: JSON.stringify(user),
    ...getClientReadableCookieOptions(),
  });
}
