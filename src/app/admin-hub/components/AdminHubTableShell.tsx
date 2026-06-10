import type { ReactNode } from "react";

interface AdminHubTableShellProps {
  children: ReactNode;
  /** standalone: borde y esquinas (listados). nested: solo scroll dentro de secciones colapsables */
  variant?: "standalone" | "nested";
}

export const ADMIN_HUB_TABLE_HEAD_FIRST_CELL =
  "w-16 rounded-tl-[12px] px-6 py-5 text-left";

export const ADMIN_HUB_TABLE_HEAD_LAST_CELL = "w-[70px] rounded-tr-[12px] px-3 py-5";

export const ADMIN_HUB_TABLE_ROW =
  "border-b border-[#EFEFEF] hover:bg-[#FAFAFA] transition-colors";

/** Columna Cliente en tablas de nóminas (ancho mínimo, el resto sigue siendo automático) */
export const ADMIN_HUB_TABLE_CLIENT_COLUMN_CLASS = "min-w-[120px]";

export default function AdminHubTableShell({
  children,
  variant = "standalone",
}: AdminHubTableShellProps) {
  const base = "w-full overflow-x-auto overflow-y-visible";
  const standalone = "rounded-[12px] border border-[#EFEFEF]";

  return (
    <div className={variant === "standalone" ? `${base} ${standalone}` : base}>
      {children}
    </div>
  );
}
