"use server";

import { createServerAxios } from "@/services/axios.server";

export async function verifyPasswordAction(password: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/verify-password", { password });
    const data = response.data?.data || response.data;
    return { success: true, verified: data?.verified === true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Invalid password",
    };
  }
}

export async function getMfaStatusAction() {
  try {
    const axios = await createServerAxios();
    const response = await axios.get("auth/mfa/status");
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error fetching MFA status",
    };
  }
}

export async function disableMfaAction(code: string, password: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/mfa/disable", { code, password });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error disabling MFA",
    };
  }
}

export async function regenerateBackupCodesAction(code: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post("auth/mfa/backup-codes/regenerate", {
      code,
    });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.response?.data?.message || "Error regenerating backup codes",
    };
  }
}

export async function setupMfaAction() {
  try {
    const axios = await createServerAxios();
    // Step 1: get a setupToken from begin-setup (authenticated endpoint)
    const beginRes = await axios.post("auth/mfa/begin-setup");
    const setupToken =
      beginRes.data?.data?.setupToken || beginRes.data?.setupToken;
    if (!setupToken) {
      return { success: false, error: "Could not obtain setup token" };
    }
    // Step 2: use the setupToken to generate QR code
    const response = await axios.post("auth/mfa/setup", { setupToken });
    const setupData = response.data?.data || response.data;
    return {
      success: true,
      data: { ...setupData, setupToken },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Error setting up MFA",
    };
  }
}

export async function enableMfaAction(setupToken: string, code: string) {
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
