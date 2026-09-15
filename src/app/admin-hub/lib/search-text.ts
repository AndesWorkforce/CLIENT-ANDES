/**
 * Normaliza texto para búsquedas del Admin Hub: ignora mayúsculas, acentos y
 * diferencias entre espacios consecutivos.
 */
export function normalizeSearchText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function includesSearchText(value: unknown, normalizedQuery: string): boolean {
  return normalizeSearchText(value).includes(normalizedQuery);
}
