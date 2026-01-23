import axios from "axios";
import { cookies } from "next/headers";

// Obtener la URL base de la API
function getApiUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/";
  let url = rawUrl.trim();
  if (!url.endsWith("/")) url = url + "/";
  if (!url.toLowerCase().includes("/api/")) {
    url = url + (url.endsWith("/") ? "" : "/") + "api/";
    url = url.replace(/([^:]\/)\/+/g, "$1");
  }
  return url;
}

export async function createServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const activeCompanyId = cookieStore.get("active_company_id")?.value;

  // Crear una nueva instancia de axios para cada llamada
  // Esto evita que los interceptores se acumulen
  const axiosServer = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
  });

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
      // Para errores 401, simplemente rechazar la promesa
      // El código que llama debe manejar el error 401 apropiadamente
      // No intentamos modificar cookies o hacer redirect aquí porque
      // el interceptor puede ejecutarse fuera del contexto de Server Actions
      if (
        error.response?.status === 401 &&
        !error.config?.url?.includes("auth/login")
      ) {
        console.log("[Axios] Interceptor de respuesta 401 - Error de autenticación");
        // Simplemente rechazar la promesa con el error original
        // El código que llama debe manejar este error
      }
      return Promise.reject(error);
    }
  );

  return axiosServer;
}
