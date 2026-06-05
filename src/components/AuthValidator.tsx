"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notifications.store";

/**
 * AuthValidator - Componente que valida la sesión del usuario al cargar la aplicación
 *
 * Este componente:
 * 1. Verifica si el token almacenado en cookies es válido
 * 2. Si el token expiró o es inválido, limpia el estado y desloguea al usuario
 * 3. Evita que los usuarios vean una UI "logueada" con un token expirado
 * 4. Escucha errores 401 globalmente para desloguear automáticamente
 * 5. Valida la sesión cada 5 segundos cuando el usuario está autenticado
 */
export function AuthValidator() {
  const { isAuthenticated, logout, setLoading } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const pathname = usePathname();
  const router = useRouter();
  const hasValidated = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Listener global para detectar 401 en cualquier parte
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      console.warn(
        "[AuthValidator] 🚨 401 detectado globalmente, deslogueando...",
      );
      addNotification("Session expired. Please log in again.", "error");
      // Esperar 2 segundos para que el usuario vea la notificación
      setTimeout(() => {
        logout();
      }, 2000);
    };

    window.addEventListener("unauthorized" as any, handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized" as any, handleUnauthorized);
    };
  }, [logout, addNotification]);

  useEffect(() => {
    // No validar en rutas de autenticación
    const authPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
    ];
    if (authPaths.some((path) => pathname.startsWith(path))) {
      setLoading(false);
      return;
    }

    // Solo validar una vez cuando el componente se monta
    if (hasValidated.current) return;

    const validateSession = async () => {
      // Solo validar si el usuario parece estar autenticado según Zustand
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      // Esperar un momento para asegurar que las cookies estén seteadas
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        console.log("[AuthValidator] 🔍 Iniciando validación de sesión...");
        console.log("[AuthValidator] 📍 Ruta actual:", pathname);
        console.log("[AuthValidator] ✅ isAuthenticated:", isAuthenticated);

        const token = useAuthStore.getState().token;
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        console.log(
          "[AuthValidator] 📡 Respuesta del servidor:",
          response.status,
          response.statusText,
        );

        if (!response.ok) {
          // Token inválido o expirado
          console.warn(
            "[AuthValidator] ❌ Token inválido o expirado (status:",
            response.status,
            "), deslogueando...",
          );
          addNotification("Session expired. Please log in again.", "error");
          // Esperar 2 segundos para que el usuario vea la notificación
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await logout();
        } else {
          const data = await response.json();
          console.log(
            "[AuthValidator] ✅ Sesión válida. Usuario:",
            data.user?.correo || data.user?.id,
          );
        }
      } catch (error) {
        console.error("[AuthValidator] 💥 Error validando sesión:", error);
        // En caso de error de red, NO desloguear automáticamente
        // Solo desloguear si es un error 401
        console.log("[AuthValidator] ⚠️ Error de red, manteniendo sesión");
      } finally {
        setLoading(false);
        hasValidated.current = true;
      }
    };

    validateSession();
  }, [isAuthenticated, logout, setLoading, pathname, addNotification]);

  // Polling: Validar sesión cada 5 segundos cuando está autenticado
  useEffect(() => {
    // No hacer polling en rutas de autenticación
    const authPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
    ];
    if (authPaths.some((path) => pathname.startsWith(path))) {
      return;
    }

    // Solo hacer polling si está autenticado
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Función de validación silenciosa (sin logs excesivos)
    const validateSessionSilently = async () => {
      try {
        const token = useAuthStore.getState().token;
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
          console.warn(
            "[AuthValidator] 🔄 Polling detectó token expirado, deslogueando...",
          );
          addNotification("Session expired. Please log in again.", "error");
          // Esperar 2 segundos para que el usuario vea la notificación
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await logout();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (error) {
        // Error de red silencioso, no desloguear
        console.debug("[AuthValidator] 🔄 Polling - error de red ignorado");
      }
    };

    // Iniciar polling cada 5 segundos
    intervalRef.current = setInterval(validateSessionSilently, 5000);

    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, logout, pathname, addNotification]);

  // Este componente no renderiza nada
  return null;
}
