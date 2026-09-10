export type HistorialCampoCambio = {
  campo: string;
  de: unknown;
  a: unknown;
};

function serialize(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function isDeA(value: unknown): value is { de?: unknown; a?: unknown } {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("de" in value || "a" in value)
  );
}

function isAntesDespues(
  value: unknown,
): value is { antes?: unknown; despues?: unknown } {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("antes" in value || "despues" in value)
  );
}

export function flattenHistorialCambios(cambios: unknown): HistorialCampoCambio[] {
  if (!cambios || typeof cambios !== "object" || Array.isArray(cambios)) {
    return [];
  }

  return Object.entries(cambios as Record<string, unknown>).map(([campo, value]) => {
    if (isDeA(value)) {
      return { campo, de: value.de ?? null, a: value.a ?? null };
    }
    if (isAntesDespues(value)) {
      return { campo, de: value.antes ?? null, a: value.despues ?? null };
    }
    return { campo, de: null, a: value };
  });
}

export function formatHistorialCambios(cambios: unknown): string {
  const items = flattenHistorialCambios(cambios);
  if (items.length === 0) return "—";
  return items
    .map((item) => `${item.campo}: ${serialize(item.de)} → ${serialize(item.a)}`)
    .join("; ");
}
