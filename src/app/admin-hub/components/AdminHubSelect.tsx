"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ChevronDown, CircleX } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

export interface AdminHubSelectOption {
  value: string;
  label: string;
}

interface AdminHubSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: AdminHubSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Campo de formulario (50px) o filtro con label (40px) / compacto (36px) */
  variant?: "form" | "filter";
  label?: string;
  required?: boolean;
  /** Fondo detrás del label flotante */
  labelBackground?: string;
  className?: string;
  menuClassName?: string;
  id?: string;
  /** Filtros con label: circle-x para limpiar cuando hay valor (Figma) */
  clearable?: boolean;
}

const MENU_PANEL_CLASS =
  "absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-[7px] border border-[#C8C8C8] bg-white py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]";

const MENU_LIST_CLASS = "max-h-[240px] overflow-y-auto overscroll-contain";

export default function AdminHubSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  disabled = false,
  variant = "form",
  label,
  labelBackground = "#FFFFFF",
  required = false,
  className = "",
  menuClassName = "",
  id: idProp,
  clearable = false,
}: AdminHubSelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);
  useOutsideClick(containerRef, close, isOpen);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const hasValue = Boolean(selectedOption);

  const isForm = variant === "form";
  const isFilterWithLabel = !isForm && Boolean(label);
  const isCompactFilter = !label && variant === "filter";
  const showFilterClear = clearable && isFilterWithLabel && hasValue && !disabled;

  const triggerClass = isForm
    ? `flex h-[50px] w-full items-center rounded-[8px] border border-[#EFEFEF] bg-white px-4 pr-10 text-left text-[14px] leading-[1.3] tracking-[0.28px] focus:outline-none focus:ring-1 focus:ring-[#0097B2] ${
        hasValue ? "text-[#343434]" : "text-[#C8C8C8]"
      }`
    : `${
        isCompactFilter ? "inline-flex min-w-[200px]" : "flex w-full"
      } ${isCompactFilter ? "h-10" : "h-11"} items-center rounded-[8px] border border-[#C8C8C8] bg-white pl-[22px] pr-10 text-left text-[14px] leading-none focus:outline-none focus:ring-1 focus:ring-[#0097B2] ${
        hasValue ? "text-[#525252]" : "text-[#C8C8C8]"
      }`;

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
  }

  function handleTriggerClick() {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation();
    onChange("");
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  const containerClass = label
    ? "relative w-full"
    : `relative ${isCompactFilter ? "w-fit self-start" : "w-full"} ${className}`;

  const selectControl = (
    <div ref={containerRef} className={containerClass}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        className={`${triggerClass} ${
          disabled ? "cursor-not-allowed bg-[#F8F8F8] text-[#525252]" : "cursor-pointer"
        } ${isOpen && !disabled ? "ring-1 ring-[#0097B2]" : ""}`}
      >
        <span className="min-w-0 truncate">{displayLabel}</span>
      </button>
      {showFilterClear ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-[11px] top-1/2 z-10 -translate-y-1/2 rounded p-0 text-[#707070] transition-colors hover:text-[#0097B2]"
          aria-label={label ? `Limpiar ${label}` : "Limpiar filtro"}
        >
          <CircleX size={18} strokeWidth={1.75} />
        </button>
      ) : (
        <ChevronDown
          size={18}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#707070] transition-transform ${
            isForm ? "right-4" : "right-3"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      )}

      {isOpen && !disabled && (
        <div className={`${MENU_PANEL_CLASS} ${menuClassName}`} role="listbox">
          <ul className={MENU_LIST_CLASS}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full px-1.5 py-0.5 text-left transition-colors ${
                      isSelected ? "bg-[#F5FAFB]" : "hover:bg-[#F5FAFB]"
                    }`}
                  >
                    <span
                      className={`block w-full rounded-[6px] px-2 py-2.5 text-[14px] whitespace-nowrap ${
                        isSelected
                          ? "font-medium leading-[1.2] text-[#0097B2]"
                          : "font-normal leading-[1.3] tracking-[0.28px] text-[#525252]"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );

  if (!label) {
    return selectControl;
  }

  return (
    <div className={`relative w-full pt-2 ${className}`}>
      <label
        htmlFor={id}
        className="absolute left-3 top-0 z-10 px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]"
        style={{ backgroundColor: labelBackground }}
      >
        {label}
        {required && "*"}
      </label>
      {selectControl}
    </div>
  );
}
