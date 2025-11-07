"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { loginAction } from "../actions/login.action";
import { useNotificationStore } from "@/store/notifications.store";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/app/components/Logo";
import { logoutAction } from "@/app/auth/logout/actions/logout.action";

const SECRET = process.env.NEXT_PUBLIC_CRYPTO_KEY || "default-secret-key";

export default function SelectRolePage() {
  const router = useRouter();
  const { setUser, setAuthenticated, setToken } = useAuthStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [roles, setRoles] = useState<string[]>([]);
  const [pending, setPending] = useState<{
    correo: string;
    contrasena: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companyStep, setCompanyStep] = useState<null | {
    role: "EMPRESA" | "EMPLEADO_EMPRESA";
    companies: { id: string; nombre: string; empleadoId?: string }[];
  }>(null);
  const [pickedRole, setPickedRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const encrypted = sessionStorage.getItem("andes_pending_login");
      if (!encrypted) {
        router.replace("/auth/login");
        return;
      }
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
      const json = bytes.toString(CryptoJS.enc.Utf8);
      if (!json) throw new Error("Invalid payload");
      const parsed = JSON.parse(json) as {
        correo: string;
        contrasena: string;
        roles: string[];
      };
      if (!parsed.roles || parsed.roles.length < 2) {
        router.replace("/auth/login");
        return;
      }
      setRoles(parsed.roles);
      setPending({ correo: parsed.correo, contrasena: parsed.contrasena });
    } catch (e) {
      console.error("Error reading pending login:", e);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const onPick = async (role: string) => {
    if (!pending) return;
    try {
      setSubmitting(true);
      setPickedRole(role);
      const result = await loginAction({
        correo: pending.correo,
        contrasena: pending.contrasena,
        selectedRole: role,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if (result.success) {
        // Debug extra para validar qué devuelve el backend
        try {
          console.log("[SelectRole] loginAction result", result);
        } catch {}
        const companyOptions = result.data?.usuario?.companyOptions;
        const needsCompanySelection = companyOptions?.needsCompanySelection;
        const companiesCount = Array.isArray(companyOptions?.companies)
          ? companyOptions.companies.length
          : 0;

        // Estrategia defensiva: si el rol es de compañía y hay >1 empresas, forzar selector
        const shouldForcePick =
          (role === "EMPRESA" || role === "EMPLEADO_EMPRESA") &&
          companiesCount > 1;

        if (
          (role === "EMPRESA" || role === "EMPLEADO_EMPRESA") &&
          (needsCompanySelection || shouldForcePick)
        ) {
          // Paso 2: elige empresa, no cerrar aún la sesión/redirect
          setCompanyStep({
            role: (companyOptions?.role as any) || (role as any),
            companies: companyOptions?.companies || [],
          });
          // No limpiamos el pending ni seteamos user/token todavía.
        } else if (
          (role === "EMPRESA" || role === "EMPLEADO_EMPRESA") &&
          companiesCount === 0
        ) {
          // Sin empresas asociadas, no podemos continuar con rol de compañía
          console.warn("[SelectRole] No company associations for company role");
          addNotification(
            "No tienes empresas asociadas para este rol.",
            "error"
          );
          setSubmitting(false);
          return;
        } else {
          addNotification("Role selected. Session started.", "success");
          setUser(result.data?.usuario);
          setAuthenticated(true);
          setToken(result.data?.accessToken);
          sessionStorage.removeItem("andes_pending_login");

          const activeRole = result.data?.usuario?.rol;
          if (activeRole === "EMPRESA" || activeRole === "EMPLEADO_EMPRESA") {
            router.replace("/companies/dashboard");
          } else if (
            activeRole === "ADMIN" ||
            activeRole === "EMPLEADO_ADMIN" ||
            activeRole === "ADMIN_RECLUTAMIENTO"
          ) {
            router.replace("/admin/dashboard");
          } else {
            if (result.data?.usuario?.perfilCompleto === "INCOMPLETO") {
              router.replace("/profile");
            } else {
              router.replace("/pages/offers");
            }
          }
        }
      } else {
        addNotification(result.error || "Error selecting role", "error");
      }
    } catch (e) {
      console.error("Error selecting role:", e);
      addNotification("Unexpected error selecting role", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onPickCompany = async (companyId: string) => {
    if (!pending) return;
    console.log("[DENTRO DE LA FUNCION", companyId);
    setSubmitting(true);
    const roleToSend = pickedRole || (companyStep?.role as string) || "EMPRESA";
    try {
      // Cookie temporal para que el server action la lea si el arg se pierde
      document.cookie = `selected_company_id=${companyId}; path=/; max-age=300; samesite=strict`;
    } catch {}
    console.log("[SelectRole] onPickCompany payload", {
      companyId,
      roleToSend,
    });
    // Use API route to avoid server action serialization issues
    const resp = await fetch("/api/auth/login/with-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: pending.correo,
        contrasena: pending.contrasena,
        selectedRole: roleToSend,
        selectedCompanyId: companyId,
      }),
    }).catch((e) => {
      console.warn("[SelectRole] fetch error:", e);
      return null;
    });

    if (!resp) {
      addNotification(
        "No se pudo contactar al servidor de autenticación.",
        "error"
      );
      setSubmitting(false);
      return;
    }

    let result: any = null;
    try {
      result = await resp.json();
    } catch (e) {
      console.warn("[SelectRole] Invalid JSON response", e);
    }
    console.log("[RESULT]", result);

    if (resp.ok && result && result.success) {
      const res: any = result as any;
      addNotification("Company selected. Session started.", "success");
      setUser(res.data?.usuario);
      setAuthenticated(true);
      setToken(res.data?.accessToken);
      sessionStorage.removeItem("andes_pending_login");
      const activeRole = res.data?.usuario?.rol;
      if (activeRole === "EMPRESA" || activeRole === "EMPLEADO_EMPRESA") {
        router.replace("/companies/dashboard");
      } else {
        router.replace("/");
      }
    } else {
      const status = resp.status;
      const msg =
        (result as any)?.error ||
        (status >= 500
          ? "Error del servidor al seleccionar la empresa"
          : status >= 400
          ? "Datos inválidos al seleccionar la empresa"
          : "Error selecting company");
      console.warn("[SelectRole] Error selecting company:", msg);
      addNotification(msg, "error");
    }
    setSubmitting(false);
  };

  console.log("[COMPANIES]", companyStep);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative">
        {/* Back icon (top-right) */}
        <button
          type="button"
          onClick={async () => {
            try {
              // limpiar credenciales temporales del flujo multi-rol
              sessionStorage.removeItem("andes_pending_login");
            } catch {}
            // borrar cookies de auth en el servidor
            await logoutAction();
            router.replace("/auth/login");
          }}
          disabled={submitting}
          aria-label="Back to login"
          className="absolute right-4 top-4 inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#0097B2] shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          <LogOut size={18} />
          <span className="sr-only">Back to login</span>
        </button>

        {/* Header (stacked on mobile) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="shrink-0">
            <Logo />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#17323A]">
              {companyStep ? "Select a company" : "Select a role"}
            </h1>
            <p className="text-sm text-gray-600">
              {companyStep
                ? "Choose the company you want to use for this session."
                : "Choose the role you want to use for this session."}
            </p>
          </div>
        </div>

        {/* Grid of role cards OR company cards */}
        {!companyStep ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            aria-label="Available roles"
          >
            {roles.map((r) => {
              const LABELS: Record<string, string> = {
                ADMIN: "Admin",
                EMPRESA: "Company",
                CANDIDATO: "Candidate",
                EMPLEADO_ADMIN: "Admin Employee",
                EMPLEADO_EMPRESA: "Company Employee",
                ADMIN_RECLUTAMIENTO: "Recruitment Admin",
              };
              const label = LABELS[r] || r;
              const bgImage = "/images/logo-andes.png"; // default background image
              return (
                <button
                  key={r}
                  onClick={() => onPick(r)}
                  disabled={submitting}
                  aria-label={`Use role ${label}`}
                  className="group relative h-36 sm:h-40 w-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md focus:shadow-md transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:ring-offset-2 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0">
                    <img
                      src={bgImage}
                      alt=""
                      className="w-full h-full object-contain opacity-60 scale-110 group-hover:scale-105 transition-transform"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="relative z-10 flex h-full items-center justify-center">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#17323A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                      {label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            aria-label="Available companies"
          >
            {companyStep.companies.map((c) => (
              <button
                key={c.id}
                onClick={() => onPickCompany(c.id)}
                disabled={submitting}
                aria-label={`Use company ${c.nombre}`}
                className="group relative h-36 sm:h-40 w-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md focus:shadow-md transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:ring-offset-2 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0">
                  <img
                    src="/images/logo-andes.png"
                    alt=""
                    className="w-full h-full object-contain opacity-60 scale-110 group-hover:scale-105 transition-transform"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60"
                    aria-hidden="true"
                  />
                </div>
                <div className="relative z-10 flex h-full items-center justify-center">
                  <span className="text-lg sm:text-xl font-extrabold tracking-wide text-[#17323A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {c.nombre}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div className="mt-4 text-xs text-gray-500">
          {!companyStep
            ? "Tip: you can change your active role any time by logging out and back in."
            : "Tip: you can change your active company later by logging out and repeating the selection."}
        </div>
      </div>

      {/* Busy overlay when submitting */}
      {submitting && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px]"
          aria-hidden="true"
        />
      )}
    </section>
  );
}
