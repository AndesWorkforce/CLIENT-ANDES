import type { AdminHubLocale } from "../locales";
import { en } from "./en";
import { es } from "./es";

export type AdminHubMessages = typeof es;

export const adminHubMessages: Record<AdminHubLocale, AdminHubMessages> = {
  es,
  en,
};
