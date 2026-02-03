import Holidays from 'date-holidays';

const COUNTRY_CODE_MAP: Record<string, string> = {
  'Colombia': 'CO',
  'Argentina': 'AR',
  'Perú': 'PE',
  'México': 'MX',
  'Chile': 'CL',
  'Ecuador': 'EC',
  'Venezuela': 'VE',
  'Estados Unidos': 'US',
};

export interface Holiday {
  date: Date;
  dateFormatted: string;
  name: string;
  type: 'public' | 'bank' | 'school' | 'optional' | 'observance';
  isMovable?: boolean;
}

/**
 * Get all public holidays for a given country in the current year
 * @param countryName - Name of the country in Spanish
 * @returns Array of holidays sorted by date
 */
export function getHolidaysForCountry(countryName: string): Holiday[] {
  const countryCode = COUNTRY_CODE_MAP[countryName];
  if (!countryCode) {
    console.warn(`Country code not found for: ${countryName}`);
    return [];
  }

  try {
    const hd = new Holidays(countryCode);
    const currentYear = new Date().getFullYear();
    const holidays = hd.getHolidays(currentYear);

    return holidays
      .filter(h => h.type === 'public') // Only public holidays
      .map(h => ({
        date: h.start,
        dateFormatted: formatHolidayDate(h.start),
        name: h.name,
        type: h.type as Holiday['type'],
        isMovable: !(h as any).fixed, // Some holidays may not have this property
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error(`Error fetching holidays for ${countryName}:`, error);
    return [];
  }
}

/**
 * Format a holiday date to a readable string (e.g., "January 01, 2026")
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatHolidayDate(date: Date): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = monthNames[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

/**
 * Get supported country names
 */
export function getSupportedCountries(): string[] {
  return Object.keys(COUNTRY_CODE_MAP);
}
