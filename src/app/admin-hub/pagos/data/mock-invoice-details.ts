import { MOCK_INVOICES, type Invoice } from "./mock-invoices";
import {
  formatClientPrice,
  getContractorsByClient,
} from "../../nominas/data/mock-contractors";

export type InvoiceLineItemStatus = "Pendiente" | "Aprobado" | "Rechazado";
export type InvoicePayrollStatus = "Pendiente" | "Aprobada";

export interface InvoiceLineItem {
  id: string;
  date: string;
  type: string;
  contractor: string;
  description: string;
  amount: string;
  currency?: string;
  amountIsNegative?: boolean;
  status: InvoiceLineItemStatus;
  createdBy: string;
}

export interface InvoicePayrollEntry {
  id: string;
  contractorName: string;
  position: string;
  contractStartDate: string;
  clientPrice: number;
  status: InvoicePayrollStatus;
}

export interface InvoiceAdditionalFee {
  id: string;
  date: string;
  contractor: string;
  position: string;
  description: string;
  amount: string;
  status: InvoiceLineItemStatus;
  createdBy: string;
}

export interface InvoiceSection {
  id: string;
  title: string;
  tabKey: "customer-charges" | "customer-credits";
  items: InvoiceLineItem[];
  subtotal: string;
  subtotalIsNegative?: boolean;
}

export interface InvoiceDetail extends Invoice {
  country: string;
  issueDate: string;
  dueDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  grandTotal: string;
  payrollEntries: InvoicePayrollEntry[];
  payrollSubtotal: string;
  additionalFees: InvoiceAdditionalFee[];
  additionalFeesSubtotal: string;
  sections: InvoiceSection[];
}

function buildPayrollEntries(client: string): InvoicePayrollEntry[] {
  const contractors = getContractorsByClient(client);

  if (contractors.length > 0) {
    return contractors.map(({ contractorId, contractorName, contract }, index) => ({
      id: `payroll-${contractorId}-${contract.id}`,
      contractorName,
      position: contract.position,
      contractStartDate: contract.contractStartDate,
      clientPrice: contract.clientPrice,
      status: index % 3 === 1 ? "Aprobada" : "Pendiente",
    }));
  }

  return [
    {
      id: "payroll-1",
      contractorName: "Juan Perez",
      position: "Intake Specialist",
      contractStartDate: "03.03.2025",
      clientPrice: 1100,
      status: "Pendiente",
    },
    {
      id: "payroll-2",
      contractorName: "Laura Sanchez",
      position: "Intake Specialist",
      contractStartDate: "03.03.2025",
      clientPrice: 1100,
      status: "Pendiente",
    },
    {
      id: "payroll-3",
      contractorName: "Martin Diaz",
      position: "Welcome Call",
      contractStartDate: "03.03.2025",
      clientPrice: 1100,
      status: "Aprobada",
    },
    {
      id: "payroll-4",
      contractorName: "Clara Rodriguez",
      position: "Project Coordinator",
      contractStartDate: "03.03.2025",
      clientPrice: 1100,
      status: "Pendiente",
    },
  ];
}

function sumPayrollClientPrice(entries: InvoicePayrollEntry[]): string {
  const total = entries.reduce((sum, entry) => sum + entry.clientPrice, 0);
  return formatClientPrice(total);
}

