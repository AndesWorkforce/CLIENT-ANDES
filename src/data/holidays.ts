/**
 * Holiday data by country
 * Each country has its list of public holidays with dates and names
 */

export interface Holiday {
  date: string; // Format: "DD-MMM" (e.g., "12-Jan")
  name: string;
  isMovable?: boolean; // For holidays that change date each year (Easter-based)
}

export interface CountryHolidays {
  country: string;
  year: number;
  holidays: Holiday[];
  compensationNote?: string;
}

/**
 * Colombia Public Holidays 2026
 * Source: Colombian labor law
 */
const colombiaHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "12-Jan", name: "Three Kings' Day" },
  { date: "23-Mar", name: "St. Joseph's Day" },
  { date: "17-Apr", name: "Maundy Thursday", isMovable: true },
  { date: "18-Apr", name: "Holy Friday", isMovable: true },
  { date: "01-May", name: "Labor Day" },
  { date: "01-Jun", name: "Ascension Day", isMovable: true },
  { date: "22-Jun", name: "Corpus Christi", isMovable: true },
  { date: "29-Jun", name: "Sacred Heart", isMovable: true },
  { date: "29-Jun", name: "Saint Peter and Saint Paul" },
  { date: "20-Jul", name: "Independence Day" },
  { date: "07-Aug", name: "Battle of Boyacá" },
  { date: "17-Aug", name: "Assumption of the Virgin Mary" },
  { date: "12-Oct", name: "Columbus Day" },
  { date: "02-Nov", name: "All Souls' Day" },
  { date: "16-Nov", name: "Independence of Cartagena" },
  { date: "08-Dec", name: "Immaculate Conception" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Argentina Public Holidays 2026
 */
const argentinaHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "23-Feb", name: "Carnival" },
  { date: "24-Feb", name: "Carnival" },
  { date: "24-Mar", name: "National Day of Memory for Truth and Justice" },
  { date: "02-Apr", name: "Malvinas Day" },
  { date: "17-Apr", name: "Holy Friday", isMovable: true },
  { date: "01-May", name: "Labor Day" },
  { date: "25-May", name: "May Revolution" },
  { date: "15-Jun", name: "Martín Miguel de Güemes Day" },
  { date: "20-Jun", name: "Flag Day" },
  { date: "09-Jul", name: "Independence Day" },
  { date: "17-Aug", name: "Death of General José de San Martín" },
  { date: "12-Oct", name: "Day of Respect for Cultural Diversity" },
  { date: "20-Nov", name: "National Sovereignty Day" },
  { date: "08-Dec", name: "Immaculate Conception" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Peru Public Holidays 2026
 */
const peruHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "17-Apr", name: "Holy Thursday", isMovable: true },
  { date: "18-Apr", name: "Holy Friday", isMovable: true },
  { date: "01-May", name: "Labor Day" },
  { date: "29-Jun", name: "Saint Peter and Saint Paul" },
  { date: "28-Jul", name: "Independence Day" },
  { date: "29-Jul", name: "Independence Day" },
  { date: "30-Aug", name: "Santa Rosa de Lima" },
  { date: "08-Oct", name: "Battle of Angamos" },
  { date: "01-Nov", name: "All Saints' Day" },
  { date: "08-Dec", name: "Immaculate Conception" },
  { date: "09-Dec", name: "Battle of Ayacucho" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Mexico Public Holidays 2026
 */
const mexicoHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "02-Feb", name: "Constitution Day" },
  { date: "16-Mar", name: "Benito Juárez's Birthday" },
  { date: "01-May", name: "Labor Day" },
  { date: "16-Sep", name: "Independence Day" },
  { date: "02-Nov", name: "Day of the Dead" },
  { date: "16-Nov", name: "Revolution Day" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Chile Public Holidays 2026
 */
const chileHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "17-Apr", name: "Holy Friday", isMovable: true },
  { date: "18-Apr", name: "Holy Saturday", isMovable: true },
  { date: "01-May", name: "Labor Day" },
  { date: "21-May", name: "Navy Day" },
  { date: "07-Jun", name: "Corpus Christi", isMovable: true },
  { date: "29-Jun", name: "Saint Peter and Saint Paul" },
  { date: "16-Jul", name: "Our Lady of Mount Carmel" },
  { date: "15-Aug", name: "Assumption of Mary" },
  { date: "18-Sep", name: "Independence Day" },
  { date: "19-Sep", name: "Army Day" },
  { date: "12-Oct", name: "Columbus Day" },
  { date: "31-Oct", name: "Reformation Day" },
  { date: "01-Nov", name: "All Saints' Day" },
  { date: "08-Dec", name: "Immaculate Conception" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Ecuador Public Holidays 2026
 */
const ecuadorHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "23-Feb", name: "Carnival" },
  { date: "24-Feb", name: "Carnival" },
  { date: "17-Apr", name: "Holy Friday", isMovable: true },
  { date: "01-May", name: "Labor Day" },
  { date: "24-May", name: "Battle of Pichincha" },
  { date: "10-Aug", name: "Independence Day" },
  { date: "09-Oct", name: "Independence of Guayaquil" },
  { date: "02-Nov", name: "All Souls' Day" },
  { date: "03-Nov", name: "Independence of Cuenca" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Venezuela Public Holidays 2026
 */
const venezuelaHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "23-Feb", name: "Carnival" },
  { date: "24-Feb", name: "Carnival" },
  { date: "17-Apr", name: "Holy Thursday", isMovable: true },
  { date: "18-Apr", name: "Holy Friday", isMovable: true },
  { date: "19-Apr", name: "Independence Declaration" },
  { date: "01-May", name: "Labor Day" },
  { date: "24-Jun", name: "Battle of Carabobo" },
  { date: "05-Jul", name: "Independence Day" },
  { date: "24-Jul", name: "Simón Bolívar's Birthday" },
  { date: "12-Oct", name: "Indigenous Resistance Day" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * United States Public Holidays 2026
 */
const usaHolidays2026: Holiday[] = [
  { date: "01-Jan", name: "New Year's Day" },
  { date: "19-Jan", name: "Martin Luther King Jr. Day" },
  { date: "16-Feb", name: "Presidents' Day" },
  { date: "25-May", name: "Memorial Day" },
  { date: "19-Jun", name: "Juneteenth" },
  { date: "04-Jul", name: "Independence Day" },
  { date: "07-Sep", name: "Labor Day" },
  { date: "12-Oct", name: "Columbus Day" },
  { date: "11-Nov", name: "Veterans Day" },
  { date: "26-Nov", name: "Thanksgiving" },
  { date: "25-Dec", name: "Christmas Day" },
];

/**
 * Map of country holidays
 */
export const HOLIDAYS_BY_COUNTRY: Record<string, CountryHolidays> = {
  Colombia: {
    country: "Colombia",
    year: 2026,
    holidays: colombiaHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws. In Colombia, such work shall be paid at double the ordinary rate.",
  },
  Argentina: {
    country: "Argentina",
    year: 2026,
    holidays: argentinaHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws.",
  },
  Peru: {
    country: "Peru",
    year: 2026,
    holidays: peruHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws.",
  },
  Mexico: {
    country: "Mexico",
    year: 2026,
    holidays: mexicoHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws.",
  },
  Chile: {
    country: "Chile",
    year: 2026,
    holidays: chileHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws.",
  },
  Ecuador: {
    country: "Ecuador",
    year: 2026,
    holidays: ecuadorHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws.",
  },
  Venezuela: {
    country: "Venezuela",
    year: 2026,
    holidays: venezuelaHolidays2026,
    compensationNote:
      "Work performed on public holidays shall be compensated in accordance with applicable labor laws.",
  },
  "United States": {
    country: "United States",
    year: 2026,
    holidays: usaHolidays2026,
    compensationNote:
      "Federal holidays. State-specific holidays may vary.",
  },
};

/**
 * Get holidays for a specific country
 */
export function getHolidaysForCountry(country: string): CountryHolidays | null {
  return HOLIDAYS_BY_COUNTRY[country] || null;
}

/**
 * Format holiday date to readable format
 * Converts "12-Jan" to "January 12, 2026"
 */
export function formatHolidayDate(dateStr: string, year: number = 2026): string {
  const [day, month] = dateStr.split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].indexOf(month);

  if (monthIndex === -1) return dateStr;

  return `${monthNames[monthIndex]} ${parseInt(day)}, ${year}`;
}
