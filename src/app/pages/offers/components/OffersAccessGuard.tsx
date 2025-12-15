"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { checkUserContractStatus } from "../actions/user-status.actions";
import { UserContractStatus } from "../actions/user-status.actions";

export interface AccessControlState {
  isAuthenticated: boolean;
  hasActiveContract: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  contractDetails?: {
    id: string;
    estadoContratacion: string;
    puestoTrabajo: string;
    activo: boolean;
  };
}

const AccessControlContext = createContext<AccessControlState | null>(null);

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error("useAccessControl must be used within OffersAccessGuard");
  }
  return context;
};

interface OffersAccessGuardProps {
  children: React.ReactNode;
}

const OffersAccessGuard: React.FC<OffersAccessGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [contractStatus, setContractStatus] =
    useState<UserContractStatus | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      // Si no está autenticado
      if (!isAuthenticated || !user) {
        setIsCheckingAccess(false);
        return;
      }

      // Si es admin o empleado admin, permitir acceso
      if (user.rol.includes("ADMIN") || user.rol.includes("EMPLEADO_ADMIN")) {
        setIsCheckingAccess(false);
        return;
      }

      // Verificar si el usuario tiene un contrato activo
      try {
        const result = await checkUserContractStatus();
        if (result.success && result.data) {
          setContractStatus(result.data);
        }
      } catch (error) {
        console.error("Error checking contract status:", error);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, user]);

  // Función para obtener el estado de control de acceso
  const getAccessControlState = (): AccessControlState => {
    return {
      isAuthenticated: isAuthenticated && !!user,
      hasActiveContract: contractStatus?.hasActiveContract || false,
      isAdmin:
        user?.rol.includes("ADMIN") ||
        user?.rol.includes("EMPLEADO_ADMIN") ||
        false,
      isLoading: isCheckingAccess,
      contractDetails: contractStatus?.contractDetails,
    };
  };

  // Pantalla de carga
  if (isCheckingAccess) {
    return (
      <div className="container mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0097B2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offers...</p>
        </div>
      </div>
    );
  }

  // Usuario con contrato activo - bloquear acceso completo
  if (contractStatus?.hasActiveContract) {
    return (
      <div className="container mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-[#0097B2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contract in Progress
              </h2>
              <p className="text-gray-600 mb-6">
                You currently have an active contract for the position{" "}
                <span className="font-semibold">
                  {contractStatus.contractDetails?.puestoTrabajo}
                </span>
                . You cannot view or apply to new job offers while you have an
                active contract.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/currentApplication")}
                  className="w-full bg-[#0097B2] text-white py-3 px-4 rounded-md font-medium hover:bg-[#007A8F] transition-colors cursor-pointer"
                >
                  View Current Contract
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-white text-[#0097B2] py-3 px-4 rounded-md font-medium border border-[#0097B2] hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Go to Home
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Once your current contract is completed, you will be able to
                  view and apply to new job offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Proveer el contexto de control de acceso a los componentes hijos
  return (
    <AccessControlContext.Provider value={getAccessControlState()}>
      {children}
    </AccessControlContext.Provider>
  );
};

export default OffersAccessGuard;
