import { redirect } from "next/navigation";
import { axiosBase } from "./axios.instance";
import { cookies } from "next/headers";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

export async function createServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const axiosServer = axiosBase;

  if (token) {
    axiosServer.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  axiosServer.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.log("[Axios] Interceptor de respuesta 401");

        // Eliminar las cookies usando el método delete
        cookieStore.delete(AUTH_COOKIE);
        cookieStore.delete(USER_INFO_COOKIE);

        // Redirigir a la página de logout forzado
        // La redirección se ejecutará después de que la acción del servidor termine
        redirect("/auth/forced-logout?reason=session_expired");
      }
      return Promise.reject(error);
    }
  );

  return axiosServer;
}
