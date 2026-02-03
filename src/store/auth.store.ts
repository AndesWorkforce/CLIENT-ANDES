import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Empresa {
  id: string;
  nombre: string;
}

interface EmpleadoEmpresa {
  id: string;
  rol: string;
  empresa: Empresa;
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  token: string;
  empresaId?: string; // ID de la empresa si el usuario es una empresa
  empleadoEmpresa?: EmpleadoEmpresa;
  pais?: string;
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
      onRehydrateStorage: (state) => {
        // Siempre marcar como no cargando después de la rehidratación
        // Usar setTimeout para asegurar que el store esté completamente inicializado
        if (typeof window !== "undefined") {
          setTimeout(() => {
            try {
              const store = useAuthStore.getState();
              if (store && typeof store.setLoading === "function") {
                store.setLoading(false);
              }
              
              // Verificar cookies del servidor si el store está vacío
              if (state && (!state.user || !state.isAuthenticated)) {
                try {
                  const raw = document.cookie
                    .split("; ")
                    .find((c) => c.startsWith("user_info="));
                  
                  if (raw) {
                    const value = raw.split("=")[1];
                    if (value) {
                      const decoded = decodeURIComponent(value);
                      const cookieUser = JSON.parse(decoded);
                      
                      if (cookieUser && cookieUser.id && store && typeof store.setUser === "function") {
                        // Hidratar desde cookie si el store está vacío
                        store.setUser(cookieUser);
                        store.setAuthenticated(true);
                        console.log("[AuthStore] Hidratado desde cookie durante rehydrate");
                      }
                    }
                  }
                } catch (error) {
                  console.warn("[AuthStore] Error verificando cookies durante rehydrate:", error);
                }
              }
            } catch (error) {
              console.warn("[AuthStore] Error en onRehydrateStorage:", error);
            }
          }, 0);
        }
      },
    }
  )
);
