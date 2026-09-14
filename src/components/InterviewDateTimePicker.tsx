"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  formatInterviewDateTimeLabel,
  utcIsoToZonedParts,
  zonedDateTimeToUtcIso,
} from "@/lib/interview-datetime";

const INTERVIEW_TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "US Eastern Time" },
  { value: "America/Chicago", label: "US Central Time" },
  { value: "America/Denver", label: "US Mountain Time" },
  { value: "America/Los_Angeles", label: "US Pacific Time" },
] as const;

interface InterviewDateTimePickerProps {
  valueISO?: string;
  minMinutesFromNow?: number;
  onChange: (iso: string | undefined) => void;
  saving?: boolean;
  onSave?: () => void;
  inline?: boolean;
  compact?: boolean;
  timeZone?: string;
  onTimeZoneChange?: (tz: string) => void;
}

function isoToDate(iso?: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function roundToFiveMinutes(d: Date): Date {
  const ms = 1000 * 60 * 5;
  return new Date(Math.ceil(d.getTime() / ms) * ms);
}

export const InterviewDateTimePicker: React.FC<
  InterviewDateTimePickerProps
> = ({
  valueISO,
  minMinutesFromNow = 10,
  onChange,
  saving = false,
  onSave,
  inline = false,
  compact = false,
  timeZone,
  onTimeZoneChange,
}) => {
  const initialDate = isoToDate(valueISO);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [selectedTz, setSelectedTz] = useState<string>(timeZone || "");

  const minDate = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + minMinutesFromNow);
    return roundToFiveMinutes(d);
  })();
  const minTime = (() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  })();
  const maxTime = (() => {
    const d = new Date();
    d.setHours(20, 0, 0, 0);
    return d;
  })();

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [valueISO]);

  useEffect(() => {
    if (timeZone !== undefined) {
      setSelectedTz(timeZone);
    }
  }, [timeZone]);

  const emitIsoFromWallClock = (
    dateStr: string,
    timeStr: string,
    tz: string = selectedTz
  ) => {
    if (!tz) return;
    onChange(zonedDateTimeToUtcIso(dateStr, timeStr, tz));
  };

  const displayInSelectedTz = (iso?: string) =>
    iso && selectedTz
      ? formatInterviewDateTimeLabel(iso, selectedTz)
      : "";

  const handleTimezoneChange = (tz: string) => {
    setSelectedTz(tz);
    if (tz) {
      onTimeZoneChange?.(tz);
    }
  };

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (!date) {
      onChange(undefined);
      return;
    }
    if (!selectedTz) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    emitIsoFromWallClock(`${y}-${m}-${d}`, `${hh}:${mm}`);
  };

  const timezoneSelect = (
    onTzChange?: (dateStr: string, timeStr: string, tz: string) => void,
    dateStr?: string,
    timeStr?: string
  ) => (
    <select
      value={selectedTz}
      onChange={(e) => {
        const tz = e.target.value;
        handleTimezoneChange(tz);
        if (tz && dateStr && timeStr && onTzChange) {
          onTzChange(dateStr, timeStr, tz);
        } else if (tz && dateStr && timeStr) {
          emitIsoFromWallClock(dateStr, timeStr, tz);
        }
      }}
      className="border border-[#cfd8dc] rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
    >
      <option value="">Select time zone</option>
      {INTERVIEW_TIMEZONE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  if (compact) {
    const timeOptions: string[] = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 20 && m > 0) break;
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        timeOptions.push(`${hh}:${mm}`);
      }
    }

    const zonedFromValue =
      valueISO && selectedTz
        ? utcIsoToZonedParts(valueISO, selectedTz)
        : null;

    const pendingDateStr = selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : "";

    const dateValue = zonedFromValue?.dateStr ?? pendingDateStr;
    const timeValue = zonedFromValue?.timeStr ?? "";

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      if (!newDate) {
        setSelectedDate(null);
        onChange(undefined);
        return;
      }
      if (!selectedTz) return;
      if (timeValue) {
        emitIsoFromWallClock(newDate, timeValue);
      } else {
        const [y, mo, d] = newDate.split("-").map(Number);
        setSelectedDate(new Date(y, mo - 1, d, 12, 0, 0));
      }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTime = e.target.value;
      if (!selectedTz) return;
      if (!newTime) {
        onChange(undefined);
        return;
      }
      if (!dateValue) {
        return;
      }
      emitIsoFromWallClock(dateValue, newTime);
    };

    const isComplete = Boolean(selectedTz && dateValue && timeValue);

    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 text-[11px] text-gray-600 flex-wrap">
          <span className="font-semibold">Time Zone:</span>
          {timezoneSelect(undefined, dateValue, timeValue)}
          {valueISO && selectedTz ? (
            <span className="ml-2">{displayInSelectedTz(valueISO)}</span>
          ) : pendingDateStr && !selectedTz ? (
            <span className="ml-2 text-amber-600">Select time zone first</span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={dateValue}
            min={minDate.toISOString().slice(0, 10)}
            onChange={handleDateChange}
            disabled={!selectedTz}
            className="border border-[#cfd8dc] rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#0097B2] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <select
            value={timeValue}
            onChange={handleTimeChange}
            disabled={!selectedTz || !dateValue}
            className="border border-[#cfd8dc] rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2] disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">--:--</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            disabled={!isComplete || saving}
            onClick={() => onSave && onSave()}
            className={`px-3 py-1.5 text-white text-xs font-medium rounded transition-colors ${
              !isComplete || saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
            }`}
          >
            {saving ? "Saving..." : valueISO ? "Update" : "Save"}
          </button>
          {valueISO && selectedTz ? (
            <span className="text-[11px] text-gray-600">
              {displayInSelectedTz(valueISO)}
            </span>
          ) : null}
        </div>
        {isComplete && selectedDate && selectedDate < minDate && (
          <p className="text-[10px] text-red-600">
            Selected time must be at least {minMinutesFromNow} minutes ahead.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
        <span className="font-semibold">Time Zone:</span>
        {timezoneSelect()}
        {valueISO && selectedTz ? (
          <span className="ml-2">{displayInSelectedTz(valueISO)}</span>
        ) : null}
      </div>
      <div className={`w-full ${inline ? "" : "max-w-full"}`}>
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          timeIntervals={15}
          minDate={minDate}
          minTime={minTime}
          maxTime={maxTime}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText={
            selectedTz ? "Select date & time" : "Select time zone first"
          }
          disabled={!selectedTz}
          className="datepicker-input border border-[#cfd8dc] rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2] disabled:bg-gray-100"
          popperClassName="z-50"
          inline={inline}
          shouldCloseOnSelect={!inline}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          disabled={!selectedDate || !selectedTz || saving}
          onClick={() => onSave && onSave()}
          className={`px-4 py-2 text-white text-xs font-medium rounded-md transition-colors ${
            !selectedDate || !selectedTz || saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
          }`}
        >
          {saving ? "Saving..." : valueISO ? "Update" : "Save"}
        </button>
        {valueISO && selectedTz ? (
          <span className="text-xs text-gray-600">
            {displayInSelectedTz(valueISO)}
          </span>
        ) : null}
      </div>
      {selectedDate && selectedDate < minDate && (
        <p className="text-xs text-red-600">
          Selected time must be at least {minMinutesFromNow} minutes ahead.
        </p>
      )}
      <style jsx>{`
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #007a8f;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }
        .react-datepicker__triangle {
          display: none;
        }
        .react-datepicker__header {
          background-color: #007a8f;
          border-bottom: 1px solid #007a8f;
        }
        .react-datepicker__current-month,
        .react-datepicker-time__header,
        .react-datepicker-year-header {
          color: #ffffff;
          font-weight: 600;
        }
        .react-datepicker__day-name {
          color: #e0f7fa;
        }
        .react-datepicker__day,
        .react-datepicker__time-name {
          color: #37474f;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #007a8f !important;
          color: #ffffff !important;
        }
        .react-datepicker__day--today {
          font-weight: 600;
          border: 1px solid #007a8f;
        }
        .react-datepicker__day:hover {
          background-color: #007a8f;
          color: #ffffff;
        }
        .react-datepicker__time-container {
          border-left: 1px solid #007a8f;
        }
        .react-datepicker__time-box
          ul.react-datepicker__time-list
          li.react-datepicker__time-list-item--selected {
          background-color: #007a8f !important;
          color: #ffffff !important;
        }
        .react-datepicker__time-box ul.react-datepicker__time-list li:hover {
          background-color: #007a8f !important;
          color: #ffffff !important;
        }
        .datepicker-input::placeholder {
          color: #607d8b;
        }
      `}</style>
    </div>
  );
};

export default InterviewDateTimePicker;
