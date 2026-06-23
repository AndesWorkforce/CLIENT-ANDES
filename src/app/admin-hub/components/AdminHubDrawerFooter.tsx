interface AdminHubDrawerFooterProps {
  onCancel: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  cancelLabel?: string;
  cancelVariant?: "cancel" | "back";
  /** Estilo activo (teal). Inactivo: gris. El botón siempre permanece clickeable. */
  cancelActive?: boolean;
}

export default function AdminHubDrawerFooter({
  onCancel,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  cancelLabel = "Cancelar",
  cancelVariant = "cancel",
  cancelActive = false,
}: AdminHubDrawerFooterProps) {
  const cancelClass =
    cancelVariant === "back"
      ? cancelActive
        ? "border-[#0097B2] text-[#0097B2] hover:bg-[#F8FCFD]"
        : "border-[#707070] text-[#707070] hover:bg-white"
      : cancelActive
        ? "border-[#0097B2] text-[#0097B2] hover:bg-[#F8FCFD]"
        : "border-[#858585] text-[#858585] hover:bg-white";

  return (
    <footer className="shrink-0 border-t border-[#C8C8C8] bg-[#F8F8F8] px-8 py-7">
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className={`inline-flex h-9 items-center justify-center rounded-[8px] border bg-white px-[22px] text-[14px] font-medium leading-5 transition-colors ${cancelClass}`}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={primaryDisabled}
          onClick={onPrimary}
          className={`inline-flex h-9 items-center justify-center rounded-[8px] px-[22px] text-[14px] leading-5 transition-colors ${
            primaryDisabled
              ? "cursor-not-allowed bg-[#C8C8C8] text-[#707070]"
              : "bg-[#0097B2] text-white hover:bg-[#008099]"
          }`}
        >
          {primaryLabel}
        </button>
      </div>
    </footer>
  );
}
