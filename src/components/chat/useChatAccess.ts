"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { checkUserContractStatus } from "@/app/pages/offers/actions/user-status.actions";

export function useChatAccess() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      if (authLoading) {
        return;
      }

      if (!isAuthenticated || !user) {
        if (!cancelled) {
          setHasAccess(false);
          setIsChecking(false);
        }
        return;
      }

      // TEMPORAL: Permitir acceso al chat sin verificar contrato activo (solo para testing)
      // TODO: Restaurar verificación de contrato antes de producción
      if (!cancelled) {
        setHasAccess(true);
        setIsChecking(false);
      }

      // Código original comentado para referencia:
      // setIsChecking(true);
      // try {
      //   const result = await checkUserContractStatus();
      //   if (!cancelled) {
      //     setHasAccess(
      //       result.success === true &&
      //         result.data?.hasActiveContract === true,
      //     );
      //   }
      // } catch {
      //   if (!cancelled) {
      //     setHasAccess(false);
      //   }
      // } finally {
      //   if (!cancelled) {
      //     setIsChecking(false);
      //   }
      // }
    }

    verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, user?.id]);

  return {
    hasAccess,
    isLoading: authLoading || isChecking,
    user: hasAccess ? user : null,
  };
}
