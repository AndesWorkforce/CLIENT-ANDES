import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Acciones
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      setUser: (user) => set({ user }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setLoading: (status) => set({ isLoading: status }),
      logout: async () => {
        try {
          // Llamar a la API para eliminar las cookies desde el servidor
          await fetch("/api/auth/logout", {
            method: "GET",
            credentials: "include",
          });

          // Actualizar el estado local de Zustand
          set({ user: null, isAuthenticated: false });

          // Redirigir al home (opcional, esto puede manejarse en el componente)
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Error during logout:", error);
          // Si hay un error, intentamos limpiar el estado de Zustand de todos modos
          set({ user: null, isAuthenticated: false });
        }
      },
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-storage", // nombre para localStorage
      // Solo persistimos en el cliente estas propiedades
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
