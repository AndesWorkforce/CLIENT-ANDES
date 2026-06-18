import { getMockContracts } from "../../contratos/data/mock-contracts";
import { getMetodoPagoDisplay, getPaisDisplay } from "../../contratos/data/contract-display";
import { getDiscretionaryBonusLabel } from "../../contratos/data/contract-detail-display";
import type { DiscretionaryBonusType } from "../../contratos/data/mock-contract-detail";
import {
  findContractor,
  MOCK_CONTRACTORS,
  type ContractorPersonaProfile,
  type MockContract,
  type MockContractor,
} from "../../nominas/data/mock-contractors";

export type PersonaStatus = "Activo" | "Inactivo";

export interface PersonaDetail {
  id: string;
  name: string;
  countryName: string;
  primaryContract: MockContract;
  contractCode: string;
  profile: ContractorPersonaProfile;
}

function generateCodigoContrato(contractorId: string, contractId: string): string {
  const seed = `${contractorId}-${contractId}`;
  const num = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 900000 + 100000;
  return `AD-${num}`;
}

function displayDateFromContract(date: string): string {
  const parts = date.split(".");
  if (parts.length !== 3) return date;
  const [month, day, year] = parts;
  return `${day}.${month}.20${year}`;
}

function isoFromContractDate(date: string): string {
  const parts = date.split(".");
  if (parts.length !== 3) return date;
  const [month, day, year] = parts;
  return `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const RESIDENCE_BY_COUNTRY: Record<
  string,
  Pick<ContractorPersonaProfile, "state" | "city" | "street" | "streetNumber" | "postalCode">
> = {
  AR: {
    state: "Buenos Aires",
    city: "CABA",
    street: "Gorriti",
    streetNumber: "1256",
    postalCode: "7600",
  },
  CO: {
    state: "Cundinamarca",
    city: "Bogotá",
    street: "Calle 85",
    streetNumber: "12-40",
    postalCode: "110111",
  },
  MX: {
    state: "CDMX",
    city: "Ciudad de México",
    street: "Av. Reforma",
    streetNumber: "222",
    postalCode: "06600",
  },
};

function buildEmailLocal(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .slice(0, 12);
}

function buildDefaultProfile(
  contractor: MockContractor,
  contract: MockContract
): ContractorPersonaProfile {
  const linked = getMockContracts().find(
    (contract) => contract.nombreCompleto === contractor.name
  );
  const residence = RESIDENCE_BY_COUNTRY[contractor.countryCode] ?? RESIDENCE_BY_COUNTRY.AR;
  const emailLocal = buildEmailLocal(contractor.name);
  const discretionaryBonusType: DiscretionaryBonusType = "HALF_MONTH_ONCE_DECEMBER";

  const billingCountry = linked
    ? getPaisDisplay(linked.paisCodigo, linked.paisFacturacion)
    : contractor.countryName;

  const paymentMethod = linked
    ? linked.usaDollarApp
      ? "Transferencia bancaria"
      : getMetodoPagoDisplay(linked)
    : "Transferencia bancaria";

  return {
    status: linked?.activo === false ? "Inactivo" : "Activo",
    personalEmail: `${emailLocal}@gmail.com`,
    workEmail: linked?.correo ?? `${emailLocal}@teamandes.com`,
    phone: "+54 11 4000 1234",
    documentNumber: "30.112.445",
    birthDate: "1992-08-15",
    nationality: contractor.countryName,
    ...residence,
    contractType: linked?.fechaFinalizacion ? "Plazo fijo" : "Permanente",
    currency: linked?.monedaSalario ?? "USD",
    hrRateHolidays: 2,
    bonusLabel: "Bono Cumpleaños",
    ipbBalance: getDiscretionaryBonusLabel(discretionaryBonusType),
    billingCountry,
    paymentMethod,
    dollarTag: emailLocal.slice(0, 8) || null,
    personalBank: linked?.bancoNombre ?? "Galicia",
    personalAccountNumber: linked?.numeroCuentaBancaria?.replace(/\*/g, "") ?? "56325478",
    billingBankName: linked?.usaDollarApp ? "Dolar App" : "Lean",
    billingAccountNumber: "45653585",
    howDidYouHear: "LinkedIn",
    wasReferred: "No",
    referredBy: null,
    notes: "",
  };
}

const JUAN_PEREZ_PROFILE: ContractorPersonaProfile = {
  status: "Activo",
  personalEmail: "jperez@gmail.com",
  workEmail: "jperez@teamandes.com",
  phone: "+54 011 452 1452",
  documentNumber: "38.335.339",
  birthDate: "1996-03-03",
  nationality: "Argentina",
  state: "Buenos Aires",
  city: "CABA",
  street: "Gorriti",
  streetNumber: "1254",
  postalCode: "7600",
  contractType: "Permanente",
  currency: "USD",
  hrRateHolidays: 2,
  bonusLabel: "Bono Cumpleaños",
  ipbBalance: "Media vez al mes de Diciembre",
  billingCountry: "Argentina",
  paymentMethod: "Transferencia bancaria",
  dollarTag: "Juanpe",
  personalBank: "Galicia",
  personalAccountNumber: "AR93 2830 0412 3456 7890 1234",
  billingBankName: "Lean",
  billingAccountNumber: "CA-984512367",
  howDidYouHear: "LinkedIn",
  wasReferred: "Si",
  referredBy: "María Sanchez",
  notes: "",
};

export function getPersonaProfile(contractor: MockContractor): ContractorPersonaProfile {
  if (contractor.profile) return contractor.profile;
  if (contractor.name === "Juan Perez") return JUAN_PEREZ_PROFILE;
  return buildDefaultProfile(contractor, contractor.contracts[0]);
}

export function getPersonaDetail(personaId: string): PersonaDetail | null {
  const contractor = findContractor(personaId);
  if (!contractor || contractor.contracts.length === 0) return null;

  const primaryContract = contractor.contracts[0];
  const profile = getPersonaProfile(contractor);

  return {
    id: contractor.id,
    name: contractor.name,
    countryName: profile.nationality || contractor.countryName,
    primaryContract,
    contractCode: generateCodigoContrato(contractor.id, primaryContract.id),
    profile,
  };
}

export function findContractorIdByName(name: string): string | undefined {
  return MOCK_CONTRACTORS.find((contractor) => contractor.name === name)?.id;
}

export function personaToDetailPath(contractor: Pick<MockContractor, "id">): string {
  return `/admin-hub/personas/${contractor.id}`;
}

export function formatPersonaBirthDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}

export function formatPersonaContractStart(contractStartDate: string): string {
  return displayDateFromContract(contractStartDate);
}

export function contractStartToIso(contractStartDate: string): string {
  return isoFromContractDate(contractStartDate);
}
