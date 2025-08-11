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
    console.log("[Axios] Interceptor de solicitud", token, zustandToken);
    if (token || zustandToken) {
      config.headers.Authorization = `Bearer ${token || zustandToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("[Axios] Interceptor de respuesta 401");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { axiosClient };
