"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import AdminHubTableShell, { ADMIN_HUB_TABLE_ROW } from "../../components/AdminHubTableShell";
import { t } from "../../i18n";
import type { CountryConfig } from "../actions/countries.actions";
import { formatCountryRate } from "../lib/format-country-rate";
import CountryStatusBadge from "./CountryStatusBadge";

const MENU_MIN_WIDTH = 148;

type MenuPosition = { top: number; left: number };

interface CountriesTableProps {
  countries: CountryConfig[];
  loading: boolean;
  onEdit: (country: CountryConfig) => void;
  onToggleStatus: (country: CountryConfig) => void;
}

export default function CountriesTable({
  countries,
  loading,
  onEdit,
  onToggleStatus,
}: CountriesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updateMenuPosition = useCallback((countryCode: string) => {
    const button = menuButtonRefs.current[countryCode];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - MENU_MIN_WIDTH),
    });
  }, []);

  useEffect(() => {
    if (!openMenuId) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-country-row-menu]")) {
        setOpenMenuId(null);
      }
    }

    const handleReposition = () => updateMenuPosition(openMenuId);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [openMenuId, updateMenuPosition]);

  function toggleRowMenu(countryCode: string) {
    setOpenMenuId((prev) => {
      const next = prev === countryCode ? null : countryCode;
      if (next) updateMenuPosition(next);
      return next;
    });
  }

  const openCountry = countries.find((country) => country.codigo === openMenuId);
  const headClass = "px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]";
  const cellClass = "whitespace-nowrap px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]";

  return (
    <AdminHubTableShell variant="nested">
      <table className="w-full min-w-[1120px] border-collapse bg-white">
        <thead>
          <tr className="border-b border-[#EFEFEF]">
            <th className={headClass}>{t("configuracion.countryFields.country")}</th>
            <th className={headClass}>{t("configuracion.countryFields.status")}</th>
            <th className={headClass}>{t("configuracion.countryFields.nationalHourlyRate")}</th>
            <th className={headClass}>{t("configuracion.countryFields.workingDaysShort")}</th>
            <th className={headClass}>{t("configuracion.countryFields.holidayRate")}</th>
            <th className={headClass}>{t("configuracion.countryFields.weekdayOvertime")}</th>
            <th className={headClass}>{t("configuracion.countryFields.saturdayOvertime")}</th>
            <th className={headClass}>{t("configuracion.countryFields.sundayOvertime")}</th>
            <th className="w-[70px] px-6 py-5" />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-[#EFEFEF]">
                {Array.from({ length: 9 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-6">
                    <div className="h-4 animate-pulse rounded bg-[#EFEFEF]" />
                  </td>
                ))}
              </tr>
            ))
          ) : countries.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-12 text-center text-[14px] text-[#858585]">
                {t("configuracion.noCountries")}
              </td>
            </tr>
          ) : (
            countries.map((country) => (
              <tr key={country.codigo} className={ADMIN_HUB_TABLE_ROW}>
                <td className={cellClass}>{country.nombre}</td>
                <td className="px-3 py-6">
                  <CountryStatusBadge active={country.activo} />
                </td>
                <td className={cellClass}>{formatCountryRate(country.tarifaHrNacional)}</td>
                <td className={cellClass}>{country.diasLaboralesMes}</td>
                <td className={cellClass}>{formatCountryRate(country.tarifaFestivo)}</td>
                <td className={cellClass}>{formatCountryRate(country.tarifaOTDiaSemana)}</td>
                <td className={cellClass}>{formatCountryRate(country.tarifaOTSabado)}</td>
                <td className={cellClass}>{formatCountryRate(country.tarifaOTDomingo)}</td>
                <td className="px-6 py-6 text-center">
                  <div className="relative inline-block" data-country-row-menu>
                    <button
                      type="button"
                      aria-label={t("common.moreOptions")}
                      aria-expanded={openMenuId === country.codigo}
                      aria-haspopup="menu"
                      ref={(node) => {
                        menuButtonRefs.current[country.codigo] = node;
                      }}
                      onClick={() => toggleRowMenu(country.codigo)}
                      className={`rounded p-1 transition-colors ${
                        openMenuId === country.codigo
                          ? "bg-[#DFFAFF] text-[#0097B2]"
                          : "text-[#858585] hover:text-[#0097B2]"
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {openCountry && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              data-country-row-menu
              role="menu"
              style={{ top: menuPosition.top, left: menuPosition.left, minWidth: MENU_MIN_WIDTH }}
              className="fixed z-[80] rounded-[8px] border border-[#EFEFEF] bg-white py-1 shadow-[0px_2px_8px_rgba(112,112,112,0.15)]"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpenMenuId(null);
                  onEdit(openCountry);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F8F8F8]"
              >
                {t("common.edit")}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpenMenuId(null);
                  onToggleStatus(openCountry);
                }}
                className="flex w-full items-center px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F8F8F8]"
              >
                {openCountry.activo
                  ? t("configuracion.deactivateCountry")
                  : t("configuracion.activateCountry")}
              </button>
            </div>,
            document.body,
          )
        : null}
    </AdminHubTableShell>
  );
}
