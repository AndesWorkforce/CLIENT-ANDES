"use server";

import {
  localWorldCountries,
  mergeWorldCountries,
  type WorldCountry,
} from "../lib/world-countries";

interface CountriesIsoResponse {
  error?: boolean;
  data?: Array<{ name?: string; Iso2?: string; Iso3?: string; iso2?: string; iso3?: string }>;
}

let cachedWorldCountries: WorldCountry[] | null = null;

export async function getWorldCountries(): Promise<{
  success: boolean;
  data: WorldCountry[];
}> {
  if (cachedWorldCountries) {
    return { success: true, data: cachedWorldCountries };
  }

  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/iso", {
      cache: "force-cache",
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      throw new Error(`World countries request failed: ${response.status}`);
    }

    const result = (await response.json()) as CountriesIsoResponse;
    if (result.error || !Array.isArray(result.data)) {
      throw new Error("Invalid world countries response");
    }

    const remote = result.data.map((country) => ({
      name: String(country.name ?? "").trim(),
      code: String(country.Iso2 ?? country.iso2 ?? "").trim().toUpperCase(),
    }));

    cachedWorldCountries = mergeWorldCountries(remote);
    return { success: true, data: cachedWorldCountries };
  } catch (error) {
    console.error("[COUNTRIES] Error fetching world countries:", error);
    return { success: false, data: mergeWorldCountries(localWorldCountries()) };
  }
}
