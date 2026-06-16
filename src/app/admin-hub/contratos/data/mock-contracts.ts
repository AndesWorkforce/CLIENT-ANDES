import { MOCK_CONTRACTORS } from "../../nominas/data/mock-contractors";

/** Alineado con `JornadaLaboral` en Prisma. */
export type JornadaLaboral = "FULL_TIME" | "PART_TIME";

/**
 * Fila de contrato para Admin Hub.
 * Campos nombrados según `ProcesoContratacion` + `Usuario` + relación empresa.
 */
export interface MockProcesoContratacion {
  id: string;
  postulacionId: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  ofertaSalarial: number;
  monedaSalario: string;
  tipoJornada: JornadaLaboral;
  fechaInicioContrato: string;
  fechaFinalizacion: string | null;
  fechaPermanente: string | null;
  activo: boolean;
  estadoContratacion: string;
  division: string | null;
  paisFacturacion: string | null;
  clientPrice: number | null;
  diasTrabajados: number | null;
  paidHolidays: boolean | null;
  correo: string;
  correoEmpresa: string | null;
  paisCodigo: string;
  bancoNombre: string | null;
  usaDollarApp: boolean | null;
  numeroCuentaBancaria: string | null;
  empresaNombre: string;
}

interface ContractSeed {
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  paisCodigo: string;
  usaDollarApp: boolean;
  bancoNombre: string | null;
  ofertaSalarial: number;
  clientPrice: number;
  tipoJornada?: JornadaLaboral;
  activo?: boolean;
  fechaFinalizacion?: string | null;
  division?: string | null;
  diasTrabajados?: number;
}

