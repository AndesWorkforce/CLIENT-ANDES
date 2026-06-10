/** Barra de búsqueda y botón "Filtros" (altura original) */
export const ADMIN_HUB_TOOLBAR_CONTROL_HEIGHT = "h-10";

export const ADMIN_HUB_TOOLBAR_CONTROL_CLASS = `${ADMIN_HUB_TOOLBAR_CONTROL_HEIGHT} rounded-[8px] border border-[#C8C8C8] bg-white text-[14px] focus:outline-none focus:ring-1 focus:ring-[#0097B2]`;

export const ADMIN_HUB_SEARCH_INPUT_CLASS = `${ADMIN_HUB_TOOLBAR_CONTROL_CLASS} w-full pl-11 pr-4 font-medium text-[#525252] placeholder:text-[#C8C8C8] [&::-ms-clear]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden`;

export const ADMIN_HUB_FILTER_BUTTON_CLASS = `inline-flex ${ADMIN_HUB_TOOLBAR_CONTROL_HEIGHT} items-center gap-1.5 rounded-[8px] border bg-white px-4 text-[14px] font-medium transition-colors`;

/** Fila de filtros (Filtrar por Cliente, etc.) — sin overflow para no recortar el dropdown */
export const ADMIN_HUB_FILTERS_ROW_CLASS = "flex flex-wrap items-center gap-4";

export const ADMIN_HUB_CLEAR_FILTERS_CLASS =
  "shrink-0 text-[14px] leading-[1.1] tracking-[0.28px] transition-colors";
