"use client";

import { t } from "../../i18n";

interface CountryStatusBadgeProps {
  active: boolean;
}

export default function CountryStatusBadge({ active }: CountryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[12px] px-2 py-[5px] text-[12px] font-semibold leading-[1.3] ${
        active ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#DDE2FF] text-[#4356A6]"
      }`}
    >
      {active ? t("configuracion.countryActive") : t("configuracion.countryPending")}
    </span>
  );
}
