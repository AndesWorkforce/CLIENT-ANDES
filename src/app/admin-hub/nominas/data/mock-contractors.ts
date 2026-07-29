export interface MockContract {
  id: string;
  position: string;
  client: string;
  baseSalary: number;
  clientPrice: number;
  contractStartDate: string;
}

/** Perfil extendido del contratista (vista Personas / detalle). */
export interface ContractorPersonaProfile {
  status: "Activo" | "Inactivo";
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

export interface MockContractor {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  contracts: MockContract[];
  /** Perfil completo; si falta, se deriva en `getPersonaDetail`. */
  profile?: ContractorPersonaProfile;
}

export const MOCK_CONTRACTORS: MockContractor[] = [
  {
    id: "ctr-1",
    name: "Juan Perez",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-BK-001",
        position: "Desarrollador Full Stack",
        client: "BK",
        baseSalary: 3200,
        clientPrice: 1100,
        contractStartDate: "03.03.2025",
      },
    ],
  },
  {
    id: "ctr-2",
    name: "María Rodriguez",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-PORT-014",
        position: "Analista de Soporte",
        client: "Port",
        baseSalary: 2800,
        clientPrice: 1100,
        contractStartDate: "03.03.2025",
      },
      {
        id: "CNT-PORT-022",
        position: "Tech Lead",
        client: "Port",
        baseSalary: 4500,
        clientPrice: 1500,
        contractStartDate: "01.06.2024",
      },
    ],
  },
  {
    id: "ctr-3",
    name: "Luis Lee",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-RKT-008",
        position: "Ingeniero Backend",
        client: "Rocket",
        baseSalary: 3800,
        clientPrice: 1200,
        contractStartDate: "15.01.2025",
      },
    ],
  },
  {
    id: "ctr-4",
    name: "Martin Diaz",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-RKT-011",
        position: "QA Engineer",
        client: "Rocket",
        baseSalary: 2600,
        clientPrice: 950,
        contractStartDate: "20.02.2025",
      },
    ],
  },
  {
    id: "ctr-5",
    name: "Sol Martin",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-VE-003",
        position: "Diseñador UX",
        client: "Ve",
        baseSalary: 2400,
        clientPrice: 900,
        contractStartDate: "10.04.2025",
      },
    ],
  },
  {
    id: "ctr-6",
    name: "Ana Gomez",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-BK-019",
        position: "Project Manager",
        client: "BK",
        baseSalary: 4100,
        clientPrice: 1100,
        contractStartDate: "03.03.2025",
      },
    ],
  },
  {
    id: "ctr-7",
    name: "Carla Ruiz",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-PORT-027",
        position: "Analista QA",
        client: "Port",
        baseSalary: 2700,
        clientPrice: 1000,
        contractStartDate: "05.03.2025",
      },
    ],
  },
  {
    id: "ctr-8",
    name: "Pedro Soto",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-BK-031",
        position: "Desarrollador Frontend",
        client: "BK",
        baseSalary: 3000,
        clientPrice: 1100,
        contractStartDate: "10.04.2025",
      },
    ],
  },
  {
    id: "ctr-9",
    name: "Sofia Morales",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-BK-040",
        position: "Data Engineer",
        client: "BK",
        baseSalary: 4200,
        clientPrice: 1400,
        contractStartDate: "15.05.2025",
      },
      {
        id: "CNT-VE-041",
        position: "Consultora BI",
        client: "Ve",
        baseSalary: 1800,
        clientPrice: 750,
        contractStartDate: "20.05.2025",
      },
    ],
  },
  {
    id: "ctr-10",
    name: "Roberto Silva",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-RKT-052",
        position: "DevOps Engineer",
        client: "Rocket",
        baseSalary: 4400,
        clientPrice: 1450,
        contractStartDate: "01.06.2025",
      },
    ],
  },
  {
    id: "ctr-11",
    name: "Laura Vega",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-PORT-060",
        position: "Scrum Master",
        client: "Port",
        baseSalary: 3900,
        clientPrice: 1300,
        contractStartDate: "10.06.2025",
      },
    ],
  },
  {
    id: "ctr-12",
    name: "Diego Campos",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-VE-068",
        position: "Mobile Developer",
        client: "Ve",
        baseSalary: 3500,
        clientPrice: 1200,
        contractStartDate: "15.07.2025",
      },
    ],
  },
  {
    id: "ctr-13",
    name: "Valentina Torres",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-BK-074",
        position: "UI Designer",
        client: "BK",
        baseSalary: 2900,
        clientPrice: 1050,
        contractStartDate: "01.08.2025",
      },
    ],
  },
  {
    id: "ctr-14",
    name: "Andrés Castro",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-PORT-081",
        position: "Arquitecto de Software",
        client: "Port",
        baseSalary: 5200,
        clientPrice: 1700,
        contractStartDate: "15.08.2025",
      },
    ],
  },
  {
    id: "ctr-15",
    name: "Camila Herrera",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-RKT-089",
        position: "Product Owner",
        client: "Rocket",
        baseSalary: 4600,
        clientPrice: 1500,
        contractStartDate: "01.09.2025",
      },
    ],
  },
  {
    id: "ctr-16",
    name: "Felipe Núñez",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-RKT-094",
        position: "Ingeniero de Datos",
        client: "Rocket",
        baseSalary: 4000,
        clientPrice: 1350,
        contractStartDate: "10.09.2025",
      },
    ],
  },
  {
    id: "ctr-17",
    name: "Gabriela Ríos",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-VE-102",
        position: "Product Designer",
        client: "Ve",
        baseSalary: 3300,
        clientPrice: 1150,
        contractStartDate: "15.09.2025",
      },
      {
        id: "CNT-BK-103",
        position: "Brand Designer",
        client: "BK",
        baseSalary: 2200,
        clientPrice: 850,
        contractStartDate: "20.09.2025",
      },
    ],
  },
  {
    id: "ctr-18",
    name: "Mateo Fernández",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-PORT-110",
        position: "SRE",
        client: "Port",
        baseSalary: 4700,
        clientPrice: 1550,
        contractStartDate: "01.10.2025",
      },
    ],
  },
  {
    id: "ctr-19",
    name: "Lucía Mendoza",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-BK-118",
        position: "Recruiter Tech",
        client: "BK",
        baseSalary: 2500,
        clientPrice: 950,
        contractStartDate: "15.10.2025",
      },
    ],
  },
  {
    id: "ctr-20",
    name: "Tomás Vargas",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-RKT-125",
        position: "Tech Lead",
        client: "Rocket",
        baseSalary: 4800,
        clientPrice: 1600,
        contractStartDate: "01.11.2025",
      },
    ],
  },
  {
    id: "ctr-21",
    name: "Isabela Restrepo",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-VE-130",
        position: "Customer Success",
        client: "Ve",
        baseSalary: 2300,
        clientPrice: 900,
        contractStartDate: "10.11.2025",
      },
    ],
  },
  {
    id: "ctr-22",
    name: "Joaquín Pereyra",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-BK-138",
        position: "Backend Senior",
        client: "BK",
        baseSalary: 4300,
        clientPrice: 1450,
        contractStartDate: "15.11.2025",
      },
    ],
  },
  {
    id: "ctr-23",
    name: "Renata López",
    countryCode: "MX",
    countryName: "México",
    contracts: [
      {
        id: "CNT-PORT-146",
        position: "Analista Financiero",
        client: "Port",
        baseSalary: 3100,
        clientPrice: 1100,
        contractStartDate: "01.12.2025",
      },
    ],
  },
  {
    id: "ctr-24",
    name: "Bruno Acosta",
    countryCode: "AR",
    countryName: "Argentina",
    contracts: [
      {
        id: "CNT-RKT-153",
        position: "Frontend Senior",
        client: "Rocket",
        baseSalary: 4100,
        clientPrice: 1400,
        contractStartDate: "10.12.2025",
      },
    ],
  },
  {
    id: "ctr-25",
    name: "Daniela Ortiz",
    countryCode: "CO",
    countryName: "Colombia",
    contracts: [
      {
        id: "CNT-VE-160",
        position: "QA Automation",
        client: "Ve",
        baseSalary: 3200,
        clientPrice: 1150,
        contractStartDate: "15.12.2025",
      },
      {
        id: "CNT-BK-161",
        position: "QA Lead",
        client: "BK",
        baseSalary: 3700,
        clientPrice: 1300,
        contractStartDate: "20.12.2025",
      },
    ],
  },
];

export function findContractor(contractorId: string): MockContractor | undefined {
  return MOCK_CONTRACTORS.find((c) => c.id === contractorId);
}

export function findContract(
  contractorId: string,
  contractId: string
): MockContract | undefined {
  return findContractor(contractorId)?.contracts.find((c) => c.id === contractId);
}

export function formatBaseSalary(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatClientPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getContractorsByClient(client: string) {
  return MOCK_CONTRACTORS.flatMap((contractor) =>
    contractor.contracts
      .filter((contract) => contract.client === client)
      .map((contract) => ({
        contractorId: contractor.id,
        contractorName: contractor.name,
        contract,
      }))
  );
}
