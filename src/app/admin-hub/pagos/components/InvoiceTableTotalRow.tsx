import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoiceTableTotalRowProps {
  /** Columnas vacías entre la etiqueta "Total" y el monto */
  emptyColumnsBeforeAmount: number;
  /** Columnas vacías después del badge de estado (p. ej. Creado por + acciones) */
  emptyColumnsAfterStatus: number;
  subtotal: string;
  subtotalIsNegative?: boolean;
}

export default function InvoiceTableTotalRow({
  emptyColumnsBeforeAmount,
  emptyColumnsAfterStatus,
  subtotal,
  subtotalIsNegative = false,
}: InvoiceTableTotalRowProps) {
  return (
    <tr className="border-t border-[#EFEFEF]">
      <td className="px-6 py-6" />
      <td className="px-3 py-6">
        <span className="text-[16.8px] font-semibold text-[#525252]">Total</span>
      </td>
      {Array.from({ length: emptyColumnsBeforeAmount }).map((_, index) => (
        <td key={`empty-before-${index}`} className="px-3 py-6" />
      ))}
      <td
        className={`px-3 py-6 text-[16.8px] font-semibold ${
          subtotalIsNegative ? "text-[#E33434]" : "text-[#525252]"
        }`}
      >
        {subtotal}
      </td>
      <td className="px-3 py-6">
        <InvoiceStatusBadge status="Pendiente" enlarged />
      </td>
      {Array.from({ length: emptyColumnsAfterStatus }).map((_, index) => (
        <td key={`empty-after-${index}`} className="px-3 py-6" />
      ))}
    </tr>
  );
}
