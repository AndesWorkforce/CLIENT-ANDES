"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
function formatTriggerDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}.${m}.${y.slice(-2)}`;
}

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

interface AdminHubDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  confirmLabel?: string;
}

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function capitalizeMonthLabel(label: string): string {
  if (!label) return label;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getMonthLabel(date: Date): string {
  return capitalizeMonthLabel(
    date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
  );
}

function getCalendarDays(viewMonth: Date): Date[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isDateDisabled(date: Date, minDate?: string, maxDate?: string): boolean {
  const day = startOfDay(date).getTime();
  const min = minDate ? startOfDay(parseIsoDate(minDate)!).getTime() : null;
  const max = maxDate ? startOfDay(parseIsoDate(maxDate)!).getTime() : null;
  if (min !== null && day < min) return true;
  if (max !== null && day > max) return true;
  return false;
}

function clampIsoDate(iso: string, minDate?: string, maxDate?: string): string {
  let result = iso;
  if (minDate && result < minDate) result = minDate;
  if (maxDate && result > maxDate) result = maxDate;
  return result;
}

type PanelPosition = { top: number; left: number };

export default function AdminHubDatePicker({
  label,
  value,
  onChange,
  placeholder = "Fecha",
  required = true,
  disabled = false,
  minDate,
  maxDate,
  confirmLabel = "Aplicar",
}: AdminHubDatePickerProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() => parseIsoDate(value) ?? new Date());
  const [draftDate, setDraftDate] = useState<Date | null>(() => parseIsoDate(value));
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);

  const selectedDate = parseIsoDate(value);
  const displayValue = value ? formatTriggerDate(value) : "";

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelWidth = 332;
    const left = Math.min(
      Math.max(8, rect.left),
      window.innerWidth - panelWidth - 8
    );

    setPanelPosition({
      top: rect.bottom + 8,
      left,
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPanelPosition(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        target.closest("[data-admin-hub-date-picker-trigger]") ||
        target.closest("[data-admin-hub-date-picker-panel]")
      ) {
        return;
      }
      close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();
    const handleReposition = () => updatePanelPosition();

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, updatePanelPosition]);

  function openPicker() {
    if (disabled) return;
    const clampedValue =
      value && (minDate || maxDate) ? clampIsoDate(value, minDate, maxDate) : value;
    const initial = parseIsoDate(clampedValue ?? "") ?? new Date();
    setViewMonth(initial);
    setDraftDate(clampedValue ? parseIsoDate(clampedValue) : null);
    setIsOpen(true);
    requestAnimationFrame(updatePanelPosition);
  }

  function handleCancel() {
    close();
  }

  function handleApply() {
    if (draftDate) {
      onChange(clampIsoDate(toIsoDate(draftDate), minDate, maxDate));
    }
    close();
  }

  function changeMonth(delta: number) {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  const calendarDays = getCalendarDays(viewMonth);
  const viewYear = viewMonth.getFullYear();
  const viewMonthIndex = viewMonth.getMonth();

  const panel =
    isOpen &&
    panelPosition &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        data-admin-hub-date-picker-panel
        className="fixed z-[250] w-[332px]"
        style={{ top: panelPosition.top, left: panelPosition.left }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div className="absolute left-6 top-0 size-3 -translate-y-1/2 rotate-45 border border-[#C8C8C8] border-b-0 border-r-0 bg-white" />

        <div className="rounded-[12px] border border-[#C8C8C8] bg-white pb-4 pl-[26px] pr-[21px] pt-[33px] shadow-[0px_2px_8px_rgba(112,112,112,0.12)]">
          <div className="flex w-[285px] flex-col gap-[33px]">
            <div className="flex items-center justify-center gap-[71px]">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded p-0.5 text-[#525252] transition-colors hover:text-[#0097B2]"
                aria-label="Mes anterior"
              >
                <ChevronLeft size={21} />
              </button>
              <p className="text-[16px] font-semibold leading-[1.3] text-black whitespace-nowrap">
                {getMonthLabel(viewMonth)}
              </p>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded p-0.5 text-[#525252] transition-colors hover:text-[#0097B2]"
                aria-label="Mes siguiente"
              >
                <ChevronRight size={21} />
              </button>
            </div>

            <div className="w-full">
              <div className="mb-[18px] grid grid-cols-7 gap-x-[26px]">
                {WEEKDAY_LABELS.map((weekday) => (
                  <span
                    key={weekday}
                    className="text-center text-[12px] font-semibold leading-[1.3] text-[#707070]"
                  >
                    {weekday}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-x-[26px] gap-y-[18px]">
                {calendarDays.map((day) => {
                  const inCurrentMonth =
                    day.getMonth() === viewMonthIndex && day.getFullYear() === viewYear;
                  const isSelected = draftDate ? isSameDay(day, draftDate) : false;
                  const dayDisabled = isDateDisabled(day, minDate, maxDate);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={dayDisabled}
                      onClick={() => setDraftDate(day)}
                      className={`mx-auto flex h-6 w-[26px] items-center justify-center rounded-[4px] text-[12px] font-semibold leading-[1.3] transition-colors ${
                        isSelected
                          ? "bg-[#0097B2] text-white"
                          : inCurrentMonth
                            ? "text-[#525252] hover:bg-[#F5FAFB]"
                            : "text-[#C8C8C8] hover:bg-[#F8F8F8]"
                      } ${dayDisabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : "cursor-pointer"}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-[22px]">
              <div className="h-px w-full bg-[#EFEFEF]" />
              <div className="flex justify-end gap-[7px]">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex h-[31px] w-[88px] items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[12px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#F5FAFB]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!draftDate}
                  className="inline-flex h-[31px] w-[88px] items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[12px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className="relative w-full pt-2">
      <label
        htmlFor={id}
        className="absolute left-3 top-0 z-10 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]"
      >
        {label}
        {required && "*"}
      </label>
      <button
        ref={triggerRef}
        data-admin-hub-date-picker-trigger
        id={id}
        type="button"
        disabled={disabled}
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`flex h-[50px] w-full items-center rounded-[8px] border border-[#EFEFEF] bg-white px-4 text-left text-[14px] leading-[1.3] tracking-[0.28px] focus:outline-none focus:ring-1 focus:ring-[#0097B2] ${
          disabled
            ? "cursor-not-allowed bg-[#F8F8F8] text-[#525252]"
            : displayValue
              ? "cursor-pointer text-[#343434]"
              : "cursor-pointer text-[#C8C8C8]"
        } ${isOpen && !disabled ? "ring-1 ring-[#0097B2]" : ""}`}
      >
        {displayValue || placeholder}
      </button>
      {panel}
    </div>
  );
}
