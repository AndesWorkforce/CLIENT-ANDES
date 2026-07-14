import type { MockContract, ContractorPersonaProfile } from "../../nominas/data/mock-contractors";

export type PersonaStatus = "Activo" | "Inactivo";

export type { ContractorPersonaProfile };

export interface PersonaDetail {
  id: string;
  name: string;
  countryName: string;
  primaryContract: MockContract;
  contractCode: string;
  profile: ContractorPersonaProfile;
}
