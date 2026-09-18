/**
 * Iniciales de un nombre, tomando las dos primeras palabras.
 *
 * Misma convención que los avatares del Admin Hub, así que "Maria Alejandra
 * Vargas" da "MA". Se usa donde el nombre completo no entra: en la tabla de
 * variables de nómina, la columna "Created by" con el nombre entero empujaba
 * el ancho y forzaba scroll lateral al 150% de zoom.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
