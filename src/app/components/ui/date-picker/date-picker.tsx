"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

interface DatePickerProps {
  value?: string; // can be legacy DD/MM/YY, DD/MM/YYYY, MM/DD/YYYY, or ISO
  onChange: (value: string) => void; // returns canonical MM/DD/YYYY
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Helpers
// Canonical output: MM/DD/YYYY
const toCanonical = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

// NEW: parse various incoming formats to Date
const parseAny = (value: string): Date | null => {
  if (!value) return null;
  // DD/MM/YY
  let m = value.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (m) {
    const [, dd, mm, yy] = m;
    return new Date(
      2000 + parseInt(yy, 10),
      parseInt(mm, 10) - 1,
      parseInt(dd, 10)
    );
  }
  // MM/DD/YYYY
  m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, mm, dd, yyyy] = m;
    return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  }
  // ISO
  m = value.match(/^(\d{4})-(\d{2})-(\d{2})(T.*)?$/);
  if (m) {
    const [, yyyy, mm, dd] = m;
    return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  }
  return null;
};

const toCanonicalFromAny = (value?: string) => {
  if (!value) return "";
  const d = parseAny(value);
  return d ? toCanonical(d) : value;
};

// Accept legacy internal DD/MM/YY plus canonical MM/DD/YYYY
const parseLegacyOrCanonical = (value: string): Date | null => {
  if (!value) return null;
  let m = value.match(/^(\d{2})\/(\d{2})\/(\d{2})$/); // DD/MM/YY
  if (m) {
    const [, dd, mm, yy] = m;
    return new Date(
      2000 + parseInt(yy, 10),
      parseInt(mm, 10) - 1,
      parseInt(dd, 10)
    );
  }
  m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // MM/DD/YYYY (canonical) or could also be DD/MM/YYYY ambiguous; rely on earlier normalization
  if (m) {
    const [, mm, dd, yyyy] = m; // we treat first part as month because we only output in that style
    return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  }
  return null;
};

const formatDisplayUS = (value?: string) => {
  if (!value) return "";
  const normalized = toCanonicalFromAny(value);
  const d = parseLegacyOrCanonical(normalized);
  if (!d) return value;
  return toCanonical(d);
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  disabled,
  minDate,
  maxDate,
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    () => parseAny(value || "") || new Date()
  );
  const canonicalValue = toCanonicalFromAny(value);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Sync month when external value changes
  useEffect(() => {
    if (value) {
      const d = parseAny(value);
      if (d) setCurrentMonth(d);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const startWeekday = startOfMonth.getDay(); // 0-6
  const totalDays = daysInMonth(currentMonth);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectDate = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (minDate && selected < minDate) return;
    if (maxDate && selected > maxDate) return;
    onChange(toCanonical(selected));
    setOpen(false);
  };

  const renderGrid = () => {
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(<div key={`e-${i}`} />);
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        d
      );
      dateObj.setHours(0, 0, 0, 0);
      const canonical = toCanonical(dateObj);
      const isSelected =
        canonicalValue &&
        parseLegacyOrCanonical(canonicalValue)?.getTime() === dateObj.getTime();
      const isToday = dateObj.getTime() === today.getTime();
      const isDisabled =
        (minDate && dateObj < minDate) || (maxDate && dateObj > maxDate);
      cells.push(
        <button
          type="button"
          key={d}
          onClick={() => selectDate(d)}
          disabled={isDisabled}
          className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-[#0097B2] text-white"
              : isToday
              ? "border border-[#0097B2]"
              : "hover:bg-gray-100"
          } ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label={canonical}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  const changeMonth = (delta: number) =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center">
        <input
          type="text"
          disabled={disabled}
          readOnly
          value={formatDisplayUS(canonicalValue)}
          placeholder={placeholder}
          onClick={() => !disabled && setOpen((o) => !o)}
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2] cursor-pointer bg-white"
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen((o) => !o)}
          className="ml-2 text-gray-500 hover:text-gray-700"
          aria-label="Open calendar"
        >
          <CalendarIcon size={18} />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-medium">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px] font-medium text-gray-500 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-gray-700">
            {renderGrid()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
