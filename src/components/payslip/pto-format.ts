/**
 * Formato de días de PTO, compartido por la vista del contratista y la de
 * administración para que el mismo saldo se lea igual en las dos.
 *
 * Sigue el diseño del desprendible, que muestra la celda PTO BALANCE como
 * "8D". El devengo es de 1,25 días por mes, así que los decimales son parte
 * normal del saldo y no se redondean a entero: mostrar "3D" cuando hay 3,75
 * le estaría escondiendo casi un día al contratista.
 */
export function formatPtoDias(dias: number): string {
  if (!Number.isFinite(dias)) return "—";

  // Sin ceros de relleno: 5 → "5D", 3,75 → "3.75D", −1,5 → "−1.5D".
  const abs = Math.abs(dias);
  const texto = Number.isInteger(abs) ? String(abs) : String(Number(abs.toFixed(2)));
  const signo = dias < 0 ? "−" : "";

  return `${signo}${texto}D`;
}

/** Etiqueta larga para la sección dedicada: "3.75 días". */
export function formatPtoDiasLargo(dias: number): string {
  if (!Number.isFinite(dias)) return "—";

  const abs = Math.abs(dias);
  const texto = Number.isInteger(abs) ? String(abs) : String(Number(abs.toFixed(2)));
  const signo = dias < 0 ? "−" : "";
  const unidad = abs === 1 ? "día" : "días";

  return `${signo}${texto} ${unidad}`;
}
