"use client";
import { axiosBase } from "./axios.instance";
import { useAuthStore } from "@/store/auth.store";

const axiosClient = axiosBase;

axiosClient.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];
    const zustandToken = useAuthStore.getState().token;
    const effectiveToken = token || zustandToken || "";

    console.log("[Axios] Interceptor de solicitud", token, zustandToken);

    if (effectiveToken) {
      config.headers.Authorization = `Bearer ${effectiveToken}`;

      try {
        const parts = effectiveToken.split(".");
        if (parts.length === 3) {
          const payloadB64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");
          const payloadJson = JSON.parse(
            atob(payloadB64)
          ) as Record<string, unknown>;
          console.log("[Axios] JWT payload:", payloadJson);
        } else {
          console.warn(
            "[Axios] Token no parece un JWT estándar (no tiene 3 partes).",
          );
        }
      } catch (e) {
        console.warn("[Axios] No se pudo decodificar el JWT", e);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log(
        "[Axios] Interceptor de respuesta 401 - Token expirado o inválido",
      );

      // Limpiar el store de Zustand
      useAuthStore.getState().logout();

      // Mostrar mensaje al usuario
      if (typeof window !== "undefined") {
        // Opcional: podrías agregar un toast aquí
        console.warn(
          "[Axios] Sesión expirada. Por favor, inicie sesión nuevamente.",
        );
      }
    }
    return Promise.reject(error);
  },
);

export { axiosClient };
