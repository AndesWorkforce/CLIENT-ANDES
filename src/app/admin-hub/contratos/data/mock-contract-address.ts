export const NATIONALITY_OPTIONS = [
  { value: "Argentina", label: "Argentina" },
  { value: "Colombia", label: "Colombia" },
  { value: "México", label: "México" },
  { value: "Chile", label: "Chile" },
  { value: "Perú", label: "Perú" },
  { value: "Uruguay", label: "Uruguay" },
];

export const RESIDENCE_COUNTRIES = [
  { value: "Argentina", label: "Argentina" },
  { value: "Colombia", label: "Colombia" },
  { value: "México", label: "México" },
  { value: "Chile", label: "Chile" },
];

export const RESIDENCE_STATES: Record<string, { value: string; label: string }[]> = {
  Argentina: [
    { value: "Buenos Aires", label: "Buenos Aires" },
    { value: "Córdoba", label: "Córdoba" },
    { value: "Santa Fe", label: "Santa Fe" },
    { value: "Mendoza", label: "Mendoza" },
  ],
  Colombia: [
    { value: "Cundinamarca", label: "Cundinamarca" },
    { value: "Antioquia", label: "Antioquia" },
    { value: "Valle del Cauca", label: "Valle del Cauca" },
  ],
  México: [
    { value: "CDMX", label: "CDMX" },
    { value: "Jalisco", label: "Jalisco" },
    { value: "Nuevo León", label: "Nuevo León" },
  ],
  Chile: [
    { value: "Región Metropolitana", label: "Región Metropolitana" },
    { value: "Valparaíso", label: "Valparaíso" },
    { value: "Biobío", label: "Biobío" },
  ],
};

export const RESIDENCE_CITIES: Record<string, { value: string; label: string }[]> = {
  "Buenos Aires": [
    { value: "CABA", label: "CABA" },
    { value: "La Plata", label: "La Plata" },
    { value: "Mar del Plata", label: "Mar del Plata" },
  ],
  Córdoba: [
    { value: "Córdoba Capital", label: "Córdoba Capital" },
    { value: "Villa María", label: "Villa María" },
  ],
  "Santa Fe": [
    { value: "Rosario", label: "Rosario" },
    { value: "Santa Fe Capital", label: "Santa Fe Capital" },
  ],
  Mendoza: [
    { value: "Mendoza Capital", label: "Mendoza Capital" },
    { value: "San Rafael", label: "San Rafael" },
  ],
  Cundinamarca: [
    { value: "Bogotá", label: "Bogotá" },
    { value: "Chía", label: "Chía" },
  ],
  Antioquia: [
    { value: "Medellín", label: "Medellín" },
    { value: "Envigado", label: "Envigado" },
  ],
  "Valle del Cauca": [
    { value: "Cali", label: "Cali" },
    { value: "Palmira", label: "Palmira" },
  ],
  CDMX: [
    { value: "Ciudad de México", label: "Ciudad de México" },
    { value: "Coyoacán", label: "Coyoacán" },
  ],
  Jalisco: [
    { value: "Guadalajara", label: "Guadalajara" },
    { value: "Zapopan", label: "Zapopan" },
  ],
  "Nuevo León": [
    { value: "Monterrey", label: "Monterrey" },
    { value: "San Pedro Garza García", label: "San Pedro Garza García" },
  ],
  "Región Metropolitana": [
    { value: "Santiago", label: "Santiago" },
    { value: "Providencia", label: "Providencia" },
  ],
  Valparaíso: [
    { value: "Valparaíso", label: "Valparaíso" },
    { value: "Viña del Mar", label: "Viña del Mar" },
  ],
  Biobío: [
    { value: "Concepción", label: "Concepción" },
    { value: "Talcahuano", label: "Talcahuano" },
  ],
};

export function getStateOptions(country: string) {
  return RESIDENCE_STATES[country] ?? [];
}

export function getCityOptions(state: string) {
  return RESIDENCE_CITIES[state] ?? [];
}
