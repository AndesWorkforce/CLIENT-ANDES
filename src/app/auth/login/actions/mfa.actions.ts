"use server";

import { createServerAxios } from "@/services/axios.server";

export async function mfaSetupAction(setupToken: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/mfa/setup", { setupToken });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error setting up MFA",
    };
  }
}

export async function mfaEnableAction(setupToken: string, code: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/mfa/enable", { setupToken, code });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Invalid TOTP code",
    };
  }
}

export async function mfaVerifyAction(challengeToken: string, code: string) {
  try {
    const axios = await createServerAxios();
    const { cookies } = await import("next/headers");
    const response = await axios.post("auth/mfa/verify", {
      challengeToken,
      code,
    });

    const data = response.data?.data || response.data;

    if (data?.accessToken) {
      const cookieStore = await cookies();
      const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

      cookieStore.set({
        name: "auth_token",
        value: data.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "strict",
      });

      if (data.usuario) {
        cookieStore.set({
          name: "user_info",
          value: JSON.stringify(data.usuario),
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: COOKIE_MAX_AGE,
          path: "/",
          sameSite: "strict",
        });
      }
    }

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Invalid MFA code",
    };
  }
}

export async function mfaRecoveryRequestAction(correo: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/mfa/recovery/request", { correo });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.response?.data?.message || "Error requesting recovery code",
    };
  }
}

export async function mfaRecoveryVerifyAction(
  correo: string,
  recoveryCode: string
) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/mfa/recovery/verify", {
      correo,
      recoveryCode,
    });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Invalid recovery code",
    };
  }
}
