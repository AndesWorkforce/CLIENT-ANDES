export interface Country {
  code: string;
  name: string;
  region: string;
}

export interface Region {
  code: string;
  name: string;
  countries: Country[];
}

// Países de Latinoamérica
export const LATIN_AMERICA_COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina", region: "LATIN_AMERICA" },
  { code: "BO", name: "Bolivia", region: "LATIN_AMERICA" },
  { code: "BR", name: "Brasil", region: "LATIN_AMERICA" },
  { code: "CL", name: "Chile", region: "LATIN_AMERICA" },
  { code: "CO", name: "Colombia", region: "LATIN_AMERICA" },
  { code: "CR", name: "Costa Rica", region: "LATIN_AMERICA" },
  { code: "CU", name: "Cuba", region: "LATIN_AMERICA" },
  { code: "DO", name: "República Dominicana", region: "LATIN_AMERICA" },
  { code: "EC", name: "Ecuador", region: "LATIN_AMERICA" },
  { code: "SV", name: "El Salvador", region: "LATIN_AMERICA" },
  { code: "GT", name: "Guatemala", region: "LATIN_AMERICA" },
  { code: "HT", name: "Haití", region: "LATIN_AMERICA" },
  { code: "HN", name: "Honduras", region: "LATIN_AMERICA" },
  { code: "JM", name: "Jamaica", region: "LATIN_AMERICA" },
  { code: "MX", name: "México", region: "LATIN_AMERICA" },
  { code: "NI", name: "Nicaragua", region: "LATIN_AMERICA" },
  { code: "PA", name: "Panamá", region: "LATIN_AMERICA" },
  { code: "PY", name: "Paraguay", region: "LATIN_AMERICA" },
  { code: "PE", name: "Perú", region: "LATIN_AMERICA" },
  { code: "PR", name: "Puerto Rico", region: "LATIN_AMERICA" },
  { code: "UY", name: "Uruguay", region: "LATIN_AMERICA" },
  { code: "VE", name: "Venezuela", region: "LATIN_AMERICA" },
];

// Otros países importantes
export const OTHER_COUNTRIES: Country[] = [
  { code: "US", name: "Estados Unidos", region: "NORTH_AMERICA" },
  { code: "CA", name: "Canadá", region: "NORTH_AMERICA" },
  { code: "ES", name: "España", region: "EUROPE" },
  { code: "PT", name: "Portugal", region: "EUROPE" },
  { code: "FR", name: "Francia", region: "EUROPE" },
  { code: "DE", name: "Alemania", region: "EUROPE" },
  { code: "IT", name: "Italia", region: "EUROPE" },
  { code: "GB", name: "Reino Unido", region: "EUROPE" },
  { code: "AU", name: "Australia", region: "OCEANIA" },
  { code: "NZ", name: "Nueva Zelanda", region: "OCEANIA" },
];

// Todas las regiones disponibles
export const REGIONS: Region[] = [
  {
    code: "ALL",
    name: "All countries",
    countries: [...LATIN_AMERICA_COUNTRIES, ...OTHER_COUNTRIES],
  },
  {
    code: "LATIN_AMERICA",
    name: "Latin America",
    countries: LATIN_AMERICA_COUNTRIES,
  },
  {
    code: "NORTH_AMERICA",
    name: "North America",
    countries: OTHER_COUNTRIES.filter((c) => c.region === "NORTH_AMERICA"),
  },
  {
    code: "EUROPE",
    name: "Europe",
    countries: OTHER_COUNTRIES.filter((c) => c.region === "EUROPE"),
  },
];

// Todos los países combinados
export const ALL_COUNTRIES: Country[] = [
  ...LATIN_AMERICA_COUNTRIES,
  ...OTHER_COUNTRIES,
].sort((a, b) => a.name.localeCompare(b.name));

// Opciones para el select (regiones + países individuales)
export interface SelectOption {
  value: string;
  label: string;
  type: "region" | "country";
  disabled?: boolean;
}

export const COUNTRY_SELECT_OPTIONS: SelectOption[] = [
  // Opción por defecto
  { value: "", label: "All countries", type: "region" },

  // Regiones
  { value: "LATIN_AMERICA", label: "🌎 Latin America", type: "region" },
  { value: "NORTH_AMERICA", label: "🌎 North America", type: "region" },
  { value: "EUROPE", label: "🌎 Europe", type: "region" },

  // Separador visual
  {
    value: "separator",
    label: "─────────────────",
    type: "country",
    disabled: true,
  },

  // Países individuales ordenados alfabéticamente
  ...ALL_COUNTRIES.map((country) => ({
    value: country.name,
    label: `🏳️ ${country.name}`,
    type: "country" as const,
  })),
];

// Funciones helper
export const getCountriesByRegion = (regionCode: string): Country[] => {
  const region = REGIONS.find((r) => r.code === regionCode);
  return region ? region.countries : [];
};

export const isCountryInLatinAmerica = (countryName: string): boolean => {
  return LATIN_AMERICA_COUNTRIES.some(
    (country) => country.name.toLowerCase() === countryName.toLowerCase()
  );
};

export const isCountryInRegion = (
  countryName: string,
  regionCode: string
): boolean => {
  if (regionCode === "ALL" || regionCode === "") return true;

  const regionCountries = getCountriesByRegion(regionCode);
  return regionCountries.some(
    (country) => country.name.toLowerCase() === countryName.toLowerCase()
  );
};

export const getRegionByCountry = (countryName: string): string | null => {
  const country = ALL_COUNTRIES.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.region : null;
};

// Para validaciones en el backend
export const validateCountryMatch = (
  userCountry: string,
  offerCountry: string
): boolean => {
  // Si la oferta no tiene restricción de país
  if (!offerCountry || offerCountry.trim() === "") return true;

  // Si es una región (ej: "LATIN_AMERICA" o "Latinoamérica")
  if (
    offerCountry === "LATIN_AMERICA" ||
    offerCountry.toLowerCase() === "latinoamérica"
  ) {
    return isCountryInLatinAmerica(userCountry);
  }

  // Si es un país específico
  return userCountry.toLowerCase() === offerCountry.toLowerCase();
};
