export interface MockContract {
  id: string;
  position: string;
  client: string;
  baseSalary: number;
}

export interface MockContractor {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  contracts: MockContract[];
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
      },
      {
        id: "CNT-PORT-022",
        position: "Tech Lead",
        client: "Port",
        baseSalary: 4500,
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
  return `$${amount.toLocaleString("es-ES")}`;
}
