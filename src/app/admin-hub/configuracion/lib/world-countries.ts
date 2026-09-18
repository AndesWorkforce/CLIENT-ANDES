import { ALL_COUNTRIES } from "@/lib/countries";
import { includesSearchText, normalizeSearchText } from "../../lib/search-text";

export interface WorldCountry {
  name: string;
  code: string;
}

const MAX_SUGGESTIONS = 8;

export function localWorldCountries(): WorldCountry[] {
  return ALL_COUNTRIES.map((country) => ({
    name: country.name,
    code: country.code.toUpperCase(),
  }));
}

export function mergeWorldCountries(remote: WorldCountry[]): WorldCountry[] {
  const byName = new Map<string, WorldCountry>();

  for (const country of [...remote, ...localWorldCountries()]) {
    const name = country.name.trim();
    const code = country.code.trim().toUpperCase();
    if (!name || !/^[A-Z]{2,3}$/.test(code)) continue;
    const key = normalizeSearchText(name);
    if (!byName.has(key)) {
      byName.set(key, { name, code });
    }
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function filterWorldCountries(
  countries: WorldCountry[],
  query: string,
  excludedCodes: Set<string> = new Set(),
): WorldCountry[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const available = countries.filter(
    (country) => !excludedCodes.has(country.code.toUpperCase()),
  );

  const startsWith: WorldCountry[] = [];
  const contains: WorldCountry[] = [];

  for (const country of available) {
    const normalizedName = normalizeSearchText(country.name);
    const matchesCode = includesSearchText(country.code, normalizedQuery);
    if (normalizedName.startsWith(normalizedQuery) || matchesCode) {
      startsWith.push(country);
    } else if (includesSearchText(country.name, normalizedQuery)) {
      contains.push(country);
    }
  }

  return [...startsWith, ...contains].slice(0, MAX_SUGGESTIONS);
}
