import { redirect } from "next/navigation";
import { axiosBase } from "./axios.instance";
import { cookies } from "next/headers";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

export async function createServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const activeCompanyId = cookieStore.get("active_company_id")?.value;

  const axiosServer = axiosBase;

  if (token) {
    axiosServer.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Persist selected company context across all backend requests
  if (activeCompanyId) {
    axiosServer.defaults.headers.common["x-company-id"] = activeCompanyId;
  } else {
    // Ensure header is not leaked between requests
    delete axiosServer.defaults.headers.common["x-company-id"];
  }

  axiosServer.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Ignorar los errores 401 en la ruta de login
      if (
        error.response?.status === 401 &&
        !error.config?.url?.includes("auth/login")
      ) {
        console.log("[Axios] Interceptor de respuesta 401");

        // Eliminar las cookies usando el método delete
        try {
          cookieStore.delete(AUTH_COOKIE);
          cookieStore.delete(USER_INFO_COOKIE);

          // Redirigir a la página de logout forzado con los parámetros correctos
          const currentPath = error.config?.url || "/";
          redirect(
            `/auth/forced-logout?reason=session_expired&callbackUrl=${encodeURIComponent(
              currentPath
            )}`
          );
        } catch (redirectError) {
          console.error("[Axios] Error en la redirección:", redirectError);
          // Este bloque catch asegura que el error de redirección sea manejado correctamente
          // y no interrumpa el flujo normal si algo falla
          throw error; // Mantener el error original para que el código que llamó pueda manejarlo
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosServer;
}
