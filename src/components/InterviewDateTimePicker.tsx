"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface InterviewDateTimePickerProps {
  valueISO?: string;
  minMinutesFromNow?: number;
  onChange: (iso: string | undefined) => void;
  saving?: boolean;
  onSave?: () => void;
  inline?: boolean;
  compact?: boolean;
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
}) => {
  const initialDate = isoToDate(valueISO);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [selectedTz, setSelectedTz] = useState<string>("America/New_York");

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

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (!date) {
      onChange(undefined);
    } else {
      onChange(date.toISOString());
    }
  };

  if (compact) {
    // Build time options every 15 minutes between 08:00 and 20:00
    const timeOptions: string[] = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 20 && m > 0) break; // end at 20:00 exactly
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        timeOptions.push(`${hh}:${mm}`);
      }
    }

    const dateValue = selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : "";
    const timeValue = selectedDate
      ? selectedDate.toTimeString().slice(0, 5)
      : "";

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      if (!newDate) {
        setSelectedDate(null);
        onChange(undefined);
        return;
      }
      // Guardamos la fecha (medianoche) para permitir elegir hora después
      const tempDate = new Date(`${newDate}T00:00:00`);
      setSelectedDate(tempDate);
      // Si ya había hora seleccionada (selectedDate con hora previa), combinamos
      if (timeValue) {
        const combined = new Date(`${newDate}T${timeValue}:00`);
        handleChange(combined);
      }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newTime = e.target.value;
      if (!newTime) {
        onChange(undefined);
        // mantenemos selectedDate con la fecha para seguir
        return;
      }
      if (!dateValue) {
        // aún no se eligió fecha; no podemos combinar
        return;
      }
      const combined = new Date(`${dateValue}T${newTime}:00`);
      handleChange(combined);
    };

    const isComplete = Boolean(dateValue && timeValue);

    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 text-[11px] text-gray-600">
          <span className="font-semibold">Time Zone:</span>
          <select
            value={selectedTz}
            onChange={(e) => setSelectedTz(e.target.value)}
            className="border border-[#cfd8dc] rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          >
            <option value="America/New_York">US Eastern Time</option>
            <option value="America/Chicago">US Central Time</option>
            <option value="America/Denver">US Mountain Time</option>
            <option value="America/Los_Angeles">US Pacific Time</option>
          </select>
          {selectedDate && (
            <span className="ml-2">
              {selectedDate.toLocaleString("en-US", { timeZone: selectedTz })}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={dateValue}
            min={minDate.toISOString().slice(0, 10)}
            onChange={handleDateChange}
            className="border border-[#cfd8dc] rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          />
          <select
            value={timeValue}
            onChange={handleTimeChange}
            className="border border-[#cfd8dc] rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
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
          {selectedDate && (
            <span className="text-[11px] text-gray-600">
              {selectedDate.toLocaleString()}
            </span>
          )}
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
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span className="font-semibold">Time Zone:</span>
        <select
          value={selectedTz}
          onChange={(e) => setSelectedTz(e.target.value)}
          className="border border-[#cfd8dc] rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
        >
          <option value="America/New_York">US Eastern Time</option>
          <option value="America/Chicago">US Central Time</option>
          <option value="America/Denver">US Mountain Time</option>
          <option value="America/Los_Angeles">US Pacific Time</option>
        </select>
        {selectedDate && (
          <span className="ml-2">
            {selectedDate.toLocaleString("en-US", { timeZone: selectedTz })}
          </span>
        )}
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
          placeholderText="Select date & time"
          className="datepicker-input border border-[#cfd8dc] rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
          popperClassName="z-50"
          inline={inline}
          shouldCloseOnSelect={!inline}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          disabled={!selectedDate || saving}
          onClick={() => onSave && onSave()}
          className={`px-4 py-2 text-white text-xs font-medium rounded-md transition-colors ${
            !selectedDate || saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0097B2] hover:bg-[#007a8f] cursor-pointer"
          }`}
        >
          {saving ? "Saving..." : valueISO ? "Update" : "Save"}
        </button>
        {selectedDate && (
          <span className="text-xs text-gray-600">
            {selectedDate.toLocaleString()}
          </span>
        )}
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
