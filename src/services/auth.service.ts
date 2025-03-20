import { useAuthStore} from "@/store/auth.store";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

// Funciones para el cliente
export const clientAuthService = {
  // Inicializar el estado del usuario desde las cookies al cargar la app
  initializeFromCookies: async (): Promise<void> => {
    try {
      // Obtenemos el token desde las cookies del navegador
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${AUTH_COOKIE}=`))
        ?.split("=")[1];

      if (!token) {
        useAuthStore.getState().setAuthenticated(false);
        useAuthStore.getState().setLoading(false);
        return;
      }

      // Obtenemos info básica del usuario desde la cookie
      const userInfoCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${USER_INFO_COOKIE}=`))
        ?.split("=")[1];

      if (userInfoCookie) {
        try {
          const userInfo = JSON.parse(decodeURIComponent(userInfoCookie));
          useAuthStore.getState().setUser(userInfo);
          useAuthStore.getState().setAuthenticated(true);
        } catch (e) {
          console.error("Error parsing user info from cookie", e);
        }
      }

      useAuthStore.getState().setLoading(false);
    } catch (error) {
      console.error("Error initializing auth state", error);
      useAuthStore.getState().setLoading(false);
    }
  },

  // Limpiar cookies al cerrar sesión (lado cliente)
  logout: (): void => {
    document.cookie = `${AUTH_COOKIE}=; max-age=0; path=/;`;
    document.cookie = `${USER_INFO_COOKIE}=; max-age=0; path=/;`;
    useAuthStore.getState().logout();
  },
};

// Nota: Para el lado del servidor, usaremos middleware y server actions
// directamente, en lugar de funciones auxiliares que podrían causar problemas
// con las APIs de cookies en Next.js
