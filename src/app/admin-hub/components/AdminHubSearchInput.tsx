"use client";

import { Search } from "lucide-react";
import { ADMIN_HUB_SEARCH_INPUT_CLASS } from "./admin-hub-filter-styles";
import { t } from "../i18n";

interface AdminHubSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AdminHubSearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: AdminHubSearchInputProps) {
  const resolvedPlaceholder = placeholder ?? t("common.search");
  return (
    <div className={`relative w-full max-w-[320px] ${className}`}>
      <Search
        size={21}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C8C8C8]"
      />
      <input
        type="text"
        inputMode="search"
        autoComplete="off"
        aria-label={resolvedPlaceholder}
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={ADMIN_HUB_SEARCH_INPUT_CLASS}
      />
    </div>
  );
}