function buildChargeItems(): InvoiceLineItem[] {
  return [
    {
      id: "c1",
      date: "03.03.2026",
      type: "Bono",
      contractor: "Juan Perez",
      description: "Cumpleaños",
      amount: "$100",
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
    {
      id: "c2",
      date: "03.03.2026",
      type: "Capacitación",
      contractor: "Laura Sanchez",
      description: "Comunicación Efectiva",
      amount: "$50",
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
    {
      id: "c3",
      date: "03.03.2026",
      type: "Viaje",
      contractor: "Martin Diaz",
      description: "Team Building",
      amount: "$300",
      status: "Aprobado",
      createdBy: "Violeta Q",
    },
    {
      id: "c4",
      date: "03.03.2026",
      type: "Overtime",
      contractor: "Manuel Perez",
      description: "Problema Tecnico",
      amount: "$200",
      status: "Aprobado",
      createdBy: "Violeta Q",
    },
    {
      id: "c5",
      date: "03.03.2026",
      type: "Equipamiento",
      contractor: "Martina Dominguez",
      description: "Computadora",
      amount: "$300",
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
  ];
}

function buildAdditionalFees(): InvoiceAdditionalFee[] {
  return [
    {
      id: "af1",
      date: "03.03.2026",
      contractor: "Damian Ruiz",
      position: "Intake Specialist",
      description: "Nuevo puesto",
      amount: "$1.000",
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
    {
      id: "af2",
      date: "03.03.2026",
      contractor: "Dolores Sanchez",
      position: "Intake Specialist",
      description: "Nuevo puesto",
      amount: "$1.000",
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
  ];
}

function buildCreditItems(): InvoiceLineItem[] {
  return [
    {
      id: "r1",
      date: "03.03.2026",
      type: "Deducción",
      contractor: "Juan Perez",
      description: "Cumpleaños",
      amount: "-$100",
      amountIsNegative: true,
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
    {
      id: "r2",
      date: "03.03.2026",
      type: "Deducción",
      contractor: "Martin Diaz",
      description: "Cumpleaños",
      amount: "-$50",
      amountIsNegative: true,
      status: "Pendiente",
      createdBy: "Violeta Q",
    },
    {
      id: "r3",
      date: "03.03.2026",
      type: "Deducción",
      contractor: "Carla Sanchez",
      description: "Problema Tecnico",
      amount: "-$50",
      amountIsNegative: true,
      status: "Aprobado",
      createdBy: "Violeta Q",
    },
  ];
}

function parseAmount(amount: string): number {
  const normalized = amount.replace(/[^\d-]/g, "");
  return parseInt(normalized, 10) || 0;
}

function formatAmount(value: number, isNegative?: boolean): string {
  const abs = Math.abs(value);
  const formatted = `$${abs.toLocaleString("es-ES")}`;
  return isNegative || value < 0 ? `-${formatted}` : formatted;
}

function sumAdditionalFees(items: InvoiceAdditionalFee[]): string {
  const total = items.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  return formatAmount(total);
}

function sumLineItems(items: InvoiceLineItem[]): {
  subtotal: string;
  subtotalIsNegative?: boolean;
} {
  const total = items.reduce((sum, item) => {
    const val = parseAmount(item.amount);
    return sum + (item.amountIsNegative || item.amount.startsWith("-") ? -Math.abs(val) : val);
  }, 0);

  return {
    subtotal: formatAmount(total, total < 0),
    subtotalIsNegative: total < 0,
  };
}

function buildGrandTotal(
  payrollEntries: InvoicePayrollEntry[],
  additionalFees: InvoiceAdditionalFee[],
  sections: InvoiceSection[]
): string {
  const payrollTotal = payrollEntries.reduce((sum, e) => sum + e.clientPrice, 0);
  const additionalTotal = additionalFees.reduce(
    (sum, fee) => sum + parseAmount(fee.amount),
    0
  );
  const chargesTotal = parseAmount(
    sections.find((s) => s.tabKey === "customer-charges")?.subtotal ?? "0"
  );
  const creditsTotal = parseAmount(
    sections.find((s) => s.tabKey === "customer-credits")?.subtotal ?? "0"
  );
  return formatAmount(payrollTotal + additionalTotal + chargesTotal + creditsTotal);
}

function buildDetail(invoice: Invoice): InvoiceDetail {
  const emailSlug = invoice.client.toLowerCase().replace(/[^a-z0-9]/g, "") || "cliente";
  const payrollEntries = buildPayrollEntries(invoice.client);
  const chargeItems = buildChargeItems();
  const creditItems = buildCreditItems();
  const additionalFees = buildAdditionalFees();
  const chargeTotals = sumLineItems(chargeItems);
  const creditTotals = sumLineItems(creditItems);

  const sections: InvoiceSection[] = [
    {
      id: "charges",
      title: "Cargos al cliente",
      tabKey: "customer-charges",
      items: chargeItems,
      ...chargeTotals,
    },
    {
      id: "credits",
      title: "Créditos al cliente",
      tabKey: "customer-credits",
      items: creditItems,
      ...creditTotals,
    },
  ];

  return {
    ...invoice,
    country: "EEUU",
    issueDate: "03.03.2026",
    dueDate: "03.30.2026",
    contactName: "Maria Sanchez",
    contactEmail: `${emailSlug}@bk.com`,
    contactPhone: "+12 125 1235588",
    payrollEntries,
    payrollSubtotal: sumPayrollClientPrice(payrollEntries),
    additionalFees,
    additionalFeesSubtotal: sumAdditionalFees(additionalFees),
    sections,
    grandTotal: buildGrandTotal(payrollEntries, additionalFees, sections),
  };
}

const DETAILS: Record<string, InvoiceDetail> = {};

MOCK_INVOICES.forEach((inv) => {
  DETAILS[inv.id] = buildDetail(inv);
});

export function getInvoiceDetail(id: string): InvoiceDetail | undefined {
  return DETAILS[id];
}
