"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminHubFormField from "../../components/AdminHubFormField";
import useOutsideClick from "@/hooks/useOutsideClick";
import { t } from "../../i18n";
import { getWorldCountries } from "../actions/world-countries.actions";
import {
  filterWorldCountries,
  type WorldCountry,
} from "../lib/world-countries";

interface CountryNameSuggestFieldProps {
  value: string;
  excludedCodes: Set<string>;
  onChange: (value: string) => void;
  onSelect: (country: WorldCountry) => void;
}

export default function CountryNameSuggestField({
  value,
  excludedCodes,
  onChange,
  onSelect,
}: CountryNameSuggestFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [catalog, setCatalog] = useState<WorldCountry[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void getWorldCountries().then((result) => {
      if (!cancelled) setCatalog(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = useMemo(
    () => filterWorldCountries(catalog, value, excludedCodes),
    [catalog, excludedCodes, value],
  );

  const showList = open && value.trim().length > 0 && suggestions.length > 0;

  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(containerRef, close, showList);

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  function handleSelect(country: WorldCountry) {
    onSelect(country);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) handleSelect(selected);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <AdminHubFormField
        type="input"
        label={t("configuracion.countryFields.country")}
        value={value}
        onChange={(next) => {
          onChange(next);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={t("configuracion.countryNamePlaceholder")}
        autoComplete="off"
      />

      {showList && (
        <ul
          role="listbox"
          className="mt-1 max-h-[240px] overflow-y-auto rounded-[7px] border border-[#C8C8C8] bg-white py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          {suggestions.map((country, index) => {
            const active = index === activeIndex;
            return (
              <li key={`${country.code}-${country.name}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] leading-[1.3] tracking-[0.28px] ${
                    active ? "bg-[#F4FBFC] text-[#0097B2]" : "text-[#343434] hover:bg-[#F8F8F8]"
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(country)}
                >
                  <span className="truncate">{country.name}</span>
                  <span className="shrink-0 text-[12px] font-medium text-[#858585]">{country.code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