const FIGMA_PRIORITY_SEEDS: ContractSeed[] = [
  {
    nombreCompleto: "Juan Perez",
    puestoTrabajo: "Welcome Call",
    empresaNombre: "BK",
    paisCodigo: "AR",
    usaDollarApp: true,
    bancoNombre: null,
    ofertaSalarial: 3200,
    clientPrice: 1100,
  },
  {
    nombreCompleto: "Camilo Ruiz",
    puestoTrabajo: "Intake Specialist",
    empresaNombre: "BK",
    paisCodigo: "AR",
    usaDollarApp: true,
    bancoNombre: null,
    ofertaSalarial: 2900,
    clientPrice: 1050,
  },
  {
    nombreCompleto: "Laura Sanchez",
    puestoTrabajo: "Case Manager",
    empresaNombre: "Tabak",
    paisCodigo: "AR",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 3500,
    clientPrice: 1200,
  },
  {
    nombreCompleto: "Luis Lee",
    puestoTrabajo: "Welcome Call",
    empresaNombre: "Rocket",
    paisCodigo: "AR",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 3800,
    clientPrice: 1200,
  },
  {
    nombreCompleto: "Martin Diaz",
    puestoTrabajo: "Welcome Call",
    empresaNombre: "Rocket",
    paisCodigo: "AR",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 2600,
    clientPrice: 950,
  },
  {
    nombreCompleto: "Maria Rodriguez",
    puestoTrabajo: "Case Manager",
    empresaNombre: "Port",
    paisCodigo: "AR",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 2800,
    clientPrice: 1100,
  },
  {
    nombreCompleto: "Sol Martin",
    puestoTrabajo: "Legal Case",
    empresaNombre: "Ve",
    paisCodigo: "AR",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 2400,
    clientPrice: 900,
  },
  {
    nombreCompleto: "Daniel Lopez",
    puestoTrabajo: "Intake Specialist",
    empresaNombre: "Tabak",
    paisCodigo: "AR",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 3000,
    clientPrice: 1100,
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildContractRow(
  seed: ContractSeed,
  index: number,
  usuarioId: string
): MockProcesoContratacion {
  const id = `pc-${slugify(seed.nombreCompleto)}-${slugify(seed.empresaNombre)}-${index}`;
  const activo = seed.activo ?? true;
  const tipoJornada = seed.tipoJornada ?? "FULL_TIME";
  const fechaFinalizacion = seed.fechaFinalizacion ?? null;

  return {
    id,
    postulacionId: `post-${usuarioId}`,
    usuarioId,
    nombreCompleto: seed.nombreCompleto,
    puestoTrabajo: seed.puestoTrabajo,
    ofertaSalarial: seed.ofertaSalarial,
    monedaSalario: "USD",
    tipoJornada,
    fechaInicioContrato: "2025-03-03",
    fechaFinalizacion,
    fechaPermanente: fechaFinalizacion ? null : "2025-09-03",
    activo,
    estadoContratacion: activo ? "FIRMADO_COMPLETO" : "CONTRATO_FINALIZADO",
    division: seed.division ?? "Operaciones",
    paisFacturacion: seed.paisCodigo,
    clientPrice: seed.clientPrice,
    diasTrabajados: seed.diasTrabajados ?? 22,
    paidHolidays: true,
    correo: `${slugify(seed.nombreCompleto).replace(/-/g, ".")}@email.com`,
    correoEmpresa: `${slugify(seed.nombreCompleto).split("-")[0]}@${seed.empresaNombre.toLowerCase()}.com`,
    paisCodigo: seed.paisCodigo,
    bancoNombre: seed.bancoNombre,
    usaDollarApp: seed.usaDollarApp,
    numeroCuentaBancaria: seed.bancoNombre ? "****4821" : null,
    empresaNombre: seed.empresaNombre,
  };
}

function contractorToSeed(
  contractorName: string,
  position: string,
  client: string,
  baseSalary: number,
  clientPrice: number,
  countryCode: string
): ContractSeed {
  const usesDollarApp = countryCode === "CO" || contractorName === "Juan Perez";

  return {
    nombreCompleto: contractorName,
    puestoTrabajo: position,
    empresaNombre: client,
    paisCodigo: countryCode,
    usaDollarApp: usesDollarApp,
    bancoNombre: usesDollarApp ? null : "Lead Bank",
    ofertaSalarial: baseSalary,
    clientPrice,
  };
}

function buildFromMockContractors(): MockProcesoContratacion[] {
  const figmaNames = new Set(FIGMA_PRIORITY_SEEDS.map((seed) => seed.nombreCompleto));
  const rows: MockProcesoContratacion[] = [];
  let index = 0;

  for (const contractor of MOCK_CONTRACTORS) {
    if (figmaNames.has(contractor.name)) continue;

    for (const contract of contractor.contracts) {
      const seed = contractorToSeed(
        contractor.name,
        contract.position,
        contract.client,
        contract.baseSalary,
        contract.clientPrice,
        contractor.countryCode
      );

      rows.push(buildContractRow(seed, index, contractor.id));
      index += 1;
    }
  }

  return rows;
}

function buildFigmaPriorityRows(): MockProcesoContratacion[] {
  return FIGMA_PRIORITY_SEEDS.map((seed, index) =>
    buildContractRow(seed, index, `usr-figma-${index + 1}`)
  );
}

const SECONDARY_CONTRACTS: ContractSeed[] = [
  {
    nombreCompleto: "Ana Gomez",
    puestoTrabajo: "Project Manager",
    empresaNombre: "BK",
    paisCodigo: "CO",
    usaDollarApp: true,
    bancoNombre: null,
    ofertaSalarial: 4100,
    clientPrice: 1100,
    activo: false,
    fechaFinalizacion: "2025-12-31",
    tipoJornada: "PART_TIME",
  },
  {
    nombreCompleto: "Pedro Soto",
    puestoTrabajo: "Desarrollador Frontend",
    empresaNombre: "BK",
    paisCodigo: "MX",
    usaDollarApp: false,
    bancoNombre: "BBVA",
    ofertaSalarial: 3000,
    clientPrice: 1100,
    fechaFinalizacion: "2026-06-30",
    tipoJornada: "PART_TIME",
  },
  {
    nombreCompleto: "Roberto Silva",
    puestoTrabajo: "DevOps Engineer",
    empresaNombre: "Rocket",
    paisCodigo: "MX",
    usaDollarApp: false,
    bancoNombre: "Lead Bank",
    ofertaSalarial: 4400,
    clientPrice: 1450,
    activo: false,
    fechaFinalizacion: "2025-11-30",
  },
];

export const MOCK_PROCESOS_CONTRATACION: MockProcesoContratacion[] = [
  ...buildFigmaPriorityRows(),
  ...buildFromMockContractors(),
  ...SECONDARY_CONTRACTS.map((seed, index) =>
    buildContractRow(seed, 100 + index, `usr-secondary-${index + 1}`)
  ),
];

export function getMockContracts(): MockProcesoContratacion[] {
  return MOCK_PROCESOS_CONTRATACION;
}

export function findMockContract(id: string): MockProcesoContratacion | undefined {
  return MOCK_PROCESOS_CONTRATACION.find((contract) => contract.id === id);
}
