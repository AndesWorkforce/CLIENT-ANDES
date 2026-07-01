import { useState, useEffect, useCallback } from "react";
import type { Alerta } from "../types/avisos.types";
import { alertsService, QueryAlertsParams } from "../services/alerts.service";

interface UseAlertsState {
  data: Alerta[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
}

interface UseAlertsReturn extends UseAlertsState {
  refetch: () => Promise<void>;
  updateEstado: (id: string, estado: string) => Promise<void>;
}

export function useAlerts(
  params?: QueryAlertsParams,
  autoFetch = true
): UseAlertsReturn {
  const [state, setState] = useState<UseAlertsState>({
    data: [],
    loading: true,
    error: null,
    isEmpty: false,
  });

  const fetchAlerts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await alertsService.getAll(params);
      setState({
        data,
        loading: false,
        error: null,
        isEmpty: data.length === 0,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar alertas";
      setState({
        data: [],
        loading: false,
        error: errorMessage,
        isEmpty: false,
      });
    }
  }, [params]);

  const updateEstado = useCallback(
    async (id: string, estado: string) => {
      try {
        await alertsService.updateEstado(id, estado);
        await fetchAlerts();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar estado de alerta";
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw err;
      }
    },
    [fetchAlerts]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchAlerts();
    }
  }, [autoFetch, fetchAlerts]);

  return {
    ...state,
    refetch: fetchAlerts,
    updateEstado,
  };
}

export function useAlertsPendientes(): UseAlertsReturn {
  const [state, setState] = useState<UseAlertsState>({
    data: [],
    loading: true,
    error: null,
    isEmpty: false,
  });

  const fetchAlerts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await alertsService.getPendientes();
      setState({
        data,
        loading: false,
        error: null,
        isEmpty: data.length === 0,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar alertas pendientes";
      setState({
        data: [],
        loading: false,
        error: errorMessage,
        isEmpty: false,
      });
    }
  }, []);

  const updateEstado = useCallback(
    async (id: string, estado: string) => {
      try {
        await alertsService.updateEstado(id, estado);
        await fetchAlerts();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar estado de alerta";
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw err;
      }
    },
    [fetchAlerts]
  );

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    ...state,
    refetch: fetchAlerts,
    updateEstado,
  };
}
