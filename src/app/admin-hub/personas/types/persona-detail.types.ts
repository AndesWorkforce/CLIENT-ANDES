import type { MockContract } from "../../nominas/data/mock-contractors";

export type PersonaStatus = "Activo" | "Inactivo";

export interface ContractorPersonaProfile {
  status: PersonaStatus;
  personalEmail: string;
  workEmail: string;
  phone: string;
  documentNumber: string;
  birthDate: string;
  nationality: string;
  state: string;
  city: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  contractType: string;
  currency: string;
  hrRateHolidays: number;
  bonusLabel: string;
  ipbBalance: string;
  billingCountry: string;
  paymentMethod: string;
  dollarTag: string | null;
  personalBank: string | null;
  personalAccountNumber: string | null;
  billingBankName: string | null;
  billingAccountNumber: string | null;
  howDidYouHear: string;
  wasReferred: "Si" | "No";
  referredBy: string | null;
  notes: string;
}

export interface PersonaDetail {
  id: string;
  name: string;
  countryName: string;
  primaryContract: MockContract;
  contractCode: string;
  profile: ContractorPersonaProfile;
}
