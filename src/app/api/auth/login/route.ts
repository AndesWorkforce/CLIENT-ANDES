import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAuthCookieBaseOptions,
  getClientReadableCookieOptions,
} from "@/lib/auth-cookies";
import { createServerAxios } from "@/services/axios.server";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";
const ACTIVE_COMPANY_COOKIE = "active_company_id";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, contrasena, selectedRole, selectedCompanyId } = body;

    const axios = await createServerAxios();
    const cookieStore = await cookies();
    const cookieSelectedCompany = cookieStore.get("selected_company_id")?.value;
    const effectiveCompanyId = selectedCompanyId || cookieSelectedCompany;

    // Limpiar la cookie temporal si existe (one-shot)
    if (cookieSelectedCompany) {
      cookieStore.set({
        name: "selected_company_id",
        value: "",
        maxAge: 0,
        path: "/",
      });
    }

    console.log("[API Login] payload", {
      correo,
      hasPassword: Boolean(contrasena?.length),
      selectedRole,
      selectedCompanyId,
      cookieSelectedCompany,
      effectiveCompanyId,
    });

    // Intentar hacer el login
    const response = await axios.post(
      "auth/login",
      {
        correo,
        contrasena,
        ...(selectedRole ? { selectedRole } : {}),
        ...(effectiveCompanyId
          ? { selectedCompanyId: effectiveCompanyId }
          : {}),
      },
      {
        maxRedirects: 0,
        headers: {
          ...(effectiveCompanyId
            ? { "x-company-id": effectiveCompanyId }
            : {}),
        },
      }
    );

    const data = response.data;

    // Si el inicio de sesión fue exitoso, establecer cookies
    if (data && data.data) {
      const userData = data.data.usuario || data.data;
      const token = data.data.accessToken || "default-token-placeholder";

      // Establecer cookie para el token (HTTP-only para seguridad)
      cookieStore.set({
        name: AUTH_COOKIE,
        value: token,
        ...getAuthCookieBaseOptions(),
      });

      // Resolver empresa activa
      const resolvedCompanyId =
        effectiveCompanyId ||
        userData?.empresaId ||
        userData?.empleadoEmpresa?.empresa?.id ||
        (Array.isArray(userData?.companyOptions?.companies) &&
        userData?.companyOptions?.companies?.length === 1
          ? userData?.companyOptions?.companies[0]?.id
          : null);

      // Guardar info de usuario (no httpOnly para que Zustand la lea)
      cookieStore.set({
        name: USER_INFO_COOKIE,
        value: JSON.stringify(userData),
        ...getClientReadableCookieOptions(),
      });

      // Guardar empresa activa si se resolvió
      if (resolvedCompanyId) {
        cookieStore.set({
          name: ACTIVE_COMPANY_COOKIE,
          value: String(resolvedCompanyId),
          ...getClientReadableCookieOptions(),
        });
      }

      console.log("[API Login] ✅ Login exitoso, cookies establecidas");

      return NextResponse.json({
        success: true,
        data: {
          usuario: userData,
          accessToken: token,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid response from backend" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[API Login] Error:", error.response?.data || error.message);

    if (error.response) {
      return NextResponse.json(
        {
          success: false,
          error: error.response.data?.message || "Login failed",
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
