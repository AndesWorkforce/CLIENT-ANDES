"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { loginAction } from "../actions/login.action";
import { getUsuarioCompanyAssociation } from "@/app/admin/superAdmin/users-roles/actions/users-roles.actions";
import { useNotificationStore } from "@/store/notifications.store";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/app/components/Logo";
import { logoutAction } from "@/app/auth/logout/actions/logout.action";

// Encryption removed: we'll read plaintext payload from sessionStorage

export default function SelectRolePage() {
  const router = useRouter();
  const { user, setUser, setAuthenticated, setToken } = useAuthStore();
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
    // Optional extra metadata so we can show context (e.g. employee id mapping)
    // disable-next-line @typescript-eslint/no-explicit-any
    raw?: any;
  }>(null);
  const [pickedRole, setPickedRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("andes_pending_login");
      if (!stored) {
        // Intento de fallback: si no hay payload pero ya existe un usuario con rol único en cookie/store, salir de esta vista
        try {
          const raw = document.cookie
            .split("; ")
            .find((c) => c.startsWith("user_info="));
          if (raw) {
            const value = raw.split("=")[1];
            const decoded = decodeURIComponent(value);
            const cookieUser = JSON.parse(decoded);
            const cookieRoles = Array.isArray(cookieUser?.roles)
              ? cookieUser.roles
              : cookieUser?.rol
              ? [cookieUser.rol]
              : [];
            if (cookieRoles.length === 1) {
              // Redirigir directamente según el único rol
              const r = cookieRoles[0];
              if (r === "EMPRESA" || r === "EMPLEADO_EMPRESA") {
                router.replace("/companies/dashboard");
              } else if (
                r === "ADMIN" ||
                r === "EMPLEADO_ADMIN" ||
                r === "ADMIN_RECLUTAMIENTO"
              ) {
                router.replace("/admin/dashboard");
              } else {
                router.replace("/pages/offers");
              }
              return; // dejamos loading en false en finally
            }
          }
        } catch {}
        router.replace("/auth/login");
        return;
      }
      let parsed: { correo: string; contrasena: string; roles: string[] };
      try {
        parsed = JSON.parse(stored) as {
          correo: string;
          contrasena: string;
          roles: string[];
        };
      } catch {
        throw new Error("Invalid payload format");
      }
      const parsed2 = parsed as {
        correo: string;
        contrasena: string;
        roles: string[];
      };
      if (!parsed2.roles || parsed2.roles.length === 0) {
        router.replace("/auth/login");
        return;
      }
      // Si hay exactamente 1 rol, usamos el flujo automático y evitamos quedarse en loading
      if (parsed2.roles.length === 1) {
        setPending({ correo: parsed2.correo, contrasena: parsed2.contrasena });
        // Llamamos asincrónicamente a onPick sin bloquear el finally
        setTimeout(() => {
          onPick(parsed2.roles[0]);
        }, 0);
      } else {
        setRoles(parsed2.roles);
        setPending({ correo: parsed2.correo, contrasena: parsed2.contrasena });
      }
    } catch (e) {
      console.error("Error reading pending login:", e);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const finalizeSession = (
    // disable-next-line @typescript-eslint/no-explicit-any
    usuario: any,
    accessToken: string | undefined,
    overrideRole?: string
  ) => {
    const finalUser = {
      ...usuario,
      ...(overrideRole ? { rol: overrideRole } : {}),
      // Propagar empresa activa si está en cookie o en empleadoEmpresa
      selectedCompanyId: (() => {
        try {
          const cookieCompany = document.cookie
            .split("; ")
            .find((c) => c.startsWith("active_company_id="));
          if (cookieCompany) {
            const val = cookieCompany.split("=")[1];
            if (val) return val;
          }
        } catch {}
        const empId =
          usuario?.empresaId || usuario?.empleadoEmpresa?.empresa?.id;
        return empId || null;
      })(),
    };
    setUser(finalUser);
    setAuthenticated(true);
    if (accessToken) setToken(accessToken);
    sessionStorage.removeItem("andes_pending_login");
    // Actualizar cookie user_info (no httpOnly) para mantener el rol elegido
    try {
      document.cookie = `user_info=${encodeURIComponent(
        JSON.stringify(finalUser)
      )}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
    } catch {}
    const rol = finalUser?.rol;
    if (rol === "EMPRESA" || rol === "EMPLEADO_EMPRESA") {
      router.replace("/companies/dashboard");
    } else if (
      rol === "ADMIN" ||
      rol === "EMPLEADO_ADMIN" ||
      rol === "ADMIN_RECLUTAMIENTO"
    ) {
      router.replace("/admin/dashboard");
    } else if (finalUser?.perfilCompleto === "INCOMPLETO") {
      router.replace("/profile");
    } else {
      router.replace("/pages/offers");
    }
  };

  const onPick = async (role: string) => {
    if (!pending) return;
    setSubmitting(true);
    setPickedRole(role);

    // Si ya hay token en store y el rol NO es de empresa, evitamos re-login
    if (role !== "EMPRESA" && role !== "EMPLEADO_EMPRESA") {
      const tokenInStore = useAuthStore.getState().token;
      if (tokenInStore) {
        try {
          const raw = document.cookie
            .split("; ")
            .find((c) => c.startsWith("user_info="));
          if (raw) {
            const value = raw.split("=")[1];
            const usuarioCookie = JSON.parse(decodeURIComponent(value));
            finalizeSession(usuarioCookie, tokenInStore, role);
            setSubmitting(false);
            return;
          }
        } catch (e) {
          console.warn("[SelectRole] cookie parse error", e);
        }
      }
    }

    // Llamada al backend necesaria (rol empresa o no había token/cookie usable)
    // disable-next-line @typescript-eslint/no-explicit-any
    let result: any = null;
    try {
      result = await loginAction({
        correo: pending.correo,
        contrasena: pending.contrasena,
        selectedRole: role,
        // disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } catch (e) {
      console.warn("[SelectRole] loginAction threw", e);
      result = null;
    }

    if (!result || !result.success) {
      addNotification(result?.error || "Error selecting role", "error");
      setSubmitting(false);
      return;
    }

    const usuario = result.data?.usuario || result.data;
    const companyOptions = usuario?.companyOptions as
      | {
          role: string;
          needsCompanySelection?: boolean;
          companies?: { id: string; nombre: string; empleadoId?: string }[];
        }
      | undefined;
    // NORMALIZATION: backend may return singular or plural forms
    const empresasResponsable = Array.isArray(usuario?.empresasResponsable)
      ? usuario.empresasResponsable
      : Array.isArray(usuario?.responsibleCompanies)
      ? usuario.responsibleCompanies
      : usuario?.responsibleCompany
      ? [usuario.responsibleCompany]
      : [];
    // empleadoEmpresa puede venir como objeto singular (NO array) -> convertirlo
    const empleadoEmpresaRaw = usuario?.empleadoEmpresa;
    const empleadoEmpresa = Array.isArray(empleadoEmpresaRaw)
      ? empleadoEmpresaRaw
      : empleadoEmpresaRaw && typeof empleadoEmpresaRaw === "object"
      ? [empleadoEmpresaRaw]
      : Array.isArray(usuario?.employeeCompanies)
      ? usuario.employeeCompanies
      : usuario?.employeeCompany
      ? [usuario.employeeCompany]
      : [];
    console.log("[SelectRole] normalized after loginAction", {
      empresasResponsable,
      empleadoEmpresa,
    });

    // Si es rol de empresa y no tiene ninguna asociación, sacar el rol de la UI para evitar loops.
    if (
      (role === "EMPRESA" || role === "EMPLEADO_EMPRESA") &&
      empresasResponsable.length === 0 &&
      empleadoEmpresa.length === 0
    ) {
      addNotification(
        "Este rol no tiene empresas asociadas actualmente.",
        "error"
      );
      // Eliminamos el rol para que el usuario no siga intentando algo imposible ahora.
      setRoles((prev) => prev.filter((r) => r !== role));
      setSubmitting(false);
      return;
    }

    if (role === "EMPRESA") {
      // Owner companies (responsible)
      const listaOwner = empresasResponsable
        // disable-next-line @typescript-eslint/no-explicit-any
        .map((e: any) => ({
          id: e?.id || e?.empresaId || e?.empresa?.id,
          nombre: e?.nombre || e?.empresa?.nombre || "Empresa",
        }))
        // disable-next-line @typescript-eslint/no-explicit-any
        .filter((c: any) => c.id && c.nombre);

      // Roles reales del usuario (desde backend)
      const rolesOfUser: string[] = Array.isArray(usuario?.roles)
        ? usuario.roles
        : usuario?.rol
        ? [usuario.rol]
        : [];

      // Fallback: permitir seleccionar empresas donde es empleado si también posee el rol EMPLEADO_EMPRESA
      let companiesToShow = listaOwner;
      if (
        companiesToShow.length === 0 &&
        empleadoEmpresa.length > 0 &&
        rolesOfUser.includes("EMPLEADO_EMPRESA")
      ) {
        const employeeCompanies = empleadoEmpresa
          // disable-next-line @typescript-eslint/no-explicit-any
          .map((ee: any) => ({
            id: ee?.empresa?.id || ee?.empresaId || ee?.id,
            nombre: ee?.empresa?.nombre || ee?.nombre || "Empresa",
            empleadoId: ee?.empleadoId || ee?.id,
          }))
          // disable-next-line @typescript-eslint/no-explicit-any
          .filter((c: any) => c.id && c.nombre);
        if (employeeCompanies.length > 0) {
          companiesToShow = employeeCompanies;
          console.log(
            "[SelectRole] EMPRESA fallback using employee companies",
            employeeCompanies
          );
        } else {
          console.log(
            "[SelectRole] EMPRESA fallback skipped: no employee companies after normalization"
          );
        }
      } else if (
        companiesToShow.length === 0 &&
        !rolesOfUser.includes("EMPLEADO_EMPRESA")
      ) {
        console.log(
          "[SelectRole] EMPRESA fallback not allowed: user lacks EMPLEADO_EMPRESA role"
        );
      }

      if (companiesToShow.length === 0) {
        addNotification(
          "You have no associated companies for this role.",
          "error"
        );
        setSubmitting(false);
        return;
      }
      if (companiesToShow.length === 1) {
        await onPickCompany(
          companiesToShow[0].id,
          role,
          companiesToShow[0].empleadoId
        );
        return;
      }
      setCompanyStep({ role: "EMPRESA", companies: companiesToShow });
      setSubmitting(false);
      return;
    }

    if (role === "EMPLEADO_EMPRESA") {
      // Prefer server-provided options when available
      if (
        companyOptions?.role === "EMPLEADO_EMPRESA" &&
        Array.isArray(companyOptions.companies) &&
        companyOptions.companies.length > 0
      ) {
        const options = companyOptions.companies
          .map((c) => ({
            id: c.id,
            nombre: c.nombre,
            empleadoId: c.empleadoId,
          }))
          .filter((c) => c.id && c.nombre);
        if (options.length > 1 || companyOptions.needsCompanySelection) {
          setCompanyStep({ role: "EMPLEADO_EMPRESA", companies: options });
          setSubmitting(false);
          return;
        }
        if (options.length === 1) {
          await onPickCompany(options[0].id, role, options[0].empleadoId);
          return;
        }
        // fallthrough to legacy derivation if empty after filter
      }
      // Usar la lista directa del loginAction
      const lista = empleadoEmpresa
        // disable-next-line @typescript-eslint/no-explicit-any
        .map((ee: any) => ({
          id: ee?.empresa?.id || ee?.empresaId || ee?.id,
          nombre: ee?.empresa?.nombre || ee?.nombre || "Empresa",
          empleadoId: ee?.empleadoId || ee?.id,
          rolInterno: ee?.rol,
        }))
        // disable-next-line @typescript-eslint/no-explicit-any
        .filter((c: any) => c.id && c.nombre && c.empleadoId);

      // Si sólo llegó 1 o ninguna, intentar enriquecer con endpoint dedicado (puede traer plural completo)
      if (lista.length <= 1 && usuario?.id) {
        try {
          const assoc = await getUsuarioCompanyAssociation(usuario.id);
          if (assoc.success && assoc.data?.employeeCompanies?.length) {
            const enriched = assoc.data.employeeCompanies
              // disable-next-line @typescript-eslint/no-explicit-any
              .map((e: any) => ({
                id: e?.empresa?.id || e?.empresaId || e?.id,
                nombre: e?.empresa?.nombre || e?.nombre || "Empresa",
                empleadoId: e?.empleadoId || e?.id,
                rolInterno: e?.rol,
              }))
              // disable-next-line @typescript-eslint/no-explicit-any
              .filter((c: any) => c.id && c.nombre && c.empleadoId);
            // Unir evitando duplicados
            // disable-next-line @typescript-eslint/no-explicit-any
            const seen = new Set(lista.map((c: any) => c.id));
            for (const c of enriched) if (!seen.has(c.id)) lista.push(c);
          }
        } catch (e) {
          console.warn("[SelectRole] enrichment failed", e);
        }
      }

      if (lista.length === 0) {
        addNotification(
          "You have no associated companies for this role.",
          "error"
        );
        setSubmitting(false);
        return;
      }
      // Siempre mostrar selección si hay más de una
      if (lista.length > 1) {
        setCompanyStep({ role: "EMPLEADO_EMPRESA", companies: lista });
        setSubmitting(false);
        return;
      }
      // Una sola -> autoseleccionar
      await onPickCompany(lista[0].id, role, lista[0].empleadoId);
      return;
    }

    // Rol no empresa después de loginAction (porque no había cookie/token usable)
    finalizeSession(usuario, result.data?.accessToken, role);
    setSubmitting(false);
  };

  const onPickCompany = async (
    companyId: string,
    roleOverride?: string,
    empleadoId?: string
  ) => {
    if (!pending) return;
    console.log("[DENTRO DE LA FUNCION", companyId);
    setSubmitting(true);
    const roleBase =
      roleOverride || pickedRole || (companyStep?.role as string) || "EMPRESA";
    // If we have an empleadoId but the role is EMPRESA (fallback manager path),
    // switch to EMPLEADO_EMPRESA to satisfy backend expectations.
    const roleToSend =
      empleadoId && roleBase === "EMPRESA" ? "EMPLEADO_EMPRESA" : roleBase;

    // Guard: si vamos a enviar EMPLEADO_EMPRESA pero el usuario no tiene ese rol en la UI, evitamos error 401
    if (
      roleToSend === "EMPLEADO_EMPRESA" &&
      !roles.includes("EMPLEADO_EMPRESA") &&
      // Permitir si venimos del fallback de EMPRESA (roleBase==='EMPRESA' con empleadoId)
      !(roleBase === "EMPRESA" && empleadoId)
    ) {
      addNotification(
        "You do not have the EMPLOYEE_COMPANY role assigned to select a company as an employee.",
        "error"
      );
      setSubmitting(false);
      return;
    }
    try {
      // Solo persistimos la empresa en cookie si el rol base es EMPRESA;
      // para EMPLEADO_EMPRESA dejamos que el backend infiera desde la relación.
      if (roleToSend === "EMPRESA") {
        document.cookie = `selected_company_id=${companyId}; path=/; max-age=300; samesite=strict`;
      } else {
        // limpiar si quedó de un intento anterior
        document.cookie = `selected_company_id=; path=/; max-age=0; samesite=strict`;
      }
    } catch {}
    console.log("[SelectRole] onPickCompany payload", {
      companyId,
      roleBase,
      roleToSend,
      empleadoId,
    });
    // Intento robusto: usar API proxy que siempre reenvía x-company-id y setea cookies; fallback a server action si falla
    // disable-next-line @typescript-eslint/no-explicit-any
    let result: any = null;
    const proxyPayload = {
      correo: pending.correo,
      contrasena: pending.contrasena,
      selectedRole: roleToSend,
      selectedCompanyId: companyId,
    };
    try {
      const resp = await fetch("/api/auth/login/with-company", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-company-id": companyId,
        },
        credentials: "include",
        body: JSON.stringify(proxyPayload),
      });
      const data = await resp.json();
      result = data;
      console.log("[SelectRole] proxy login result", resp.status, data);
      // disable-next-line @typescript-eslint/no-explicit-any
    } catch (proxyErr: any) {
      console.warn(
        "[SelectRole] proxy login failed, fallback to server action",
        proxyErr?.message
      );
      try {
        // disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = { ...proxyPayload };
        // disable-next-line @typescript-eslint/no-explicit-any
        result = await loginAction(payload as any);
        // disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.warn("[SelectRole] loginAction (company) threw", e?.message, e);
        result = { success: false, error: e?.message || "Request failed" };
      }
    }

    if (!result || !result.success) {
      console.error("[SelectRole] onPickCompany error detail", {
        roleBase,
        roleToSend,
        companyId,
        backendError: result?.error,
      });

      // Recovery: para EMPRESA intentamos cookie; para EMPLEADO_EMPRESA evitamos sesionar con empresa equivocada
      if (roleToSend === "EMPRESA") {
        try {
          const raw = document.cookie
            .split("; ")
            .find((c) => c.startsWith("user_info="));
          if (raw) {
            const cookieUser = JSON.parse(
              decodeURIComponent(raw.split("=")[1])
            );
            const finalRole = cookieUser?.rol || roleToSend;
            if (finalRole === "EMPRESA") {
              addNotification("Company selected. Session started.", "success");
              finalizeSession(cookieUser, undefined, finalRole);
              setSubmitting(false);
              return;
            }
          }
        } catch (e) {
          console.warn("[SelectRole] cookie recovery failed", e);
        }
      }

      addNotification(
        result?.error || result?.message || "Error selecting company",
        "error"
      );
      setSubmitting(false);
      return;
    }

    addNotification("Company selected. Session started.", "success");
    const respuestaUsuario = result.data?.usuario || result.data;
    // Validar que la empresa elegida se haya reflejado (para empleadoEmpresa puede venir en empleadoEmpresa.empresa.id)
    const empresaAsignada =
      respuestaUsuario?.empresaId ||
      respuestaUsuario?.empleadoEmpresa?.empresa?.id;
    if (
      (roleToSend === "EMPRESA" || roleToSend === "EMPLEADO_EMPRESA") &&
      empresaAsignada &&
      empresaAsignada !== companyId
    ) {
      addNotification(
        "Warning: the returned company does not match the selected one. Refreshing selection.",
        "warning"
      );
      // Forzar persistencia de la seleccion local aunque backend no coincida todavía
      try {
        document.cookie = `active_company_id=${companyId}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; samesite=strict`;
      } catch {}
    }
    // Persistir la empresa elegida para todas las solicitudes (incluso si coincidió)
    try {
      document.cookie = `active_company_id=${companyId}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; samesite=strict`;
    } catch {}
    finalizeSession(respuestaUsuario, result.data?.accessToken);
    setSubmitting(false);
  };

  console.log("[USER]", user);
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
                onClick={() => onPickCompany(c.id, undefined, c.empleadoId)}
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
