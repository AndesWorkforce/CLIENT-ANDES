"use client";

import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";
import { useNotificationStore } from "@/store/notifications.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const REMEMBER_KEY = "andes_remembered_email";
// Encryption removed to simplify flow and avoid runtime issues

export default function LoginForm() {
  const router = useRouter();
  const { setUser, setAuthenticated, setToken } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      contrasena: "",
    },
  });

  useEffect(() => {
    try {
      const remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered) {
        // Store plaintext email directly
        if (remembered && remembered.includes("@")) {
          setValue("correo", remembered);
          setRememberMe(true);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading remembered email:", error);
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, [setValue]);

  const safeRedirect = (url: string) => {
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  const readUserInfoCookie = () => {
    try {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("user_info="));
      if (!raw) return null;
      const value = raw.split("=")[1];
      if (!value) return null;
      const decoded = decodeURIComponent(value);
      const parsed = JSON.parse(decoded);
      return parsed;
    } catch (e) {
      console.warn("[Login] Could not parse user_info cookie", e);
      return null;
    }
  };

  const hydrateStoreFromCookieIfNeeded = () => {
    // Si ya tenemos usuario en store, no hacemos nada
    const existing = useAuthStore.getState().user;
    if (existing) return existing;
    const cookieUser = readUserInfoCookie();
    if (cookieUser) {
      try {
        setUser(cookieUser);
        setAuthenticated(true);
      } catch (e) {
        console.warn("[Login] Error hydrating user from cookie", e);
      }
      return cookieUser;
    }
    return null;
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);

      // Manejar Remember Me (plaintext)
      if (rememberMe && data.correo) {
        try {
          localStorage.setItem(REMEMBER_KEY, data.correo);
        } catch (error) {
          console.error("Error saving remembered email:", error);
        }
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      // Intentar login
      try {
        const result = await loginAction(data);

        // Guard against unexpected undefined
        if (!result) {
          addNotification("Login failed: empty response", "error");
          console.error("[Login] Empty result from loginAction");
          return;
        }

        if (result.success) {
          // usuario puede venir en distintas formas
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const user: any = result.data?.usuario || result.data;
          // Normalizamos lista de roles: si user.roles existe y es array con >0, usarla; si no, usar user.rol si existe
          const rolesFromResponse = Array.isArray(user?.roles)
            ? (user.roles as string[])
            : user?.rol
            ? [user.rol]
            : [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const selectedWasProvided = Boolean((data as any).selectedRole);

          // Multi-rol sólo si hay 2 o más roles
          if (rolesFromResponse.length > 1 && !selectedWasProvided) {
            try {
              // Pre-cargar sesión local para que la vista de selección tenga contexto inmediatamente
              if (user) {
                try {
                  // Guardar en store
                  setUser(user);
                  setAuthenticated(true);
                  if (result.data?.accessToken)
                    setToken(result.data?.accessToken);
                  // Guardar cookie legible por el cliente usada como fallback en select-role
                  const userInfo = encodeURIComponent(JSON.stringify(user));
                  // 7 días
                  document.cookie = `user_info=${userInfo}; path=/; max-age=${
                    7 * 24 * 60 * 60
                  }; samesite=strict`;
                } catch (e) {
                  console.warn(
                    "[Login] could not prime local session before role selection",
                    e
                  );
                }
              }
              const payload = JSON.stringify({
                correo: data.correo,
                contrasena: data.contrasena,
                roles: rolesFromResponse,
              });
              // Store plaintext payload to avoid CryptoJS issues
              sessionStorage.setItem("andes_pending_login", payload);
            } catch (e) {
              console.error("Error preparing pending login payload", e);
            }
            router.push("/auth/login/select-role");
            return;
          }

          // Si no hay roles en la respuesta, intentar hidratar desde cookie
          let effectiveUser = user;
          if (rolesFromResponse.length === 0 || !user) {
            const cookieUser = hydrateStoreFromCookieIfNeeded();
            if (cookieUser) {
              effectiveUser = cookieUser;
              // Intentar reconstruir roles a partir de cookieUser.rol
              if (rolesFromResponse.length === 0 && cookieUser.rol) {
                rolesFromResponse.push(cookieUser.rol);
              }
            }
          }

          addNotification("Successfully logged in", "success");
          setUser(effectiveUser);
          setAuthenticated(true);
          setToken(result.data?.accessToken);

          // Verificar si hay una URL de redirección pendiente
          const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
          if (redirectAfterLogin) {
            localStorage.removeItem("redirectAfterLogin");
            safeRedirect(redirectAfterLogin);
            return;
          }

          const activeRole = effectiveUser?.rol;
          if (activeRole === "EMPRESA" || activeRole === "EMPLEADO_EMPRESA") {
            safeRedirect("/companies/dashboard");
          } else if (
            activeRole === "ADMIN" ||
            activeRole === "EMPLEADO_ADMIN" ||
            activeRole === "ADMIN_RECLUTAMIENTO"
          ) {
            safeRedirect("/admin/dashboard");
          } else {
            if (effectiveUser?.perfilCompleto === "INCOMPLETO") {
              safeRedirect("/profile");
            } else {
              safeRedirect("/pages/offers");
            }
          }
        } else {
          addNotification(result.error || "Error logging in", "error");
          console.error("Login error:", result.error);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (loginError: any) {
        if (
          loginError.message &&
          (loginError.message.includes("NEXT_REDIRECT") ||
            loginError.message.includes("307") ||
            loginError.message.includes("redirect"))
        ) {
          // Flujo de redirección: intentar hidratar store desde cookie antes de redirigir
          const cookieUser = hydrateStoreFromCookieIfNeeded();
          if (cookieUser) {
            addNotification("Successfully logged in", "success");
            // Determinar destino según rol hidratrado
            const r = cookieUser?.rol;
            if (r === "EMPRESA" || r === "EMPLEADO_EMPRESA") {
              safeRedirect("/companies/dashboard");
            } else if (
              r === "ADMIN" ||
              r === "EMPLEADO_ADMIN" ||
              r === "ADMIN_RECLUTAMIENTO"
            ) {
              safeRedirect("/admin/dashboard");
            } else if (cookieUser?.perfilCompleto === "INCOMPLETO") {
              safeRedirect("/profile");
            } else {
              safeRedirect("/pages/offers");
            }
          } else {
            addNotification("Successfully logged in", "success");
            safeRedirect("/profile");
          }
        } else {
          throw loginError;
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      addNotification("Unexpected error during login", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // onSelectRole fue movido a la vista dedicada /auth/login/select-role

  return (
    <div className="flex-1 text-black h-full flex flex-col">
      {/* Título solo visible en móvil */}
      <h2 className="text-xl font-[600] text-[18px] mb-4 lg:hidden">Log in</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 mt-4"
      >
        {/* Email input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Email
          </label>
          <input
            type="email"
            placeholder="Write your email"
            className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
            {...register("correo")}
          />
          {errors.correo && (
            <span className="text-red-500 text-xs mt-1">
              {errors.correo.message}
            </span>
          )}
        </div>

        {/* Password input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Write your password"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("contrasena")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon
                  size={20}
                  color="#0097B2"
                  className="cursor-pointer"
                />
              ) : (
                <EyeIcon size={20} color="#0097B2" className="cursor-pointer" />
              )}
            </button>
          </div>
          {errors.contrasena && (
            <span className="text-red-500 text-xs mt-1">
              {errors.contrasena.message}
            </span>
          )}
          {/* Forgot password link */}
          <div className="mt-2 text-right">
            <Link
              href="/auth/fargot-password"
              className="text-[#0097B2] text-xs hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="form-checkbox h-4 w-4 text-[#0097B2] transition duration-150 ease-in-out"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-700 ml-2">
            Remember me
          </label>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] mt-8 text-[15px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        {/* Register link */}
        <div className="text-center mt-2">
          <p className="flex flex-col text-[14px] text-[#B6B4B4] m-0">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#0097B2] font-[600] text-[16px] hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>
      {/* El selector de rol ahora es una vista dedicada en /auth/login/select-role */}
    </div>
  );
}
