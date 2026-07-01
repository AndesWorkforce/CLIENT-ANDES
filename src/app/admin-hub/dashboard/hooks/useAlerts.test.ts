import { renderHook, waitFor } from "@testing-library/react";
import { useAlerts, useAlertsPendientes } from "./useAlerts";
import { alertsService } from "../services/alerts.service";
import { EstadoAlerta, PrioridadAlerta, TipoAlerta } from "../types/avisos.types";

jest.mock("../services/alerts.service");

const mockAlerta = {
  id: "test-id",
  tipo: TipoAlerta.NOMINA_PENDIENTE,
  estado: EstadoAlerta.PENDIENTE,
  prioridad: PrioridadAlerta.MEDIA,
  titulo: "Test Alert",
  descripcion: "Test Description",
  creadoEn: new Date().toISOString(),
};

describe("useAlerts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch alerts on mount when autoFetch is true", async () => {
    const mockAlertas = [mockAlerta];
    (alertsService.getAll as jest.Mock).mockResolvedValue(mockAlertas);

    const { result } = renderHook(() => useAlerts(undefined, true));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockAlertas);
    expect(result.current.error).toBeNull();
    expect(result.current.isEmpty).toBe(false);
  });

  it("should not fetch alerts when autoFetch is false", () => {
    const { result } = renderHook(() => useAlerts(undefined, false));

    expect(alertsService.getAll).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
  });

  it("should handle empty state", async () => {
    (alertsService.getAll as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useAlerts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });

  it("should handle error state", async () => {
    const errorMessage = "Network error";
    (alertsService.getAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useAlerts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isEmpty).toBe(false);
  });

  it("should refetch data when refetch is called", async () => {
    const mockAlertas = [mockAlerta];
    (alertsService.getAll as jest.Mock).mockResolvedValue(mockAlertas);

    const { result } = renderHook(() => useAlerts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(alertsService.getAll).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    await waitFor(() => {
      expect(alertsService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  it("should update estado and refetch", async () => {
    const mockAlertas = [mockAlerta];
    (alertsService.getAll as jest.Mock).mockResolvedValue(mockAlertas);
    (alertsService.updateEstado as jest.Mock).mockResolvedValue({
      ...mockAlerta,
      estado: EstadoAlerta.RESUELTO,
    });

    const { result } = renderHook(() => useAlerts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.updateEstado("test-id", EstadoAlerta.RESUELTO);

    expect(alertsService.updateEstado).toHaveBeenCalledWith(
      "test-id",
      EstadoAlerta.RESUELTO
    );

    await waitFor(() => {
      expect(alertsService.getAll).toHaveBeenCalledTimes(2);
    });
  });
});

describe("useAlertsPendientes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch only pending alerts", async () => {
    const mockAlertas = [mockAlerta];
    (alertsService.getPendientes as jest.Mock).mockResolvedValue(mockAlertas);

    const { result } = renderHook(() => useAlertsPendientes());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockAlertas);
    expect(alertsService.getPendientes).toHaveBeenCalledTimes(1);
  });

  it("should handle error when fetching pending alerts", async () => {
    const errorMessage = "Error al cargar alertas pendientes";
    (alertsService.getPendientes as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useAlertsPendientes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });
});
