/**
 * Utilities for interview scheduling: wall-clock times in IANA zones ↔ UTC ISO.
 */

export type InterviewTimeFormatOptions = {
  hour?: "2-digit" | "numeric";
  minute?: "2-digit" | "numeric";
  hour12?: boolean;
};

/** MM/DD/YYYY in optional IANA timezone */
export function formatInterviewDateUS(iso?: string, timeZone?: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    if (timeZone) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .formatToParts(d)
        .reduce<Record<string, string>>((acc, p) => {
          if (p.type !== "literal") acc[p.type] = p.value;
          return acc;
        }, {});
      return `${parts.month}/${parts.day}/${parts.year}`;
    }

    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  } catch {
    const plain = (iso || "").split("T")[0];
    const parts = plain.split("-");
    if (parts.length === 3) {
      const [y, m, day] = parts;
      return `${m}/${day}/${y}`;
    }
    return iso || "";
  }
}

/** Time string (e.g. "02:00 PM") in optional IANA timezone */
export function formatInterviewTime(
  iso?: string,
  timeZone?: string | null,
  options?: InterviewTimeFormatOptions
): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const fmt: Intl.DateTimeFormatOptions = {
    hour: options?.hour ?? "2-digit",
    minute: options?.minute ?? "2-digit",
    hour12: options?.hour12 ?? true,
    ...(timeZone ? { timeZone } : {}),
  };

  return d.toLocaleTimeString([], fmt);
}

/** Combined label for dropdowns: "MM/DD/YYYY hh:mm a" */
export function formatInterviewDateTimeLabel(
  iso: string,
  timeZone?: string | null
): string {
  const dateStr = formatInterviewDateUS(iso, timeZone);
  const timeStr = formatInterviewTime(iso, timeZone);
  return `${dateStr} ${timeStr}`.trim();
}

function readZonedParts(timestamp: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date(timestamp));

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || "0", 10);

  return {
    y: get("year"),
    mo: get("month"),
    d: get("day"),
    h: get("hour"),
    mi: get("minute"),
  };
}

/**
 * Converts wall-clock date + time in an IANA zone to a UTC ISO string.
 * Example: 2026-05-27 15:00 in America/New_York → correct UTC instant.
 */
export function zonedDateTimeToUtcIso(
  dateStr: string,
  timeStr: string,
  timeZone: string
): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);
  const desired = { y, mo, d, h, mi };

  let utc = Date.UTC(y, mo - 1, d, h, mi, 0);

  for (let i = 0; i < 10; i++) {
    const z = readZonedParts(utc, timeZone);
    if (
      z.y === desired.y &&
      z.mo === desired.mo &&
      z.d === desired.d &&
      z.h === desired.h &&
      z.mi === desired.mi
    ) {
      return new Date(utc).toISOString();
    }
    const zAsUtc = Date.UTC(z.y, z.mo - 1, z.d, z.h, z.mi);
    const desiredAsUtc = Date.UTC(desired.y, desired.mo - 1, desired.d, desired.h, desired.mi);
    utc += desiredAsUtc - zAsUtc;
  }

  return new Date(utc).toISOString();
}

/** Extract YYYY-MM-DD and HH:mm as they appear in the given timezone */
export function utcIsoToZonedParts(
  iso: string,
  timeZone: string
): { dateStr: string; timeStr: string } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");

  if (!year || !month || !day) return null;

  return {
    dateStr: `${year}-${month}-${day}`,
    timeStr: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
  };
}
